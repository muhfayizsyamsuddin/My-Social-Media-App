import React, { useContext, useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { deleteSecure, getSecure } from "../helpers/SecureStore";
import { TouchableOpacity } from "react-native";
import { gql, useQuery } from "@apollo/client";

const GET_USER_PROFILE = gql`
  query GetUserById($getUserByIdId: ID!) {
    getUserById(id: $getUserByIdId) {
      _id
      name
      username
      email
      followers {
        username
      }
      followings {
        username
      }
    }
  }
`;

export default function ProfileScreen({ route }) {
  const { setIsSignedIn } = useContext(AuthContext);
  const { currentUserId } = useContext(AuthContext);
  const [userId, setUserId] = useState(route.params?.userId || null);
  // Kalau userId tidak ada di params, ambil dari SecureStore
  useEffect(() => {
    if (!userId) {
      (async () => {
        const storedId = await getSecure("_id"); // pastikan kamu simpan userId saat login
        setUserId(storedId);
      })();
    }
  }, [userId]);

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { getUserByIdId: userId },
    skip: !userId, // Skip query if userId is not set
    fetchPolicy: "network-only",
  });
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
  console.log("Current userId used for query:", userId);

  const user = data?.getUserById;
  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <Text style={{ color: "#fff" }}>User not found</Text>
        <TouchableOpacity
          onPress={async () => {
            console.log("Logout Pressed");
            await deleteSecure("token");
            await deleteSecure("_id");
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
            {user.followers?.length || 0}
          </Text>
          <Text style={{ color: "#fff" }}>Followers</Text>
        </View>
        <View style={{ alignItems: "center", marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
            {user.followings?.length || 0}
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
          await deleteSecure("_id");
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
