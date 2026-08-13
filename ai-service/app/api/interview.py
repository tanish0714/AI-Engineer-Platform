import os
import re
import json
import tempfile
from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel, Field

from faster_whisper import WhisperModel

from app.core.gemini import llm


router = APIRouter()


# ============================================================
# WHISPER MODEL
# ============================================================

# Local + free Speech-to-Text
# CPU friendly configuration

whisper_model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8",
)


# ============================================================
# CONSTANTS
# ============================================================

MAX_AUDIO_SIZE = 10 * 1024 * 1024  # 10 MB

ALLOWED_AUDIO_TYPES = {
    "audio/webm",
    "audio/wav",
    "audio/wave",
    "audio/mpeg",
    "audio/mp4",
    "audio/ogg",
    "audio/x-wav",
}

FILLER_WORDS = {
    "um",
    "uh",
    "umm",
    "uhh",
    "like",
    "basically",
    "actually",
    "literally",
    "you know",
    "i mean",
    "sort of",
    "kind of",
    "so yeah",
}


# ============================================================
# HELPERS
# ============================================================

def clean_json_response(text: str) -> str:
    """
    Gemini kabhi-kabhi JSON ko ```json ... ``` ke andar return
    karta hai. Is helper se clean JSON extract karte hain.
    """

    text = text.strip()

    if text.startswith("```"):
        text = re.sub(
            r"^```(?:json)?\s*",
            "",
            text,
            flags=re.IGNORECASE,
        )

        text = re.sub(
            r"\s*```$",
            "",
            text,
        )

    return text.strip()


def count_words(text: str) -> int:
    """
    Simple word count.
    """

    if not text:
        return 0

    return len(
        re.findall(
            r"\b[\w']+\b",
            text.lower(),
        )
    )


def detect_filler_words(text: str):
    """
    Detect common filler words.
    """

    if not text:
        return []

    normalized = text.lower()

    found = []

    for filler in FILLER_WORDS:

        pattern = rf"\b{re.escape(filler)}\b"

        matches = re.findall(
            pattern,
            normalized,
        )

        found.extend(
            [filler] * len(matches)
        )

    return found


def calculate_fluency(
    words_per_minute: float,
    filler_count: int,
    pause_count: int,
) -> float:

    score = 10.0

    # WPM penalty
    if words_per_minute > 180:
        score -= 1.5

    elif words_per_minute > 160:
        score -= 0.5

    elif 0 < words_per_minute < 80:
        score -= 1.0

    # Filler penalty
    if filler_count >= 10:
        score -= 2.0

    elif filler_count >= 6:
        score -= 1.0

    elif filler_count >= 3:
        score -= 0.5

    # Pause penalty
    if pause_count >= 8:
        score -= 1.5

    elif pause_count >= 5:
        score -= 0.5

    return round(
        max(0.0, min(10.0, score)),
        2,
    )


def calculate_pause_count(segments) -> int:
    """
    Whisper segments ke beech large gaps ko pauses maana jayega.
    """

    pause_count = 0

    previous_end = None

    for segment in segments:

        start = float(segment.start)
        end = float(segment.end)

        if previous_end is not None:

            gap = start - previous_end

            if gap >= 1.0:
                pause_count += 1

        previous_end = end

    return pause_count


# ============================================================
# REQUEST MODELS
# ============================================================

class InterviewEvaluationRequest(BaseModel):

    question: str = Field(
        ...,
        min_length=1,
    )

    answer: str = Field(
        ...,
        min_length=1,
    )

    difficulty: str = Field(
        default="Medium",
    )


class InterviewQuestionReport(BaseModel):

    question: str

    answer: str

    score: float = 0

    feedback: str = ""

    evaluation: dict = {}

    speechAnalysis: dict = {}


class FinalReportRequest(BaseModel):

    difficulty: str = "Medium"

    questions: List[InterviewQuestionReport]


# ============================================================
# TRANSCRIBE VOICE ANSWER
# ============================================================

