from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from app.models import Code
from app.schemas import CodeSchema, CodeCreate
from app.settings import SessionLocal, engine, Base
import uvicorn

Base.metadata.create_all(bind=engine)
app = FastAPI(title="tab-tool backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ログイン
@app.get("/")
def root():
    return {"message": "Login successful."}

@app.post("/codes/", response_model=CodeSchema)
def create_code(code: CodeCreate, db: Session = Depends(get_db)):
    db_code = db.query(Code).filter(Code.code == code.code).first()
    if db_code:
        raise HTTPException(status_code=400, detail="Code already registered")
    new_code = Code(code=code.code, fingering=code.fingering, position=code.position)
    db.add(new_code)
    db.commit()
    db.refresh(new_code)

    return new_code

# データベースの一覧取得
@app.get("/codes/", response_model=List[CodeSchema])
def read_codes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    codes = db.query(Code).offset(skip).limit(limit).all()
    return codes

# コードの読み取り
@app.get("/codes/{code_id}", response_model=CodeSchema)
def read_code(code_id: int, db: Session = Depends(get_db)):
    db_code = db.query(Code).filter(Code.id == code_id).first()
    if db_code is None:
        raise HTTPException(status_code=404, detail="Code not found")
    return db_code

# コードの更新
@app.put("/codes/{code_id}", response_model=CodeSchema)
def update_code(code_id: int, code: CodeCreate, db: Session = Depends(get_db)):
    db_code = db.query(Code).filter(Code.id == code_id).first()
    if db_code is None:
        raise HTTPException(status_code=404, detail="Code not found")
    db_code.code = code.code
    db_code.fingering = code.fingering
    db_code.position = code.position
    db.commit()
    db.refresh(db_code)

    return {"message": "success"}

# コードの削除
@app.delete("/codes/{code_id}", status_code=204)
def delete_code(code_id: int, db: Session = Depends(get_db)):
    db_code = db.query(Code).filter(Code.id == code_id).first()
    if db_code is None:
        raise HTTPException(status_code=404, detail="Code not found")
    db.delete(db_code)
    db.commit()
    return {"message": "success"}
