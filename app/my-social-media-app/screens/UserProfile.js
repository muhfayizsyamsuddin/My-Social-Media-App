import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Text, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { deleteSecure, getSecure } from "../helpers/SecureStore";
import { TouchableOpacity } from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";

const GET_USER_PROFILE = gql`
  query GetUserById($getUserByIdId: ID!) {
    getUserById(id: $getUserByIdId) {
      _id
      name
      username
      email
      followers {
        _id
        username
      }
      followings {
        _id
        username
      }
    }
  }
`;

const FOLLOW_USER = gql`
  mutation FollowUser($followInput: FollowInput) {
    followUser(followInput: $followInput) {
      _id
      createdAt
      updatedAt
    }
  }
`;

export default function UserProfile({ route }) {
  const { userId } = route.params;
  const { currentUserId: loggedInUserId } = useContext(AuthContext);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  // Kalau userId tidak ada di params, ambil dari SecureStore
  useEffect(() => {
    if (loggedInUserId) {
      setCurrentUserId(loggedInUserId);
    } else {
      (async () => {
        const storedId = await getSecure("_id");
        setCurrentUserId(storedId);
      })();
    }
  }, [loggedInUserId]);

  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { getUserByIdId: userId },
    skip: !userId, // Skip query if userId is not set
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.getUserById && currentUserId) {
      const followers = data.getUserById.followers || [];
      setIsFollowing(followers.some((f) => f._id === currentUserId));
    }
  }, [data, currentUserId]);

  const [followUser] = useMutation(FOLLOW_USER);
  const handleFollow = async () => {
    try {
      const result = await followUser({
        variables: {
          followInput: {
            // userId: currentUserId,
            followingId: user._id,
          },
        },
      });
      console.log("Follow user result:", result);
      await refetch(); // Refetch to update the followers list
      Alert.alert("Success", "You are now following this user.");
    } catch (error) {
      console.error("Error following user:", error);
      Alert.alert("Error", "Failed to follow user.");
    }
  };
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
  if (!data?.getUserById) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>User not found</Text>
      </View>
    );
  }
  const user = data?.getUserById;

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>User not found</Text>
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
            {user.posts?.length || 0}
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
      <TouchableOpacity
        onPress={handleFollow}
        disabled={isFollowing}
        style={{
          backgroundColor: isFollowing ? "#999" : "#e60023",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          marginBottom: 20,
          opacity: isFollowing ? 0.6 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          {isFollowing ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
