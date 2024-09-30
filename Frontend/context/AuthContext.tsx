import React, { createContext, useState, useContext, ReactNode } from "react";
import { useRouter } from "expo-router";

// Define a type for the user (update based on your actual user object structure)
interface User {
  _id: string;
  personalInfo: {
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    civilStatus: string;
    nationality: string;
  };
  contactInfo: {
    address: {
      houseNumber: string;
      street: string;
      barangay: string;
      city: string;
    };
    phoneNumbers: string[];
  };
  economicInfo: {
    employmentStatus: string;
    occupation: string;
  };
  credentials: {
    email: string;
    password: string;
    level: string;
  };
}

// Define a type for the context value
interface AuthContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateUser: (updatedUser: User) => void;
  logout: () => void;
}

// Create an AuthContext with an initial value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the type for the children prop
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider will wrap your entire app and provide the context
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null); // JWT token
  const [user, setUser] = useState<User | null>(null); // User details

  // Function to update the user
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };
  const logout = () => {
    setToken(null); // Clear the token
    setUser(null); // Clear user details
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, user, setUser, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the AuthContext in other components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
