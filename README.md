# 🎬 Movie Discovery App — Built with React + Vite + Appwrite

Welcome to the **Movie Discovery App**, a blazing-fast web application that helps users find and explore movies they'll love — without the hassle.  
Built with modern tools, clean architecture, and an eye for design.

![Movie App Preview](./public/readme/movie_app.jpg)

> 🚧 This is a work in progress. Stay tuned for continuous improvements.

---

## 🚀 Features

- 🔍 Search through thousands of movies instantly
- 🎨 Clean and responsive UI with dark mode support
- 🧠 Smart and intuitive interface
- 🔐 Secure user authentication and backend data via **Appwrite**
- ⚡️ Fast performance using **React 18 + Vite**
- 🛠️ Extensible architecture for future enhancements (e.g., watchlists, reviews)

---

## 🧱 Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Backend**: [Appwrite](https://appwrite.io) (Authentication + Database)
- **Styling**: Tailwind CSS or Custom CSS
- **Movie API**: External (e.g., TMDB or OMDb)
- **State Management**: React Hooks / Context API

---

## 🛠️ Getting Started

Follow these steps to set up the project on your local machine.

### 1. Clone the repository
```bash
git clone https://github.com/mentorbuteyodev/movie-app-react.git
cd movie-app
```

### 2. Install dependencies 
```bash
npm install 
```

### 3. Configure Environment Variables
Create a ``.env`` file at the root with the following:
```bash 
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id

```
> 🔐 Make sure to replace the placeholders with your actual Appwrite project values.

### 4. Start the development server

```bash
npm run dev
```
The app will be running at http://localhost:5173

---

## 📦 Free Assets & UI Snippets
Use these helpful resources to speed up development and design.
- JS Mastery Pro
- Free Video Kit Assets
Explore more at https://jsmastery.com

---

## ✅ Linting & TypeScript Support
This project includes basic ESLint configuration.

To improve:
- Migrate to TypeScript
- Enable type-aware rules via typescript-eslint
- Check the React + TypeScript template for reference

---

## 📄 License
This project is licensed under the MIT License.

---

## 🙌 Built With
Made with ❤️ and guidance from Mentor Buteyo