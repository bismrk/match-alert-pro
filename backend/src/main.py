from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import auth, routers

app = FastAPI(
    title="MatchTracker Pro API",
    version="0.1.0",
    description="Contract between the MatchTracker Pro frontend and the FastAPI backend."
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
