# 🎯 Career AI

> An AI-powered mock interview application designed to help candidates practice interviews, improve their answers, and build confidence through realistic interview sessions.

**Career AI** is a full-stack application that simulates an interview experience using AI. It allows users to practice interview questions in an interactive environment and receive feedback on their responses.

The project combines a modern web frontend, backend services, and an AI/ML layer to create a practical interview-preparation tool.

---

## ✨ Features

### 🎤 AI Mock Interviews

Practice interviews through an AI-powered interview experience instead of relying only on static question lists.

### 🧠 Intelligent Interview Questions

The application can generate interview questions based on the selected interview context and continue the conversation with relevant questions.

### 🔄 Follow-up Questions

Career AI is designed to make interviews more realistic by allowing questions to build upon previous responses.

### 📊 Interview Feedback

Responses can be analyzed to provide useful feedback and help candidates identify areas for improvement.

### 💻 Technical Interview Practice

Designed to support technical interview preparation, including questions related to software development and computer science.

### 👔 HR / Behavioral Practice

The application can also be used to practice common behavioral and HR interview scenarios.

### 🎯 Structured Interview Experience

The interview follows a structured flow rather than presenting random questions, helping users practice under a more realistic interview format.

---

## 🏗️ Architecture

Career AI is organized into three major components:

```text
                    ┌─────────────────────┐
                    │       Frontend      │
                    │   User Interface    │
                    └──────────┬──────────┘
                               │
                               │ API Requests
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │ API / Application   │
                    │      Logic          │
                    └──────────┬──────────┘
                               │
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
       ┌─────────────────┐          ┌─────────────────┐
       │    AI / ML      │          │    Data Layer   │
       │ Interview Logic │          │ Application Data│
       └─────────────────┘          └─────────────────┘
```

---

## 📁 Project Structure

```text
career-ai/
│
├── frontend/
│   └── Frontend application
│
├── backend/
│   └── Backend API and application logic
│
├── ml/
│   └── AI / ML components
│
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React / JavaScript |
| Backend | Backend API |
| AI / ML | Python / Machine Learning |
| API Communication | REST APIs |
| Version Control | Git & GitHub |

> The stack may evolve as the project continues to be developed.

---

## 🔄 How Career AI Works

The application follows a conversational interview workflow:

```text
Start Interview
      │
      ▼
Select Interview Context
      │
      ▼
AI Generates Question
      │
      ▼
Candidate Answers
      │
      ▼
AI Processes Response
      │
      ▼
Generate Follow-up Question
      │
      ▼
Continue Interview
      │
      ▼
Generate Feedback
      │
      ▼
Interview Summary
```

This approach is intended to make practice sessions more dynamic than a traditional question-and-answer list.

---

## 🎯 Project Objective

The main objective of Career AI is to create a practical environment where candidates can repeatedly practice interviews without needing a human interviewer for every session.

The project focuses on:

- Improving interview confidence
- Practicing technical and behavioral questions
- Simulating follow-up questions
- Receiving structured feedback
- Making interview preparation more accessible
- Applying AI to a real-world career-development problem

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the required development tools installed:

- Node.js
- npm
- Python
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/maithilipandey/career-ai.git
cd career-ai
```

### 2. Set Up the Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Set Up the Backend

Open another terminal:

```bash
cd backend
```

Install the required dependencies according to the backend configuration and start the development server.

### 4. Set Up the AI / ML Component

```bash
cd ml
```

Create and activate a Python virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

API keys and other sensitive configuration should be stored in environment variables rather than committed to GitHub.

Example:

```env
AI_API_KEY=your_api_key
DATABASE_URL=your_database_url
```

Make sure `.env` files are included in `.gitignore`.

---

## 🧪 Development Status

Career AI is an actively developing project.

Current focus:

- [x] Project architecture
- [x] Frontend
- [x] Backend
- [x] AI / ML component
- [ ] Complete interview workflow
- [ ] Advanced response evaluation
- [ ] Interview analytics
- [ ] Interview history
- [ ] Production deployment

---

## 🔮 Future Improvements

Some planned improvements include:

- 🎙️ Voice-based interviews
- 🗣️ Speech-to-text responses
- 📈 Detailed performance analytics
- 📚 Interview history
- 🎯 Role-specific interviews
- 🏢 Company-specific interview preparation
- 📄 Resume-based questions
- 🧠 More advanced AI response evaluation
- 📊 Progress tracking across multiple interviews
- 🌐 Production deployment

---

## 💡 Why I Built This

Interview preparation often involves repeatedly practicing the same questions without receiving meaningful feedback.

Career AI was built to explore how AI can make this process more interactive by simulating an interviewer, asking contextual follow-up questions, and providing feedback after the session.

The project also serves as a practical exploration of **full-stack development, APIs, AI/ML integration, and conversational applications**.

---

## 👩‍💻 Author

### Maithili Pandey

Computer Engineering | AI/ML

GitHub: **[@maithilipandey](https://github.com/maithilipandey)**

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.
