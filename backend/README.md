# Jiva Health Backend API

This repository contains the production-ready REST API backend for the **Jiva Health** Healthcare Admin Dashboard. It is built using **Node.js**, **Express.js**, and **MongoDB/Mongoose**, and uses **JSON Web Token (JWT)** authentication with role-based access control.

---

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Folder Structure](#folder-structure)
3. [Prerequisites](#prerequisites)
4. [Installation & Setup](#installation--setup)
5. [Database Seeding](#database-seeding)
6. [Running the Application](#running-the-application)
7. [API Endpoint Reference](#api-endpoint-reference)
   - [Authentication (`/api/auth`)](#1-authentication)
   - [Users (`/api/users`)](#2-users)
   - [Orders (`/api/orders`)](#3-orders)
   - [Payments (`/api/payments`)](#4-payments)
8. [Testing the API](#testing-the-api)

---

## Tech Stack
- **Runtime Environment:** Node.js (v16+)
- **Web Framework:** Express.js
- **Database Wrapper:** MongoDB with Mongoose ODM
- **Security & Session Management:** JWT, bcryptjs
- **Configurations:** dotenv, cors
- **Development Tooling:** nodemon

---

## Folder Structure
```text
backend/
  ├── config/          # Configurations (database connection helper)
  ├── controllers/     # Controller modules containing request handlers
  ├── data/            # Mock database seeds and test runners
  ├── middleware/      # Global guards, error, and fallback middlewares
  ├── models/          # Mongoose database models and subdocuments
  ├── routes/          # REST route handlers separating resource endpoints
  ├── utils/           # Shared utility functions (async wrappers, token signers)
  ├── .env             # Active local environment configurations (ignored)
  ├── .env.example     # Template configurations structure
  ├── package.json     # Project dependency configurations
  └── server.js        # Main application execution entry point
```

---

## Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.x or above recommended)
- **NPM** (v9.x or above)
- **MongoDB Server** (Running locally on default port `27017` or a MongoDB Atlas URI)

---

## Installation & Setup

1. **Clone/Navigate** to your backend folder:
   ```bash
   cd backend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of the `backend/` folder (or copy from the template):
   ```bash
   cp .env.example .env
   ```
   Modify the `.env` settings according to your configuration:
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/jiva_health
   JWT_SECRET=supersecretjwtkeyforjivahealthdashboard2026
   NODE_ENV=development
   ```

---

## Database Seeding
To populate MongoDB with realistic mock data (Admin, Nurse, Patients, Addresses, Family Members, Orders, and Payment transactions), run:
```bash
npm run seed
```
This utility script will:
- Establish a database connection.
- Purge all previous records in the users, orders, and payments collections.
- Seed three distinct roles: Admin (`admin@jivahealth.com`), Nurse (`nurse@jivahealth.com`), and Patient (`john.doe@example.com` & others).
- Auto-encrypt user passwords using `bcryptjs`.
- Seed matching orders and payments.

---

## Running the Application

### Development Mode (with hot-reloading):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

---

## API Endpoint Reference

All endpoints return unified, standardized JSON responses.

### 1. Authentication
Endpoint prefix: `/api/auth`

| Method | Endpoint | Description | Access | Request Body Fields |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new patient account | Public | `fullName`, `email`, `phone`, `password`, `gender` (optional), `dob` (optional), `bloodGroup` (optional) |
| **POST** | `/api/auth/login` | Log in and receive JWT token | Public | `email`, `password` |
| **GET** | `/api/auth/me` | Retrieve profile of the logged-in user | Private | None (Requires Authorization Header) |

### 2. Users
Endpoint prefix: `/api/users`

| Method | Endpoint | Description | Access | Allowed Roles |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/users` | List all users (supports `?role=Patient`, `?status=Active`, `?search=john`) | Private | Admin, Nurse |
| **GET** | `/api/users/:id` | Fetch specific user details | Private | Admin, Nurse, or Self |
| **POST** | `/api/users` | Manually create a user | Private | Admin, Nurse |
| **PUT** | `/api/users/:id` | Update user metadata | Private | Admin, Nurse, or Self |
| **DELETE** | `/api/users/:id` | Delete user | Private | Admin |
| **PATCH** | `/api/users/:id/prime` | Toggle Prime member upgrade status | Private | Admin, Nurse, or Self |
| **PATCH** | `/api/users/:id/status` | Toggle user status (Active/Inactive) | Private | Admin, Nurse |

#### Nested Address Operations
| Method | Endpoint | Description | Request Body Fields |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/users/:id/addresses` | Add a new address subdocument | `type` (Home/Work), `addressLine`, `city`, `state`, `pincode`, `isDefault` |
| **PUT** | `/api/users/:id/addresses/:addressId` | Edit specific address fields | Same as above (Only provides updated fields) |
| **DELETE** | `/api/users/:id/addresses/:addressId` | Remove specific address subdocument | None |
| **PATCH** | `/api/users/:id/addresses/:addressId/default` | Elevate address to Default | None |

#### Nested Family Member Operations
| Method | Endpoint | Description | Request Body Fields |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/users/:id/family` | Add family member | `name`, `relationship`, `dob`, `phone` |
| **PUT** | `/api/users/:id/family/:memberId` | Edit family member details | Same as above |
| **DELETE** | `/api/users/:id/family/:memberId` | Remove family member | None |

### 3. Orders
Endpoint prefix: `/api/orders`

| Method | Endpoint | Description | Access | Allowed Roles / Rule |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/orders` | Get all orders | Private | Patients see own orders; Admin/Nurse see all. |
| **GET** | `/api/orders/:id` | Get order details | Private | Patient owner, Admin, or Nurse |
| **POST** | `/api/orders` | Create a new order | Private | Any authenticated user |
| **PATCH** | `/api/orders/:id/status` | Update order and payment status | Private | Admin, Nurse |

### 4. Payments
Endpoint prefix: `/api/payments`

| Method | Endpoint | Description | Access | Request Body Fields |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/payments` | Get payment transaction history | Private | Patients see own payments; Admin/Nurse see all |
| **POST** | `/api/payments` | Record a payment transaction | Private | `paymentId`, `amount`, `method`, `status` |
| **PATCH** | `/api/payments/:id/status` | Update transaction status | Private (Admin/Nurse) | `status` (Pending/Completed/Failed) |

---

## Testing the API

### 1. Programmatic Automated Tests
We have built an integration test harness that automatically starts a test server, runs query flows, checks validations, and verifies that the endpoints adhere to the route guard security policies.

To run tests:
```bash
node data/test_endpoints.js
```

### 2. Manual Testing using `curl`
Here are examples to manually test endpoints with curl commands:

#### User Registration:
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Alice Smith",
    "email": "alice.smith@example.com",
    "phone": "+1-555-0720",
    "password": "password123",
    "gender": "Female"
  }'
```

#### User Login:
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "patientpassword123"
  }'
```
*Note: Make sure to extract the `token` from the JSON response to use in the authorization headers below.*

#### Get profile (Requires JWT token):
```bash
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Add a family member (Requires JWT token):
```bash
curl -X POST http://localhost:5001/api/users/YOUR_USER_ID_HERE/family \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tommy Doe",
    "relationship": "Child",
    "dob": "2018-09-12"
  }'
```
