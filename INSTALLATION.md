# Installation Guide 💻

Follow these steps to set up the project locally for development.

## 1. Clone the repository
```bash
git clone https://github.com/your-username/sharda-connect.git
cd sharda-connect
```

## 2. Set up the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory based on the `.env.example` file.
4. Start the development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

## 3. Set up the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## 4. Admin Seeding (First-time setup)
To log into the Admin Panel for the first time, you must seed an admin account.
Send a `POST` request to `http://localhost:5000/api/admin/auth/seed` using Postman or cURL.
This will create a default super admin:
- Email: `admin@example.com`
- Password: `testing12345`

You can now log into the admin panel at `http://localhost:5173/admin/login`.
