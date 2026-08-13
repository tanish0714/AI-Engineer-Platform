import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  Send,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

const AIChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const handleSend = async (e) => {
    e?.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) return;

    if (!id) {
      setError("Project ID is missing");
      return;
    }

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);

    setQuestion("");
    setLoading(true);
    setError("");

    try {
      console.log("========== AI CHAT ==========");
      console.log("PROJECT ID:", id);
      console.log("QUESTION:", trimmedQuestion);

      const response = await api.post("/chat", {
        question: trimmedQuestion,
        project_id: id,
      });

      console.log("AI CHAT RESPONSE:", response.data);

      const answer =
        response.data?.answer ||
        response.data?.data?.answer ||
        "No answer received from AI.";

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: answer,
        sources: response.data?.sources || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("❌ AI CHAT ERROR:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Unable to get AI response";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col">

      {/* HEADER */}
      <div className="mb-5 flex items-center justify-between">

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              navigate(`/dashboard/projects/${id}`)
            }
            className="rounded-xl border border-white/10 bg-zinc-900 p-2.5 text-zinc-400 transition hover:border-cyan-500 hover:text-white"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <Bot
                size={21}
                className="text-cyan-400"
              />

              <h1 className="text-xl font-bold text-white">
                AI Assistant
              </h1>
            </div>

            <p className="mt-1 text-sm text-zinc-500">
              Ask questions about your uploaded documents
            </p>
          </div>

        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* CHAT AREA */}
      <div className="min-h-[500px] flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#111114] p-5">

        {messages.length === 0 ? (

          // EMPTY STATE
          <div className="flex h-full flex-col items-center justify-center text-center">

            <div className="mb-5 rounded-2xl bg-cyan-500/10 p-5">
              <Bot
                size={38}
                className="text-cyan-400"
              />
            </div>

            <h2 className="text-xl font-semibold text-white">
              Ask your AI Assistant
            </h2>

            <p className="mt-2 max-w-md text-sm text-zinc-500">
              Ask anything about the documents uploaded
              to this project.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">

              {[
                "Summarize my document",
                "What skills are mentioned?",
                "What projects are mentioned?",
              ].map((text) => (
                <button
                  key={text}
                  onClick={() => setQuestion(text)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-400 transition hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-white"
                >
                  {text}
                </button>
              ))}

            </div>

          </div>

        ) : (
  // MESSAGES
  <div className="space-y-6">

    {messages.map((message) => (

      <div
        key={message.id}
        className={`flex gap-3 ${
          message.role === "user"
            ? "justify-end"
            : "justify-start"
        }`}
      >

        {/* AI ICON */}
        {message.role === "assistant" && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
            <Bot
              size={18}
              className="text-cyan-400"
            />
          </div>
        )}

        {/* MESSAGE + SOURCES */}
        <div className="max-w-[75%]">

          {/* MESSAGE */}
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
              message.role === "user"
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                : "border border-white/10 bg-zinc-900 text-zinc-300"
            }`}
          >
            {message.content}
          </div>

          {/* SOURCES */}
          {message.role === "assistant" &&
            message.sources?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">

                {message.sources.map((source, index) => (
                  <div
                    key={`${source.documentId}-${source.chunkIndex}-${index}`}
                    className="
                      rounded-lg
                      border
                      border-white/10
                      bg-white/5
                      px-3
                      py-1.5
                      text-xs
                      text-zinc-500
                    "
                  >
                    📄 {source.fileName}

                    {source.chunkIndex !== undefined &&
                      ` • Chunk ${source.chunkIndex + 1}`}
                  </div>
                ))}

              </div>
            )}

        </div>

        {/* USER ICON */}
        {message.role === "user" && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <User
              size={18}
              className="text-blue-400"
            />
          </div>
        )}

      </div>

    ))}

    {/* LOADING */}
    {loading && (
      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
          <Bot
            size={18}
            className="text-cyan-400"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Loader2
              size={16}
              className="animate-spin"
            />
            Thinking...
          </div>
        </div>

      </div>
    )}

  </div>

)}

      </div>

      {/* INPUT */}
      <form
        onSubmit={handleSend}
        className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111114] p-3"
      >

        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something about your documents..."
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-600 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <Loader2
              size={19}
              className="animate-spin"
            />
          ) : (
            <Send size={19} />
          )}
        </button>

      </form>

    </div>
  );
};

export default AIChat;