# BookNow Frontend

A modern React TypeScript application for the BookNow event booking platform.

## Features

- 🎭 **Multi-Role Authentication** - Separate login/register flows for Customers, Organizers, and Admins
- 🎨 **Modern UI** - Built with Tailwind CSS and custom animations
- 🌟 **3D Graphics** - Three.js integration for immersive experiences
- 🔄 **State Management** - Redux Toolkit for efficient state handling
- 🛡️ **Protected Routes** - Role-based access control
- 📱 **Responsive Design** - Mobile-first approach

## Tech Stack

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Three.js** for 3D graphics
- **Framer Motion** for animations
- **Axios** for API calls

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   ├── auth/           # Authentication components
│   ├── customer/       # Customer-specific components
│   ├── organizer/      # Organizer-specific components
│   └── admin/          # Admin-specific components
├── pages/              # Page components
├── store/              # Redux store and slices
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## Authentication Flow

- **Customer**: `/login/customer` → `/register/customer`
- **Organizer**: `/login/organizer` → `/register/organizer`
- **Admin**: `/login/admin` (login only)

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Backend Integration

The frontend connects to the BookNow backend API running on `http://localhost:5089/api`

Make sure the backend server is running before starting the frontend application.