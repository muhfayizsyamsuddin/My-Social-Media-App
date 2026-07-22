import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useContext, useEffect } from "react";
import PostCard from "../components/PostCard";
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../contexts/AuthContext";
import { deleteSecure } from "../helpers/SecureStore";

const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      _id
      content
      tags
      imgUrl
      authorId
      author {
        _id
        name
        username
        email
      }
      comments {
        username
        content
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export default function HomeScreen() {
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    fetchPolicy: "network-only",
    skip: !isSignedIn, // Skip the query if the user is not signed in
  });
  // console.log({ loading, error, data });
  const navigation = useNavigation();
  // await refetch();
  useEffect(() => {
    if (error && error.message.includes("logged in")) {
      (async () => {
        await deleteSecure("token");
        await deleteSecure("_id");
        setIsSignedIn(false); // Memaksa Navigasi Pindah ke LoginScreen!
      })();
    }
  }, [error, setIsSignedIn]);

  useFocusEffect(
    useCallback(() => {
      if (isSignedIn) {
        refetch();
      }
    }, [refetch, isSignedIn])
  );
  // useEffect(() => {
  //   refetch();
  // }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>Discover amazing content</Text>
        </View>

        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner}>
            <Ionicons name="home" size={24} color="#B3B3B3" />
          </View>
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>Discover amazing content</Text>
        </View>

        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="warning" size={32} color="#E60023" />
          </View>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>
            Failed to fetch posts. Please try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data?.getPosts || data.getPosts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>Discover amazing content</Text>
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="newspaper-outline" size={48} color="#404040" />
          <Text style={styles.emptyTitle}>No Posts Yet</Text>
          <Text style={styles.emptyText}>
            Be the first to share something awesome!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Discover amazing content</Text>
      </View>

      <View style={styles.content}>
        <PostCard posts={data?.getPosts} />
      </View>
    </SafeAreaView>
  );
}

// Pinterest-inspired dark theme styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#B3B3B3",
    fontWeight: "500",
    marginTop: 2,
  },

  content: {
    flex: 1,
  },

  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
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

  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#1F1F1F",
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },

  errorText: {
    fontSize: 16,
    color: "#B3B3B3",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "400",
  },
});
