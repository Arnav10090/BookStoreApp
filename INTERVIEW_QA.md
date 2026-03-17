# BookStore App — Interview Q&A

**Interview:** OneLab Ventures · AI Native Engineer (SDE2) · March 2026  
**Interviewer:** Balkrushna More

---

## Project Executive Summary

1. **Full-Stack MERN Application**: A complete bookstore management system with separate React (Vite) frontend and Express.js backend, featuring JWT authentication, file uploads via Multer, and MongoDB persistence with Mongoose ODM.

2. **Authentication Architecture**: Implements JWT-based auth with bcrypt password hashing (12 salt rounds), token stored in localStorage, and Axios interceptors for automatic token attachment to protected API requests.

3. **File Upload System**: Uses Multer middleware with disk storage for book cover images (5MB limit, image-only filter), supporting both local file uploads and remote URL references with automatic cleanup on update/delete.

4. **Context-Based State Management**: Leverages React Context API for global auth state (AuthProvider) and search functionality (SearchProvider), with protected routes using custom ProtectedRoute and PublicRoute components.

5. **Modern UI/UX**: Built with Tailwind CSS + DaisyUI, featuring dark mode support, responsive design, React Slick carousels, React Hot Toast notifications, and React Hook Form for validation.

---

## Complete API Endpoints Reference

### Authentication Endpoints
- `POST /users/signup` — Register new user (returns JWT token)
- `POST /users/login` — Login user (returns JWT token + user data)
- `POST /users/check-email` — Check if email exists in database

### Book Endpoints
- `GET /book/` — Get all books (public, no auth required)
- `POST /book/` — Create new book (protected, requires JWT + multipart/form-data)
- `PUT /book/:id` — Update book by ID (protected, requires JWT + multipart/form-data)
- `DELETE /book/:id` — Delete book by ID (protected, requires JWT)

### Contact Form Endpoint
- `POST /contact/submit` — Submit contact form (public, no auth required)

---

## Complete Mongoose Models Reference

### User Model (`user.model.js`)
- `name`: String, required
- `email`: String, required, unique, lowercase
- `password`: String, required (hashed with bcrypt, 12 rounds)
- `createdAt`: Date, default: Date.now
- `timestamps`: true (adds createdAt, updatedAt)
- **Pre-save hook**: Hashes password before saving if modified
- **Method**: `comparePassword(candidatePassword)` — compares plain text with hashed password

### Book Model (`book.model.js`)
- `title`: String, required
- `author`: String, required
- `price`: Number, required, min: 0
- `category`: String, default: 'Uncategorized'
- `image`: String, default: "" (stores URL or /uploads/filename)
- `buyingLink`: String, default: ""
- `timestamps`: true

### ContactForm Model (`contactForm.model.js`)
- `fullName`: String, required
- `emailAddress`: String, required, lowercase
- `subject`: String, required
- `message`: String, required
- `createdAt`: Date, default: Date.now

---

## Files Read

**Backend:**
- Backend/index.js
- Backend/package.json
- Backend/.env
- Backend/middleware/auth.middleware.js
- Backend/middleware/upload.middleware.js
- Backend/controllers/book.controller.js
- Backend/controllers/user.controller.js
- Backend/controllers/contactForm.controller.js
- Backend/model/book.model.js
- Backend/model/user.model.js
- Backend/model/contactForm.model.js
- Backend/routes/book.route.js
- Backend/routes/user.routes.js
- Backend/routes/contactForm.route.js

**Frontend:**
- Frontend/package.json
- Frontend/vite.config.js
- Frontend/tailwind.config.js
- Frontend/src/main.jsx
- Frontend/src/App.jsx
- Frontend/src/axiosConfig.js
- Frontend/src/context/AuthProvider.jsx
- Frontend/src/context/SearchProvider.jsx
- Frontend/src/components/Navbar.jsx
- Frontend/src/components/Login.jsx
- Frontend/src/components/Signup.jsx
- Frontend/src/components/AddBookForm.jsx
- Frontend/src/components/EditBookForm.jsx
- Frontend/src/components/BookCard.jsx
- Frontend/src/components/Cards.jsx
- Frontend/src/home/Home.jsx

**Documentation:**
- README.md

---


# SECTION 1: Overall Architecture & Design

### Q1: Why did you choose a separate Frontend (React/Vite) and Backend (Node/Express) architecture instead of a full-stack framework like Next.js?

**Difficulty:** Medium  
**Category:** Architecture

**Answer:**  
I chose a decoupled architecture for several strategic reasons. First, independent deployment — the frontend can be deployed to Netlify/Vercel (static hosting) while the backend runs on a Node server or cloud platform, allowing each to scale independently. Second, clear separation of concerns — the backend at `http://localhost:4000` handles all business logic, authentication, and database operations, while the frontend at `http://localhost:5173` focuses purely on UI/UX. This makes the codebase easier to maintain and allows frontend and backend teams to work in parallel.

In my implementation, the frontend uses Axios with a configured base URL (`axiosConfig.js` sets `baseURL: 'http://localhost:4000'`) and an interceptor that automatically attaches JWT tokens from localStorage to every request. The backend uses CORS middleware (`app.use(cors())` in `index.js`) to allow cross-origin requests from the frontend.

While Next.js would provide SSR and API routes in one codebase, this project doesn't require SEO optimization (it's an authenticated app, not a public content site), and the separation gives us more flexibility for future microservices architecture or mobile app integration using the same backend API.

**Key talking points:**
- Backend runs on port 4000, frontend on 5173 (Vite default)
- Axios interceptor in `axiosConfig.js` handles token attachment automatically
- CORS enabled in `Backend/index.js` with `app.use(cors())`
- Independent scaling and deployment strategies

**Follow-up the interviewer might ask:**  
"How would you handle CORS in production when frontend and backend are on different domains?"

---

### Q2: Walk me through your CORS configuration. How does the frontend communicate with the backend, and what security considerations did you implement?

**Difficulty:** Medium  
**Category:** Architecture / Security

**Answer:**  
Currently, I'm using a permissive CORS setup with `app.use(cors())` in `Backend/index.js`, which allows all origins. This works for local development where frontend is on `localhost:5173` and backend on `localhost:4000`. 

The frontend communicates via Axios with a centralized configuration in `axiosConfig.js`. I created an axios instance with `baseURL: 'http://localhost:4000'` and a request interceptor that retrieves the JWT token from localStorage and attaches it as `Authorization: Bearer ${token}` to every outgoing request. This eliminates the need to manually add auth headers in every API call.

For production, I would tighten CORS security by:
1. Whitelisting specific origins: `cors({ origin: 'https://mybookstore.com', credentials: true })`
2. Enabling credentials to allow cookies/auth headers
3. Using environment variables for the allowed origin
4. Implementing rate limiting with `express-rate-limit`

The current setup has a security gap — any origin can call my API. In production, I'd also add CSRF protection for state-changing operations and consider using HTTP-only cookies instead of localStorage for token storage to prevent XSS attacks.

**Key talking points:**
- Axios instance in `axiosConfig.js` with base URL and interceptor
- Request interceptor: `config.headers.Authorization = Bearer ${token}`
- Current CORS: `app.use(cors())` — permissive for development
- Production needs: origin whitelist, credentials: true, rate limiting

**Follow-up the interviewer might ask:**  
"You mentioned HTTP-only cookies — how would that change your authentication flow?"

---

### Q3: How are environment variables managed across frontend and backend? What's your strategy for different environments (dev, staging, prod)?

**Difficulty:** Easy  
**Category:** Architecture

**Answer:**  
I use `.env` files with the `dotenv` package for environment variable management. 

**Backend** (`Backend/.env`):
```
PORT=4000
MONGO_URL=mongodb://127.0.0.1:27017/bookStore
JWT_SECRET=AntigravitySecretKey_83729
```
These are loaded in `index.js` with `dotenv.config()` at the top of the file. The JWT secret is used for signing tokens in `user.controller.js` with `jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })`.

**Frontend**: Uses Vite's environment variable system (variables prefixed with `VITE_`). Currently, the API URL is hardcoded in `axiosConfig.js` as `http://localhost:4000`, but for production I would use `import.meta.env.VITE_API_URL`.

