# Chat Application

A modern, real-time chat application built with React, TypeScript, Node.js, Express, and Socket.IO. This application provides a seamless messaging experience with a clean, responsive UI.

## Features

- 🔐 **User Authentication**: Secure login and registration with JWT
- 💬 **Real-time Messaging**: Instant message delivery using Socket.IO
- 👥 **User Presence**: See when users are online/offline
- 🎨 **Modern UI**: Built with Shadcn UI and Tailwind CSS
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🚀 **Type Safety**: Full TypeScript support
- 🔄 **State Management**: React Query for efficient data fetching and caching

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI Components
- React Router DOM
- Socket.IO Client
- React Query

### Backend

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Socket.IO
- JWT for Authentication
- Zod for Schema Validation

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:

   ```
   PORT=8000
   FRONTEND_URL=http://localhost:5173
   MONGO_URI=mongodb://localhost:27017/chat-app
   ACCESS_TOKEN_SECRET=supersecret
   SUPABASE_URL=https://<your-project>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variable:

   ```
   VITE_API_URL=https://localhost:8000
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. **Trust the Development Certificate**:
   - First, visit the backend URL directly in your browser: `https://localhost:8000`
   - You'll see a security warning (this is normal for self-signed certificates in development)
   - Click "Advanced" and then "Proceed to localhost (unsafe)" or similar option to accept the certificate
   - You should see a message indicating the backend is running

6. Open your browser and navigate to the frontend at `https://localhost:5173`

## Project Structure

```
chat-app/
├── backend/             # Backend server
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── socket/      # Socket.IO handlers
│   │   ├── utils/       # Utility functions
│   │   └── server.ts    # Server entry point
│   └── ...
│
└── frontend/            # Frontend React app
    ├── public/          # Static files
    └── src/
        ├── components/  # Reusable UI components
        ├── pages/       # Page components
        ├── hooks/       # Custom React hooks
        ├── lib/         # Utility functions
        ├── types/       # TypeScript type definitions
        └── ...
```

## Environment Variables

### Backend

- `PORT`: Server port (default: 3001)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT
- `NODE_ENV`: Environment (development/production)

### Frontend

- `VITE_API_URL`: Backend API URL

## 🔐 HTTPS Setup (for Development)

This project uses **HTTPS locally** to support secure cookies and cross-origin authentication.

### Step 1: Generate Self-Signed Certificates

Run the following command in the project root to generate local development certs:

```bash
mkdir cert
openssl req -x509 -out cert/localhost.pem -keyout cert/localhost-key.pem \
  -newkey rsa:2048 -nodes -sha256 \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost" \
  -days 365
```

> 📁 This will create a `cert/` folder containing:
>
> - `localhost-key.pem`
> - `localhost.pem`

### Step 2: Use HTTPS URLs

Set your frontend `.env` like this:

```env
VITE_API_URL=https://localhost:3001
```

Make sure you access the frontend at `https://localhost:5173` (not `http://`) so secure cookies are accepted by the browser.

### Step 3: Trust the Certificate (Optional)

On first use, your browser may show a warning about the self-signed certificate. You can safely bypass this warning in development, or add the certificate to your trusted store based on your OS.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

You are free to use, modify, and distribute this software under the terms of the AGPL-3.0 license.

**If you deploy this software as a network service**, or use it in a SaaS product, you **must also make the complete source code available** to users of the service.

See the [LICENSE](https://www.gnu.org/licenses/agpl-3.0.txt) for full details.

## Commercial License

If you are interested in using this project in a closed-source or proprietary setting, or if you require a custom license, please contact me at [badraanmo@gmail.com](mailto:badraanmo@gmail.com).

---

Built with ❤️ by Badraan
