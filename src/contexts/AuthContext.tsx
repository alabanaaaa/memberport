import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  memberNumber: string;
  dateOfBirth: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user from localStorage or API
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate login - in real app, this would call an API
    let mockUser: User;
    
    // Check if admin login
    if (email.includes('admin') || email.includes('officer')) {
      mockUser = {
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'Super Admin',
        memberId: undefined
      };
    } else {
      mockUser = {
        id: '1',
        name: 'John Doe',
        email: email,
        role: 'Member',
        memberId: 'M001234'
      };
    }
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const register = async (userData: RegisterData) => {
    // Simulate API call - in real app, this would call the backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, create a mock user
    const mockUser: User = {
      id: '2',
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      role: 'Member',
      memberId: userData.memberNumber
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const forgotPassword = async (email: string) => {
    // Simulate API call - in real app, this would call the backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, we'll just simulate success
    console.log('Password reset email sent to:', email);
  };

  const resetPassword = async (token: string, password: string) => {
    // Simulate API call - in real app, this would call the backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll just simulate success
    console.log('Password reset successful for token:', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, forgotPassword, resetPassword, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};