**Multi-environment strategy:**
- `.env.development` — local MongoDB, localhost URLs
- `.env.staging` — staging database, staging API URL
- `.env.production` — production MongoDB Atlas, production domain
- Never commit `.env` files (they're in `.gitignore`)
- Use CI/CD environment variables for secrets in deployment pipelines

The current JWT secret is exposed in the repo (security issue) — in production, this would be injected via CI/CD secrets or a secrets manager like AWS Secrets Manager.

**Key talking points:**
- Backend: `dotenv` package, loaded in `index.js`
- JWT_SECRET used in `jwt.sign()` and `jwt.verify()` calls
- Frontend: Vite env vars with `VITE_` prefix
- Current security gap: JWT secret in committed .env file

**Follow-up the interviewer might ask:**  
"How would you rotate the JWT secret in production without invalidating all existing user sessions?"

---

### Q4: Explain your folder structure decisions. Why did you organize the backend with routes/controllers/models (MVC pattern)?

**Difficulty:** Easy  
**Category:** Architecture

**Answer:**  
I followed the MVC (Model-View-Controller) pattern for the backend to achieve separation of concerns and maintainability:

**Models** (`Backend/model/`): Define data schemas and business logic at the database level. For example, `user.model.js` contains the Mongoose schema with a pre-save hook that automatically hashes passwords with bcrypt before saving: `userSchema.pre('save', async function(next) { ... })`. This ensures password hashing logic lives with the data model, not scattered across controllers.

**Controllers** (`Backend/controllers/`): Handle business logic and request/response processing. For example, `book.controller.js` exports `getBook`, `createBook`, `updateBook`, `deleteBook` functions. The `createBook` function validates required fields, handles both file uploads and remote image URLs, and saves to MongoDB. Controllers are pure functions that receive `(req, res)` and don't know about routing.

**Routes** (`Backend/routes/`): Define API endpoints and map them to controllers. For example, `book.route.js` defines `router.get("/", getBook)` for the public endpoint and `router.post("/", upload.single('image'), createBook)` for the protected endpoint with Multer middleware. Routes also apply middleware like `authMiddleware` to protect endpoints.

**Middleware** (`Backend/middleware/`): Reusable functions for cross-cutting concerns. `auth.middleware.js` verifies JWT tokens and attaches the user object to `req.user`. `upload.middleware.js` configures Multer for file uploads with size limits (5MB) and file type filtering (images only).

This structure makes the codebase scalable — adding a new resource (e.g., "reviews") means creating `review.model.js`, `review.controller.js`, and `review.route.js` without touching existing code.

**Key talking points:**
- Models: Mongoose schemas with hooks (e.g., password hashing pre-save hook)
- Controllers: Business logic, e.g., `createBook` in `book.controller.js`
- Routes: Endpoint definitions, e.g., `router.post("/", upload.single('image'), createBook)`
- Middleware: Reusable logic, e.g., `authMiddleware` verifies JWT

**Follow-up the interviewer might ask:**  
"Where would you put validation logic — in the model, controller, or a separate validation layer?"

---


### Q5: How does the frontend communicate with the backend? Walk me through the Axios configuration and why you chose Axios over fetch.

**Difficulty:** Medium  
**Category:** Architecture / Frontend

**Answer:**  
I created a centralized Axios instance in `Frontend/src/axiosConfig.js` to handle all API communication. The configuration includes:

```javascript
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' }
});
```

The key feature is the request interceptor that automatically attaches JWT tokens:
```javascript
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

This means every component that imports `axiosInstance` automatically gets authenticated requests without manually adding headers. For example, in `AddBookForm.jsx`, I just call `await axiosInstance.post('/book', submitData)` and the token is attached automatically.

**Why Axios over fetch:**
1. **Automatic JSON transformation** — Axios automatically parses JSON responses, while fetch requires `.json()` call
2. **Request/response interceptors** — Critical for my auth flow; fetch would require wrapping every call in a custom function
3. **Better error handling** — Axios rejects on HTTP error status codes; fetch only rejects on network errors
4. **Request cancellation** — Axios supports AbortController natively
5. **Backward compatibility** — Works in older browsers without polyfills

For file uploads, I override the Content-Type header: `axiosInstance.post('/book', formData, { headers: { 'Content-Type': 'multipart/form-data' } })` in `AddBookForm.jsx`.

**Key talking points:**
- Centralized config in `axiosConfig.js` with baseURL
- Request interceptor attaches token from localStorage
- Used in components like `AddBookForm.jsx`: `axiosInstance.post('/book', submitData)`
- Interceptors eliminate repetitive auth header code

**Follow-up the interviewer might ask:**  
"How would you handle token refresh if the access token expires during a request?"

---

### Q6: Why did you choose MongoDB/Mongoose over a relational database like PostgreSQL for this application?

**Difficulty:** Medium  
**Category:** Architecture / Database

**Answer:**  
I chose MongoDB for several reasons specific to this application's requirements:

**1. Schema Flexibility**: Books can have varying attributes (some have buyingLink, some don't; image can be a URL or local path). MongoDB's flexible schema allows this without NULL columns or complex joins. The Book model in `book.model.js` uses optional fields with defaults: `image: { type: String, default: "" }`.

**2. Rapid Prototyping**: Mongoose schemas are quick to define and modify. I can add a new field like `rating` to the Book model without migrations — just add it to the schema and it's available.

**3. JSON-Native**: The entire data flow is JSON — React state → Axios → Express → MongoDB. No ORM impedance mismatch. When I call `await Book.find({})` in `book.controller.js`, I get JavaScript objects that can be sent directly as JSON responses.

**4. No Complex Relationships**: This app has minimal relationships. Books don't reference users (no foreign keys needed). If I were building a system with orders, reviews, and complex joins, PostgreSQL would be better.

**5. Horizontal Scaling**: MongoDB shards easily if the book catalog grows to millions of entries.

**Trade-offs I'm aware of:**
- No ACID transactions across collections (though Mongoose 4.0+ supports multi-document transactions)
- No enforced referential integrity (if I add a `user` reference to books, MongoDB won't prevent orphaned records)
- Query performance for complex aggregations is worse than PostgreSQL with proper indexes

If this were an e-commerce system with orders, payments, and inventory management requiring strong consistency, I'd choose PostgreSQL with proper foreign keys and transactions.

**Key talking points:**
- Flexible schema in `book.model.js` with optional fields
- JSON-native: `Book.find({})` returns objects ready for JSON response
- No complex relationships in current design
- Trade-off: No enforced referential integrity

**Follow-up the interviewer might ask:**  
"How would you migrate this to PostgreSQL if the requirements changed?"

---

### Q7: What's your deployment strategy? Can the frontend and backend be deployed independently?

**Difficulty:** Medium  
**Category:** Architecture / DevOps

**Answer:**  
Yes, the architecture supports fully independent deployment, which is one of its key advantages.

**Frontend Deployment:**
- Build command: `npm run build` (Vite generates static files in `dist/`)
- Deploy to: Netlify, Vercel, or AWS S3 + CloudFront
- The `_redirects` file in `Frontend/public/` handles client-side routing for React Router
- Environment variable: `VITE_API_URL` points to the production backend URL
- No server required — it's a static SPA

**Backend Deployment:**
- Deploy to: Heroku, AWS EC2, DigitalOcean, or containerized with Docker
- Environment variables: `PORT`, `MONGO_URL` (MongoDB Atlas connection string), `JWT_SECRET`
- The backend serves the `/uploads` directory as static files: `app.use('/uploads', express.static(path.join(__dirname, 'uploads')))` in `index.js`
- For production, I'd use AWS S3 for file storage instead of local disk

**Deployment Workflow:**
1. Frontend deploys first with old API URL (no breaking changes)
2. Backend deploys with new features
3. Frontend redeploys with new API calls if needed
4. Zero downtime if done correctly

**Current Gaps:**
- File uploads stored locally (`Backend/uploads/`) won't work with multiple backend instances — need S3 or cloud storage
- No CI/CD pipeline — would add GitHub Actions for automated testing and deployment
- No health check endpoint — would add `GET /health` for load balancer monitoring

**Key talking points:**
- Frontend: Static build deployed to CDN (Netlify/Vercel)
- Backend: Node server on cloud platform with MongoDB Atlas
- `_redirects` file handles SPA routing
- File uploads need S3 for production (currently local disk)

**Follow-up the interviewer might ask:**  
"How would you handle database migrations in a zero-downtime deployment?"

---

# SECTION 2: JWT Authentication — Deep Dive

### Q8: Walk me through your JWT authentication flow from login to protected API call. What exactly happens at each step?

**Difficulty:** Hard  
**Category:** Auth

**Answer:**  
Here's the complete flow with actual code references:

**Step 1: User Login** (`Frontend/src/components/Login.jsx`)
- User submits email/password via React Hook Form
- `onSubmit` calls `axios.post("http://localhost:4000/users/login", { email, password })`

**Step 2: Backend Validates** (`Backend/controllers/user.controller.js` - `login` function)
- Finds user: `const user = await User.findOne({ email })`
- Compares password: `const isPasswordCorrect = await bcryptjs.compare(password, user.password)`
- If valid, generates JWT: `const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })`
- Returns: `{ message: "Login successful", _id, fullname, email, token }`

**Step 3: Frontend Stores Token** (`Frontend/src/context/AuthProvider.jsx`)
- `setAuthUser(userData, userToken)` is called
- Token stored in localStorage: `localStorage.setItem("token", token)`
- User data stored: `localStorage.setItem("Users", JSON.stringify(authUser))`
- Auth state updated: `isAuthenticated: !!authUser && !!token`

**Step 4: Protected API Call** (e.g., `AddBookForm.jsx` creating a book)
- Component calls: `axiosInstance.post('/book', submitData)`
- Axios interceptor in `axiosConfig.js` runs automatically:
  ```javascript
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  ```

**Step 5: Backend Verifies Token** (`Backend/middleware/auth.middleware.js`)
- Extracts token: `const token = req.headers.authorization.split(' ')[1]`
- Verifies: `const decoded = jwt.verify(token, process.env.JWT_SECRET)`
- Fetches user: `const user = await User.findById(decoded._id).select('-password')`
- Attaches to request: `req.user = user`
- Calls `next()` to proceed to controller

**Step 6: Controller Accesses User** (`book.controller.js` - `createBook`)
- Can access authenticated user: `user: req.user?._id || null`

**Key talking points:**
- JWT payload: `{ _id: user._id }` — only user ID, no sensitive data
- Token expiry: `expiresIn: '1h'` in `user.controller.js`
- Axios interceptor automatically attaches token to all requests
- Middleware verifies and attaches user to `req.user`

**Follow-up the interviewer might ask:**  
"What happens when the token expires after 1 hour? How does the user experience this?"

---


### Q9: What is the exact JWT payload you're encoding? Why did you choose those specific fields?

**Difficulty:** Medium  
**Category:** Auth

**Answer:**  
The JWT payload is minimal and contains only one field:

```javascript
const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
```

From `Backend/controllers/user.controller.js` in both `signup` and `login` functions.

**Payload structure:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "iat": 1678901234,
  "exp": 1678904834
}
```

