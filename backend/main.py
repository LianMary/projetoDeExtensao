from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field, validator
from typing import Dict, Any
import phonenumbers
from phonenumbers import is_valid_number, parse as parse_phone, PhoneNumberFormat, format_number,NumberParseException
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://192.168.0.12:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


ALUNOS_DB: Dict[str, Dict[str, Any]] = {}

class LoginRequest(BaseModel):
    name: str = Field(..., min_length=3)
    phone: str  

    @validator('phone')
    def validate_phone(cls, value):
        try:
            parsed_number=parse_phone(value,"BR")
            if not is_valid_number(parsed_number):
                raise ValueError("Número de telefone invalido ou ímpossivel.")
            normalized=format_number(parsed_number, PhoneNumberFormat.E164)
            return normalized
        except NumberParseException:
            # Captura erros de análise (formato errado)
            raise ValueError("Formato de telefone inválido.")
    
def adicionar_aluno(name: str, phone: str) -> Dict[str, Any]:
    novo_aluno = {
        "id": phone,
        "name": name.strip(),
        "phone": phone
    }
    ALUNOS_DB[phone] = novo_aluno
    return novo_aluno
@app.post("/api/login")
async def student_login(request_data: LoginRequest):
    print("Dados recebidos:", request_data.dict())      
    phone = request_data.phone
    name = request_data.name.strip()
    
    aluno_existente = ALUNOS_DB.get(phone)
    
    if aluno_existente:
        if aluno_existente["name"].strip().lower() == name.lower():
            return {"message": "Login realizado com sucesso.", "aluno": aluno_existente}
        else:
            # Telefone conhecido, mas nome errado
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Número já cadastrado, mas o nome não corresponde."
            )
    else: 
        try:
            
            novo_aluno = adicionar_aluno(name=name, phone=phone)
            return {"message": "Novo aluno cadastrado com sucesso!", "aluno": novo_aluno}       
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
@app.get("/")
def read_root():
    return {
        "status": "Backend FastAPI rodando com sucesso!",
        "endpoint_login": "/api/login",
        "observacao": "Use POST /api/login com 'name' e 'phone'"
    }

