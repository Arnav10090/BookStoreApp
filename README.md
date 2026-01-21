
# 📚 BookStore App

> A modern, full-stack MERN application for managing and exploring a vast collection of books. Experience seamless navigation, secure authentication, and a responsive design.

## 🚀 Features

- **User Authentication**: Secure Signup and Login using JWT and BCrypt.
- **Book Management**: Browse, Add, Edit, and Delete books (Admin/User specific roles).
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices.
- **Modern UI**: Built with **Tailwind CSS** and **DaisyUI** for a sleek, dark-mode compatible interface.
- **Search & Filter**: Quickly find books by category or title.
- **Image Uploads**: Support for book cover images using Multer.

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

## 📂 Project Structure

```bash
BookStoreApp/
├── Backend/                # Node.js & Express Server
│   ├── controllers/        # Request handlers
│   ├── model/              # Mongoose schemas
│   ├── routes/             # API routes
│   └── index.js            # Entry point
│
└── Frontend/               # React & Vite Application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── context/        # React Context (Auth, Search)
    │   └── home/           # Landing page
    └── package.json        # Dependencies
```

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas URL)

### 1. Clone the Repository
```bash
git clone https://github.com/Arnav10090/BookStoreApp.git
cd BookStoreApp
```

### 2. Backend Setup
Navigate to the `Backend` directory and install dependencies.
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory:
```env
PORT=4000
MONGO_URL=mongodb://127.0.0.1:27017/bookStore
JWT_SECRET=YourSecureSecretKey
```

Start the server:
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal, navigate to the `Frontend` directory, and install dependencies.
```bash
cd Frontend
npm install
```

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---
Made with ❤️ by [Arnav Tiwari](https://github.com/Arnav10090)
