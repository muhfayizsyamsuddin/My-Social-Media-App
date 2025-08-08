import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { gql, useMutation } from "@apollo/client";

const REGISTER = gql`
  mutation Register($newUser: RegisterUserInput) {
    register(newUser: $newUser) {
      _id
      name
      username
      email
    }
  }
`;

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { loading }] = useMutation(REGISTER);

  const handleRegister = async () => {
    if (!username || !name || !email || !password) {
      Alert.alert("Validation Error", "All fields are required");
      return;
    }
    try {
      const result = await register({
        variables: {
          newUser: { username, name, email, password },
        },
      });
      Alert.alert(
        "Registration Successful",
        `Welcome, ${result.data.register.name}!`
      );
      setUsername("");
      setName("");
      setEmail("");
      setPassword("");
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Registration Failed", err?.message);
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
        <View
          style={{
            width: "100%",
            maxWidth: 360,
            backgroundColor: "#1e1e1e",
            borderRadius: 16,
            padding: 28,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              marginBottom: 28,
              color: "#fff",
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            Create Account
          </Text>

          <Text style={{ marginBottom: 6, color: "#bbb", fontWeight: "600" }}>
            Full Name
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor="#666"
            autoCapitalize="words"
            keyboardAppearance="dark"
          />

          <Text style={{ marginBottom: 6, color: "#bbb", fontWeight: "600" }}>
            Username
          </Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a username"
            placeholderTextColor="#666"
            autoCapitalize="none"
            keyboardAppearance="dark"
          />

          <Text style={{ marginBottom: 6, color: "#bbb", fontWeight: "600" }}>
            Email
          </Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            autoCapitalize="none"
            keyboardType="email-address"
            keyboardAppearance="dark"
          />

          <Text style={{ marginBottom: 6, color: "#bbb", fontWeight: "600" }}>
            Password
          </Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            placeholderTextColor="#666"
            secureTextEntry
            keyboardAppearance="dark"
          />

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#333" : "#1976d2",
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 18,
              marginTop: 12,
              shadowColor: "#1976d2",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {loading ? (
              <ActivityIndicator color={"#fff"} />
            ) : (
              <Text
                style={{
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: "bold",
                  letterSpacing: 1,
                }}
              >
                Register
              </Text>
            )}
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 4,
            }}
          >
            <Text style={{ color: "#888" }}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={{
                  color: "#1976d2",
                  fontWeight: "bold",
                  marginLeft: 4,
                  textDecorationLine: "underline",
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
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
  },
};
