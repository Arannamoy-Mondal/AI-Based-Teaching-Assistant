# AI-Based Teaching Assistant (PDF Chatbot)

A full-stack ChatGPT-like web application that allows users to upload PDF documents and ask questions based on the document's content. Built with a Retrieval-Augmented Generation (RAG) pipeline using local LLMs.

## 🚀 Tech Stack

**Frontend:**
- Next.js (TypeScript, App Router)
- Tailwind CSS v3 & DaisyUI (Theming)
- Lucide React (Icons) & React Markdown

**Backend:**
- FastAPI & Python
- LangChain & ChromaDB (Vector Store)
- Ollama (Local LLM & Embeddings)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
1. **Node.js** & **pnpm**
2. **Python 3.10+** (Conda recommended)
3. **[Ollama](https://ollama.com/)** installed locally.

**Pull the required Ollama models:**
```bash
ollama pull nomic-embed-text:latest
ollama pull nemotron-cascade-2:latest
```

---

## ⚙️ Installation & Setup

### 1. Backend Setup (FastAPI)
Navigate to your backend directory and install the dependencies:

```bash
# Activate your conda environment (if any)
conda activate conda-env-mlops-3-12

# Install required Python packages
pip install fastapi uvicorn langchain-ollama langchain-community langchain-chroma langchain-text-splitters python-multipart pypdf chromadb

# Run the backend server
python main.py
```
> The FastAPI server will start running at `http://127.0.0.1:8888`

### 2. Frontend Setup (Next.js)
Open a **new terminal window**, navigate to the frontend directory, and start the Next.js app:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```
> The frontend application will start running at `http://localhost:3000`

---

## 💡 Usage
1. Open `http://localhost:3000` in your browser.
2. Click the 📎 (Paperclip) icon to upload a PDF file.
3. Type your question in the input box and hit enter.
4. The AI will process the PDF and answer your question based on the context!

---

## 🌙 Features
- Clean, responsive UI inspired by ChatGPT.
- Light/Dark mode toggle.
- Markdown support for AI responses (bold, lists, code blocks).
- 100% private and local AI processing using Ollama.
```