**Why only `_id`:**
1. **Minimal payload size** — JWTs are sent with every request; smaller tokens = less bandwidth
2. **No stale data** — If I included email/name in the token, changing those in the database wouldn't reflect until token expires. By storing only `_id`, I fetch fresh user data on each request.
3. **Security** — Less information in the token means less exposure if it's intercepted
4. **Stateless verification** — The `_id` is all I need to identify the user and fetch their current data

**How it's used in auth middleware** (`auth.middleware.js`):
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded._id).select('-password');
req.user = user;
```

The middleware decodes the token to get `_id`, then fetches the full user object from MongoDB (excluding password). This means if a user's email changes, the next request will reflect the new email even with the same token.

**Trade-off:** This requires a database query on every protected request. If performance becomes an issue, I could include more user data in the token (email, name, role) and accept eventual consistency.

**Key talking points:**
- Payload: `{ _id: user._id }` only
- Signed with `process.env.JWT_SECRET` (currently "AntigravitySecretKey_83729")
- Expiry: 1 hour (`expiresIn: '1h'`)
- Middleware fetches fresh user data on each request

**Follow-up the interviewer might ask:**  
"How would you implement role-based access control (RBAC) with this JWT structure?"

---

### Q10: What is the token expiry time, and how did you decide on that value? What happens when it expires?

**Difficulty:** Medium  
**Category:** Auth

**Answer:**  
The token expires in 1 hour, set in `user.controller.js`:
```javascript
const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
```

**Why 1 hour:**
- **Security vs UX balance** — Short enough that a stolen token has limited validity, but long enough that users aren't constantly re-authenticating
- **Typical session length** — Most users browse books for 15-30 minutes; 1 hour covers a normal session
- **No refresh token yet** — With only access tokens, I can't make it too short or UX suffers

**What happens when it expires:**
1. User makes a request (e.g., creating a book)
2. Axios sends token in `Authorization` header
3. Backend `auth.middleware.js` calls `jwt.verify(token, process.env.JWT_SECRET)`
4. JWT library throws `TokenExpiredError`
5. Middleware catches it and returns: `res.status(401).json({ message: 'Invalid token' })`
6. Frontend receives 401 error
7. **Current behavior**: User sees error toast, must manually log in again

**Current UX problem:** The user loses their work (e.g., half-filled book form) when the token expires. They're not warned before expiry.

**How I'd improve it:**
1. **Refresh tokens** — Issue a long-lived refresh token (7 days) stored in HTTP-only cookie, and a short-lived access token (15 minutes). When access token expires, automatically request a new one using the refresh token.
2. **Token expiry warning** — Decode the token in the frontend to check `exp` claim, show a warning 5 minutes before expiry
3. **Axios response interceptor** — Catch 401 errors, attempt token refresh, retry the original request
4. **Sliding sessions** — Extend token expiry on each request (requires backend to issue new tokens)

**Key talking points:**
- Expiry: 1 hour (`expiresIn: '1h'`)
- Expired tokens return 401 from `auth.middleware.js`
- Current UX: User must manually log in again
- Improvement needed: Refresh token flow

**Follow-up the interviewer might ask:**  
"Implement a refresh token flow — what changes would you make to the backend and frontend?"

---

### Q11: Where is the JWT token stored on the frontend, and what are the security implications of that choice?

**Difficulty:** Hard  
**Category:** Auth / Security

**Answer:**  
The token is stored in **localStorage**, set in `AuthProvider.jsx`:

```javascript
useEffect(() => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}, [token]);
```

And retrieved in `axiosConfig.js`:
```javascript
const token = localStorage.getItem('token');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

**Security implications of localStorage:**

