import { createContext, useEffect, useState } from "react";
import { getSecure } from "../helpers/SecureStore";
import { ActivityIndicator, View } from "react-native";

export const AuthContext = createContext(false);

export default function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    async function checkToken() {
      const token = await getSecure("token");
      const userId = await getSecure("_id"); // Ambil userId juga
      if (token) {
        setIsSignedIn(true);
      }
      if (userId) {
        setCurrentUserId(userId);
      }
      setLoading(false);
    }
    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AuthContext
      value={{ isSignedIn, setIsSignedIn, currentUserId, setCurrentUserId }}
    >
      {children}
    </AuthContext>
  );
}
