# Google Keep Clone - Backend

This is the backend server for the Google Keep Clone project, built with Node.js, Express, and MongoDB. It provides a RESTful API for user authentication and note management.

## Features
- **User Authentication**: Secure signup and login with JWT (JSON Web Tokens).
- **Password Hashing**: Uses bcryptjs to securely hash user passwords.
- **RESTful API**: Endpoints for CRUD operations on notes.
- **CORS Configuration**: Configured to securely handle requests from the frontend client.
- **MongoDB Integration**: Uses Mongoose for data modeling and interactions with MongoDB.

## Technologies Used
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- Bcryptjs

## Getting Started

### Prerequisites
- Node.js installed on your machine
- MongoDB installed locally or a MongoDB Atlas connection string

### Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the `server` directory using `.env.example` as a template:
   ```env
   PORT=5000
   NODE_ENV=development
   URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   *(Alternatively, run `npm start` for production mode).*

The server will be running at `http://localhost:5000`.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user and get a token

### Notes
- `GET /api/notes` - Get all notes for the authenticated user
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a specific note
- `DELETE /api/notes/:id` - Delete a specific note
