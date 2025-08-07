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
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          backgroundColor: "#f4f6fb",
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            marginBottom: 36,
            color: "#1a1a2e",
            letterSpacing: 1,
          }}
        >
          Welcome Back
        </Text>
        <View style={{ width: "100%", marginBottom: 20 }}>
          <Text style={{ marginBottom: 8, color: "#6c757d", fontSize: 16 }}>
            Username
          </Text>
          <TextInput
            style={{
              height: 50,
              borderColor: "#d1d9e6",
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 14,
              backgroundColor: "#fff",
              fontSize: 16,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
            }}
            placeholder="Enter your username"
            autoCapitalize="none"
            keyboardType="default"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#adb5bd"
          />
        </View>
        <View style={{ width: "100%", marginBottom: 28 }}>
          <Text style={{ marginBottom: 8, color: "#6c757d", fontSize: 16 }}>
            Password
          </Text>
          <TextInput
            style={{
              height: 50,
              borderColor: "#d1d9e6",
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 14,
              backgroundColor: "#fff",
              fontSize: 16,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
            }}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#adb5bd"
          />
        </View>
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            height: 50,
            backgroundColor: loading ? "#90b6f9" : "#2563eb",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 8,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
        <View style={{ marginTop: 32, flexDirection: "row" }}>
          <Text style={{ color: "#6c757d", fontSize: 15 }}>
            Don't have an account?{" "}
          </Text>
          <Text
            style={{
              color: "#2563eb",
              fontWeight: "bold",
              fontSize: 15,
              textDecorationLine: "underline",
            }}
            onPress={() => navigation.navigate("Register")}
          >
            Register
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
