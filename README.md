<div align="center">

# 📚 BookStore App

<div align="center">

![BookStore Logo](https://img.shields.io/badge/📚_BookStore-Your_Reading_Journey-pink?style=for-the-badge)

**A modern, full-stack MERN application for discovering, managing, and exploring an extensive collection of books.**

</div>

---

## ✨ Features

### 🔐 **Authentication & Security**
- Secure user registration and login with **JWT** and **BCrypt**
- Protected routes for authenticated users
- Session management with automatic token refresh

### 📖 **Book Management**
- **Curated Collection**: Browse 20+ featured books from various genres
- **Personalized Library**: Create and manage your own book collection
- **View Modes**: Toggle between featured books and personal collection
- **CRUD Operations**: Add, edit, and delete books in your personal library
- **Search & Filter**: Quickly find books by title, author, or category

### 🎨 **Modern User Interface**
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Dark Mode**: Eye-friendly dark theme with smooth transitions
- **Interactive Sliders**: Auto-playing book carousels on the home page
- **Active Navigation**: Visual indicators for the current page
- **Smooth Animations**: Elegant transitions and hover effects

### 📱 **Pages & Components**
- **Home**: Featured books slider with curated collection
- **Books**: Dual-view mode (Featured/Personalized) with grid layout
- **About**: Learn about the BookStore mission and team
- **Contact**: Get in touch with form validation and social links
- **Privacy Policy**: Detailed privacy and data protection information

### 🚀 **Performance & UX**
- Auto-scroll to top on navigation
- Image optimization and lazy loading
- Form validation with instant feedback
- Toast notifications for user actions
- Loading states and error handling

---

## 🛠️ Tech Stack

### **Frontend**
<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/DaisyUI-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white" alt="DaisyUI" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
  <img src="https://img.shields.io/badge/React_Slick-000000?style=for-the-badge&logo=slick&logoColor=white" alt="React Slick" />
</p>

### **Backend**
<p align="left">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/BCrypt-00599C?style=for-the-badge&logo=letsencrypt&logoColor=white" alt="BCrypt" />
  <img src="https://img.shields.io/badge/Multer-FF6600?style=for-the-badge&logo=files&logoColor=white" alt="Multer" />
  <img src="https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white" alt="Nodemon" />
</p>

---

## 📂 Project Structure

```
BookStoreApp/
│
├── Backend/                    # Node.js & Express Server
│   ├── controllers/            # Request handlers & business logic
│   │   ├── book.controller.js
│   │   ├── contact.controller.js
│   │   └── user.controller.js
│   ├── model/                  # Mongoose schemas & models
│   │   ├── book.model.js
│   │   ├── contact.model.js
│   │   └── user.model.js
│   ├── routes/                 # API route definitions
│   │   ├── book.route.js
│   │   ├── contact.route.js
│   │   └── user.route.js
│   ├── uploads/                # File upload directory
│   ├── .env                    # Environment variables
│   ├── index.js                # Server entry point
│   └── package.json            # Backend dependencies
│
└── Frontend/                   # React & Vite Application
    ├── public/                 # Static assets
    │   ├── images/             # Image files
    │   └── Banner.png
    ├── src/
    │   ├── components/         # React components
    │   │   ├── About.jsx
    │   │   ├── AddBookForm.jsx
    │   │   ├── Banner.jsx
    │   │   ├── BookCard.jsx
    │   │   ├── Books.jsx
    │   │   ├── Contact.jsx
    │   │   ├── EditBookForm.jsx
    │   │   ├── FeaturedBook.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Login.jsx
    │   │   ├── Logout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── PrivacyPolicy.jsx
    │   │   ├── ScrollToTop.jsx
    │   │   └── Signup.jsx
    │   ├── context/            # Context providers
    │   │   ├── AuthProvider.jsx
    │   │   └── SearchProvider.jsx
    │   ├── data/               # Static data
    │   │   └── books.json      # Default book collection
    │   ├── home/               # Home page
    │   │   └── Home.jsx
    │   ├── App.jsx             # Main app component
    │   ├── axiosConfig.js      # Axios configuration
    │   ├── index.css           # Global styles
    │   └── main.jsx            # React entry point
    ├── .env                    # Environment variables
    ├── package.json            # Frontend dependencies
    └── vite.config.js          # Vite configuration
```

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Local installation or MongoDB Atlas) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)

### 🔧 Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Arnav10090/BookStoreApp.git
cd BookStoreApp
```

#### 2️⃣ Backend Setup

Navigate to the `Backend` directory:
```bash
cd Backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `Backend` directory with the following variables:
```env
PORT=4000
MONGO_URL=mongodb://127.0.0.1:27017/bookStore
# For MongoDB Atlas, use:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/bookStore

JWT_SECRET=your_secure_jwt_secret_key_here
```

> **Note**: Replace `your_secure_jwt_secret_key_here` with a strong, random secret key.

Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:4000` 🚀

#### 3️⃣ Frontend Setup

Open a new terminal and navigate to the `Frontend` directory:
```bash
cd Frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `Frontend` directory (if needed for API URL):
```env
VITE_API_URL=http://localhost:4000
```

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` 🎉

---

## 🎯 Usage

### For Users:
1. **Sign Up**: Create an account to access all features
2. **Browse Books**: Explore featured books on the home page
3. **Personal Collection**: Switch to personalized mode to manage your books
4. **Add Books**: Click "Add New Book" to add books to your collection
5. **Edit/Delete**: Manage your books with edit and delete options

### For Developers:
- **API Endpoints**: Backend provides RESTful API for all operations
- **Authentication**: Protected routes require JWT token
- **Dark Mode**: Automatically syncs with system preferences
- **Responsive**: Mobile-first design approach

---

## 🔗 API Endpoints

### Authentication
```
POST   /api/user/signup      - Register new user
POST   /api/user/login       - Login user
```

### Books
```
GET    /api/book             - Get all books
POST   /api/book             - Add new book (Auth required)
PUT    /api/book/:id         - Update book (Auth required)
DELETE /api/book/:id         - Delete book (Auth required)
```

### Contact
```
POST   /api/contact/submit   - Submit contact form (Auth required)
```

---

## 👨‍💻 Author

**Arnav Tiwari**

- GitHub: [@Arnav10090](https://github.com/Arnav10090)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/arnav-tiwari-063278253/)

---

<div align="center">

**Made with ❤️ by [Arnav Tiwari](https://github.com/Arnav10090)**

©️ 2024 BookStore App. All rights reserved.

</div>
