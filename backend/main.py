from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend is running!"}

def main():
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000)

if __name__ == "__main__":
    main()
