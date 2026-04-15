import uvicorn
import fastapi
from langchain_ollama import OllamaEmbeddings,ChatOllama
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_classic.chains import RetrievalQA
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os
import shutil
import jose.jwt
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

oauth2_scheme=OAuth2PasswordBearer(tokenUrl="token")


def get_current_user(token:str=fastapi.Depends(oauth2_scheme)):
    
    return {"token":f"{jose.jwt.decode(token,os.getenv("KEY"))}"}

app=fastapi.FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test")
def test():
    return {"status": "Online", "message": "Running .........."}

@app.post("/upload-pdf")
def upload_pdf(file:fastapi.UploadFile=fastapi.File(...),query:str="Query"):
    file_path=os.path.join("pdf",file.filename)
    with open(file_path,"wb") as fl:
        shutil.copyfileobj(file.file,fl)

    loader=PyPDFLoader(file_path=file_path)
    splitter=RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=100)
    data=splitter.split_documents(loader.load())
    for datum in data:
        datum.page_content=datum.page_content.encode("utf-8","ignore").decode("utf-8")
    embedding_model=OllamaEmbeddings(model="nomic-embed-text:latest")
    vector_db=Chroma.from_documents(data,embedding=embedding_model)
    chat_model=ChatOllama(model="nemotron-cascade-2:latest")
    qa_chain=RetrievalQA.from_chain_type(llm=chat_model,retriever=vector_db.as_retriever())
    result=qa_chain.invoke("Explain this in shortway")
    return {"response":f"{result["result"]}"}

if __name__=="__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8888, reload=True)