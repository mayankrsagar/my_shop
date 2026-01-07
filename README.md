# My Shop Assignment

This is a full-stack e-commerce web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Next.js for the frontend.

## Features

- **User Authentication:** Secure user registration and login system with JWT authentication.
- **Product Management:** Admins and sellers can add, update, and delete products.
- **Shopping Cart:** Users can add products to their cart and manage cart items.
- **Favorites:** Users can add products to their favorites/wishlist.
- **Checkout and Payments:** Integration with Razorpay for seamless and secure payments.
- **Admin Dashboard:** A dashboard for administrators to manage users, products, and orders.
- **Seller Dashboard:** A dashboard for sellers to manage their products and view sales.
- **Product Ratings and Reviews:** Users can rate and review products.
- **Password Reset:** Users can securely reset their password via email.
- **Search and Filtering:** Users can search for products and filter them based on categories.

## Tech Stack

### Backend

- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **File Uploads:** Multer and Cloudinary
- **Payment Gateway:** Razorpay
- **Other:** bcryptjs for password hashing, CORS, Express Validator for input validation.

### Frontend

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **API Communication:** Axios
- **State Management:** React Context API
- **Notifications:** React Hot Toast
- **Icons:** React Icons, Lucide React

## Getting Started

### Prerequisites

- Node.js and npm (or yarn)
- MongoDB (local or a cloud instance like MongoDB Atlas)
- A Cloudinary account for image storage
- A Razorpay account for payment processing

### Backend Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/my-shop-assignment.git
    cd my-shop-assignment/backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory and add the following environment variables:

    ```
    PORT=5000
    MONGO_URI=<Your_MongoDB_Connection_String>
    JWT_SECRET=<Your_JWT_Secret>
    CLOUDINARY_CLOUD_NAME=<Your_Cloudinary_Cloud_Name>
    CLOUDINARY_API_KEY=<Your_Cloudinary_API_Key>
    CLOUDINARY_API_SECRET=<Your_Cloudinary_API_Secret>
    RAZORPAY_KEY_ID=<Your_Razorpay_Key_ID>
    RAZORPAY_KEY_SECRET=<Your_Razorpay_Key_Secret>
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The backend server will be running on `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**

    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env.local` file** in the `frontend` directory and add the following environment variable:

    ```
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend application will be running on `http://localhost:3000`.

## Folder Structure

```
my-shop-assignment/
├── backend/
│   ├── config/         # Database and Cloudinary configuration
│   ├── controllers/    # Express route handlers
│   ├── middleware/     # Custom middleware (auth, validation)
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   └── server.js       # Main server entry point
├── frontend/
│   ├── public/         # Static assets
│   └── src/
│       ├── app/        # Next.js app router pages
│       ├── components/ # Reusable React components
│       ├── context/    # React context for state management
│       └── lib/        # Library and utility functions
└── README.md
```