**Vulnerabilities:**
1. **XSS (Cross-Site Scripting) attacks** — If an attacker injects malicious JavaScript (e.g., via a comment field that's not sanitized), they can access localStorage: `localStorage.getItem('token')` and send it to their server. This is the biggest risk.
2. **No expiry enforcement** — localStorage persists even after browser closes. If someone uses a public computer and forgets to log out, the token remains accessible.
3. **Accessible to all scripts** — Any JavaScript running on the page (including third-party libraries) can read localStorage.

**Why I chose it anyway:**
- **Simplicity** — Easy to implement, no server-side session management
- **Works across tabs** — User stays logged in across multiple tabs
- **No CORS issues** — Unlike cookies, localStorage doesn't require CORS credentials configuration

**Better alternatives:**

**1. HTTP-only cookies (most secure):**
- Backend sets cookie: `res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' })`
- Browser automatically sends cookie with requests
- JavaScript cannot access it (XSS protection)
- Requires CSRF protection (use `csurf` middleware)

**2. Memory storage (most secure for SPAs):**
- Store token in React state/context only (not localStorage)
- Token lost on page refresh (requires re-login)
- Best security, worst UX

**3. sessionStorage:**
- Similar to localStorage but cleared when tab closes
- Still vulnerable to XSS

**My production recommendation:** HTTP-only cookies for refresh tokens (long-lived, high security) + memory storage for access tokens (short-lived, auto-refreshed). This combines security and UX.

**Key talking points:**
- Current: localStorage in `AuthProvider.jsx`
- Vulnerable to XSS attacks
- Better: HTTP-only cookies + CSRF protection
- Trade-off: Security vs simplicity

**Follow-up the interviewer might ask:**  
"How would you protect against XSS attacks in your current implementation?"

---

### Q12: How is the JWT token attached to API requests? Walk me through the Axios interceptor implementation.

**Difficulty:** Medium  
**Category:** Auth / Frontend

**Answer:**  
The token is attached automatically via an Axios request interceptor in `axiosConfig.js`:

```javascript
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

**How it works:**
1. **Interceptor registration** — When I create the axios instance, I register a request interceptor
2. **Pre-request execution** — Before every request, the interceptor function runs
3. **Token retrieval** — Gets token from localStorage
4. **Header modification** — Adds `Authorization: Bearer <token>` to the request config
5. **Request proceeds** — Returns modified config, request continues to backend

**Example usage in `AddBookForm.jsx`:**
```javascript
const response = await axiosInstance.post('/book', submitData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

Notice I don't manually add the Authorization header — the interceptor does it automatically. I only override Content-Type for file uploads.

**Benefits:**
- **DRY principle** — Token logic in one place, not repeated in every component
- **Automatic updates** — If token changes in localStorage, next request uses new token
- **Centralized auth** — Easy to add token refresh logic later

**Error handling:**
The interceptor has an error handler that rejects the promise if something goes wrong before the request is sent. I could enhance this to:
- Check token expiry before sending request
- Automatically refresh expired tokens
- Redirect to login if no token exists

**Response interceptor (not implemented yet):**
I could add a response interceptor to handle 401 errors globally:
```javascript
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/signup';
    }
    return Promise.reject(error);
  }
);
```

**Key talking points:**
- Request interceptor in `axiosConfig.js`
- Retrieves token from localStorage, adds to Authorization header
- Used in all components: `axiosInstance.post('/book', data)`
- Could add response interceptor for 401 handling

**Follow-up the interviewer might ask:**  
"How would you handle concurrent requests when the token expires?"

---


### Q13: How is auth state managed in React? Explain the AuthContext implementation and what it provides to components.

**Difficulty:** Medium  
**Category:** Auth / Frontend

**Answer:**  
Auth state is managed globally using React Context API in `AuthProvider.jsx`. Here's the complete implementation:

**State variables:**
```javascript
const [authUser, setAuthUser] = useState(null);  // User object
const [token, setToken] = useState(null);        // JWT token
const [loading, setLoading] = useState(true);    // Initial load state
```

**Initialization on mount:**
```javascript
useEffect(() => {
  const storedUser = localStorage.getItem("Users");
  const storedToken = localStorage.getItem("token");
  
  if (storedUser && storedUser !== "undefined") {
    setAuthUser(JSON.parse(storedUser));
  }
  if (storedToken && storedToken !== "undefined") {
    setToken(storedToken);
  }
  setLoading(false);
}, []);
```

This checks localStorage on app load to restore the session. The `loading` state prevents flickering — components wait for auth check before rendering.

**Sync to localStorage:**
```javascript
useEffect(() => {
  if (authUser) {
    localStorage.setItem("Users", JSON.stringify(authUser));
  } else {
    localStorage.removeItem("Users");
  }
  // Same for token
}, [authUser, token]);
```

Whenever `authUser` or `token` changes, it syncs to localStorage automatically.

**Context value provided:**
```javascript
const value = {
  authUser,                              // User object { _id, fullname, email }
  setAuthUser: updateAuthUserAndToken,   // Function to update both user and token
  isAuthenticated: !!authUser && !!token, // Boolean computed property
  loading,                               // Boolean for initial load
  token,                                 // JWT token string
  logout                                 // Function to clear auth state
};
```

**Usage in components:**
```javascript
const { authUser, isAuthenticated, logout } = useAuth();

if (isAuthenticated) {
  // Show protected content
}
```

**Protected routes in `App.jsx`:**
```javascript
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/signup" />;
  return children;
}
```

The `ProtectedRoute` component checks `isAuthenticated` and redirects to signup if false. The `loading` check prevents redirecting during the initial auth check.

**Logout implementation:**
```javascript
const logout = () => {
  setAuthUser(null);
  setToken(null);
  localStorage.removeItem("Users");
  localStorage.removeItem("token");
};
```

Called from `Navbar.jsx` when user clicks logout button.

**Key talking points:**
- Context provides: `authUser`, `token`, `isAuthenticated`, `loading`, `logout`
- Syncs to localStorage automatically via useEffect
- `ProtectedRoute` uses `isAuthenticated` to guard routes
- `useAuth()` hook for easy access in any component

**Follow-up the interviewer might ask:**  
"How would you prevent the auth state from being lost on page refresh if you moved away from localStorage?"

---

### Q14: What are the security weaknesses in your current JWT implementation, and how would you fix them?

**Difficulty:** Hard  
**Category:** Auth / Security

**Answer:**  
I've identified several critical security weaknesses:

**1. Token stored in localStorage (XSS vulnerability)**
- **Problem**: Any XSS attack can steal the token via `localStorage.getItem('token')`
- **Fix**: Use HTTP-only cookies for refresh tokens, memory storage for access tokens
- **Implementation**: Backend sets cookie with `httpOnly: true, secure: true, sameSite: 'strict'`

**2. No refresh token mechanism**
- **Problem**: 1-hour expiry means users must re-login frequently, or we extend expiry (security risk)
- **Fix**: Implement refresh token flow:
  - Access token: 15 minutes, stored in memory
  - Refresh token: 7 days, stored in HTTP-only cookie
  - Endpoint: `POST /users/refresh` to get new access token
- **Implementation**: Add `refreshToken` field to User model, rotate on each use

**3. JWT secret exposed in committed .env file**
- **Problem**: `JWT_SECRET=AntigravitySecretKey_83729` is in the repo
- **Fix**: Use environment variables injected by CI/CD, never commit secrets
- **Implementation**: Use AWS Secrets Manager, GitHub Secrets, or Vault

**4. No token revocation mechanism**
- **Problem**: If a token is stolen, it's valid until expiry (1 hour)
- **Fix**: Implement token blacklist or use short-lived tokens with refresh
- **Implementation**: Redis cache with blacklisted token JTIs, check on each request

**5. No rate limiting on auth endpoints**
- **Problem**: Attacker can brute-force login endpoint
- **Fix**: Add `express-rate-limit` middleware
- **Implementation**:
  ```javascript
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // 5 attempts
  });
  router.post('/login', loginLimiter, login);
  ```

**6. Password comparison timing attack**
- **Problem**: `bcryptjs.compare()` is safe, but the "User not found" vs "Invalid password" messages leak information
- **Fix**: Return generic "Invalid credentials" for both cases
- **Current code** (`user.controller.js`):
  ```javascript
  if (!user) return res.status(401).json({ message: "User not found" });
  if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid password" });
  ```
- **Fixed code**:
  ```javascript
  if (!user || !isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  ```

**7. No CSRF protection**
- **Problem**: If using cookies, vulnerable to CSRF attacks
- **Fix**: Implement CSRF tokens with `csurf` middleware
- **Implementation**: Generate CSRF token on login, validate on state-changing requests

**Priority order for fixes:**
1. Move to HTTP-only cookies (blocks XSS)
2. Add refresh token flow (better UX + security)
3. Implement rate limiting (prevents brute force)
4. Add token revocation (limits damage from theft)
5. Fix error messages (prevents user enumeration)

**Key talking points:**
- localStorage = XSS vulnerable
- No refresh tokens = poor UX or security trade-off
- JWT secret in repo = critical vulnerability
- Rate limiting missing on `/users/login`

**Follow-up the interviewer might ask:**  
"Walk me through implementing a complete refresh token flow with token rotation."

---

### Q15: How does the auth middleware verify tokens? What happens if verification fails?

**Difficulty:** Medium  
**Category:** Auth / Backend

**Answer:**  
The auth middleware in `Backend/middleware/auth.middleware.js` performs token verification:

**Step-by-step verification:**

```javascript
export const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // 2. Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      // 3. Verify token signature and expiry
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 4. Fetch user from database
      const user = await User.findById(decoded._id).select('-password');
      
      // 5. Check if user still exists
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // 6. Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      // Token verification failed (expired, invalid signature, etc.)
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
```

**What `jwt.verify()` checks:**
1. **Signature validity** — Ensures token was signed with `JWT_SECRET`
2. **Expiry** — Checks if current time < `exp` claim (1 hour from issue)
3. **Structure** — Validates JWT format (header.payload.signature)

**Failure scenarios:**

| Scenario | Error | Response |
|----------|-------|----------|
| No Authorization header | No token provided | 401 |
| Invalid format (not "Bearer <token>") | No token provided | 401 |
| Token expired | TokenExpiredError | 401 "Invalid token" |
| Invalid signature (wrong secret) | JsonWebTokenError | 401 "Invalid token" |
| Malformed token | JsonWebTokenError | 401 "Invalid token" |
| User deleted from DB | User not found | 401 |
| Server error | Any exception | 500 |

**Usage in routes** (`book.route.js`):
```javascript
router.use(authMiddleware);  // All routes below require auth
router.post("/", upload.single('image'), createBook);
router.put("/:id", upload.single('image'), updateBook);
router.delete("/:id", deleteBook);
```

The middleware runs before the controller, so `createBook` can safely access `req.user`.

**Security consideration:**
The middleware fetches the user from the database on every request (`User.findById(decoded._id)`). This ensures:
- Deleted users can't access the API (even with valid token)
- User data is always fresh (email changes reflect immediately)
- Trade-off: Extra DB query on every protected request

**Key talking points:**
- Verifies signature with `jwt.verify(token, process.env.JWT_SECRET)`
- Checks expiry automatically (1 hour)
- Fetches user from DB to ensure they still exist
- Returns 401 for any verification failure

**Follow-up the interviewer might ask:**  
"How would you optimize the database query on every request if you had millions of users?"

---

# SECTION 3: bcrypt Password Security

### Q16: How is bcrypt used in your application? What are the actual salt rounds, and where is hashing performed?

**Difficulty:** Medium  
**Category:** Security / Auth

**Answer:**  
Bcrypt is used for password hashing with **12 salt rounds**, implemented in the User model's pre-save hook in `Backend/model/user.model.js`:

```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```

**Why 12 rounds:**
- **Security vs performance balance** — Each round doubles the computation time
- **2^12 = 4,096 iterations** — Makes brute-force attacks computationally expensive
- **Current recommendation** — OWASP recommends 10-12 rounds as of 2024
- **Future-proof** — As hardware improves, I can increase to 13-14 without code changes

**Where hashing happens:**

**1. Registration** (`user.controller.js` - `signup`):
```javascript
const user = new User({ name: fullname, email, password: password });
await user.save();  // Pre-save hook hashes password automatically
```

The plain text password is passed to the User constructor, but the pre-save hook hashes it before MongoDB insertion.

**2. Password comparison** (`user.controller.js` - `login`):
```javascript
const user = await User.findOne({ email });
const isPasswordCorrect = await bcryptjs.compare(password, user.password);
```

`bcrypt.compare()` hashes the plain text password with the same salt and compares the result. This is timing-safe.

**Why pre-save hook:**
- **Automatic** — Developers can't forget to hash passwords
- **Centralized** — Hashing logic in one place (model layer)
- **Conditional** — Only hashes if password is modified (`this.isModified('password')`)
- **Prevents double-hashing** — If updating user email, password isn't re-hashed

**Model method for comparison** (defined but not used):
```javascript
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

I defined this method but used `bcryptjs.compare()` directly in the controller. Better practice would be to use the model method: `await user.comparePassword(password)`.

**Key talking points:**
- Salt rounds: 12 (in `bcrypt.hash(this.password, 12)`)
- Hashing: Pre-save hook in `user.model.js`
- Comparison: `bcryptjs.compare()` in `user.controller.js`
- Automatic hashing prevents plain text passwords in DB

**Follow-up the interviewer might ask:**  
"How would you migrate existing passwords if you decided to increase salt rounds to 14?"

---


### Q17: Walk me through the exact code flow when a user registers. How is the password hashed?

**Difficulty:** Medium  
**Category:** Auth / Security

**Answer:**  
Here's the complete registration flow with actual code:

**Step 1: Frontend form submission** (`Signup.jsx`):
```javascript
const onSubmit = async (data) => {
  const userInfo = {
    fullname: data.fullname,
    email: data.email,
    password: data.password  // Plain text password
  };
  await axios.post("http://localhost:4000/users/signup", userInfo);
};
```

The password is sent as plain text over HTTPS (in production).

**Step 2: Backend receives request** (`user.controller.js` - `signup`):
```javascript
export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    
    // Validation
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    
    // Create new user (password still plain text here)
    const user = new User({ name: fullname, email, password: password });
    
    // Save triggers pre-save hook
    await user.save();
```

**Step 3: Mongoose pre-save hook executes** (`user.model.js`):
```javascript
userSchema.pre('save', async function(next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) return next();
  
  // Hash with 12 salt rounds
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```

**What happens in `bcrypt.hash()`:**
1. Generates a random salt (12 rounds = 2^12 iterations)
2. Combines salt with plain text password
3. Runs through bcrypt algorithm 4,096 times
4. Returns hashed password: `$2b$12$<salt><hash>`

**Step 4: Hashed password saved to MongoDB**:
```javascript
await user.save();  // Password is now hashed
```

**Step 5: Generate JWT and respond**:
```javascript
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    const userObj = user.toObject();
    delete userObj.password;  // Remove password from response
    
    res.status(201).json({ user: userObj, message: "Signup successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Security considerations:**
- Password never stored in plain text
- Password removed from response (`delete userObj.password`)
- Pre-save hook ensures hashing even if developer forgets
- `this.isModified('password')` prevents re-hashing on user updates

**Example hashed password in MongoDB:**
```
$2b$12$K8QvZ9X.5YqN7xJ3mP2eXuFGHIJKLMNOPQRSTUVWXYZ1234567890
```
- `$2b$` — bcrypt algorithm version
- `12` — salt rounds
- Next 22 chars — salt
- Remaining chars — hash

**Key talking points:**
- Plain text password sent to backend (over HTTPS)
- Pre-save hook in `user.model.js` hashes automatically
- `bcrypt.hash(this.password, 12)` — 12 salt rounds
- Hashed password saved to MongoDB, never plain text

**Follow-up the interviewer might ask:**  
"What would happen if you called `user.save()` twice in a row? Would the password be double-hashed?"

---

### Q18: How is password comparison done during login? Why is bcrypt.compare() safe against timing attacks?

**Difficulty:** Hard  
**Category:** Security / Auth

**Answer:**  
Password comparison happens in `user.controller.js` - `login` function:

```javascript
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    // 2. Compare passwords
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }
    
    // 3. Generate JWT if password correct
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", _id: user._id, fullname: user.name, email: user.email, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**How `bcrypt.compare()` works:**
1. Extracts the salt from the stored hash (`user.password`)
2. Hashes the plain text password with the same salt
3. Compares the two hashes in constant time
4. Returns boolean (true/false)

**Why it's timing-attack safe:**

**Timing attack vulnerability:**
If comparison uses `===` or early-exit loops, an attacker can measure response time to guess characters:
```javascript
// VULNERABLE CODE (example)
for (let i = 0; i < hash1.length; i++) {
  if (hash1[i] !== hash2[i]) return false;  // Early exit leaks info
}
```

If the first character is wrong, the function returns immediately (fast). If the first 10 characters are correct, it takes longer to fail. An attacker can use this timing difference to brute-force the hash character by character.

**Bcrypt's constant-time comparison:**
```javascript
// Simplified concept (actual implementation is in C)
let result = 0;
for (let i = 0; i < hash1.length; i++) {
  result |= hash1[i] ^ hash2[i];  // XOR, no early exit
}
return result === 0;
```

Every character is compared regardless of matches, so timing is constant.

**Additional security:**
- **Slow by design** — 12 rounds means each comparison takes ~100-200ms, making brute-force impractical
- **Salt prevents rainbow tables** — Each password has a unique salt, so pre-computed hash tables are useless
- **Adaptive** — Can increase rounds as hardware improves without changing code

**Current vulnerability in my code:**
```javascript
if (!user) {
  return res.status(401).json({ message: "User not found" });
}
if (!isPasswordCorrect) {
  return res.status(401).json({ message: "Invalid password" });
}
```

Different error messages leak information (user enumeration). An attacker can determine if an email exists in the database. Better approach:

```javascript
if (!user || !isPasswordCorrect) {
  return res.status(401).json({ message: "Invalid credentials" });
}
```

But this introduces a timing attack — if user doesn't exist, we skip the slow `bcrypt.compare()`. Solution:

```javascript
const user = await User.findOne({ email });
const isPasswordCorrect = user ? await bcryptjs.compare(password, user.password) : false;

if (!user || !isPasswordCorrect) {
  return res.status(401).json({ message: "Invalid credentials" });
}
```

This always runs `bcrypt.compare()` (or a dummy comparison) to maintain constant timing.

**Key talking points:**
- `bcryptjs.compare(password, user.password)` in `user.controller.js`
- Constant-time comparison prevents timing attacks
- Slow by design (12 rounds) prevents brute-force
- Current vulnerability: Different error messages for "user not found" vs "wrong password"

**Follow-up the interviewer might ask:**  
"How would you implement account lockout after 5 failed login attempts?"

---

### Q19: Why did you choose bcrypt over other hashing algorithms like SHA-256, MD5, or Argon2?

**Difficulty:** Medium  
**Category:** Security

**Answer:**  
I chose bcrypt specifically for password hashing, and here's why it's superior to alternatives:

**Why NOT SHA-256 or MD5:**

**MD5:**
- **Cryptographically broken** — Collision attacks are trivial
- **Too fast** — Can compute billions of hashes per second on GPU
- **No salt** — Vulnerable to rainbow table attacks
- **Never use for passwords** — Only for checksums/fingerprints

**SHA-256:**
- **Too fast** — Designed for speed, not password security
- **No built-in salt** — Must implement manually
- **GPU-friendly** — Attackers can use GPUs to brute-force
- **Not adaptive** — Can't increase difficulty as hardware improves

**Why bcrypt:**

**1. Slow by design:**
- 12 rounds = ~100-200ms per hash
- Makes brute-force attacks impractical
- Attacker can only try ~5-10 passwords per second

**2. Adaptive cost:**
- Can increase rounds as hardware improves
- Current: 12 rounds, future: 13-14 rounds
- No code changes needed, just update the number

**3. Built-in salt:**
- Automatic random salt generation
- Salt stored with hash: `$2b$12$<salt><hash>`
- Prevents rainbow table attacks

**4. Battle-tested:**
- Used since 1999
- Well-audited and trusted
- Supported by all major languages

**5. Resistant to GPU attacks:**
- Memory-hard algorithm
- Difficult to parallelize on GPUs
- Attackers can't use GPU farms effectively

**Why NOT Argon2:**

Argon2 is actually **better** than bcrypt (won the Password Hashing Competition in 2015), but I chose bcrypt because:
- **Ecosystem maturity** — bcrypt has better Node.js support (`bcryptjs` is pure JS, no native dependencies)
- **Deployment simplicity** — No compilation issues on different platforms
- **Good enough** — For this application's threat model, bcrypt's security is sufficient

**When I'd choose Argon2:**
- High-security applications (banking, healthcare)
- Need for memory-hardness (defense against ASICs)
- Modern infrastructure with native module support

**Comparison table:**

| Algorithm | Speed | Salt | Adaptive | GPU Resistant | Use Case |
|-----------|-------|------|----------|---------------|----------|
| MD5 | Very Fast | No | No | No | Never for passwords |
| SHA-256 | Fast | Manual | No | No | Checksums, not passwords |
| bcrypt | Slow | Built-in | Yes | Yes | Password hashing (good) |
| Argon2 | Slow | Built-in | Yes | Yes | Password hashing (best) |

**My implementation:**
```javascript
// user.model.js
this.password = await bcrypt.hash(this.password, 12);
```

12 rounds is the sweet spot for 2024. In 2-3 years, I'd increase to 13.

**Key talking points:**
- bcrypt: Slow by design, adaptive, built-in salt
- SHA-256/MD5: Too fast, not designed for passwords
- Argon2: Better but less ecosystem support
- 12 rounds = ~100-200ms per hash

**Follow-up the interviewer might ask:**  
"How would you benchmark different salt rounds to find the optimal value for your server?"

---

### Q20: What would you change about your password security implementation? Would you use Argon2, and what's the trade-off?

**Difficulty:** Hard  
**Category:** Security

**Answer:**  
Here are the improvements I'd make, prioritized by impact:

**1. Migrate to Argon2id (highest priority):**

**Why Argon2id:**
- **Memory-hard** — Requires significant RAM, making GPU/ASIC attacks impractical
- **Hybrid mode** — Argon2id combines Argon2i (side-channel resistant) and Argon2d (GPU resistant)
- **Configurable** — Can tune memory, iterations, and parallelism
- **Modern standard** — Recommended by OWASP as of 2023

**Implementation:**
```javascript
// Install: npm install argon2
import argon2 from 'argon2';

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await argon2.hash(this.password, {
    type: argon2.argon2id,
    memoryCost: 65536,  // 64 MB
    timeCost: 3,        // 3 iterations
    parallelism: 4      // 4 threads
  });
  next();
});

// Comparison
const isValid = await argon2.verify(user.password, candidatePassword);
```

**Trade-offs:**
- **Native dependency** — Requires C++ compilation, deployment complexity
- **Memory usage** — 64 MB per hash (vs bcrypt's ~4 KB)
- **Server load** — More resource-intensive under high load
- **Migration effort** — Need to rehash passwords on next login

**2. Implement password strength requirements:**

Currently, I accept any password. I'd add:
```javascript
// user.controller.js
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
if (!passwordRegex.test(password)) {
  return res.status(400).json({ 
    message: "Password must be 12+ chars with uppercase, lowercase, number, and special char" 
  });
}
```

**3. Add password breach checking:**

Integrate with Have I Been Pwned API:
```javascript
import crypto from 'crypto';
import axios from 'axios';

async function isPasswordPwned(password) {
  const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = hash.substring(0, 5);
  const suffix = hash.substring(5);
  
  const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
  return response.data.includes(suffix);
}

// In signup controller
if (await isPasswordPwned(password)) {
  return res.status(400).json({ 
    message: "This password has been exposed in a data breach. Please choose another." 
  });
}
```

**4. Implement password history:**

Prevent reusing last 5 passwords:
```javascript
// user.model.js
const userSchema = new mongoose.Schema({
  // ... existing fields
  passwordHistory: [{
    hash: String,
    changedAt: Date
  }]
});

// On password change
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  // Check against history
  for (const oldPassword of this.passwordHistory) {
    if (await bcrypt.compare(this.password, oldPassword.hash)) {
      throw new Error('Cannot reuse recent passwords');
    }
  }
  
  // Add current password to history
  this.passwordHistory.push({
    hash: await bcrypt.hash(this.password, 12),
    changedAt: new Date()
  });
  
  // Keep only last 5
  if (this.passwordHistory.length > 5) {
    this.passwordHistory.shift();
  }
  
  next();
});
```

**5. Add pepper (application-level secret):**

```javascript
const pepper = process.env.PASSWORD_PEPPER;  // Stored separately from DB
const pepperedPassword = password + pepper;
this.password = await bcrypt.hash(pepperedPassword, 12);
```

This adds defense-in-depth — even if the database is compromised, attacker needs the pepper.

**Migration strategy for Argon2:**

```javascript
// Hybrid approach during migration
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Check if password is bcrypt (starts with $2b$)
  if (this.password.startsWith('$2b$')) {
    const isValid = await bcrypt.compare(candidatePassword, this.password);
    if (isValid) {
      // Rehash with Argon2 on successful login
      this.password = candidatePassword;  // Will trigger pre-save hook with Argon2
      await this.save();
    }
    return isValid;
  }
  
  // Otherwise use Argon2
  return await argon2.verify(this.password, candidatePassword);
};
```

**Key talking points:**
- Argon2id: Memory-hard, modern standard, better than bcrypt
- Trade-off: Native dependency, higher memory usage
- Additional improvements: Strength requirements, breach checking, password history
- Migration: Rehash on login, hybrid verification

**Follow-up the interviewer might ask:**  
"How would you handle the increased memory usage of Argon2 under high concurrent load?"

---

# SECTION 4: MongoDB & Mongoose Schema Design

### Q21: Walk me through each Mongoose model. What are the actual field names, types, validators, and defaults?

**Difficulty:** Medium  
**Category:** Database

**Answer:**  
Here are all three models with complete field specifications:

**User Model** (`user.model.js`):
```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,      // Creates unique index
    lowercase: true    // Converts to lowercase before saving
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});
```

**Validators:**
- `required: true` on name, email, password
- `unique: true` on email (enforced by MongoDB index)
- `lowercase: true` on email (normalization)

**Hooks:**
- Pre-save: Hashes password with bcrypt (12 rounds)

**Methods:**
- `comparePassword(candidatePassword)` — Compares plain text with hash

---

**Book Model** (`book.model.js`):
```javascript
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0           // Validation: price cannot be negative
  },
  category: {
    type: String,
    default: 'Uncategorized'
  },
  image: {
    type: String,
    default: ""      // Can be URL or /uploads/filename
  },
  buyingLink: {
    type: String,
    default: ""
  }
}, {
  timestamps: true   // Adds createdAt and updatedAt
});
```

**Validators:**
- `required: true` on title, author, price
- `min: 0` on price (prevents negative prices)

**Defaults:**
- category: 'Uncategorized'
- image: "" (empty string)
- buyingLink: "" (empty string)

**Note:** There's a commented-out `name` field in the schema, suggesting it was refactored to `title`.

---

**ContactForm Model** (`contactForm.model.js`):
```javascript
const contactFormSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

