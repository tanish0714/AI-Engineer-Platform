import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  Upload,
  FileText,
  Search,
  Trash2,
  Eye,
} from "lucide-react";

const files = [
  {
    name: "React Documentation.pdf",
    type: "PDF",
    size: "4.2 MB",
  },
  {
    name: "NodeJS Notes.docx",
    type: "DOCX",
    size: "1.8 MB",
  },
  {
    name: "LLM Research.pdf",
    type: "PDF",
    size: "8.4 MB",
  },
];

const KnowledgeBase = () => {
  return (
    <DashboardLayout>

      <div className="space-y-8">

        {/* Header */}

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Knowledge Base
            </h1>

            <p className="mt-2 text-zinc-400">
              Upload documents to power your AI agents.
            </p>

          </div>

          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-medium">

            <Upload size={18} />

            Upload Files

          </button>

        </div>

        {/* Search */}

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111114] px-5 py-4">

          <Search size={18} className="text-zinc-500" />

          <input
            type="text"
            placeholder="Search documents..."
            className="flex-1 bg-transparent outline-none placeholder:text-zinc-500"
          />

        </div>

        {/* Files */}

        <div className="rounded-2xl border border-white/10 bg-[#111114] overflow-hidden">

          <table className="w-full">

            <thead className="border-b border-white/10 text-left">

              <tr>

                <th className="p-5">File</th>

                <th>Type</th>

                <th>Size</th>

                <th className="text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {files.map((file) => (

                <tr
                  key={file.name}
                  className="border-b border-white/5 hover:bg-white/5"
                >

                  <td className="flex items-center gap-3 p-5">

                    <FileText
                      size={20}
                      className="text-cyan-400"
                    />

                    {file.name}

                  </td>

                  <td>{file.type}</td>

                  <td>{file.size}</td>

                  <td>

                    <div className="flex justify-center gap-4">

                      <button>

                        <Eye
                          size={18}
                          className="text-zinc-400 hover:text-white"
                        />

                      </button>

                      <button>

                        <Trash2
                          size={18}
                          className="text-red-400"
                        />

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default KnowledgeBase;