from pydantic import BaseModel

class ChordCreate(BaseModel):
    chord: str
    fingering: str
    position: int

class ChordSchema(BaseModel):
    id: int
    chord: str
    fingering: str
    position: int

    class Config:
        from_attributes = True