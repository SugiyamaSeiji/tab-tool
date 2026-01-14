from sqlalchemy import Column, Integer, String, LargeBinary
from app.settings import Base

class Code(Base):
    __tablename__ = 'codes'
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, index=True)
    fingering = Column(String, index=True)
    position = Column(Integer, index=True)
