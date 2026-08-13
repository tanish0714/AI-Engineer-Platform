import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import api from "../../services/api";

const ProjectDocuments = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH DOCUMENTS
  // =====================================================

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("📄 FETCHING DOCUMENTS");
      console.log("📁 PROJECT ID:", id);

      const response = await api.get(
        `/documents/project/${id}`
      );

      console.log(
        "📄 DOCUMENT RESPONSE:",
        response.data
      );

      setDocuments(response.data?.data || []);
    } catch (err) {
      console.error(
        "❌ FETCH DOCUMENTS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to fetch documents"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDocuments();
    }
  }, [id]);

  // =====================================================
  // UPLOAD
  // =====================================================

 const handleUpload = async () => {
  if (!file) {
    setError("Please select a document first.");
    return;
  }

  try {
    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();

    formData.append("document", file);
    formData.append("projectId", id);

    // DEBUG
    console.log("🚀 UPLOADING DOCUMENT");
    console.log("📁 PROJECT ID:", id);
    console.log("📄 FILE:", file);
    console.log("📄 FILE NAME:", file.name);
    console.log("📄 FILE TYPE:", file.type);
    console.log("📄 FILE SIZE:", file.size);

    // Check FormData
    for (const [key, value] of formData.entries()) {
      console.log("FORM DATA:", key, value);
    }

    const response = await api.post(
      "/upload",
      formData
    );

    console.log(
      "✅ UPLOAD RESPONSE:",
      response.data
    );

    setSuccess(
      "Document uploaded successfully."
    );

    setFile(null);

    await fetchDocuments();

  } catch (err) {
    console.error(
      "❌ DOCUMENT UPLOAD ERROR:",
      err
    );

    console.error(
      "❌ BACKEND RESPONSE:",
      err.response?.data
    );

    setError(
      err.response?.data?.message ||
      "Document upload failed"
    );

  } finally {
    setUploading(false);
  }
};

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-8">

      {/* BACK */}

      <button
        onClick={() =>
          navigate(`/dashboard/projects/${id}`)
        }
        className="
          flex
          items-center
          gap-2
          text-sm
          text-zinc-400
          transition
          hover:text-white
        "
      >
        <ArrowLeft size={17} />
        Back to Project
      </button>


      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Knowledge Base
        </h1>

        <p className="mt-2 text-zinc-400">
          Upload documents to teach your AI assistant.
        </p>
      </div>


      {/* ERROR */}

      {error && (
        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-red-500/20
            bg-red-500/5
            p-4
            text-sm
            text-red-400
          "
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}


      {/* SUCCESS */}

      {success && (
        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-green-500/20
            bg-green-500/5
            p-4
            text-sm
            text-green-400
          "
        >
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}


      {/* UPLOAD CARD */}

      <div
        className="
          rounded-2xl
          border
          border-white/10
          bg-[#111114]
          p-7
        "
      >

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-cyan-500/10 p-3">
            <Upload
              size={22}
              className="text-cyan-400"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Upload Document
            </h2>

            <p className="text-sm text-zinc-500">
              PDF, DOCX or TXT — maximum 20 MB
            </p>
          </div>

        </div>


        {/* FILE INPUT */}

        <label
          className="
            mt-6
            flex
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-xl
            border
            border-dashed
            border-white/10
            bg-white/[0.02]
            px-6
            py-10
            transition
            hover:border-cyan-500/40
          "
        >

          <FileText
            size={36}
            className="text-zinc-600"
          />

          <p className="mt-4 text-sm text-zinc-400">
            {file
              ? file.name
              : "Click to select a document"}
          </p>

          <input
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />

        </label>


        {/* UPLOAD BUTTON */}

        <button
          type="button"
          disabled={!file || uploading}
          onClick={handleUpload}
          className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            px-5
            py-3
            font-medium
            text-white
            transition
            hover:opacity-90
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >

          {uploading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Processing...
            </>
          ) : (
            <>
              <Upload size={18} />
              Upload Document
            </>
          )}

        </button>

      </div>


      {/* DOCUMENT LIST */}

      <div>

        <h2 className="mb-4 text-xl font-semibold text-white">
          Uploaded Documents
        </h2>

        {loading ? (

          <div className="flex justify-center py-16">
            <Loader2
              size={28}
              className="animate-spin text-cyan-400"
            />
          </div>

        ) : documents.length === 0 ? (

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-white/10
              bg-[#111114]
              p-12
              text-center
            "
          >
            <FileText
              size={40}
              className="mx-auto text-zinc-700"
            />

            <p className="mt-4 text-zinc-500">
              No documents uploaded yet.
            </p>
          </div>

        ) : (

          <div className="space-y-3">

            {documents.map((document) => (

              <div
                key={document._id}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-white/10
                  bg-[#111114]
                  p-5
                "
              >

                <div className="flex items-center gap-4">

                  <div className="rounded-lg bg-blue-500/10 p-3">
                    <FileText
                      size={20}
                      className="text-blue-400"
                    />
                  </div>

                  <div>

                    <p className="font-medium text-white">
                      {document.originalName}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {document.fileType}
                    </p>

                  </div>

                </div>


                <span
                  className={`
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    ${
                      document.processingStatus ===
                      "completed"
                        ? "bg-green-500/10 text-green-400"
                        : document.processingStatus ===
                          "failed"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }
                  `}
                >
                  {document.processingStatus}
                </span>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default ProjectDocuments;