**Validators:**
- `required: true` on all fields
- `lowercase: true` on emailAddress

**No timestamps option** — Uses manual `createdAt` field instead.

---

**Summary table:**

| Model | Required Fields | Optional Fields | Validators | Indexes |
|-------|----------------|-----------------|------------|---------|
| User | name, email, password | createdAt | unique email, lowercase email | email (unique) |
| Book | title, author, price | category, image, buyingLink | min: 0 on price | none |
| ContactForm | fullName, emailAddress, subject, message | createdAt | lowercase email | none |

**Key talking points:**
- User: unique email index, password hashing hook
- Book: min: 0 validator on price, timestamps enabled
- ContactForm: All fields required, manual createdAt
- Consistent use of lowercase: true for emails

**Follow-up the interviewer might ask:**  
"Why doesn't the Book model have a reference to the User who created it?"

---


### Q22: How are relationships between models handled? Are there any references or population being used?

**Difficulty:** Medium  
**Category:** Database

**Answer:**  
Currently, there are **no relationships** between models in my implementation. Each model is completely independent:

- **User** ↔ **Book**: No relationship (books don't track who created them)
- **User** ↔ **ContactForm**: No relationship (contact forms don't reference users)
- **Book** ↔ **ContactForm**: No relationship

**Evidence from the code:**

In `book.controller.js` - `createBook`, there's a commented-out reference:
```javascript
const newBook = new Book({
  title,
  author,
  price,
  category: category || "Uncategorized",
  image: imageUrl,
  buyingLink: buyingLink || "",
  user: req.user?._id || null,  // This field doesn't exist in the schema!
});
```

The controller tries to set `user: req.user?._id`, but the Book schema in `book.model.js` doesn't have a `user` field. This means the field is silently ignored by Mongoose.

**How I would implement relationships:**

**1. Add user reference to Book model:**
```javascript
const bookSchema = new mongoose.Schema({
  // ... existing fields
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Optional: some books might be system-created
  }
}, {
  timestamps: true
});
```

**2. Populate user data when fetching books:**
```javascript
// book.controller.js - getBook
export const getBook = async (req, res) => {
  try {
    const books = await Book.find({})
      .populate('user', 'name email')  // Populate user, select only name and email
      .exec();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};
```

**3. Query books by user:**
```javascript
// Get books created by specific user
const userBooks = await Book.find({ user: req.user._id });

// Get books with user details
const booksWithUsers = await Book.find({})
  .populate({
    path: 'user',
    select: 'name email',
    match: { email: { $exists: true } }  // Only populate if email exists
  });
```

**Why relationships might not be needed here:**

For this application, the lack of relationships makes sense:
- **Books are global** — All users see the same book catalog
- **No ownership model** — Books aren't "owned" by users who add them
- **Simplified queries** — No joins needed, faster reads
- **Easier scaling** — No cross-collection queries

**When I'd add relationships:**
- **User reviews** — `Review` model with references to both `User` and `Book`
- **User library** — `UserBook` model tracking which books a user owns
- **Orders** — `Order` model referencing `User` and multiple `Books`

**Example with reviews:**
```javascript
const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String
}, { timestamps: true });

// Compound index to prevent duplicate reviews
reviewSchema.index({ book: 1, user: 1 }, { unique: true });
```

**Key talking points:**
- Currently no relationships between models
- Book controller tries to set `user` field, but schema doesn't have it
- Would add `user: ObjectId` reference to Book schema for ownership
- Use `.populate()` to fetch related data
- Current design: Simplified, no joins needed

**Follow-up the interviewer might ask:**  
"How would you implement a many-to-many relationship for users favoriting books?"

---

### Q23: What validation is done at the schema level versus the controller level? Where should validation logic live?

**Difficulty:** Medium  
**Category:** Database / Architecture

**Answer:**  
Currently, validation is split between schema and controller, but inconsistently:

**Schema-level validation** (Mongoose):

**User model:**
- `required: true` on name, email, password
- `unique: true` on email (enforced by MongoDB index)
- `lowercase: true` on email (automatic transformation)

**Book model:**
- `required: true` on title, author, price
- `min: 0` on price (prevents negative prices)

**ContactForm model:**
- `required: true` on all fields
- `lowercase: true` on emailAddress

**Controller-level validation:**

**user.controller.js - signup:**
```javascript
if (!fullname || !email || !password) {
  return res.status(400).json({ message: "All fields are required" });
}

const existingUser = await User.findOne({ email });
if (existingUser) {
  return res.status(409).json({ message: "User already exists" });
}
```

**book.controller.js - createBook:**
```javascript
if (!title || !author || !price) {
  return res.status(400).json({
    message: "Title, author, and price are required fields.",
  });
}
```

**contactForm.controller.js - submitContactForm:**
```javascript
if (!fullName || !emailAddress || !subject || !message) {
  return res.status(400).json({ message: "All fields are required" });
}
```

**Problems with current approach:**

1. **Duplication** — Required field checks in both schema and controller
2. **Inconsistent error messages** — Schema errors are generic, controller errors are custom
3. **No email format validation** — Email could be "notanemail" and pass validation
4. **No string length limits** — User could submit 10MB message in contact form
5. **Race condition** — Checking `existingUser` then creating user isn't atomic

**Where validation should live:**

**Schema-level (Mongoose):**
- Data type enforcement
- Required fields
- Format validation (regex)
- Range validation (min/max)
- String length limits
- Custom validators for business rules

**Controller-level:**
- Cross-field validation (e.g., password confirmation)
- Business logic validation (e.g., "can't delete book with active orders")
- External validation (e.g., checking if email is already taken)
- File upload validation (type, size)

**Improved implementation:**

**1. Enhanced schema validation:**
```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  }
});
```

**2. Use validation library (Joi or express-validator):**
```javascript
import { body, validationResult } from 'express-validator';

// Validation middleware
export const signupValidation = [
  body('fullname')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number')
];

// In route
router.post('/signup', signupValidation, signup);

// In controller
export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ... rest of logic
};
```

**3. Separate validation layer:**
```
Backend/
  validators/
    user.validator.js
    book.validator.js
  routes/
    user.routes.js  (applies validators)
  controllers/
    user.controller.js  (assumes data is valid)
```

**Key talking points:**
- Current: Validation split between schema and controller
- Schema: required, min/max, lowercase
- Controller: Manual checks with custom error messages
- Better: Use express-validator middleware
- Separation: Schema for data integrity, controller for business logic

**Follow-up the interviewer might ask:**  
"How would you handle validation errors from Mongoose and return user-friendly messages?"

---

### Q24: How is file upload (book cover image) handled? Walk me through the Multer configuration and storage strategy.

**Difficulty:** Hard  
**Category:** Backend / File Upload

**Answer:**  
File uploads are handled with Multer middleware configured in `Backend/middleware/upload.middleware.js`:

**Multer configuration:**

```javascript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB limit
  }
});
```

**Storage strategy:**
- **Disk storage** — Files saved to `Backend/uploads/` directory
- **Filename format** — `{timestamp}-{random9digits}.{extension}`
  - Example: `1678901234567-123456789.jpg`
- **File filter** — Only accepts files with MIME type starting with `image/`
- **Size limit** — 5MB maximum

**Usage in routes** (`book.route.js`):
```javascript
router.post("/", upload.single('image'), createBook);
router.put("/:id", upload.single('image'), updateBook);
```

`upload.single('image')` expects a form field named `image` with a single file.

**Controller handling** (`book.controller.js` - `createBook`):
```javascript
let imageUrl = "";
if (remoteImageUrl && typeof remoteImageUrl === 'string' && 
    (remoteImageUrl.startsWith("http://") || remoteImageUrl.startsWith("https://"))) {
  imageUrl = remoteImageUrl;  // Use remote URL
} else if (req.file) {
  imageUrl = `/uploads/${req.file.filename}`;  // Use uploaded file
}
```

The controller supports two image sources:
1. **Remote URL** — User provides a URL, stored as-is
2. **File upload** — Multer saves file, path stored as `/uploads/filename`

**Serving uploaded files** (`index.js`):
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

This makes uploaded files accessible at `http://localhost:4000/uploads/filename.jpg`.

**File cleanup on update/delete** (`book.controller.js`):

**Update:**
```javascript
if (book.image && book.image.startsWith("/uploads/")) {
  const oldImagePath = path.join(__dirname, "..", book.image);
  if (fs.existsSync(oldImagePath)) {
    fs.unlink(oldImagePath, (err) => {
      if (err) console.error("Failed to delete old image:", err);
    });
  }
}
```

**Delete:**
```javascript
if (book.image && book.image.startsWith("/uploads/")) {
  const imagePath = path.join(__dirname, "..", book.image);
  if (fs.existsSync(imagePath)) {
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Failed to delete associated image file:", err);
    });
  }
}
```

**Problems with current implementation:**

1. **Local disk storage** — Won't work with multiple server instances (load balancing)
2. **No image optimization** — Large images aren't resized or compressed
3. **No virus scanning** — Uploaded files aren't scanned for malware
4. **Filename collisions** — Timestamp + random might collide (unlikely but possible)
5. **No CDN** — Images served from Node.js instead of CDN
6. **Orphaned files** — If database save fails after file upload, file remains on disk

**Production improvements:**

**1. Use cloud storage (AWS S3):**
```javascript
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: 'us-east-1' });

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'bookstore-images',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, `books/${Date.now()}-${file.originalname}`);
    }
  }),
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
```

**2. Image optimization with Sharp:**
```javascript
import sharp from 'sharp';

// After Multer saves file
const optimizedPath = `uploads/optimized-${req.file.filename}`;
await sharp(req.file.path)
  .resize(800, 1200, { fit: 'inside' })
  .jpeg({ quality: 80 })
  .toFile(optimizedPath);

// Delete original, use optimized
fs.unlinkSync(req.file.path);
```

**3. Use UUID for filenames:**
```javascript
import { v4 as uuidv4 } from 'uuid';

filename: function (req, file, cb) {
  cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
}
```

**Key talking points:**
- Multer disk storage in `Backend/uploads/`
- Filename: `{timestamp}-{random}.{ext}`
- File filter: images only, 5MB limit
- Cleanup: Deletes old files on update/delete
- Production needs: S3, image optimization, CDN

**Follow-up the interviewer might ask:**  
"How would you handle uploading multiple images per book (e.g., cover + gallery)?"

---

### Q25: How are schema-level constraints enforced (required, unique, min/max)? What happens when they're violated?

**Difficulty:** Medium  
**Category:** Database

**Answer:**  
Mongoose enforces schema constraints at two levels: application-level (before save) and database-level (MongoDB indexes).

**Required fields:**
```javascript
// user.model.js
name: {
  type: String,
  required: true  // Mongoose checks before save
}
```

**What happens when violated:**
```javascript
const user = new User({ email: 'test@test.com', password: '123' });
await user.save();  // Throws ValidationError
```

Error object:
```javascript
{
  errors: {
    name: {
      message: 'Path `name` is required.',
      name: 'ValidatorError',
      kind: 'required',
      path: 'name'
    }
  }
}
```

**Unique constraint:**
```javascript
// user.model.js
email: {
  type: String,
  unique: true  // Creates MongoDB index
}
```

This creates a unique index in MongoDB: `db.users.createIndex({ email: 1 }, { unique: true })`

**What happens when violated:**
```javascript
// First user
await new User({ name: 'John', email: 'john@test.com', password: '123' }).save();

// Second user with same email
await new User({ name: 'Jane', email: 'john@test.com', password: '456' }).save();
// Throws MongoServerError: E11000 duplicate key error
```

Error:
```javascript
{
  code: 11000,
  keyPattern: { email: 1 },
  keyValue: { email: 'john@test.com' }
}
```

**Min/Max validation:**
```javascript
// book.model.js
price: {
  type: Number,
  required: true,
  min: 0
}
```

**What happens when violated:**
```javascript
const book = new Book({ title: 'Test', author: 'Test', price: -10 });
await book.save();  // Throws ValidationError
```

Error:
```javascript
{
  errors: {
    price: {
      message: 'Path `price` (-10) is less than minimum allowed value (0).',
      name: 'ValidatorError',
      kind: 'min',
      path: 'price',
      value: -10
    }
  }
}
```

**Handling in controllers:**

Currently, errors aren't handled gracefully. Example from `user.controller.js`:
```javascript
export const signup = async (req, res) => {
  try {
    const user = new User({ name: fullname, email, password });
    await user.save();
    // ...
  } catch (error) {
    res.status(500).json({ message: error.message });  // Generic error
  }
};
```

**Better error handling:**
```javascript
export const signup = async (req, res) => {
  try {
    const user = new User({ name: fullname, email, password });
    await user.save();
    // ...
  } catch (error) {
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    
    // MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ message: `${field} already exists` });
    }
    
    // Other errors
    res.status(500).json({ message: 'Internal server error' });
  }
};
```

**Key talking points:**
- Required: Mongoose checks before save, throws ValidationError
- Unique: MongoDB index, throws E11000 duplicate key error
- Min/Max: Mongoose validates, throws ValidationError with details
- Current handling: Generic error messages
- Better: Parse error type and return specific messages

**Follow-up the interviewer might ask:**  
"How would you handle the race condition between checking if a user exists and creating them?"

---

### Q26: How would you migrate this MongoDB schema to PostgreSQL? What would change?

**Difficulty:** Hard  
**Category:** Database

**Answer:**  
Migrating to PostgreSQL would require significant changes to schema design, queries, and relationships.

**Schema changes:**

**User table (PostgreSQL):**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

**Book table:**
```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category VARCHAR(100) DEFAULT 'Uncategorized',
  image TEXT DEFAULT '',
  buying_link TEXT DEFAULT '',
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_books_user_id ON books(user_id);
CREATE INDEX idx_books_category ON books(category);
```

**ContactForm table:**
```sql
CREATE TABLE contact_forms (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**ORM changes (Mongoose → Sequelize):**

**User model:**
```javascript
import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase());
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  },
  timestamps: true,
  underscored: true
});
```

**Query changes:**

**MongoDB:**
```javascript
const books = await Book.find({ category: 'Fiction' });
```

**PostgreSQL (Sequelize):**
```javascript
const books = await Book.findAll({ where: { category: 'Fiction' } });
```

**MongoDB:**
```javascript
const books = await Book.find({})
  .populate('user', 'name email')
  .exec();