@router.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...)
):

    temp_path = None

    try:

        # ----------------------------------------------------
        # VALIDATE FILE
        # ----------------------------------------------------

        if not audio:
            raise HTTPException(
                status_code=400,
                detail="Audio file is required",
            )

        if (
            audio.content_type
            and audio.content_type
            not in ALLOWED_AUDIO_TYPES
        ):
            raise HTTPException(
                status_code=400,
                detail="Unsupported audio format",
            )

        # ----------------------------------------------------
        # READ AUDIO
        # ----------------------------------------------------

        audio_bytes = await audio.read()

        if not audio_bytes:
            raise HTTPException(
                status_code=400,
                detail="Audio file is empty",
            )

        if len(audio_bytes) > MAX_AUDIO_SIZE:
            raise HTTPException(
                status_code=400,
                detail="Audio file must be smaller than 10 MB",
            )

        # ----------------------------------------------------
        # TEMP FILE
        # ----------------------------------------------------

        extension = ".webm"

        if audio.filename:

            _, ext = os.path.splitext(
                audio.filename
            )

            if ext:
                extension = ext

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension,
        ) as temp_file:

            temp_file.write(
                audio_bytes
            )

            temp_path = temp_file.name

        print(
            "\n========== SPEECH TO TEXT =========="
        )

        print(
            "Filename:",
            audio.filename,
        )

        print(
            "Mimetype:",
            audio.content_type,
        )

        print(
            "Size:",
            len(audio_bytes),
        )

        # ----------------------------------------------------
        # WHISPER TRANSCRIPTION
        # ----------------------------------------------------

        segments_generator, info = (
            whisper_model.transcribe(
                temp_path,
                beam_size=5,
                vad_filter=True,
                word_timestamps=True,
            )
        )

        # Generator ko list me convert karna important hai
        segments = list(
            segments_generator
        )

        transcript_parts = []

        for segment in segments:

            text = segment.text.strip()

            if text:
                transcript_parts.append(
                    text
                )

        transcript = " ".join(
            transcript_parts
        ).strip()

        if not transcript:

            raise HTTPException(
                status_code=422,
                detail="Unable to understand the audio",
            )

        # ----------------------------------------------------
        # SPEECH METRICS
        # ----------------------------------------------------

        duration = float(
            getattr(
                info,
                "duration",
                0,
            )
            or 0
        )

        word_count = count_words(
            transcript
        )

        filler_words = detect_filler_words(
            transcript
        )

        filler_count = len(
            filler_words
        )

        pause_count = calculate_pause_count(
            segments
        )

        if duration > 0:

            words_per_minute = (
                word_count
                / (duration / 60)
            )

        else:

            words_per_minute = 0

        fluency = calculate_fluency(
            words_per_minute,
            filler_count,
            pause_count,
        )

        speech_analysis = {

            "duration": round(
                duration,
                2,
            ),

            "wordCount": word_count,

            "wordsPerMinute": round(
                words_per_minute,
                2,
            ),

            "fillerWordCount": filler_count,

            "fillerWords": filler_words,

            "pauseCount": pause_count,

            "fluency": fluency,
        }

        print(
            "Transcript:",
            transcript,
        )

        print(
            "Speech Analysis:",
            speech_analysis,
        )

        print(
            "====================================\n"
        )

        return {

            "success": True,

            "transcript": transcript,

            "speechAnalysis":
                speech_analysis,
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "TRANSCRIPTION ERROR:",
            repr(e),
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to transcribe audio",
        )

    finally:

        # ----------------------------------------------------
        # DELETE TEMP FILE
        # ----------------------------------------------------

        if temp_path:

            try:

                if os.path.exists(
                    temp_path
                ):
                    os.remove(
                        temp_path
                    )

            except Exception as cleanup_error:

                print(
                    "TEMP FILE CLEANUP ERROR:",
                    cleanup_error,
                )


# ============================================================
# EVALUATE SINGLE INTERVIEW ANSWER
# ============================================================

