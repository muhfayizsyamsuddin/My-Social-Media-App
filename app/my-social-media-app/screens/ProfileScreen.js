import React, { useContext, useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { deleteSecure, getSecure } from "../helpers/SecureStore";
import { TouchableOpacity } from "react-native";
import { gql, useQuery } from "@apollo/client";
import jwtDecode from "jwt-decode";

const GET_USER_PROFILE = gql`
  query GetUserById($getUserByIdId: ID!) {
    getUserById(id: $getUserByIdId) {
      _id
      name
      username
      email
      followers {
        username
        _id
      }
      followings {
        _id
        username
      }
    }
  }
`;

export default function ProfileScreen({ route }) {
  const [userId, setUserId] = useState(null);
  const { setIsSignedIn } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const token = await getSecure("token");
      console.log("Token from SecureStore:", token);
      if (token) {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setUserId(decoded.id);
      }
    })();
  }, []);

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    // variables: { getUserByIdId: userId },
    variables: userId ? { getUserByIdId: userId } : undefined,
    skip: !userId, // Skip query if userId is not set
    fetchPolicy: "network-only",
  });
  console.log("User ID:", userId);
  console.log("Query Data:", data);
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Loading user profile...</Text>
      </View>
    );
  }
  if (error) {
    console.error("Error fetching user profile:", error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>Error loading profile</Text>
      </View>
    );
  }
  const user = data?.getUserById;
  console.log("User data:", user);
  // const [user, setUser] = React.useState(hardcodedUser);
  // const [loading, setLoading] = React.useState(false);
  // State untuk data user
  // const [user, setUser] = React.useState(null);
  // const [loading, setLoading] = React.useState(true);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: 40,
        backgroundColor: "#000",
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "bold", color: "#fff" }}>
        {user.username}
      </Text>
      <Text style={{ fontSize: 16, color: "gray", marginBottom: 20 }}>
        {user.email}
      </Text>
      <Text style={{ fontSize: 16, color: "gray", marginBottom: 20 }}>
        {user.name}
      </Text>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <View style={{ alignItems: "center", marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
            {/* {user.posts.length} */}
          </Text>
          <Text style={{ color: "#fff" }}>Posts</Text>
        </View>
        <View style={{ alignItems: "center", marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
            {user.followers.length}
          </Text>
          <Text style={{ color: "#fff" }}>Followers</Text>
        </View>
        <View style={{ alignItems: "center", marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
            {user.followings.length}
          </Text>
          <Text style={{ color: "#fff" }}>Following</Text>
        </View>
      </View>
      {/* Tambahkan komponen lain seperti list pin user di sini */}
      {/* <Button
        title="Logout"
        color="#e60023"
        onPress={async () => {
          console.log("Logout Pressed");
          await deleteSecure("token");
          setIsSignedIn(false);
        }}
      /> */}
      <TouchableOpacity
        onPress={async () => {
          console.log("Logout Pressed");
          await deleteSecure("token");
          setIsSignedIn(false);
        }}
        style={{
          backgroundColor: "#e60023",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
