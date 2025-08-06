import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, Text, View, TextInput, TouchableOpacity } from "react-native";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleRegister = () => {
    console.log("Register Pressed", { name, username, email, password });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
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

      <View style={{ width: 280 }}>
        <Text style={{ marginBottom: 6, color: "#555" }}>Full Name</Text>
        <TextInput
          style={{
            height: 44,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 14,
            paddingHorizontal: 12,
            backgroundColor: "#fff",
          }}
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          autoCapitalize="words"
        />

        <Text style={{ marginBottom: 6, color: "#555" }}>Username</Text>
        <TextInput
          style={{
            height: 44,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 14,
            paddingHorizontal: 12,
            backgroundColor: "#fff",
          }}
          value={username}
          onChangeText={setUsername}
          placeholder="Choose a username"
          autoCapitalize="none"
        />

        <Text style={{ marginBottom: 6, color: "#555" }}>Email</Text>
        <TextInput
          style={{
            height: 44,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 14,
            paddingHorizontal: 12,
            backgroundColor: "#fff",
          }}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={{ marginBottom: 6, color: "#555" }}>Password</Text>
        <TextInput
          style={{
            height: 44,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 22,
            paddingHorizontal: 12,
            backgroundColor: "#fff",
          }}
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleRegister}
          style={{
            backgroundColor: "#1976d2",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            Register
          </Text>
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
  );
}
