import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginRequest, CustomerRegisterRequest, OrganizerRegisterRequest, User } from '../types/auth.types';
import { authService } from '../services/authService';

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const customerLogin = createAsyncThunk(
  'auth/customerLogin',
  async (credentials: LoginRequest) => {
    const response = await authService.customerLogin(credentials);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('userData', JSON.stringify({
      userId: response.userId,
      email: response.email,
      name: response.name,
      role: 'Customer',
      profileCompleted: response.profileCompleted
    }));
    return response;
  }
);

export const organizerLogin = createAsyncThunk(
  'auth/organizerLogin',
  async (credentials: LoginRequest) => {
    const response = await authService.organizerLogin(credentials);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('userData', JSON.stringify({
      userId: response.userId,
      email: response.email,
      name: response.name,
      role: 'Organizer',
      profileCompleted: response.profileCompleted
    }));
    return response;
  }
);

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async (credentials: LoginRequest) => {
    const response = await authService.adminLogin(credentials);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('userData', JSON.stringify({
      userId: response.userId,
      email: response.email,
      name: response.name,
      role: 'Admin',
      profileCompleted: response.profileCompleted
    }));
    return response;
  }
);

export const customerRegister = createAsyncThunk(
  'auth/customerRegister',
  async (data: CustomerRegisterRequest) => {
    const response = await authService.customerRegister(data);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('userData', JSON.stringify({
      userId: response.userId,
      email: response.email,
      name: response.name,
      role: 'Customer',
      profileCompleted: response.profileCompleted
    }));
    return response;
  }
);

export const organizerRegister = createAsyncThunk(
  'auth/organizerRegister',
  async (data: OrganizerRegisterRequest) => {
    const response = await authService.organizerRegister(data);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('userData', JSON.stringify({
      userId: response.userId,
      email: response.email,
      name: response.name,
      role: 'Organizer',
      profileCompleted: response.profileCompleted
    }));
    return response;
  }
);

export const googleAuth = createAsyncThunk(
  'auth/googleAuth',
  async (idToken: string) => {
    const response = await authService.googleAuth(idToken);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('userData', JSON.stringify({
      userId: response.userId,
      email: response.email,
      name: response.name,
      role: 'Customer',
      profileCompleted: response.profileCompleted
    }));
    return response;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Customer Login
    builder
      .addCase(customerLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(customerLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          userId: action.payload.userId,
          email: action.payload.email,
          name: action.payload.name,
          role: 'Customer',
          profileCompleted: action.payload.profileCompleted
        };
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(customerLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Organizer Login
      .addCase(organizerLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          userId: action.payload.userId,
          email: action.payload.email,
          name: action.payload.name,
          role: 'Organizer',
          profileCompleted: action.payload.profileCompleted
        };
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      // Admin Login
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          userId: action.payload.userId,
          email: action.payload.email,
          name: action.payload.name,
          role: 'Admin',
          profileCompleted: action.payload.profileCompleted
        };
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      // Register cases
      .addCase(customerRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          userId: action.payload.userId,
          email: action.payload.email,
          name: action.payload.name,
          role: 'Customer',
          profileCompleted: action.payload.profileCompleted
        };
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(organizerRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          userId: action.payload.userId,
          email: action.payload.email,
          name: action.payload.name,
          role: 'Organizer',
          profileCompleted: action.payload.profileCompleted
        };
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      // Google Auth
      .addCase(googleAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          userId: action.payload.userId,
          email: action.payload.email,
          name: action.payload.name,
          role: 'Customer',
          profileCompleted: action.payload.profileCompleted
        };
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Google authentication failed';
      });
  },
});

export const { logout, clearError, setUser, setToken } = authSlice.actions;
export default authSlice.reducer;