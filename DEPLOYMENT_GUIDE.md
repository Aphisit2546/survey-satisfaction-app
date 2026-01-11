# 🚀 Deployment Guide: Deploying to Render.com

This guide will walk you through deploying your Survey Application to Render.

## Prerequisites

1.  **GitHub Account**: You need a GitHub account.
2.  **Render Account**: You can sign up at [render.com](https://render.com) using your GitHub account.
3.  **Project on GitHub**: Your project code must be pushed to a GitHub repository.

---

## Step 1: Push Code to GitHub (If not already done)

If you haven't pushed your code to GitHub yet, run these commands in your terminal:

```bash
# 1. Initialize Git (if not done)
git init

# 2. Add files
git add .

# 3. Commit
git commit -m "Ready for deployment"

# 4. create a new repository on GitHub.com and copy the URL

# 5. Link to GitHub (replace URL with yours)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 6. Push
git push -u origin main
```

---

## Step 2: Create a New Web Service on Render

1.  Log in to your [Render Dashboard](https://dashboard.render.com/).
2.  Click the **"New +"** button and select **"Static Site"**.
    *   *Note: Since this is a React Frontend, "Static Site" is the best and free option.*
3.  Connect your GitHub account if prompted.
4.  Select your repository (`survey-satisfaction-app` or whatever you named it).

---

## Step 3: Configure Build Settings

Render will ask for build configuration. Use these settings:

*   **Name**: `survey-app` (or any name you like)
*   **Branch**: `main` (or `master`)
*   **Root Directory**: `.` (leave blank or dot)
*   **Build Command**: `npm install && npm run build`
*   **Publish Directory**: `dist`
    *   *Important: Since we are using Vite, the output folder is `dist`, not `build`.*

---

## Step 4: Add Environment Variables (Critical!)

**Do not skip this step.** Your app needs to know how to connect to Supabase.

1.  Scroll down to the **"Environment Variables"** section on the Render setup page.
2.  Click **"Add Environment Variable"**.
3.  Add the keys exactly as they are in your `.env` file:

| Key | Value |
| :--- | :--- |
| `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your-long-anon-key-string` |

*   *Copy these values from your local `.env` file.*

---

## Step 5: Deploy

1.  Click **"Create Static Site"**.
2.  Render will start building your app. You can watch the logs.
3.  Once finished, you will see a green **"Live"** badge and your URL (e.g., `https://survey-app.onrender.com`).

---

## Troubleshooting

*   **Page 404 on Refresh**:
    *   If you refresh a page (like `/dashboard`) and get a 404 error, you need to add a "Rewrite Rule" in valid Render settings.
    *   Go to **Settings > Redirects/Rewrites**.
    *   Add a new Rewrite:
        *   **Source**: `/*`
        *   **Destination**: `/index.html`
        *   **Status**: `200`
    *   This is required for React Router to work correctly on Static Sites.
