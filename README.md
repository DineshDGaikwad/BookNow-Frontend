# BookNow Frontend

A modern React-based frontend application for the BookNow event booking platform. Built with TypeScript, Redux Toolkit, and Tailwind CSS.

## 🚀 Current Implementation Status

### ✅ Completed Features

#### Authentication System
- **Multi-role Authentication**: Customer, Organizer, and Admin login/register flows
- **JWT Token Management**: Automatic token handling with refresh mechanism
- **Protected Routes**: Role-based access control for different user types
- **Persistent Sessions**: Auto-login on page refresh using localStorage
- **Form Validation**: Client-side validation for all auth forms

#### State Management
- **Redux Toolkit**: Centralized state management with async thunks
- **Auth Slice**: Complete authentication state management
- **Type Safety**: Full TypeScript integration with proper typing

#### UI/UX Components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Glass morphism effects, gradients, and animations
- **Component Library**: Reusable components for consistent design
- **Loading States**: Proper loading indicators and error handling
- **Toast Notifications**: User feedback for actions and errors

#### Backend Integration
- **API Service Layer**: Axios-based HTTP client with interceptors
- **CORS Support**: Cross-origin requests properly configured
- **Error Handling**: Centralized error management and user feedback
- **Connection Monitoring**: Real-time backend connectivity status

### 🏗️ Architecture Overview

```
src/
├── components/           # Reusable UI components
│   ├── admin/           # Admin-specific components
│   ├── auth/            # Authentication forms
│   ├── common/          # Shared components (Header, ProtectedRoute)
│   ├── customer/        # Customer-specific components
│   └── organizer/       # Organizer-specific components
├── hooks/               # Custom React hooks
├── pages/               # Page-level components
│   ├── admin/           # Admin dashboard pages
│   ├── auth/            # Authentication pages
│   ├── customer/        # Customer pages
│   └── organizer/       # Organizer pages
├── services/            # API and external service integrations
├── store/               # Redux store configuration
├── styles/              # Global styles and Tailwind config
├── types/               # TypeScript type definitions
└── utils/               # Utility functions and helpers
```

### 🔐 Authentication Flow

#### User Types & Routes
1. **Customer** (`/`)
   - Browse and book events
   - Manage bookings and reviews
   - Profile management

2. **Organizer** (`/organizer`)
   - Create and manage events
   - Venue management
   - Analytics dashboard

3. **Admin** (`/admin`)
   - Approve organizer registrations
   - System management
   - User moderation

#### Auth Pages Implemented
- `/login` - Role selection page
- `/login/customer` - Customer login form
- `/login/organizer` - Organizer login form  
- `/login/admin` - Admin login form
- `/register` - Registration type selection
- `/register/customer` - Customer registration
- `/register/organizer` - Organizer registration (with business details)

### 🎨 Design System

#### Color Palette
- **Primary**: Blue gradient (`from-blue-500 to-purple-600`)
- **Success**: Green (`from-green-500 to-emerald-600`)
- **Warning**: Yellow/Orange tones
- **Error**: Red (`from-red-500 to-pink-600`)
- **Neutral**: Gray scale for text and backgrounds

#### Components Style
- **Glass Morphism**: Translucent cards with backdrop blur
- **Gradient Buttons**: Smooth color transitions with hover effects
- **Rounded Corners**: Consistent border radius (xl = 12px)
- **Shadows**: Layered shadow system for depth
- **Animations**: Smooth transitions and micro-interactions

### 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - `sm`: 640px (tablets)
  - `md`: 768px (small laptops)
  - `lg`: 1024px (desktops)
  - `xl`: 1280px (large screens)

### 🔧 Technical Stack

#### Core Technologies
- **React 18.2.0**: Latest React with concurrent features
- **TypeScript 4.9.5**: Type safety and better developer experience
- **Redux Toolkit 1.9.7**: Modern Redux with less boilerplate
- **React Router 6.8.1**: Client-side routing with nested routes

#### Styling & UI
- **Tailwind CSS 3.3.6**: Utility-first CSS framework
- **PostCSS 8.4.32**: CSS processing and optimization
- **React Toastify 9.1.3**: Toast notifications

#### HTTP & API
- **Axios 1.6.2**: HTTP client with interceptors
- **Base URL**: `http://localhost:5089/api`
- **Auto-retry**: Failed requests with token refresh

### 🌐 Backend Integration

#### API Endpoints Used
```typescript
// Authentication
POST /api/auth/customer/login
POST /api/auth/customer/register
POST /api/auth/organizer/login
POST /api/auth/organizer/register
POST /api/auth/admin/login
POST /api/auth/refresh
POST /api/auth/logout

// Health Check
GET /health
```

#### Request/Response Flow
1. **Request Interceptor**: Adds JWT token to Authorization header
2. **Response Interceptor**: Handles 401 errors and token refresh
3. **Error Handling**: Centralized error processing with user feedback
4. **Loading States**: UI feedback during API calls

