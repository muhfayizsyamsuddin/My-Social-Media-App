import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function FollowListScreen({ route, navigation }) {
  const { mode, followers = [], followings = [] } = route.params;

  // Tentukan data berdasarkan mode
  const data = mode === "followers" ? followers : followings;

  const renderUserItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.userItem, { marginTop: index === 0 ? 0 : 12 }]}
      onPress={() => navigation.navigate("User Profile", { userId: item._id })}
      activeOpacity={0.7}
    >
      <View style={styles.userAvatarWrapper}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>
            {item.username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userAvatarRing} />
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.userSubtext}>Tap to view profile</Text>
      </View>

      <View style={styles.viewButton}>
        <Ionicons name="chevron-forward" size={16} color="#E60023" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {mode === "followers" ? "Followers" : "Following"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {data.length} {mode === "followers" ? "followers" : "following"}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {data.length > 0 ? (
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={renderUserItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons
                name={
                  mode === "followers" ? "people-outline" : "person-outline"
                }
                size={32}
                color="#666"
              />
            </View>
            <Text style={styles.emptyTitle}>
              {mode === "followers"
                ? "No Followers Yet"
                : "Not Following Anyone"}
            </Text>
            <Text style={styles.emptyText}>
              {mode === "followers"
                ? "When people follow this account, they'll appear here."
                : "When this account follows others, they'll appear here."}
            </Text>
          </View>
        )}
      </View>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },

  headerContent: {
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  listContent: {
    paddingBottom: 20,
  },

  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F1F1F",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  userAvatarWrapper: {
    position: "relative",
    marginRight: 16,
  },

  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2A2A2A",
    zIndex: 2,
  },

  userAvatarRing: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#E60023",
    top: -3,
    left: -3,
    zIndex: 1,
  },

  userAvatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  userInfo: {
    flex: 1,
  },

  username: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
    letterSpacing: 0.3,
  },

  userSubtext: {
    fontSize: 14,
    color: "#B3B3B3",
    fontWeight: "400",
  },

  viewButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  emptyIconContainer: {
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

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },

  emptyText: {
    fontSize: 16,
    color: "#B3B3B3",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "400",
  },
};
