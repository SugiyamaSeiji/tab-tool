from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base #ORMの基底クラス
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = 'sqlite:///chords.sqlite' #sqliteファイルにデータ保存

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} #複数スレッドからのアクセスを許可するか False=許可
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) #自動コミット　フラッシュ　セッションの紐づけ

Base = declarative_base()