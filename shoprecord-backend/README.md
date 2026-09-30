# ShopRecord Backend API

RESTful API for ShopRecord - A simple inventory management system for shopkeepers.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Features

- User authentication (Register/Login)
- JWT-based authorization
- Product CRUD operations
- Input validation
- Error handling middleware
- CORS enabled

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory with:
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/shoprecord
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Run the development server:
```bash
npm run dev
```

The API will be running at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

## Project Structure

```
src/
├── config/         # Configuration files
├── models/         # Mongoose models
├── controllers/    # Route controllers
├── routes/         # API routes
├── middleware/     # Custom middleware
├── services/       # Business logic services
├── utils/          # Utility functions
├── app.js          # Express app setup
└── server.js       # Server entry point
```

## License

ISC
