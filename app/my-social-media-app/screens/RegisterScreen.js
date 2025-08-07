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
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f9f9f9",
          padding: 24,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 24,
            color: "#222",
          }}
        >
          Create Account
        </Text>

        <View style={{ width: "100%", maxWidth: 320 }}>
          <Text style={{ marginBottom: 6, color: "#555" }}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            autoCapitalize="words"
          />

          <Text style={{ marginBottom: 6, color: "#555" }}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a username"
            autoCapitalize="none"
          />

          <Text style={{ marginBottom: 6, color: "#555" }}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={{ marginBottom: 6, color: "#555" }}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry
          />

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#ccc" : "#1976d2",
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 16,
              marginTop: 8,
            }}
          >
            {loading ? (
              <ActivityIndicator color={"#fff"} />
            ) : (
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                Register
              </Text>
            )}
          </TouchableOpacity>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
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
    backgroundColor: "#fff",
  },
};
