import React, { useContext, useState } from "react";
import { Alert, KeyboardAvoidingView, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text, View, TouchableOpacity } from "react-native";
// import { useColorScheme } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { gql, useMutation } from "@apollo/client";
import { setSecure } from "../helpers/SecureStore";

const LOGIN = gql`
  mutation Login($userLogin: LoginUserInput) {
    login(userLogin: $userLogin) {
      access_token
      message
    }
  }
`;

export default function LoginScreen() {
  const navigation = useNavigation();
  const { setIsSignedIn } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [login, { error }] = useMutation(LOGIN);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await login({
        variables: {
          userLogin: { username, password },
        },
      });
      // console.log("Login result:", result);
      console.log(result.data.login.access_token);
      const token = result.data?.login.access_token;
      await setSecure("token", token);
      setIsSignedIn(true);
    } catch (err) {
      Alert.alert("Login Failed", err?.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, backgroundColor: "#000" }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            marginBottom: 36,
            color: "#fff",
            letterSpacing: 1,
          }}
        >
          Login
        </Text>
        <View style={{ width: "100%", marginBottom: 20 }}>
          <Text style={{ marginBottom: 8, color: "#d1d5db", fontSize: 16 }}>
            Username
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            autoCapitalize="none"
            keyboardType="default"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#6b7280"
            keyboardAppearance="dark"
          />
        </View>
        <View style={{ width: "100%", marginBottom: 28 }}>
          <Text style={{ marginBottom: 8, color: "#d1d5db", fontSize: 16 }}>
            Password
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#6b7280"
            keyboardAppearance="dark"
          />
        </View>
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            height: 50,
            backgroundColor: loading ? "#60a5fa" : "#2563eb",
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 8,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
        <View style={{ marginTop: 32, flexDirection: "row" }}>
          <Text style={{ color: "#a1a1aa", fontSize: 15 }}>
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text
              style={{
                color: "#2563eb",
                fontWeight: "bold",
                fontSize: 15,
                textDecorationLine: "underline",
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = {
  input: {
    height: 44,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 14,
    paddingHorizontal: 12,
    backgroundColor: "#000",
    color: "#fff",
  },
};