```

**PostgreSQL (Sequelize):**
```javascript
const books = await Book.findAll({
  include: [{
    model: User,
    attributes: ['name', 'email']
  }]
});
```

**Advantages of PostgreSQL:**

1. **ACID transactions** — Atomic operations across tables
2. **Foreign key constraints** — Enforced referential integrity
3. **Complex queries** — Better support for joins, subqueries, CTEs
4. **Data integrity** — Stronger type system, constraints
5. **Mature ecosystem** — Better tooling, monitoring, backups

**Disadvantages:**

1. **Schema rigidity** — Migrations required for schema changes
2. **Vertical scaling** — Harder to scale horizontally than MongoDB
3. **JSON support** — Less flexible than MongoDB for nested documents
4. **Learning curve** — SQL vs NoSQL paradigm shift

**Migration strategy:**

1. **Export MongoDB data:**
```javascript
const users = await User.find({});
fs.writeFileSync('users.json', JSON.stringify(users));
```

2. **Transform data:**
```javascript
const transformedUsers = users.map(user => ({
  name: user.name,
  email: user.email,
  password: user.password,  // Already hashed
  created_at: user.createdAt,
  updated_at: user.updatedAt
}));
```

3. **Import to PostgreSQL:**
```javascript
await User.bulkCreate(transformedUsers);
```

4. **Update application code** — Replace Mongoose with Sequelize

**Key talking points:**
- PostgreSQL: Relational, ACID, foreign keys
- Sequelize ORM replaces Mongoose
- Schema: Fixed types, constraints, indexes
- Queries: findAll vs find, include vs populate
- Trade-off: Integrity vs flexibility

**Follow-up the interviewer might ask:**  
"How would you handle the migration with zero downtime?"

---

### Q27: What indexes are defined in your schemas? Should there be more for performance?

**Difficulty:** Medium  
**Category:** Database / Performance

**Answer:**  
Currently, there's only **one index** explicitly defined:

**User model:**
```javascript
email: {
  type: String,
  unique: true  // Creates unique index on email field
}
```

This creates: `db.users.createIndex({ email: 1 }, { unique: true })`

**Default indexes:**
- `_id` field — Automatically indexed by MongoDB (primary key)

**Total indexes:**
- `users` collection: `_id`, `email`
- `books` collection: `_id` only
- `contactforms` collection: `_id` only

**Missing indexes that should exist:**

**1. Book category (for filtering):**
```javascript
// book.model.js
bookSchema.index({ category: 1 });
```

**Why:** Users filter books by category frequently. Without an index, MongoDB scans all documents.

**Query:**
```javascript
const fictionBooks = await Book.find({ category: 'Fiction' });
```

**Without index:** O(n) — scans all books  
**With index:** O(log n) — uses B-tree lookup

**2. Book title (for search):**
```javascript
bookSchema.index({ title: 'text', author: 'text' });
```

**Why:** Enables full-text search on title and author.

**Query:**
```javascript
const results = await Book.find({ $text: { $search: 'Harry Potter' } });
```

**3. Compound index for user queries:**
```javascript
bookSchema.index({ user: 1, createdAt: -1 });
```

**Why:** If we add user references, this optimizes "get user's books sorted by date".

**Query:**
```javascript
const userBooks = await Book.find({ user: userId }).sort({ createdAt: -1 });
```

**4. ContactForm email (for lookup):**
```javascript
contactFormSchema.index({ emailAddress: 1 });
```

**Why:** If we need to find all submissions by email.

**Checking current indexes:**
```javascript
// In MongoDB shell
db.users.getIndexes()
// Output:
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { email: 1 }, name: 'email_1', unique: true }
]

