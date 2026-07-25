# Sharda Connect 🎓

Sharda Connect is a full-stack MERN (MongoDB, Express, React, Node.js) application built for university students. It combines the thrill of anonymous messaging with the utility of real-time direct connections and chat.

## Features ✨

### For Students
- **Secret Confessions**: Send and receive anonymous messages.
- **Direct Messaging**: Connect with other students via real-time Socket.io chat.
- **Connection System**: Send, accept, or reject connection requests before chatting.
- **Responsive UI**: A beautiful, modern interface with Light and Dark modes.

### For Administrators
- **Super Admin Panel**: A completely isolated dashboard for moderation.
- **Role-Based Access Control**: Secure JWT-based access for Admins and Super Admins.
- **Real-Time Metrics**: View charts and data for total users, messages, and reports.
- **Moderation Tools**: Review reported direct messages and anonymous messages, and take action (delete, block, ban).

## Tech Stack 🛠️

- **Frontend**: React (Vite), TailwindCSS, Zustand, React-Router, Socket.io-client
- **Backend**: Node.js, Express.js, Socket.io, JSON Web Tokens (JWT)
- **Database**: MongoDB (Mongoose)

## Deployment

Please see [DEPLOYMENT.md](DEPLOYMENT.md) for instructions on how to host this application on Vercel and Render.

## Development

Please see [INSTALLATION.md](INSTALLATION.md) for local setup instructions.
