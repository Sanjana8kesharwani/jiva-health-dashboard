# Jiva Health Dashboard

A full stack healthcare admin dashboard built using React, Vite, Node.js, Express, MongoDB, and JWT Authentication.

This project provides an admin panel for managing healthcare operations like users, medicine orders, consultations, lab bookings, ambulance services, reports, and more.

---

# Live Demo

## Frontend
https://jiva-health-dashboard-theta.vercel.app

## Backend API
Add your Render backend URL here.

---

# Tech Stack

## Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React Icons

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs

---

# Features

## Authentication
- Secure admin login
- JWT based authentication
- Protected routes

## Dashboard
- Real-time dashboard statistics
- Active consultations count
- Pending orders tracking
- Recent activity section

## User Management
- Add new users
- View users
- Filter users
- User status management

## Medicine Orders
- Real-time medicine order data
- Order tracking
- Payment details
- Delivery progress

## Additional Modules
- Consultation management
- Lab test booking
- Ambulance booking
- Vendor management
- Reports section
- System settings

## UI Features
- Responsive design
- Clean admin dashboard UI
- Sidebar navigation
- Modern healthcare theme

---

# Project Structure

```bash
jiva-health-dashboard/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   ├── package.json
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Sanjana8kesharwani/jiva-health-dashboard.git
```

---

# Frontend Setup

## Move to frontend folder

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Run frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Backend Setup

## Move to backend folder

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

## Create .env file

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## Run backend

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5001
```

---

# Environment Variables

## Frontend `.env`

```env
VITE_API_BASE_URL=your_backend_url
```

## Backend `.env`

```env
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
NODE_ENV=production
```

---

# Deployment

## Frontend Deployment
- Platform: Vercel
- Framework: Vite

## Backend Deployment
- Platform: Render
- Runtime: Node.js

---

# Database

MongoDB Atlas is used for storing:
- Users
- Orders
- Payments
- Dashboard statistics

---

# API Integration

The frontend fetches live data from the backend API using Axios.

Example API modules:
- `/api/auth`
- `/api/users`
- `/api/orders`
- `/api/payments`

---

# Future Improvements

- Dark mode support
- Role-based authentication
- Analytics dashboard
- Notification system
- Appointment scheduling
- File uploads
- Email integration

---

# Author

## Sanjana Kesharwani

GitHub:
https://github.com/Sanjana8kesharwani
