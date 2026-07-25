# Deployment Guide 🚀

This guide explains how to deploy the Sharda Connect application. The architecture is split:
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render
- **Database**: Hosted on MongoDB Atlas

## Prerequisites
1. A GitHub repository containing the code.
2. A Vercel account (vercel.com).
3. A Render account (render.com).
4. A MongoDB Atlas cluster.

---

## 1. Deploying the Backend (Render)

We use a `render.yaml` blueprint for zero-config deployment.

1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New** -> **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` file in the root directory.
5. In the Render Dashboard for your new Web Service, go to **Environment** and set the required variables:
   - `NODE_ENV=production`
   - `MONGO_URI=<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET=<A strong random string>`
   - `FRONTEND_URL=<Your Vercel URL (e.g. https://sharda-connect.vercel.app)>`

Once the deployment finishes, copy the Backend URL (e.g. `https://sharda-connect-api.onrender.com`).

---

## 2. Deploying the Frontend (Vercel)

The frontend uses Vite and React Router, so we have included a `vercel.json` to handle client-side routing.

1. Go to [Vercel Dashboard](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Set the **Framework Preset** to `Vite`.
5. Set the **Root Directory** to `frontend`.
6. Open the **Environment Variables** section and add:
   - `VITE_API_URL=<Your Render Backend URL (e.g. https://sharda-connect-api.onrender.com)>`
   - `VITE_SOCKET_URL=<Your Render Backend URL>`
7. Click **Deploy**.

Vercel will automatically build the project using `npm run build` and output to the `dist` folder.

---

## 3. Post-Deployment Checks

1. Verify that the Frontend URL correctly loads the homepage.
2. Open the console and ensure there are no CORS errors.
3. Test the WebSocket connection by logging in and opening the Direct Chat tab.
