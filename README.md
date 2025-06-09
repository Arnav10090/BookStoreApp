# BookStore App

A full-stack web application designed to provide a seamless experience for browsing and managing books. It features user authentication, a responsive design with dark mode support, and a structured layout for different sections of the application.

## 🚀 Features

*   **User Authentication:** Secure signup and login with password hashing (bcrypt).
*   **JWT Authentication:** Implements JSON Web Tokens for secure and stateless user session management.
*   **Protected Routes:** Access to specific book management features is restricted to authenticated users.
*   **Dynamic Homepage:** Displays a selection of featured books at all times, with a responsive slider for mobile devices and a grid for larger screens.
*   **Book Management:** Authenticated users can add, edit, and **delete** books.
*   **Theming:** Toggle between light and dark modes for a personalized browsing experience.
*   **Informative Pages:** Dedicated sections for "About Us" and "Contact Us" with appealing designs.
*   **Responsive Design:** Optimized for various screen sizes, from mobile phones to desktops.
*   **Toast Notifications:** Provides user feedback for actions like successful login/signup or errors.

## 🛠️ Technologies Used

**Frontend:**
*   **React.js:** A JavaScript library for building user interfaces.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **DaisyUI:** A Tailwind CSS component library.
*   **React Router DOM:** For declarative routing in React applications.
*   **Axios:** Promise-based HTTP client for making API requests.
*   **React Hook Form:** For flexible and extensible forms with easy validation.
*   **React Hot Toast:** For beautiful and responsive toast notifications.
*   **React Slick:** A carousel component for React.
*   **Vite:** A fast build tool for modern web projects.

**Backend:**
*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB:** NoSQL database for storing user and book data.
*   **Mongoose:** MongoDB object data modeling (ODM) for Node.js.
*   **JSON Web Tokens (JWT):** For secure and stateless user authentication.
*   **bcryptjs:** For hashing passwords securely.

## ⚙️ Setup and Installation

Follow these steps to get your development environment set up.

### 1. Clone the repository

```bash
git clone <repository_url>
cd bookstoreApp
```

### 2. Backend Setup

Navigate to the `Backend` directory, install dependencies, and start the server.

```bash
cd Backend
npm install
npm start
```
*   **Database Connection:** Ensure your MongoDB database is running and accessible. You might need to set up your MongoDB connection string in a `.env` file -`MONGO_URL=mongodb://127.0.0.1:27017/bookStore` and `PORT=4000`.
*   **JWT Secret:** In the `.env` file define your JWT secret key -`JWT_SECRET=your_super_secret_jwt_key`.

### 3. Frontend Setup

Open a new terminal, navigate to the `Frontend` directory, install dependencies, and start the development server.

```bash
cd ../Frontend
npm install
npm run dev
```

The frontend application will typically run on `http://localhost:5173/`.

## 📂 Folder Structure (Simplified)

```
bookstoreApp/
├── Backend/
│   ├── controllers/      # API logic handlers
│   ├── models/           # Mongoose schemas for database
│   ├── routes/          # API route definitions
│   ├── .env.example     # Environment variables example
│   ├── server.js        # Backend entry point
│   └── package.json
└── Frontend/
    ├── public/          # Static assets
    ├── src/
    │   ├── assets/      # Images, etc.
    │   ├── components/  # Reusable UI components (Navbar, Footer, Books, FeaturedBook, Login, Signup, etc.)
    │   ├── context/     # React Context for global state (e.g., AuthProvider)
    │   ├── home/        # Homepage components
    │   ├── App.jsx      # Main React application
    │   ├── main.jsx     # React entry point
    │   └── index.css    # Global styles
    ├── index.html
    ├── package.json
    └── tailwind.config.js
```