@router.post("/evaluate")
async def evaluate_answer(
    request: InterviewEvaluationRequest
):

    try:

        question = request.question.strip()

        answer = request.answer.strip()

        difficulty = (
            request.difficulty.strip()
        )

        # ----------------------------------------------------
        # VALIDATION
        # ----------------------------------------------------

        if not question:

            raise HTTPException(
                status_code=400,
                detail="Question is required",
            )

        if not answer:

            raise HTTPException(
                status_code=400,
                detail="Answer is required",
            )

        # ----------------------------------------------------
        # GEMINI PROMPT
        # ----------------------------------------------------

        prompt = f"""
You are an expert technical interviewer.

Evaluate the candidate's answer strictly based on
the interview question.

Interview difficulty:
{difficulty}

Question:
{question}

Candidate Answer:
{answer}

Evaluate the answer on these five dimensions:

1. correctness
2. completeness
3. technicalDepth
4. communication
5. confidence

Each score must be between 0 and 10.

Important rules:

- Do NOT give a high score just because the answer sounds confident.
- If the answer is incomplete, reduce completeness.
- If the answer contains technically incorrect information, reduce correctness.
- If important technical concepts are missing, reduce technicalDepth.
- Communication should evaluate clarity and structure.
- Confidence should evaluate how confidently and decisively the answer is presented.
- Do not reward verbosity by itself.
- Evaluate only what the candidate actually said.
- Do not assume missing information was known by the candidate.

Calculate the final score as:

correctness * 0.35
+ completeness * 0.20
+ technicalDepth * 0.25
+ communication * 0.10
+ confidence * 0.10

Return ONLY valid JSON.

Required JSON format:

{{
    "correctness": 0,
    "completeness": 0,
    "technicalDepth": 0,
    "communication": 0,
    "confidence": 0,
    "score": 0,
    "feedback": "",
    "strengths": [],
    "weaknesses": [],
    "suggestions": []
}}
"""

        # ----------------------------------------------------
        # GEMINI CALL
        # ----------------------------------------------------

        response = await llm.ainvoke(
            prompt
        )

        raw_content = (
            response.content
            if hasattr(
                response,
                "content",
            )
            else str(response)
        )

        cleaned = clean_json_response(
            raw_content
        )

        try:

            result = json.loads(
                cleaned
            )

        except json.JSONDecodeError:

            print(
                "GEMINI INVALID JSON:",
                raw_content,
            )

            raise HTTPException(
                status_code=500,
                detail="Gemini returned invalid evaluation data",
            )

        # ----------------------------------------------------
        # SAFE SCORE EXTRACTION
        # ----------------------------------------------------

        def safe_score(value):

            try:

                value = float(value)

                return round(
                    max(
                        0,
                        min(
                            10,
                            value,
                        ),
                    ),
                    2,
                )

            except (
                ValueError,
                TypeError,
            ):

                return 0

        correctness = safe_score(
            result.get(
                "correctness",
                0,
            )
        )

        completeness = safe_score(
            result.get(
                "completeness",
                0,
            )
        )

        technical_depth = safe_score(
            result.get(
                "technicalDepth",
                0,
            )
        )

        communication = safe_score(
            result.get(
                "communication",
                0,
            )
        )

        confidence = safe_score(
            result.get(
                "confidence",
                0,
            )
        )

        # ----------------------------------------------------
        # CALCULATE SCORE SERVER-SIDE
        # ----------------------------------------------------
        #
        # Gemini score ko blindly trust nahi karenge.
        # Final score backend khud calculate karega.
        #

        score = round(
            (
                correctness * 0.35
                + completeness * 0.20
                + technical_depth * 0.25
                + communication * 0.10
                + confidence * 0.10
            ),
            2,
        )

        feedback = str(
            result.get(
                "feedback",
                "",
            )
        ).strip()

        strengths = result.get(
            "strengths",
            [],
        )

        weaknesses = result.get(
            "weaknesses",
            [],
        )

        suggestions = result.get(
            "suggestions",
            [],
        )

        if not isinstance(
            strengths,
            list,
        ):
            strengths = []

        if not isinstance(
            weaknesses,
            list,
        ):
            weaknesses = []

        if not isinstance(
            suggestions,
            list,
        ):
            suggestions = []

        evaluation = {

            "correctness":
                correctness,

            "completeness":
                completeness,

            "technicalDepth":
                technical_depth,

            "communication":
                communication,

            "confidence":
                confidence,
        }

        print(
            "\n========== GEMINI EVALUATION =========="
        )

        print(
            "Score:",
            score,
        )

        print(
            "Evaluation:",
            evaluation,
        )

        print(
            "Feedback:",
            feedback,
        )

        print(
            "========================================\n"
        )

        return {

            "success": True,

            "score": score,

            "feedback": feedback,

            "evaluation":
                evaluation,

            "strengths":
                strengths,

            "weaknesses":
                weaknesses,

            "suggestions":
                suggestions,
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "EVALUATION ERROR:",
            repr(e),
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to evaluate answer",
        )


# ============================================================
# GENERATE FINAL INTERVIEW REPORT
# ============================================================

