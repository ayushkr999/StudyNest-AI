# StudyNest AI – AI-Powered Collaborative Learning Platform

> **Tagline: Learn Smarter. Remember Longer.**

StudyNest AI is a full-stack, enterprise-grade, collaborative learning and revision ecosystem. Built from scratch with a **JavaScript Modular Monolith Architecture**, it seamlessly unifies Markdown note-taking, Retrieval-Augmented Generation (RAG) over PDF textbooks, active-recall spaced-repetition flashcards, dynamic AI-generated exam quizzes, and real-time peer study rooms powered by Google Gemini and Socket.IO.

---

## Table of Contents

1. [Features Overview](#features-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Project Directory Structure](#project-directory-structure)
5. [LangChain.js RAG Pipeline & Vector Search](#langchainjs-rag-pipeline--vector-search)
6. [Database Schema Design](#database-schema-design)
7. [REST API Documentation](#rest-api-documentation)
8. [Socket.IO Real-Time Collaboration & AI Tutor](#socketio-real-time-collaboration--ai-tutor)
9. [Installation & Local Setup](#installation--local-setup)
10. [Environment Variables](#environment-variables)
11. [Third-Party Cloud Configuration](#third-party-cloud-configuration)
    - [MongoDB Atlas Setup](#mongodb-atlas-setup)
    - [Google Gemini API Setup](#google-gemini-api-setup)
    - [Qdrant Cloud Setup](#qdrant-cloud-setup)
12. [Cloud Deployment Guide](#cloud-deployment-guide)
    - [Frontend Deployment on Vercel](#frontend-deployment-on-vercel)
    - [Backend Deployment on Render](#backend-deployment-on-render)
13. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## 1. Features Overview

### 📝 Module 1 & 3: Smart Notes & Folders
- **Full CRUD Note-Taking**: Create, edit, organize, pin, and archive study notes.
- **Folder Organization**: Categorize notes into colored folders with dynamic counters.
- **Side-by-Side Markdown Editor**: Real-time live preview, syntax highlighting, and math formatting.
- **Debounced Auto-Save**: Automatically commits edits to the database after 700ms of inactivity with live saving status indicators.
- **Search & Filters**: Instant full-text search across titles, contents, and tags.

### 🤖 Module 4: Gemini AI Study Assistant
- **Note & Folder Summarization**: Choose between Concise, Detailed, or High-Impact Bullet styles.
- **Feynman Technique Explainer**: Breaks down difficult theories into intuition, mechanics, real-world examples, and self-checks.
- **Exam Question Generator**: Curates exam-style questions with model answers and grading rubrics.
- **Last-Minute Revision Sheets**: Dense active-recall cheat sheets with formulas, core mnemonics, and common traps.
- **Interactive AI Study Chat**: Continuous academic tutor chat with Markdown and KaTeX math formatting.

### 📚 Module 5: PDF Upload & RAG System
- **Document Ingestion**: Upload textbook chapters, lecture slides, or syllabi (up to 30MB).
- **Text & Metadata Extraction**: Preserves page numbers and metadata using `pdf-parse`.
- **Intelligent Chunking**: LangChain.js `RecursiveCharacterTextSplitter` (1000 characters with 200 overlap).
- **Vector Embeddings**: Gemini `text-embedding-004` (768-dimensional vectors).
- **Vector Search on Qdrant Cloud**: Strict metadata filtering by `userId` and `documentId`.
- **Grounded Q&A with Citations**: AI answers citing exact document titles, page numbers, and snippet excerpts.
- **Multi-Document Chat**: Select multiple textbooks to chat across a synthesized collection simultaneously.

### 🗂️ Module 6: AI Flashcards & Spaced Repetition
- **Deck Management**: Group flashcards into decks linked to folders, documents, or notes.
- **AI Card Generation**: Generates flashcard decks automatically from notes or topics using structured Gemini JSON outputs.
- **3D Card Flip Mode**: Interactive review mode with 3D CSS flip animations, memory hints, and card shuffling.
- **Spaced Repetition Algorithm**: Adjusts interval days and ease factors dynamically based on "Mastered / Known" vs "Needs Revision" ratings.

### 🎯 Module 7: AI Quiz Generator
- **Dynamic Quiz Curator**: Automatically designs multiple-choice quizzes with selectable difficulty (`easy`, `medium`, `hard`).
- **Timed Test-Taking Interface**: Immediate automated evaluation and score calculation.
- **In-Depth Explanations**: Understand why each choice was right or wrong.
- **Weak Topic Analytics**: Tracks missed topics to inform targeted study review.

### 👥 Module 8 & 9: Collaborative Study Rooms & AI Tutor
- **Unique Room Codes**: 6-character unique codes (e.g., `NEST89`) for instant peer joining.
- **Real-Time Messaging**: Built on Socket.IO with token-authenticated handshakes.
- **Peer Presence**: Real-time tracking of active room members.
- **@ai Mention Detection**: Type `@ai` or `/ai` in chat to summon the Gemini AI Tutor directly into group discussions with live typing states.

### 📊 Module 10: Dashboard & Analytics
- **Live Metrics**: Aggregate counts of notes, folders, PDFs, flashcards, quizzes, and study sessions.
- **Performance Tracking**: Flashcard mastery percentage, average quiz accuracy, and recommended focus areas.
- **Quick-Access Hub**: Resume recent notes, jump into documents, or create study sessions in one click.

---

## 2. Technology Stack

### Frontend
- **Framework**: React.js 19 with Vite 8
- **Language**: JavaScript (ES Modules)
- **Styling**: Tailwind CSS (Warm off-white `#FAF9F6`, Deep forest green `#0F382A`, Emerald `#10B981`)
- **State Management**: Redux Toolkit (10 slices)
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with centralized response unwrapping and error interceptors
- **Real-Time**: Socket.IO Client
- **Rendering**: React Markdown, Lucide React icons

### Backend
- **Runtime**: Node.js v20+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcryptjs, secure HTTP-only cookies
- **File Uploads**: Multer with file type & size constraints
- **Real-Time Server**: Socket.IO
- **Security & Limits**: `express-rate-limit`, `cookie-parser`, `cors`

### Generative AI & Vector Search
- **AI Orchestration**: LangChain.js (`@langchain/core`, `@langchain/textsplitters`)
- **LLM**: Google Gemini (`gemini-1.5-flash` via `@google/generative-ai`)
- **Embeddings**: Google Gemini `text-embedding-004` (768 dimensions)
- **Vector Database**: Qdrant Cloud (`@qdrant/js-client-rest`)

---

## 3. System Architecture

StudyNest AI follows a **JavaScript Modular Monolith Architecture**. Rather than fragmenting services into complex Python microservices or Docker containers, the entire RAG pipeline, authentication, vector queries, real-time sockets, and business logic live in a unified, maintainable Node.js Express monolith.

```
┌────────────────────────────────────────────────────────┐
│                   React.js Frontend                    │
│      Redux Toolkit • Tailwind CSS • Socket.IO Client   │
└───────────────────────────▲────────────────────────────┘
                            │ HTTPS / WSS
┌───────────────────────────▼────────────────────────────┐
│              StudyNest Express.js Monolith             │
│  ┌────────────┬─────────────┬────────────┬───────────┐ │
│  │ Auth (JWT) │ Notes/Folder│ AI & RAG   │ Sockets   │ │
│  │ Middleware │ Controllers │ Pipeline   │ (Rooms)   │ │
│  └────────────┴─────────────┴────────────┴───────────┘ │
└──────▲────────────────────▲────────────────────▲───────┘
       │                    │                    │
┌──────▼───────┐     ┌──────▼───────┐     ┌──────▼───────┐
│MongoDB Atlas │     │ Qdrant Cloud │     │ Google Gemini│
│App Database  │     │ Vector Store │     │ LLM & Embed  │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## 4. Project Directory Structure

```
StudyNest-AI/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js                # Environment variables loader
│   │   │   ├── db.js                 # MongoDB Mongoose connection
│   │   │   ├── gemini.js             # Gemini SDK client
│   │   │   └── qdrant.js             # Qdrant Cloud client & collection setup
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT & HTTP-only cookie authentication
│   │   │   ├── error.middleware.js   # Centralized error handler
│   │   │   ├── rateLimiter.middleware.js # Rate limiters (general, auth, AI)
│   │   │   └── upload.middleware.js  # Multer PDF storage & validation
│   │   ├── models/                   # 12 Mongoose Models
│   │   │   ├── User.js
│   │   │   ├── Folder.js
│   │   │   ├── Note.js
│   │   │   ├── Document.js
│   │   │   ├── ChatSession.js
│   │   │   ├── ChatMessage.js
│   │   │   ├── FlashcardDeck.js
│   │   │   ├── Flashcard.js
│   │   │   ├── Quiz.js
│   │   │   ├── QuizAttempt.js
│   │   │   ├── StudyRoom.js
│   │   │   └── RoomMessage.js
│   │   ├── modules/
│   │   │   ├── auth/                 # Auth routes, controller, service
│   │   │   ├── folders/              # Folders CRUD
│   │   │   ├── notes/                # Notes CRUD & search
│   │   │   ├── ai/                   # Gemini summarization & explainer
│   │   │   ├── rag/                  # Complete LangChain RAG pipeline
│   │   │   │   ├── pdf.service.js
│   │   │   │   ├── chunk.service.js
│   │   │   │   ├── embedding.service.js
│   │   │   │   ├── vector.service.js
│   │   │   │   ├── retrieval.service.js
│   │   │   │   ├── rag.service.js
│   │   │   │   ├── rag.controller.js
│   │   │   │   └── rag.routes.js
│   │   │   ├── flashcards/           # Flashcards & spaced repetition
│   │   │   ├── quizzes/              # AI quiz generator & assessment
│   │   │   ├── studyRooms/           # Room code generation & membership
│   │   │   └── dashboard/            # Aggregated database analytics
│   │   ├── sockets/
│   │   │   └── roomSocket.js         # Socket.IO handlers & @ai tutor
│   │   ├── utils/
│   │   │   ├── apiResponse.js        # Standard JSON envelope
│   │   │   └── asyncHandler.js       # Promise catch wrapper
│   │   ├── app.js                    # Express app configuration
│   │   └── server.js                 # HTTP & Socket.IO server listener
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js              # Redux Toolkit store (10 slices)
│   │   ├── components/
│   │   │   ├── common/               # Button, Input, Modal, Badge, Toast, MarkdownView...
│   │   │   └── layout/               # Sidebar, Navbar, AppLayout, ProtectedRoute
│   │   ├── features/                 # 10 Redux Slices
│   │   │   ├── auth/authSlice.js
│   │   │   ├── ui/uiSlice.js
│   │   │   ├── folders/folderSlice.js
│   │   │   ├── notes/notesSlice.js
│   │   │   ├── pdf/pdfSlice.js
│   │   │   ├── chat/chatSlice.js
│   │   │   ├── flashcards/flashcardSlice.js
│   │   │   ├── quizzes/quizSlice.js
│   │   │   ├── studyRooms/studyRoomSlice.js
│   │   │   └── dashboard/dashboardSlice.js
│   │   ├── pages/                    # 15 React Pages
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── NotesPage.jsx
│   │   │   ├── NoteEditorPage.jsx
│   │   │   ├── AiAssistantPage.jsx
│   │   │   ├── PdfLibraryPage.jsx
│   │   │   ├── PdfChatPage.jsx
│   │   │   ├── FlashcardsPage.jsx
│   │   │   ├── FlashcardDeckViewPage.jsx
│   │   │   ├── QuizzesPage.jsx
│   │   │   ├── QuizPlayerPage.jsx
│   │   │   ├── StudyRoomsPage.jsx
│   │   │   ├── RoomChatPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance with credentials
│   │   │   └── socket.js             # Socket.IO client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
├── DEVELOPMENT_PROGRESS.md
├── README.md
└── .gitignore
```

---

## 5. LangChain.js RAG Pipeline & Vector Search

The RAG pipeline is implemented entirely in JavaScript across `backend/src/modules/rag/`:

```
User uploads PDF
       │
       ▼
[pdf.service.js]       ──> Parses text & extracts individual page numbers (pdf-parse)
       │
       ▼
[chunk.service.js]     ──> LangChain RecursiveCharacterTextSplitter (chunkSize: 1000, overlap: 200)
       │
       ▼
[embedding.service.js] ──> Google Gemini API (text-embedding-004, 768 dimensions)
       │
       ▼
[vector.service.js]    ──> Upserts points to Qdrant Cloud with strict payload:
                           { userId, documentId, documentName, pageNumber, chunkIndex, text }
```

### Retrieval & Grounded Generation
When a student asks a question:
1. **Query Embedding**: The question is embedded using Gemini `text-embedding-004`.
2. **Filtered Vector Search**: Qdrant Cloud executes a cosine similarity search filtered strictly by the authenticated `userId` and selected `documentId(s)`.
3. **Context Construction**: Top $k$ chunks (score, page number, text) are compiled into a grounded prompt.
4. **Synthesis**: Google Gemini answers using only retrieved facts and cites exact source pages (e.g. `[Campbell Biology, Page 42]`).
5. **Persistence**: The conversation is stored in MongoDB `ChatSession` and `ChatMessage` models with all source metadata.

---

## 6. Database Schema Design

StudyNest AI uses 12 normalized Mongoose models:

| Model | Purpose | Key Attributes |
|---|---|---|
| **User** | Authentication & Profile | `name`, `email`, `password` (bcrypt), `bio`, `studyGoals`, `avatar` |
| **Folder** | Note Organization | `name`, `color`, `icon`, `user` (ref), `parentFolder` |
| **Note** | Markdown Notes | `title`, `content`, `folder` (ref), `user` (ref), `tags`, `isPinned`, `lastEditedAt` |
| **Document** | Uploaded RAG PDFs | `title`, `originalName`, `filePath`, `totalPages`, `chunkCount`, `status` (`pending`, `processing`, `indexed`, `failed`), `user` |
| **ChatSession** | RAG Chat History | `title`, `user`, `document`, `isMultiDoc`, `selectedDocuments`, `lastMessageAt` |
| **ChatMessage** | RAG Messages | `session`, `user`, `role` (`user`, `assistant`), `content`, `sources` (`pageNumber`, `score`, `textSnippet`) |
| **FlashcardDeck**| Flashcard Grouping | `title`, `description`, `folder`, `document`, `note`, `cardCount`, `user` |
| **Flashcard** | Spaced Repetition Cards| `deck`, `front`, `back`, `hint`, `difficulty`, `status`, `reviewCount`, `intervalDays`, `easeFactor`, `nextReviewDate` |
| **Quiz** | Dynamic MCQs | `title`, `topic`, `difficulty`, `questions` (`question`, `options`, `correctAnswer`, `explanation`), `user` |
| **QuizAttempt** | Test Results | `quiz`, `user`, `answers`, `score`, `totalQuestions`, `percentage`, `weakTopics`, `timeSpentSeconds` |
| **StudyRoom** | Live Rooms | `name`, `description`, `code` (6-char unique), `owner`, `members`, `active` |
| **RoomMessage** | Real-Time Chat | `room`, `user`, `senderName`, `isAi`, `content`, `createdAt` |

---

## 7. REST API Documentation

All routes are prefixed with `/api`. Protected routes require authentication via HTTP-only cookie or Bearer JWT token.

### Authentication (`/api/auth`)
- `POST /register`: Register user `{ name, email, password }`
- `POST /login`: Authenticate and set HTTP-only cookie
- `POST /logout`: Clear session cookie
- `GET /me`: Get authenticated user profile
- `PUT /profile`: Update name, bio, study goals
- `PUT /change-password`: Update password

### Notes & Folders (`/api/notes`, `/api/folders`)
- `GET /notes`: List notes with search, folder, tag, and sort filters
- `POST /notes`: Create note
- `GET /notes/:id`: Get note details
- `PUT /notes/:id`: Update note (used by debounced auto-save)
- `DELETE /notes/:id`: Delete note
- `PATCH /notes/:id/pin`: Toggle note pin status
- `GET /folders`: List folders with dynamic note counts
- `POST /folders`: Create folder

### Gemini AI Assistant (`/api/ai`)
- `POST /summarize-note/:noteId`: Summarize note `{ style }`
- `POST /summarize-folder/:folderId`: Synthesize entire folder `{ style }`
- `POST /explain-concept`: Feynman technique explanation `{ concept, context }`
- `POST /exam-questions`: Generate exam questions with model answers
- `POST /revision-notes`: Generate cheat-sheet revision notes
- `POST /chat`: Multi-turn study tutor conversation

### PDF Library & RAG (`/api/rag`)
- `POST /upload`: Upload PDF (multipart/form-data)
- `GET /documents`: List user's documents and indexing status
- `POST /documents/:id/retry`: Retry failed indexing
- `DELETE /documents/:id`: Delete PDF and purge vectors from Qdrant
- `POST /chat/ask`: Grounded question-answering `{ question, documentIds, sessionId }`
- `GET /chat/sessions`: List chat sessions
- `GET /chat/sessions/:sessionId`: Get full message history with citations

### Flashcards & Quizzes (`/api/flashcards`, `/api/quizzes`)
- `GET /flashcards/decks`: List decks
- `POST /flashcards/decks`: Create deck
- `POST /flashcards/generate`: Generate cards using Gemini AI
- `PATCH /flashcards/cards/:cardId/review`: Record review (`known` or `needs_revision`)
- `POST /quizzes/generate`: Generate MCQs `{ topic, difficulty, questionCount }`
- `GET /quizzes`: List quizzes
- `POST /quizzes/:id/attempt`: Submit assessment and evaluate answers
- `GET /quizzes/attempts`: View assessment history

### Study Rooms & Dashboard (`/api/rooms`, `/api/dashboard`)
- `POST /rooms`: Create room (returns unique 6-character code)
- `POST /rooms/join`: Join room with code
- `GET /rooms/code/:code`: Get room details & member list
- `GET /rooms/:id/messages`: Get recent room chat history
- `GET /dashboard`: Aggregated statistics, metrics, and focus areas

---

## 8. Socket.IO Real-Time Collaboration & AI Tutor

Real-time collaboration is powered by Socket.IO on the same HTTP server port.

### Connection & Security
- Handshakes are authenticated using JWT from cookies or `socket.handshake.auth.token`.

### Events
| Event | Direction | Payload | Description |
|---|---|---|---|
| `join_room` | Client ➔ Server | `{ roomId }` | Joins socket room and registers presence |
| `leave_room` | Client ➔ Server | `{ roomId }` | Leaves room and removes presence |
| `room_presence` | Server ➔ Client | `{ roomId, activeMembers }` | Broadcasts active online user list |
| `send_message` | Client ➔ Server | `{ roomId, content }` | Dispatches chat message |
| `new_message` | Server ➔ Client | `RoomMessage` payload | Broadcasts new message to room |
| `ai_typing` | Server ➔ Client | `{ roomId, isTyping }` | Displays live AI Tutor typing indicator |

### @ai Mention Handling
When any student sends a message containing `@ai` or `/ai`, the server:
1. Strips the tag to isolate the question.
2. Emits `ai_typing` with `{ isTyping: true }`.
3. Calls the Google Gemini model with a collaborative academic tutor system prompt.
4. Saves the response as a `RoomMessage` with `isAi: true` and `senderName: 'StudyNest AI Tutor'`.
5. Emits `new_message` to the room and clears the typing state.

---

## 9. Installation & Local Setup

### Prerequisites
- Node.js (v20 or higher)
- npm (v10 or higher)
- MongoDB instance (MongoDB Atlas free cluster or local MongoDB)
- Google Gemini API key
- Qdrant Cloud cluster and API key (free tier available)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/studynest-ai.git
cd studynest-ai
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Configure Backend Environment
Copy the example file and fill in your credentials:
```bash
cp .env.example .env
```
Edit `.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/studynest?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004
QDRANT_URL=https://your-cluster-id.europe-west3-0.gcp.cloud.qdrant.io:6333
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION=studynest_documents
STORAGE_PROVIDER=local
STORAGE_DIR=uploads
```

### Step 4: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 5: Configure Frontend Environment
```bash
cp .env.example .env
```
Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Step 6: Run Locally

In one terminal, start the backend:
```bash
cd backend
npm run dev
```

In a second terminal, start the frontend:
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 10. Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend port | `5000` |
| `NODE_ENV` | Environment (`development` or `production`) | `development` |
| `CLIENT_URL` | Allowed CORS origin for frontend | `http://localhost:5173` |
| `MONGO_URI` | MongoDB Atlas connection string | Required |
| `JWT_SECRET` | Secret key for signing authentication tokens | Required |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `GEMINI_MODEL` | Gemini generative text model | `gemini-1.5-flash` |
| `GEMINI_EMBEDDING_MODEL` | Gemini embedding model | `text-embedding-004` |
| `QDRANT_URL` | Qdrant Cloud endpoint | Required |
| `QDRANT_API_KEY` | Qdrant Cloud API key | Required |
| `QDRANT_COLLECTION` | Qdrant vector collection name | `studynest_documents` |
| `STORAGE_PROVIDER` | PDF storage mode (`local` or object storage) | `local` |
| `STORAGE_DIR` | Directory for PDF uploads | `uploads` |

### Frontend (`frontend/.env`)
| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Express REST API base endpoint | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Socket.IO server URL | `http://localhost:5000` |

---

## 11. Third-Party Cloud Configuration

### MongoDB Atlas Setup
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Security > Database Access**, create a user with read and write privileges.
3. Under **Security > Network Access**, allow access from anywhere (`0.0.0.0/0`) or add Render's IP addresses.
4. Copy the connection string into `MONGO_URI`.

### Google Gemini API Setup
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Create an API Key.
3. Copy the key into `GEMINI_API_KEY`.
4. The default models used are:
   - Text generation: `gemini-1.5-flash`
   - Embeddings: `text-embedding-004` (768 dimensions)

### Qdrant Cloud Setup
1. Sign up on [Qdrant Cloud](https://cloud.qdrant.io/).
2. Create a free 1GB cluster.
3. Generate an API Key.
4. Copy your cluster endpoint URL (including port `:6333`) and API key into `QDRANT_URL` and `QDRANT_API_KEY`.
5. The backend automatically initializes the collection `studynest_documents` with 768 dimensions and Cosine distance on first startup.

---

## 12. Cloud Deployment Guide

### Backend Deployment on Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your Git repository.
3. Configure the service settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, set:
   - `NODE_ENV=production`
   - `PORT=10000` (or leave default for Render)
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL=https://your-studynest-app.vercel.app`
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL=gemini-1.5-flash`
   - `GEMINI_EMBEDDING_MODEL=text-embedding-004`
   - `QDRANT_URL`
   - `QDRANT_API_KEY`
   - `QDRANT_COLLECTION=studynest_documents`
5. Deploy the service and copy your Render URL (e.g., `https://studynest-backend.onrender.com`).

### Frontend Deployment on Vercel

1. Import your Git repository into [Vercel](https://vercel.com).
2. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Under **Environment Variables**, add:
   - `VITE_API_URL=https://studynest-backend.onrender.com/api`
   - `VITE_SOCKET_URL=https://studynest-backend.onrender.com`
4. Deploy the project.

---

## 13. Troubleshooting & FAQ

#### Q: How does the application behave if Gemini API or Qdrant credentials are not configured yet?
> The backend employs graceful degradation. The application boots cleanly, health checks pass, and all non-AI features (note-taking, folder organization, manual flashcard decks, study room real-time peer messaging) work normally. When an AI feature is invoked without keys, it returns a clear descriptive message prompting configuration rather than crashing.

#### Q: Why are my cookies not sending across domains in production?
> When deploying frontend on Vercel and backend on Render, ensure:
> 1. `NODE_ENV=production` is set on the backend.
> 2. `CLIENT_URL` matches your exact Vercel frontend domain.
> 3. Cookies are set with `sameSite: 'none'` and `secure: true`.

#### Q: Can I run this without Docker?
> Yes! StudyNest AI was engineered specifically as a native JavaScript modular monolith. It connects directly to Qdrant Cloud and MongoDB Atlas, requiring zero local Docker containers.

---

## License

This project is licensed under the MIT License.
