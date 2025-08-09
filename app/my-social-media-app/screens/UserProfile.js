import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { deleteSecure, getSecure } from "../helpers/SecureStore";
import { gql, useMutation, useQuery } from "@apollo/client";

const { width } = Dimensions.get("window");

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
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner}>
            <Text style={styles.loadingText}>✨</Text>
          </View>
          <Text style={styles.loadingSubtext}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (error) {
    console.error("Error fetching user profile:", error);
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>Unable to load this profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data?.getUserById) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundIcon}>👤</Text>
          <Text style={styles.notFoundTitle}>User not found</Text>
          <Text style={styles.notFoundText}>
            This profile doesn't exist or has been removed
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  const user = data?.getUserById;

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundIcon}>👤</Text>
          <Text style={styles.notFoundTitle}>User not found</Text>
          <Text style={styles.notFoundText}>
            This profile doesn't exist or has been removed
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{user.username}</Text>
        <View style={styles.headerActions}>
          {/* Add more actions here if needed */}
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar Section */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : user.username[0].toUpperCase()}
                </Text>
              </View>
              <View style={styles.avatarRing} />
            </View>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user.username || "Unknown"}</Text>
            <Text style={styles.fullName}>{user.name || ""}</Text>
            <Text style={styles.email}>{user.email || ""}</Text>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={[styles.statItem, styles.statItemLeft]}>
              <Text style={styles.statNumber}>
                {user.followers?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={[styles.statItem, styles.statItemRight]}>
              <Text style={styles.statNumber}>
                {user.followings?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* Follow Button */}
          <TouchableOpacity
            onPress={handleFollow}
            disabled={isFollowing}
            style={[
              styles.followButton,
              isFollowing ? styles.followingButton : styles.notFollowingButton,
            ]}
          >
            <Text
              style={[
                styles.followButtonText,
                isFollowing
                  ? styles.followingButtonText
                  : styles.notFollowingButtonText,
              ]}
            >
              {isFollowing ? "✓ Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <View style={styles.infoCardsContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Profile Status</Text>
            <Text style={styles.infoCardText}>
              {isFollowing ? "Connected" : "Not Connected"}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Posts</Text>
            <Text style={styles.infoCardText}>Coming Soon</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Pinterest-inspired dark theme styles
const styles = {
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  headerActions: {
    flexDirection: "row",
  },

  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  profileCard: {
    backgroundColor: "#111111",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    padding: 30,
    borderWidth: 1,
    borderColor: "#1F1F1F",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#2A2A2A",
    zIndex: 2,
  },

  avatarRing: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#E60023",
    top: -5,
    left: -5,
    zIndex: 1,
  },

  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  userInfo: {
    alignItems: "center",
    marginBottom: 30,
  },

  username: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: 0.5,
  },

  fullName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#B3B3B3",
    marginBottom: 4,
  },

  email: {
    fontSize: 16,
    color: "#808080",
    fontWeight: "400",
  },

  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    overflow: "hidden",
    marginBottom: 24,
  },

  statItem: {
    flex: 1,
    paddingVertical: 20,
    alignItems: "center",
  },

  statItemLeft: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },

  statItemRight: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },

  statDivider: {
    width: 1,
    backgroundColor: "#2A2A2A",
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 14,
    color: "#B3B3B3",
    fontWeight: "500",
  },

  followButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  notFollowingButton: {
    backgroundColor: "#E60023",
  },

  followingButton: {
    backgroundColor: "#1A1A1A",
    borderWidth: 2,
    borderColor: "#2A2A2A",
  },

  followButtonText: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  notFollowingButtonText: {
    color: "#FFFFFF",
  },

  followingButtonText: {
    color: "#B3B3B3",
  },

  infoCardsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    gap: 15,
  },

  infoCard: {
    flex: 1,
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1F1F1F",
    alignItems: "center",
  },

  infoCardTitle: {
    fontSize: 14,
    color: "#B3B3B3",
    fontWeight: "500",
    marginBottom: 8,
  },

  infoCardText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingSpinner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  loadingText: {
    fontSize: 24,
  },

  loadingSubtext: {
    fontSize: 16,
    color: "#B3B3B3",
    fontWeight: "500",
  },

  // Error states
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  errorIcon: {
    fontSize: 48,
    marginBottom: 20,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },

  errorText: {
    fontSize: 16,
    color: "#B3B3B3",
    textAlign: "center",
  },

  // Not found states
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  notFoundIcon: {
    fontSize: 48,
    marginBottom: 20,
  },

  notFoundTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },

  notFoundText: {
    fontSize: 16,
    color: "#B3B3B3",
    textAlign: "center",
    marginBottom: 30,
  },
};