db.books.getIndexes()
// Output:
[
  { v: 2, key: { _id: 1 }, name: '_id_' }
]
```

**Index trade-offs:**

**Pros:**
- Faster queries (O(log n) vs O(n))
- Reduced CPU usage
- Better scalability

**Cons:**
- Slower writes (index must be updated)
- More disk space (each index stores data)
- Memory usage (indexes loaded into RAM)

**When to add indexes:**

1. **Frequent queries** — Fields used in `find()`, `findOne()`
2. **Sort operations** — Fields used in `.sort()`
3. **Unique constraints** — Enforce data integrity
4. **Foreign keys** — Fields used in joins/population

**When NOT to add indexes:**

1. **Low cardinality** — Fields with few unique values (e.g., boolean)
2. **Rarely queried** — Fields not used in queries
3. **High write volume** — Indexes slow down inserts/updates
4. **Small collections** — < 1000 documents, full scan is fast enough

**Monitoring index usage:**
```javascript
// Check if index is used
db.books.find({ category: 'Fiction' }).explain('executionStats')

// Output shows:
// - totalDocsExamined: 1000 (without index)
// - totalDocsExamined: 10 (with index)
```

**Key talking points:**
- Current: Only `email` unique index on User
- Missing: category, title/author text search, compound indexes
- Trade-off: Query speed vs write speed and storage
- Should add indexes based on query patterns

**Follow-up the interviewer might ask:**  
"How would you identify which indexes to add in a production system with real query patterns?"

---

# SECTION 5: Express.js REST API Design

### Q28: List every API endpoint in your application. What does each one do, and which require authentication?

**Difficulty:** Easy  
**Category:** Backend / API

**Answer:**  
Here's the complete API endpoint reference:

**User/Auth Endpoints** (`/users` prefix):

| Method | Endpoint | Description | Auth Required | Controller |
|--------|----------|-------------|---------------|------------|
| POST | `/users/signup` | Register new user | No | `signup` |
| POST | `/users/login` | Login user | No | `login` |
| POST | `/users/check-email` | Check if email exists | No | `checkEmail` |

**Book Endpoints** (`/book` prefix):

| Method | Endpoint | Description | Auth Required | Controller |
|--------|----------|-------------|---------------|------------|
| GET | `/book/` | Get all books | No | `getBook` |
| POST | `/book/` | Create new book | Yes | `createBook` |
| PUT | `/book/:id` | Update book by ID | Yes | `updateBook` |
| DELETE | `/book/:id` | Delete book by ID | Yes | `deleteBook` |

**Contact Form Endpoints** (`/contact` prefix):

| Method | Endpoint | Description | Auth Required | Controller |
|--------|----------|-------------|---------------|------------|
| POST | `/contact/submit` | Submit contact form | No | `submitContactForm` |

**Route configuration:**

**book.route.js:**
```javascript
// Public routes
router.get("/", getBook);

