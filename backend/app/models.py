from sqlalchemy import Column, Integer, String, LargeBinary
from app.settings import Base

class Chord(Base):
    __tablename__ = 'chords'
    
    id = Column(Integer, primary_key=True, index=True)
    chord = Column(String, index=True)
    fingering = Column(String, index=True)
    position = Column(Integer, index=True)
