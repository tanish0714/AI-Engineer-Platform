import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Bot, SendHorizonal, Sparkles } from "lucide-react";

const AIChat = () => {
  return (
    <DashboardLayout>

      <div className="flex h-[calc(100vh-145px)] overflow-hidden rounded-2xl border border-white/10 bg-[#111114]">

        {/* Left Sidebar */}

        <div className="hidden w-80 border-r border-white/10 lg:flex lg:flex-col">

          <div className="border-b border-white/10 p-6">

            <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-medium">
              + New Chat
            </button>

          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-5">

            {[
              "Resume Analyzer",
              "Build MERN Auth",
              "Create AI Agent",
              "RAG Architecture",
              "LangChain Help",
            ].map((chat) => (
              <button
                key={chat}
                className="w-full rounded-xl border border-white/10 bg-[#18181B] p-4 text-left transition hover:bg-white/5"
              >
                {chat}
              </button>
            ))}

          </div>

        </div>

        {/* Chat */}

        <div className="flex flex-1 flex-col">

          {/* Header */}

          <div className="flex items-center justify-between border-b border-white/10 p-6">

            <div>

              <h2 className="text-2xl font-bold">
                AI Assistant
              </h2>

              <p className="text-sm text-zinc-500">
                GPT-4 • RAG • Agentic AI
              </p>

            </div>

            <Sparkles className="text-cyan-400" />

          </div>

          {/* Messages */}

          <div className="flex-1 space-y-6 overflow-y-auto p-8">

            <div className="flex gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500">

                <Bot size={20} />

              </div>

              <div className="max-w-3xl rounded-2xl bg-[#18181B] p-5">

                Hello 👋
                <br />
                I'm your AI Engineering Assistant.
                Ask me anything about coding, RAG,
                LLMs, Agents or Full Stack Development.

              </div>

            </div>

            <div className="flex justify-end">

              <div className="max-w-2xl rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-5">

                Build a MERN Authentication System.

              </div>

            </div>

            <div className="flex gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500">

                <Bot size={20} />

              </div>

              <div className="max-w-3xl rounded-2xl bg-[#18181B] p-5">

                Sure! I'll generate a production-ready MERN authentication
                system with JWT, Refresh Tokens, Protected Routes,
                bcrypt, MongoDB and Express.

              </div>

            </div>

          </div>

          {/* Input */}

          <div className="border-t border-white/10 p-6">

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#18181B] px-5 py-3">

              <input
                type="text"
                placeholder="Ask anything..."
                className="flex-1 bg-transparent outline-none placeholder:text-zinc-500"
              />

              <button className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-3">

                <SendHorizonal size={20} />

              </button>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default AIChat;