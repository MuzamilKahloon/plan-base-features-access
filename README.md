# Planbase Features Access

A full-stack web application for managing user subscriptions and feature access with secure authentication and payment processing.

## 🚀 Features

### 🔐 User Authentication
- Secure user registration and login
- JWT-based authentication
- Protected routes and API endpoints
- Password hashing with bcrypt

### 💳 Payment Processing
- Integration with Stripe for secure payments
- Subscription management
- Secure handling of payment information

### 📱 Responsive Frontend
- Built with React 19
- Modern UI with Tailwind CSS
- Client-side routing with React Router
- State management with React Hooks

### ⚙️ Backend API
- RESTful API built with Express.js
- MongoDB database with Mongoose ODM
- Environment-based configuration
- CORS and security middleware

## 🛠️ Tech Stack

### Frontend
- **React 19** - Frontend library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Stripe** - Payment processing
- **Bcrypt** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

## 📦 Prerequisites

- Node.js (v18 or later)
- npm (v9 or later) or yarn
- MongoDB (local or cloud instance)
- Stripe account (for payment processing)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/planbase-features-access.git
cd planbase-features-access
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   CLIENT_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Project Structure

```
planbase-features-access/
├── backend/               # Backend server
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── .env              # Environment variables
│   ├── package.json      # Backend dependencies
│   └── server.js         # Entry point
│
└── frontend/             # Frontend React app
    ├── public/          # Static files
    ├── src/             # Source files
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── App.jsx      # Main App component
    │   └── main.jsx     # Entry point
    ├── .env             # Frontend environment variables
    └── package.json     # Frontend dependencies
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Payments
- `POST /api/payment/create-checkout-session` - Create Stripe checkout session
- `POST /api/payment/webhook` - Stripe webhook handler
- `GET /api/payment/subscription` - Get user subscription status

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Stripe](https://stripe.com/)
- [Tailwind CSS](https://tailwindcss.com/)
