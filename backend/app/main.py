from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from app.models import Chord
from app.schemas import ChordSchema, ChordCreate
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

@app.post("/chords/", response_model=ChordSchema)
def create_chord(chord: ChordCreate, db: Session = Depends(get_db)):
    db_chord = db.query(Chord).filter(Chord.chord == chord.chord).first()
    if db_chord:
        raise HTTPException(status_code=400, detail="Chord already registered")
    new_chord = Chord(chord=chord.chord, fingering=chord.fingering, position=chord.position)
    db.add(new_chord)
    db.commit()
    db.refresh(new_chord)

    return new_chord    

# データベースの一覧取得
@app.get("/chords/", response_model=List[ChordSchema])
def read_chords(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    chords = db.query(Chord).offset(skip).limit(limit).all()
    return chords

# コードの読み取り
@app.get("/chords/{chord_id}", response_model=ChordSchema)
def read_chord(chord_id: int, db: Session = Depends(get_db)):
    db_chord = db.query(Chord).filter(Chord.id == chord_id).first()
    if db_chord is None:
        raise HTTPException(status_code=404, detail="Chord not found")
    return db_chord
# コードの更新
@app.put("/chords/{chord_id}", response_model=ChordSchema)
def update_chord(chord_id: int, chord: ChordCreate, db: Session = Depends(get_db)):
    db_chord = db.query(Chord).filter(Chord.id == chord_id).first()
    if db_chord is None:
        raise HTTPException(status_code=404, detail="Chord not found")
    db_chord.chord = chord.chord
    db_chord.fingering = chord.fingering
    db_chord.position = chord.position
    db.commit()
    db.refresh(db_chord)
    return {"message": "success"}

# コードの削除
@app.delete("/chords/{chord_id}", status_code=204)
def delete_chord(chord_id: int, db: Session = Depends(get_db)):
    db_chord = db.query(Chord).filter(Chord.id == chord_id).first()
    if db_chord is None:
        raise HTTPException(status_code=404, detail="Chord not found")
    db.delete(db_chord)
    db.commit()
    return {"message": "success"}
