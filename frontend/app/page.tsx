"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Sun, Moon, FileText, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  role: "user" | "bot";
  content: string;
  fileName?: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    const newUserMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input || "Uploaded a document",
      fileName: file?.name,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("query", input || "Explain this document");

      const response = await fetch("http://127.0.0.1:8888/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "bot",
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error("Error sending query:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "bot",
          content: "Sorry, I encountered an error while processing your request. Please check if the FastAPI server is running.",
        },
      ]);
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-base-100 text-base-content transition-colors duration-200">
      <header className="flex justify-between items-center p-4 bg-base-200 shadow-sm">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary" />
          AI Assistant
        </h1>
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
            <Bot className="w-16 h-16 mb-4" />
            <h2 className="text-2xl font-semibold">How can I help you today?</h2>
            <p className="mt-2">Upload a PDF or ask me a question.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`avatar placeholder flex-shrink-0 ${msg.role === "user" ? "online" : ""}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${msg.role === "user" ? "bg-neutral text-neutral-content" : "bg-primary text-primary-content"}`}>
                    {msg.role === "user" ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                  </div>
                </div>
                <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-[80%]`}>
                  {msg.fileName && (
                    <div className="flex items-center gap-2 bg-base-300 p-2 rounded-lg mb-2 text-sm">
                      <FileText className="w-4 h-4 text-secondary" />
                      <span>{msg.fileName}</span>
                    </div>
                  )}
                  <div
                    className={`p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-base-300 text-base-content rounded-tr-none"
                        : "bg-base-200 text-base-content rounded-tl-none border border-base-300"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-base-content">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isUploading && (
              <div className="flex gap-4 items-start">
                <div className="avatar placeholder flex-shrink-0">
                  <div className="bg-primary text-primary-content w-10 h-10 flex items-center justify-center rounded-full">
                    <Bot className="w-6 h-6" />
                  </div>
                </div>
                <div className="p-4 bg-base-200 rounded-2xl rounded-tl-none border border-base-300 flex items-center gap-2">
                  <span className="loading loading-dots loading-md"></span>
                  <span className="text-sm opacity-70">Processing PDF...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="p-4 bg-base-100 border-t border-base-300">
        <div className="max-w-4xl mx-auto relative flex items-center">
          <label className="btn btn-circle btn-ghost absolute left-2 z-10 cursor-pointer">
            <Paperclip className="w-5 h-5" />
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <input
            type="text"
            placeholder={file ? `Attached: ${file.name} - Ask a question...` : "Ask a question..."}
            className="input input-bordered w-full pl-14 pr-14 py-6 rounded-full bg-base-200 focus:outline-none focus:border-primary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isUploading}
          />

          <button
            onClick={handleSend}
            disabled={isUploading || (!input.trim() && !file)}
            className="btn btn-circle btn-primary absolute right-2 z-10"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {file && (
          <div className="max-w-4xl mx-auto mt-2 pl-4 text-xs text-secondary flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {file.name} ready to send.
          </div>
        )}
      </footer>
    </div>
  );
}