### Invoice Management App — Local Development Setup (Windows & Linux)

This repository contains a NestJS backend (MySQL via TypeORM) and an Angular frontend. Docker is used to run MySQL and phpMyAdmin locally.

---

## Prerequisites

- Node.js 22
  - Windows: Install from `https://nodejs.org`
  - Linux: Install via your package manager or `nvm`
- Package managers
  - Backend: Yarn (preferred) or npm
  - Frontend: Yarn (preferred) or npm
- Git `https://git-scm.com/downloads`
- Docker
  - Windows 10/11: Install Docker Desktop `https://www.docker.com/products/docker-desktop/`
    - Enable WSL2 backend during install (recommended)
  - Linux: Install Docker Engine and Compose plugin
    - Quick start: `https://docs.docker.com/engine/install/`
    - Compose plugin: `https://docs.docker.com/compose/install/`

Verify installs:

```bash
docker --version
docker compose version
node -v
yarn -v
npm -v
```

---

## Environment variables

Create a `.env` file at `backend/.env`. This file is used by both Docker services and the NestJS backend.

Minimum example:

```env
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=accomation
MYSQL_USER=accomation
MYSQL_PASSWORD=password

PMA_HOST=mysql
PMA_USER=root
PMA_PASSWORD=root_password
```

---

## Start infrastructure (MySQL + phpMyAdmin)

From the repository root:

```bash
# Compose V2 (Docker Desktop on Windows and most modern Linux)
docker compose up -d

# If you have the legacy docker-compose binary
# docker-compose up -d
```

Services and default ports:

- MySQL: `http://localhost:3306`
- phpMyAdmin: `http://localhost:8080`

Login to phpMyAdmin with:

- Username: `accomation`
- Password: `password`

To stop services:

```bash
docker compose down
```

---

## Backend (NestJS)

From `backend/`:

```bash
# Install deps (choose one)
yarn install
# or
npm install

# Start dev server
yarn start:dev
# or
npm run start:dev
```

Backend runs at:

- Default: `http://localhost:3000`

Environment integration:

- The backend uses the `.env` you created to connect to MySQL.

---

## Frontend (Angular)

From `frontend/`:

```bash
# Install deps (choose one)
yarn install
# or
npm install

# Start dev server
yarn start
# or
npm start
```

Frontend runs at:

- `http://localhost:4200`

API proxy:

- The Angular dev server proxies `/api` to the backend at `http://localhost:3000` (see `frontend/proxy.conf.json`).

---

## Quick start (Windows)

PowerShell from the repo root:

```powershell
# Ensure Docker Desktop is running

# 1) Create backend/.env (see template above)

# 2) Start DB + phpMyAdmin
docker compose up -d

# 3) Start backend
cd backend

yarn install
yarn start:dev

# or:

npm install
npm run start:dev

# 4) Start frontend (new terminal)
cd ../frontend

yarn install
yarn start

# or:

npm install
npm start

```

Open:

- Frontend: `http://localhost:4200`
- phpMyAdmin: `http://localhost:8080`
- Backend (direct): `http://localhost:3000`

---

## Quick start (Linux)

Terminal from the repo root:

```bash
# 1) Create backend/.env (see template above)

# 2) Start DB + phpMyAdmin
docker compose up -d

# 3) Start backend
cd backend

yarn install && yarn start:dev

# or:

npm install && npm run start:dev

# 4) Start frontend (new terminal or tmux pane)
cd ../frontend

yarn install && yarn start:dev

# or:

npm install && npm start


```

Open:

- Frontend: `http://localhost:4200`
- phpMyAdmin: `http://localhost:8080`
- Backend (direct): `http://localhost:3000`

---

## Common issues

- Port 3306 already in use
  - Stop local MySQL or change the published port in `docker-compose.yml` and `MYSQL_PORT` in `.env`.
- Docker Desktop not running (Windows)
  - Launch Docker Desktop and wait until it says “Running” before `docker compose up -d`.
- Proxy errors from Angular
  - Ensure backend is running on port 3000 (or update `frontend/proxy.conf.json` target if you change it).
- Authentication errors in phpMyAdmin
  - Verify `.env` credentials match what you use to log in. If you changed them after the first run, remove the volume to reinitialize: `docker compose down -v` (this wipes DB data).

---

## Project structure

- `backend/`: NestJS app (TypeORM + MySQL)
- `frontend/`: Angular app (dev proxy to backend)
- `docker-compose.yml`: MySQL and phpMyAdmin services
