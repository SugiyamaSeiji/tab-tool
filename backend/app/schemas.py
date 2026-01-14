from pydantic import BaseModel

class CodeCreate(BaseModel):
    code: str
    fingering: str
    position: int

class CodeSchema(BaseModel):
    id: int
    code: str
    fingering: str
    position: int

    class Config:
        from_attributes = True