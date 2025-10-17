import os
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

import google.generativeai as genai

load_dotenv()
genai.configure(api_key="AIzaSyCnI7A3IHOqJ2Ii7ijLKFXhmtqSNqUJV2A")

model = genai.GenerativeModel("gemini-2.5-flash")

app = FastAPI()

# Modèle de requête utilisateur
class ChatRequest(BaseModel):
    message: str

# Endpoint de chat
@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = model.generate_content(request.message)
        return {"response": response.text}
    except Exception as e:
        return {"error": str(e)}

# Page d'accueil
@app.get("/")
async def root():
    return {"message": "Bienvenue sur le chatbot Gemini avec FastAPI !"}