// Protected routes (authMiddleware applied to all below)
router.use(authMiddleware);
router.post("/", upload.single('image'), createBook);
router.put("/:id", upload.single('image'), updateBook);
router.delete("/:id", deleteBook);
```

**user.routes.js:**
```javascript
// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/check-email', checkEmail);

// Protected routes (none currently, but middleware is set up)
router.use(authMiddleware);
```

**contactForm.route.js:**
```javascript
// Public route
router.post("/submit", submitContactForm);
```

**Full URL examples:**
- `http://localhost:4000/users/signup`
- `http://localhost:4000/users/login`
- `http://localhost:4000/book/` (GET all books)
- `http://localhost:4000/book/` (POST create book, requires auth)
- `http://localhost:4000/book/507f1f77bcf86cd799439011` (PUT/DELETE, requires auth)
- `http://localhost:4000/contact/submit`

**Request/Response examples:**

**POST /users/signup:**
```json
// Request
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Response (201)
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "Signup successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**POST /book/ (with auth):**
```json
// Request (multipart/form-data)
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "price": 12.99,
  "category": "Classic",
  "buyingLink": "https://amazon.com/...",
  "remoteImageUrl": "https://covers.com/gatsby.jpg"
}

// Headers
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "multipart/form-data"
}

// Response (201)
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "price": 12.99,
  "category": "Classic",
  "image": "https://covers.com/gatsby.jpg",
  "buyingLink": "https://amazon.com/...",
  "createdAt": "2024-03-18T10:30:00.000Z",
  "updatedAt": "2024-03-18T10:30:00.000Z"
}
```

**Key talking points:**
- 8 total endpoints across 3 resources
- 4 protected endpoints (POST/PUT/DELETE books)
- RESTful design: GET (read), POST (create), PUT (update), DELETE (delete)
- Auth via JWT in Authorization header

**Follow-up the interviewer might ask:**  
"Why is GET /book/ public but POST /book/ protected? Shouldn't all book operations require auth?"

---