### 🔒 Security Features

#### Token Management
- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal
- **Automatic Refresh**: Seamless token renewal on expiry
- **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)

#### Route Protection
- **Authentication Check**: Redirects to login if not authenticated
- **Role-based Access**: Prevents unauthorized access to role-specific pages
- **Unauthorized Page**: Proper error handling for access violations

### 📊 State Management

#### Auth State Structure
```typescript
interface AuthState {
  user: User | null;           // Current user information
  token: string | null;        // JWT access token
  isLoading: boolean;          // Loading state for auth operations
  error: string | null;        // Error messages
  isAuthenticated: boolean;    // Authentication status
}
```

#### Redux Actions
- `customerLogin` - Customer authentication
- `organizerLogin` - Organizer authentication  
- `adminLogin` - Admin authentication
- `customerRegister` - Customer registration
- `organizerRegister` - Organizer registration
- `logout` - Clear auth state and tokens
- `setUser` - Set user from localStorage
- `clearError` - Clear error messages

### 🎯 User Experience Features

#### Loading States
- **Skeleton Loading**: Placeholder content while data loads
- **Button Loading**: Disabled state with loading text
- **Page Transitions**: Smooth navigation between routes

#### Error Handling
- **Form Validation**: Real-time validation with error messages
- **API Errors**: User-friendly error messages from backend
- **Network Errors**: Offline/connection error handling
- **Fallback UI**: Graceful degradation for failed states

#### Accessibility
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: ARIA labels and descriptions
- **Color Contrast**: WCAG compliant color combinations

### 🚧 Pending Implementation

#### Customer Features
- [ ] Event browsing and filtering
- [ ] Event details and seat selection
- [ ] Booking flow and payment integration
- [ ] Booking history and management
- [ ] Review and rating system
- [ ] User profile management

#### Organizer Features
- [ ] Event creation and management
- [ ] Venue management
- [ ] Show scheduling
- [ ] Analytics dashboard
- [ ] Revenue tracking
- [ ] Customer management

#### Admin Features
- [ ] Organizer approval workflow
- [ ] User management
- [ ] System settings
- [ ] Audit logs
- [ ] Fraud detection
- [ ] Revenue analytics

#### Technical Enhancements
- [ ] Real-time notifications (WebSocket)
- [ ] Progressive Web App (PWA) features
- [ ] Image upload and optimization
- [ ] Advanced search and filtering
- [ ] Caching strategies
- [ ] Performance optimization

### 🛠️ Development Setup

#### Prerequisites
- Node.js 16+ and npm
- Backend API running on `http://localhost:5089`

#### Installation
```bash
cd booknow-frontend
npm install
npm start
```

#### Available Scripts
- `npm start` - Development server (port 3000)
- `npm build` - Production build
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

#### Environment Configuration
- **Development**: Uses `http://localhost:5089` for API
- **Production**: Configure API_BASE_URL for production backend

### 📈 Performance Considerations

#### Optimization Strategies
- **Code Splitting**: Route-based lazy loading
- **Bundle Analysis**: Webpack bundle analyzer for optimization
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Service worker for offline functionality
- **Minification**: CSS and JS minification in production

#### Monitoring
- **Error Tracking**: Integration ready for Sentry/LogRocket
- **Analytics**: Google Analytics integration points
- **Performance**: Web Vitals monitoring setup

### 🔄 Backend Connection Status

The frontend includes a real-time backend connectivity indicator:
- **Green**: Backend connected and responding
- **Red**: Backend disconnected or not responding  
- **Yellow**: Checking connection status

Connection is tested via the `/health` endpoint and auth API availability.

### 🎨 Custom Styling

#### Tailwind Extensions
```javascript
// Custom animations and utilities
extend: {
  animation: {
    'fade-in': 'fadeIn 0.5s ease-in-out',
    'slide-up': 'slideUp 0.3s ease-out',
  }
}
```

#### Glass Effect CSS
```css
.glass-effect {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

### 📝 Code Quality

#### TypeScript Integration
- **Strict Mode**: Enabled for better type safety
- **Interface Definitions**: Comprehensive type definitions
- **Generic Types**: Reusable type patterns
- **Enum Usage**: Consistent constant definitions

#### Best Practices
- **Component Composition**: Reusable and composable components
- **Custom Hooks**: Logic separation and reusability
- **Error Boundaries**: Graceful error handling
- **Performance**: React.memo and useMemo where appropriate

---

## 🚀 Next Steps

1. **Complete Customer Flow**: Event browsing, booking, and payment
2. **Organizer Dashboard**: Event management and analytics
3. **Admin Panel**: User management and system controls
4. **Real-time Features**: WebSocket integration for live updates
5. **Mobile App**: React Native version for mobile platforms

The frontend is well-architected and ready for rapid feature development with a solid foundation of authentication, routing, and state management in place.