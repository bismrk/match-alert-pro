from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import auth, routers, db_models, seed
from .database import engine, SessionLocal

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed db
    db_models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed.seed_db(db)
    finally:
        db.close()
    yield
    # Shutdown

app = FastAPI(
    title="MatchTracker Pro API",
    version="0.1.0",
    description="Contract between the MatchTracker Pro frontend and the FastAPI backend.",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(routers.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "ok"}
