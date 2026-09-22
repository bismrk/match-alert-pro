# Stage 1: Build the frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

# Install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy source and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Runtime image containing Python and Node.js
FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim AS runtime

# Install Node.js to run the TanStack Start (Nitro) SSR server
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend dependencies
COPY backend/pyproject.toml backend/uv.lock ./
# Install backend dependencies using uv
RUN uv sync --frozen

# Copy backend source
COPY backend/ ./backend/

# Copy the standalone frontend build (no node_modules required)
COPY --from=frontend-builder /app/frontend/.output /app/frontend/.output

# Create a startup script to run both servers
RUN echo '#!/bin/bash\n\
# Start FastAPI backend in the background on port 8000\n\
uv run uvicorn backend.src.main:app --host 0.0.0.0 --port 8000 &\n\
\n\
# Start Nitro frontend server in the foreground on port 3000\n\
PORT=3000 node /app/frontend/.output/server/index.mjs\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose both ports
EXPOSE 8000 3000

CMD ["/app/start.sh"]
