# **Order Management System**

A React + TypeScript order management application built with Vite, featuring user authentication, order creation, and order tracking with pagination.

## **Features**

- **User Authentication**
    - User registration and login
- **Order Management**
    - Create new orders with multiple items
    - View all orders with pagination
    - Edit order details and status
    - Delete orders
- **User Profile**
    - View user information

## **Tech Stack**

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Form Handling**: React Hook Form + Yup validation
- **HTTP Client**: Axios
- **Icons**: Heroicons + Lucide React
- **Routing**: React Router v7

## **route**

- `/register` - User registration
- `/` - User login
- `/profile` - Get current user profile
- `/all_order` - Get all orders (with pagination)
- `/create_order` - Create new order

## **Features in Detail**

### Authentication

- Form validation using Yup schema
- Secure login with credentials
- Session persistence via cookies
- Protected routes via Login_auth guard

### Order Management

- Dynamic item management in orders
- Pagination with configurable page size
- Edit and delete functionality (owner only)
- Order detail preview modal

### UI/UX

- Responsive design with Tailwind CSS
- Modal dialogs for editing/viewing
- Status badge color coding
- pagination controls

## **Getting Started**

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```
cd order_system
npm install
```

### Environment Setup

Create a .env file in the project root:

```jsx
VITE_BACKEND_URL=http://localhost:3000
```

### Development

```jsx
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```jsx
npm run build
```

## **Contributing**

Feel free to submit issues and enhancement requests.

## **License**

This project for educational purposes.