@router.post("/report")
async def generate_final_report(
    request: FinalReportRequest
):

    try:

        if not request.questions:

            raise HTTPException(
                status_code=400,
                detail="At least one evaluated question is required",
            )

        # ----------------------------------------------------
        # PREPARE INTERVIEW DATA
        # ----------------------------------------------------

        interview_data = []

        for index, item in enumerate(
            request.questions,
            start=1,
        ):

            interview_data.append(
                {
                    "questionNumber": index,
                    "question": item.question,
                    "answer": item.answer,
                    "score": item.score,
                    "feedback": item.feedback,
                    "evaluation": item.evaluation,
                    "speechAnalysis": item.speechAnalysis,
                }
            )

        serialized_data = json.dumps(
            interview_data,
            ensure_ascii=False,
            indent=2,
        )

        # ----------------------------------------------------
        # GEMINI FINAL REPORT PROMPT
        # ----------------------------------------------------

        prompt = f"""
You are a senior technical interviewer.

Generate a final interview performance report.

Interview difficulty:
{request.difficulty}

The candidate's evaluated answers are:

{serialized_data}

Analyze the complete interview.

The final report must contain:

1. overallScore
2. technicalPerformance
3. communication
4. confidence
5. fluency
6. strengths
7. weaknesses
8. suggestions
9. summary

All numeric scores must be between 0 and 10.

Important:

- Base the report ONLY on the provided interview data.
- Do not invent answers or skills.
- Do not assume that an incomplete answer was correct.
- TechnicalPerformance should primarily reflect correctness,
  completeness and technical depth.
- Communication should reflect clarity and structure.
- Confidence should reflect confidence in the answers.
- Fluency should use speech analysis when available.
- Mention specific recurring weaknesses when appropriate.
- Suggestions must be actionable.

Return ONLY valid JSON.

Required format:

{{
    "overallScore": 0,
    "technicalPerformance": 0,
    "communication": 0,
    "confidence": 0,
    "fluency": 0,
    "strengths": [],
    "weaknesses": [],
    "suggestions": [],
    "summary": ""
}}
"""

        # ----------------------------------------------------
        # GEMINI CALL
        # ----------------------------------------------------

        response = await llm.ainvoke(
            prompt
        )

        raw_content = (
            response.content
            if hasattr(
                response,
                "content",
            )
            else str(response)
        )

        cleaned = clean_json_response(
            raw_content
        )

        try:

            report = json.loads(
                cleaned
            )

        except json.JSONDecodeError:

            print(
                "GEMINI REPORT INVALID JSON:",
                raw_content,
            )

            raise HTTPException(
                status_code=500,
                detail="Gemini returned invalid report data",
            )

        # ----------------------------------------------------
        # SAFE SCORE
        # ----------------------------------------------------

        def safe_score(value):

            try:

                value = float(value)

                return round(
                    max(
                        0,
                        min(
                            10,
                            value,
                        ),
                    ),
                    2,
                )

            except (
                ValueError,
                TypeError,
            ):

                return 0

        overall_score = safe_score(
            report.get(
                "overallScore",
                0,
            )
        )

        technical_performance = safe_score(
            report.get(
                "technicalPerformance",
                0,
            )
        )

        communication = safe_score(
            report.get(
                "communication",
                0,
            )
        )

        confidence = safe_score(
            report.get(
                "confidence",
                0,
            )
        )

        fluency = safe_score(
            report.get(
                "fluency",
                0,
            )
        )

        strengths = report.get(
            "strengths",
            [],
        )

        weaknesses = report.get(
            "weaknesses",
            [],
        )

        suggestions = report.get(
            "suggestions",
            [],
        )

        if not isinstance(
            strengths,
            list,
        ):
            strengths = []

        if not isinstance(
            weaknesses,
            list,
        ):
            weaknesses = []

        if not isinstance(
            suggestions,
            list,
        ):
            suggestions = []

        summary = str(
            report.get(
                "summary",
                "",
            )
        ).strip()

        # ----------------------------------------------------
        # SERVER-SIDE OVERALL SCORE
        # ----------------------------------------------------
        #
        # Gemini ka overall score blindly use nahi karenge.
        #

        question_scores = [
            float(item.score)
            for item in request.questions
        ]

        if question_scores:

            calculated_overall = round(
                sum(question_scores)
                / len(question_scores),
                2,
            )

        else:

            calculated_overall = 0

        # Gemini overall score aur actual question average me
        # consistency maintain karne ke liye question average
        # final overall score rahega.

        overall_score = calculated_overall

        # ----------------------------------------------------
        # FINAL REPORT
        # ----------------------------------------------------

        final_report = {

            "overallScore":
                overall_score,

            "technicalPerformance":
                technical_performance,

            "communication":
                communication,

            "confidence":
                confidence,

            "fluency":
                fluency,

            "strengths":
                strengths,

            "weaknesses":
                weaknesses,

            "suggestions":
                suggestions,

            "summary":
                summary,
        }

        print(
            "\n========== FINAL INTERVIEW REPORT =========="
        )

        print(
            json.dumps(
                final_report,
                indent=2,
                ensure_ascii=False,
            )
        )

        print(
            "============================================\n"
        )

        return {

            "success": True,

            "report":
                final_report,

            "questionsEvaluated":
                len(request.questions),
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "FINAL REPORT ERROR:",
            repr(e),
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to generate final interview report",
        )