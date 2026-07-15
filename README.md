# 🧪 WebLabs

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)

![Bun](https://img.shields.io/badge/Bun-package%20manager-000000?style=for-the-badge&logo=bun&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-infrastructure-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![mise](https://img.shields.io/badge/mise-runtime%20manager-6C4AB6?style=for-the-badge)
![uv](https://img.shields.io/badge/uv-package%20manager-DE5FE9?style=for-the-badge)

---

My personal learning lab — a single repo where I keep notes, exercises, and projects from my journey through web development and beyond. Content comes from courses, reading docs, and self-study. Each section is a topic or technology, built up progressively from HTML fundamentals through full-stack JS, then into Python and its frameworks.

---

## 📚 Sections

| # | Section | What it covers | Status |
|---|---------|---------------|--------|
| 00 | Key-Concepts | Programming fundamentals and reference material | ✅ |
| 01 | HTML | Structure, semantic elements, accessibility | ✅ |
| 02 | CSS | Styling, layouts, Flexbox, Grid, animations | ✅ |
| 03 | Bootstrap | Component library, responsive grid | ✅ |
| 04 | Web-Design | Design principles, typography, color theory | ✅ |
| 05 | Javascript | Core JS — DOM, events, async, ES6+ | ✅ |
| 06 | Node.js | Runtime, modules, file system, CLI tools | ✅ |
| 07 | Express.js | Routing, middleware, REST APIs | ✅ |
| 08 | EJS | Server-side templating with Express | ✅ |
| 09 | APIs | REST API design, authentication, third-party APIs | ✅ |
| 10 | PostgreSQL | SQL, relational design, Node.js integration | ✅ |
| 11 | React | React + TypeScript, testing, full-stack with NestJS | ✅ |
| 12 | Python | Language fundamentals, data structures, OOP | 🚧 |
| 13 | Django | MVT, ORM, REST framework | ✅ |
| 14 | FastAPI | Async APIs, Pydantic, SQLAlchemy | 🚧 |
| 15 | Docker | Reference notes — concepts, compose, good practices | ✅ |
| 16 | Dev-Tooling | mise, uv, package managers, workflow guide | ✅ |

---

## 🗂️ How it's organized

Each section follows the same pattern:

```
XX-SectionName/
├── .mise.toml          # pins runtime version (Node, Bun, Python)
├── README.md           # what the section covers and how to run it
├── notes/              # concept notes and command references
├── practice-snippets/  # small focused exercises
└── projects/           # larger end-to-end projects
```

JS sections use **Bun** as the package manager. Python sections use **uv** for packages and **mise** to pin the Python version. Projects that need a database get their own `docker-compose.dev.yml` on a unique port — no shared infrastructure container.

---

## 🚀 Getting started

### Prerequisites

- [mise](https://mise.jdx.dev) — activates the right runtime when you `cd` into a section
- [Bun](https://bun.sh) — for JS/TS sections
- [uv](https://docs.astral.sh/uv) — for Python sections
- [Docker](https://www.docker.com) — for sections with a database

### Running a JS section

```bash
git clone https://github.com/RossCabrera/WebLabs.git
cd WebLabs/11-React/projects/01-heroes-app/01-heroes-app-frontend

bun install       # install dependencies
bun run dev       # start dev server
```

### Running a Python section

```bash
cd WebLabs/13-Django

uv sync                              # install dependencies
uv run python manage.py runserver    # start dev server
```

### Starting a database

Projects that need Postgres have their own compose file:

```bash
cd WebLabs/11-React/projects/02-teslo-shop/02-teslo-shop-backend

cp .env.example .env                                    # fill in your credentials
docker compose -f docker-compose.dev.yml up -d          # start Postgres
bun install && bun run start:dev                        # start the API
```

> Each section's `README.md` has the specific commands for that project.
