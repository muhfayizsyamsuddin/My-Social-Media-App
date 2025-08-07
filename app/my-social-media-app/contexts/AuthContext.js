import { createContext, useEffect, useState } from "react";
import { getSecure } from "../helpers/SecureStore";
import { ActivityIndicator, View } from "react-native";

export const AuthContext = createContext(false);

export default function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkToken() {
      const token = await getSecure("token");
      if (token) {
        setIsSignedIn(true);
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
    <AuthContext value={{ isSignedIn, setIsSignedIn }}>{children}</AuthContext>
  );
}
