import { createContext, useState } from "react";

export const AuthContext = createContext(false);

export default function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(true);
  return (
    <AuthContext value={{ isSignedIn, setIsSignedIn }}>{children}</AuthContext>
  );
}
