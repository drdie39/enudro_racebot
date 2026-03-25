FROM node:22-alpine AS base
WORKDIR /app

COPY backend/package.json backend/tsconfig.json ./backend/
COPY frontend/package.json frontend/tsconfig.json frontend/next.config.ts frontend/next-env.d.ts ./frontend/
RUN cd backend && npm install
RUN cd frontend && npm install

COPY backend ./backend
COPY frontend ./frontend

RUN cd backend && npm run build
RUN cd frontend && npm run build

EXPOSE 3000 4000
CMD sh -c "cd backend && npm run start & cd /app/frontend && npm run start"
