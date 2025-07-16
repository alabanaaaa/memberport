const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function makeApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred',
        response.status,
        data.errors
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error occurred', 500);
  }
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await makeApiRequest<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!response.success || !response.data) {
      throw new ApiError(response.message || 'Login failed', 401);
    }

    return response.data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await makeApiRequest<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (!response.success || !response.data) {
      throw new ApiError(response.message || 'Registration failed', 400);
    }

    return response.data;
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await makeApiRequest<{ message: string }>('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.success || !response.data) {
      throw new ApiError(response.message || 'Failed to send reset email', 400);
    }

    return response.data;
  },

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await makeApiRequest<{ message: string }>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.success || !response.data) {
      throw new ApiError(response.message || 'Password reset failed', 400);
    }

    return response.data;
  },

  async validateToken(token: string): Promise<AuthResponse> {
    const response = await makeApiRequest<AuthResponse>('/api/v1/auth/validate', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.success || !response.data) {
      throw new ApiError(response.message || 'Token validation failed', 401);
    }

    return response.data;
  },

  async logout(token: string): Promise<void> {
    await makeApiRequest('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await makeApiRequest<{ message: string }>('/api/v1/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    if (!response.success || !response.data) {
      throw new ApiError(response.message || 'Email verification failed', 400);
    }

    return response.data;
  },
};

export { ApiError };
export type { AuthResponse, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest };
