# Thrift Store Frontend

A React frontend for the Thrift Store application built with Vite, Tailwind CSS, and React Router.

## Features

- ⚡ Fast development with Vite
- 🎨 Beautiful UI with Tailwind CSS
- 🛣️ Client-side routing with React Router
- 🔐 Authentication forms (Login/Register)
- 📱 Responsive design
- 🎯 Modern React with hooks

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Navbar.jsx          # Navigation component
│   ├── pages/
│   │   ├── Home.jsx           # Home page
│   │   ├── Login.jsx          # Login page
│   │   └── Register.jsx       # Register page
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles with Tailwind
├── public/                    # Static assets
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── postcss.config.js          # PostCSS configuration
```

## Pages

- **Home** (`/`) - Landing page with hero section and features
- **Login** (`/login`) - User authentication form
- **Register** (`/register`) - User registration form

## API Integration

The frontend is configured to proxy API requests to the backend server running on port 5000. All API calls to `/api/*` will be automatically forwarded to `http://localhost:5000/api/*`.

### API Service

- **Axios** for HTTP requests with automatic token handling
- **Request interceptors** to add JWT tokens to all requests
- **Response interceptors** for automatic error handling and token cleanup
- **Base URL configuration** for consistent API calls

## Authentication

- JWT tokens are stored in localStorage
- Automatic redirect after successful login/register
- Form validation and error handling
- Loading states for better UX
- Dynamic navbar showing user info when logged in
- Logout functionality with token cleanup

## Styling

- Custom Tailwind CSS configuration with primary color palette
- Responsive design for mobile and desktop
- Custom component classes for consistent styling
- Smooth transitions and hover effects 