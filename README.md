🧠 StudyNest AI – Your Ultimate Smart Study Companion 📚✨

"Study smarter, not harder."

A full-stack AI-powered productivity app built with ❤️ using the MERN stack, designed to help students and learners manage their notes, summarize content, chat with documents, and boost retention with flashcards — all in one place.

---

🚀 Live Demo

🌐 Application: http://13.51.56.209/

---

🛠 Tech Stack

🖥️ Frontend

- React + Tailwind CSS
- Zustand (State Management)
- Socket.io-client (Real-time communication)

🧠 Backend

- Node.js + Express
- MongoDB (Mongoose)
- LangChain + Gemini API (AI Engine)
- Socket.io (WebSocket server for real-time features)

🌐 Others

- JWT Authentication
- Multer for file uploads
- PDF parsing + LangChain for chunking and querying
- Real-time messaging with WebSocket protocol

---

✨ Core Features

📝 1. Create & Manage Notes

- Rich Markdown-based note editor
- Organize notes inside folders
- CRUD operations for folders and notes
- Instant autosave and structure for easy studying

---

🧠 2. AI Summarization & Question Generation

- Select a folder and let Gemini summarize all the notes inside
- Generate potential questions from your notes automatically 🪄
- Perfect for quick revisions before exams

---

🗂 3. Upload PDFs & Chat with Documents (LangChain)

- Upload large PDFs (up to 60–70 pages) 📄
- Backend uses LangChain + text splitter to process and index documents efficiently
- Chat with your PDF — ask any question, get context-aware answers in seconds
- Chat history is session-aware for deeper conversations

---

🧠 4. Flashcard Generator

- Instantly convert notes or AI summaries into interactive flashcards 🃏
- Review mode to boost memory with spaced repetition
- Ideal for active recall sessions before tests

---

👥 5. Real-Time Collaborative AI Study Rooms

- Create or join study rooms with unique 6-character codes (e.g., ABC123) 🏠
- Real-time chat with multiple students using Socket.io for instant collaboration
- AI tutor integration — type @ai or ai help to get instant study assistance from Gemini API
- Live participant tracking and persistent message history for seamless group study sessions

---

🔐 Authentication & Security

- Secure JWT-based login system
- Role-based access ready for future teacher/student expansions
- All file uploads handled securely on the server