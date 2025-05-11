# KHITAB - Initiative Against Hate Speech

A web application for collecting signatures against hate speech, built with React and Express.

## Features

- User-friendly form for collecting participant information
- Real-time statistics dashboard
- Export functionality to Excel
- Form validation
- Responsive design

## Tech Stack

- Frontend: React, Vite, TailwindCSS
- Backend: Node.js, Express
- Database: SQLite

## Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/abdellahi9288/KHITAB.git
cd KHITAB
```

2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Run the application
```bash
# Start the backend server (from server directory)
npm start

# Start the frontend development server (from client directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
KHITAB/
├── client/             # React frontend
│   ├── src/           # Source files
│   └── public/        # Static files
└── server/            # Express backend
    └── index.js       # Server entry point
``` 