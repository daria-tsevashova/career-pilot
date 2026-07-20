AI-powered career copilot that helps you track job applications, optimize your CV, and prepare for interviews.

---

## Overview

CareerPilot is a full-stack SaaS application designed to streamline the job search process using AI.

It helps users:
- 📋 Track job applications
- 📄 Optimize resumes with AI
- ✉️ Generate cover letters
- 🎤 Practice AI-powered mock interviews
- 🤖 Get personalized career recommendations

---

## Key Features

### 📋 Job Tracker
- Add and manage job applications
- Track statuses such as Wishlist, Applied, Interview, Offer, and Rejected
- Filter and search jobs

### 📄 AI Resume Optimizer
- Upload or paste a CV
- Get AI feedback and improvement suggestions
- Tailor resumes for specific job descriptions 

### ✉️ Cover Letter Generator
- Generate personalized cover letters with AI
- Edit and export results

### 🎤 AI Interview Coach
- Run simulated interview sessions
- Ask role-based questions
- Receive feedback and scoring

### 🤖 AI Assistant
- Analyze job descriptions
- Suggest skills to learn
- Provide career guidance

---

## Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query

### Backend
- NestJS
- PostgreSQL
- Prisma ORM
- JWT Authentication

### AI Integration
- OpenAI / Gemini / Groq / OpenRouter
- Structured JSON responses
- Prompt engineering for job-related tasks

### DevOps
- Docker
- Vercel (Frontend)
- Render / Railway (Backend)

---

## Architecture

Frontend (Next.js)
        ↓
Backend API (NestJS)
        ↓
PostgreSQL (Prisma)
        ↓
AI Services (LLM APIs)

---

## Database Schema (Simplified)
- Users
- Jobs
- Resumes
- CoverLetters
- Interviews

---

## Current Progress

The project currently includes:
- a Next.js frontend shell
- a NestJS backend with auth routes
- registration and login endpoints
- JWT-based profile access via /me

