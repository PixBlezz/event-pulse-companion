import React, { createContext, useContext, useState, useCallback } from "react";

interface User {
  name: string;
  email: string;
  studentId?: string;
  level?: string;
  isRep?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (emailOrId: string, password: string) => { success: boolean; error?: string };
  register: (data: { name: string; email: string; studentId: string; level: string; password: string }) => { success: boolean; error?: string };
  repLogin: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo student accounts
const DEMO_STUDENTS: { email: string; studentId: string; password: string; name: string; level: string }[] = [
  { email: "kwame@email.com", studentId: "10987654", password: "password123", name: "Kwame Mensah", level: "Level 300" },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState(DEMO_STUDENTS);

  const login = useCallback((emailOrId: string, password: string) => {
    const found = students.find(
      (s) => (s.email === emailOrId || s.studentId === emailOrId) && s.password === password
    );
    if (found) {
      setUser({ name: found.name, email: found.email, studentId: found.studentId, level: found.level });
      return { success: true };
    }
    return { success: false, error: "Incorrect details. Please try again." };
  }, [students]);

  const register = useCallback((data: { name: string; email: string; studentId: string; level: string; password: string }) => {
    if (students.find((s) => s.email === data.email || s.studentId === data.studentId)) {
      return { success: false, error: "An account with this email or Student ID already exists." };
    }
    const newStudent = { ...data };
    setStudents((prev) => [...prev, newStudent]);
    setUser({ name: data.name, email: data.email, studentId: data.studentId, level: data.level });
    return { success: true };
  }, [students]);

  const repLogin = useCallback((email: string, password: string) => {
    if (email === "rep@compssa.org" && password === "compssa2025") {
      setUser({ name: "CS Rep", email, isRep: true });
      return { success: true };
    }
    return { success: false, error: "Access denied. Rep credentials only." };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, register, repLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
