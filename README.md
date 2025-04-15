# Roblox-Style Login Page Next.js Project (https://roblox-app-v1.vercel.app/)

### [LIVE Demo here](https://roblox-app-v1.vercel.app/).

Welcome to your Next.js project! This is a beginner-friendly guide to help you set up and run the project on your computer. The app features a login page styled like Roblox's login screen, built with **Next.js 15**, **Tailwind CSS v4**, **shadcn/ui**, and form validation using **Zod**. It uses the **App Router**, with the main page at `app/page.tsx`, the layout in `app/layout.tsx`, and a login API at `/api/login` that returns a cookie based on the provided username.

This guide assumes you're new to web development and will walk you through everything step-by-step for **Windows**, **Mac**, or **Linux**.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Install Node.js](#install-nodejs)
3. [Set Up the Project](#set-up-the-project)
4. [Run the Project](#run-the-project)
5. [How the App Works](#how-the-app-works)
6. [Make Changes to the App](#make-changes-to-the-app)
7. [Troubleshooting](#troubleshooting)
8. [Contact Support](#contact-support)

---
---




## What You’ll Need
Before you begin, make sure you have:
- A computer running **Windows**, **Mac**, or **Linux**.
- A code editor like **Visual Studio Code** (recommended, free to download).
- A web browser like **Google Chrome** or **Firefox**.
- The project ZIP file I sent you.

---

## Install Node.js
Node.js is required to run this project. Follow the steps below based on your operating system.

### Windows
1. **Download Node.js**:
   - Go to [nodejs.org](https://nodejs.org).
   - Download the **LTS version** (e.g., 20.x.x LTS) by clicking the left button.
2. **Install Node.js**:
   - Open the downloaded `.msi` file.
   - Follow the installer prompts (click "Next" and accept defaults).
   - When prompted, check "Automatically install the necessary tools" (if available).
3. **Verify Installation**:
   - Open **Command Prompt** (press `Win + R`, type `cmd`, press Enter).
   - Type `node -v` and press Enter. You should see a version number (e.g., `v20.x.x`).
   - Type `npm -v` and press Enter. You should see another version number (e.g., `10.x.x`).

### Mac
1. **Download Node.js**:
   - Go to [nodejs.org](https://nodejs.org).
   - Download the **LTS version** (e.g., 20.x.x LTS) by clicking the left button.
2. **Install Node.js**:
   - Open the downloaded `.pkg` file.
   - Follow the installer prompts (click "Continue" and accept defaults).
3. **Verify Installation**:
   - Open **Terminal** (search for "Terminal" in Spotlight or find it in Applications > Utilities).
   - Type `node -v` and press Enter. You should see a version number (e.g., `v20.x.x`).
   - Type `npm -v` and press Enter. You should see another version number (e.g., `10.x.x`).

### Linux (Ubuntu/Debian-based)
1. **Install Node.js**:
   - Open **Terminal** (search for it or press `Ctrl + Alt + T`).
   - Run the following commands one by one:
     ```bash
     sudo apt update
     sudo apt install -y curl
     curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
     sudo apt install -y nodejs
     ```
2. **Verify Installation**:
   - Type `node -v` and press Enter. You should see a version number (e.g., `v20.x.x`).
   - Type `npm -v` and press Enter. You should see another version number (e.g., `10.x.x`).

If you use a different Linux distribution (e.g., Fedora), let me know, and I can provide specific instructions.

---

## Set Up the Project
Now that Node.js is installed, let’s set up the project.

1. **Unzip the Project**:
   - Find the ZIP file I sent you (e.g., `project.zip`).
   - **Windows**: Right-click the ZIP file, select "Extract All," choose a location (like your Desktop), and click "Extract."
   - **Mac**: Double-click the ZIP file. It will create a folder in the same location.
   - **Linux**: Right-click the ZIP file, select "Extract Here," or run `unzip project.zip` in Terminal.

2. **Open the Project Folder**:
   - You’ll see a folder (e.g., `roblox-login-page`).
   - Open it in a code editor:
     - **Visual Studio Code**: Download and install from [code.visualstudio.com](https://code.visualstudio.com). Open VS Code, go to `File > Open Folder`, and select the project folder.
     - Alternatively, you can explore the folder manually, but a code editor makes changes easier.

3. **Install Dependencies**:
   - Open a terminal in the project folder:
     - **VS Code**: In VS Code, go to `Terminal > New Terminal`.
     - **Windows**: Open Command Prompt, navigate to the folder using `cd path/to/folder` (e.g., `cd Desktop/roblox-login-page`).
     - **Mac/Linux**: Open Terminal, navigate using `cd path/to/folder`.
   - Run this command to install all required packages:
     ```bash
     npm install
     ```
   - Wait until it finishes (it may take a minute or two). You’ll see a `node_modules` folder appear in the project.

---

## Run the Project
Now you’re ready to run the app!

1. **Start the Development Server**:
   - In the terminal (still in the project folder), run:
     ```bash
     npm run dev
     ```
   - You’ll see output like `ready - started server on 0.0.0.0:3000, url: http://localhost:3000`.

2. **Open the App**:
   - Open your web browser (Chrome, Firefox, etc.).
   - Go to `http://localhost:3000`.
   - You should see the login page styled like Roblox’s login screen.

3. **Test the Login**:
   - Enter a username (e.g., "testuser").
   - Click the "Login" button.
   - If the username is valid, you’ll see a success message, and a cookie will be set with the username.
   - If the username is invalid (e.g., empty or too short), you’ll see an error message.

4. **Stop the Server**:
   - To stop the app, go back to the terminal and press `Ctrl + C`.

---

## How the App Works
Here’s a simple overview of the project structure and functionality:
- **Main Page** (`app/page.tsx`):
  - This is the login page you see at `http://localhost:3000`.
  - It contains a form styled like Roblox’s login screen, built with Tailwind CSS and shadcn/ui components.
  - The form uses Zod for validation (e.g., username must be at least 3 characters).
- **Layout** (`app/layout.tsx`):
  - This defines the overall structure of the app, including the HTML head and body.
  - It wraps the login page and applies global styles.
- **Login API** (`app/api/login/route.ts`):
  - This handles the login form submission.
  - When you submit a valid username, it sets a cookie with the username and returns a success response.
  - If the username is invalid, it returns an error.
- **Styling**:
  - **Tailwind CSS v4**: Used for responsive and modern styling.
  - **shadcn/ui**: Provides reusable components like buttons and input fields.
- **Form Validation**:
  - Uses **Zod** to ensure the username is valid before submitting to the API.

---

## Make Changes to the App
Want to customize the app? Here’s how to make simple changes.

1. **Edit the Login Page**:
   - Open `app/page.tsx` in your code editor.
   - To change the placeholder text in the username field:
     - Find the `<input>` tag (it looks like `<input placeholder="Enter username" ... />`).
     - Change `"Enter username"` to something else, like `"Type your name"`.
   - To change colors:
     - Find classes like `bg-blue-600` (button background).
     - Replace with another Tailwind color, like `bg-green-600` (see [Tailwind Colors](https://tailwindcss.com/docs/colors)).
   - Save the file, and the app will automatically reload in your browser.

2. **Modify the Layout**:
   - Open `app/layout.tsx`.
   - To add a title to the page:
     - Find the `<title>` tag (inside `<head>`).
     - Change it to `<title>My Cool Login App</title>`.
   - Save, and the browser tab will update.

3. **Change Validation Rules**:
   - Open `app/page.tsx`.
   - Look for the Zod schema (it looks like `z.string().min(3, "Username must be at least 3 characters")`).
   - To require a longer username, change `.min(3, ...)` to `.min(5, "Username must be at least 5 characters")`.
   - Save, and try logging in to see the new rule.

4. **Test the API**:
   - The login API is at `app/api/login/route.ts`.
   - To change the cookie name:
     - Find `setCookie("username", ...)` (or similar).
     - Change `"username"` to something like `"user_id"`.
   - Save, restart the server (`Ctrl + C`, then `npm run dev`), and test the login.

5. **Add New Pages**:
   - Create a new file in the `app` folder, e.g., `app/dashboard/page.tsx`.
   - Add this code:
     ```tsx
     export default function Dashboard() {
       return <h1>Welcome to the Dashboard!</h1>;
     }
     ```
   - Save, and visit `http://localhost:3000/dashboard` to see the new page.

**Note**: Always save your files after changes. The app auto-reloads, but if you edit API routes, you may need to restart the server.

---

## Troubleshooting
If something goes wrong, try these steps:
- **Error: "node: command not found"**:
  - Node.js isn’t installed properly. Reinstall it following the [Install Node.js](#install-nodejs) section.
- **Error during `npm install`**:
  - Ensure you’re in the project folder.
  - Delete the `node_modules` folder and `package-lock.json` (if present), then run `npm install` again.
- **App doesn’t load at `http://localhost:3000`**:
  - Make sure the server is running (`npm run dev`).
  - Check the terminal for errors and fix them (or contact me).
- **Login doesn’t work**:
  - Ensure you’re entering a username with at least 3 characters.
  - Check the browser console for errors (right-click page, select "Inspect," go to "Console" tab).
- **Changes don’t appear**:
  - Save the file and ensure the server is running.
  - Clear your browser cache (Ctrl + Shift + R).

If you’re stuck, don’t worry! See the [Contact Support](#contact-support) section.

---

## Contact Support
If you run into issues or have questions:
- Message me on Fiverr, and I’ll respond ASAP.
- Provide a screenshot of any errors and describe what you were doing.
- I can guide you through fixes or make updates if needed.

---

Thank you for choosing my service! I hope you love your Roblox-style login page. Let me know if you want to add more features!