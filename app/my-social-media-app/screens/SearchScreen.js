import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { getSecure } from "../helpers/SecureStore";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const SEARCH_USERS = gql`
  query SearchUsers($keyword: String!) {
    searchUsers(keyword: $keyword) {
      _id
      username
      name
    }
  }
`;

export default function SearchScreen() {
  const navigation = useNavigation();

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const { currentUserId: contextUserId } = useContext(AuthContext);
  const [currentUserId, setCurrentUserId] = useState(contextUserId || null);

  // Fallback load user ID dari SecureStore kalau AuthContext belum siap
  useEffect(() => {
    if (!contextUserId) {
      (async () => {
        const storedId = await getSecure("_id");
        if (storedId) setCurrentUserId(storedId);
      })();
    } else {
      setCurrentUserId(contextUserId);
    }
  }, [contextUserId]);

  // debounce input 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  const { data, loading, error } = useQuery(SEARCH_USERS, {
    variables: { keyword: debouncedKeyword },
    skip: !debouncedKeyword,
  });
  // console.log({ loading, error, data });
  const results = data?.searchUsers || [];
  // console.log(results, "results");
  // if (!currentUserId) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Text style={{ color: "red" }}>Loading user info...</Text>
  //     </View>
  //   );
  // }
  const handlePressUser = (userId) => {
    if (!currentUserId) {
      console.warn("User ID belum siap, tidak bisa navigasi");
      return;
    }
    if (userId === currentUserId) {
      navigation.navigate("Profile"); // tab profil user sendiri
    } else {
      navigation.navigate("User Profile", { userId });
    }
  };

  // Tampilkan loading sementara nunggu currentUserId
  if (!currentUserId) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner}>
            <Ionicons name="search" size={24} color="#B3B3B3" />
          </View>
          <Text style={styles.loadingSubtext}>Loading search...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Find people to connect with</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons
            name="search"
            size={20}
            color="#B3B3B3"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search users..."
            placeholderTextColor="#808080"
            autoCapitalize="none"
            autoCorrect={false}
            value={keyword}
            onChangeText={setKeyword}
            keyboardAppearance="dark"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E60023" />
            <Text style={styles.loadingSubtext}>Searching...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons
              name="warning"
              size={32}
              color="#E60023"
              style={styles.errorIcon}
            />
            <Text style={styles.errorText}>Something went wrong!</Text>
          </View>
        )}

        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePressUser(item._id)}
              style={styles.userCard}
              activeOpacity={0.7}
            >
              <View style={styles.userAvatarWrapper}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {item.name
                      ? item.name[0].toUpperCase()
                      : item.username[0].toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userAvatarRing} />
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {item.name || item.username}
                </Text>
                <Text style={styles.userUsername} numberOfLines={1}>
                  @{item.username}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !loading && debouncedKeyword ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="person" size={32} color="#B3B3B3" />
                </View>
                <Text style={styles.emptyTitle}>No users found</Text>
                <Text style={styles.emptyText}>
                  Try searching with a different keyword
                </Text>
              </View>
            ) : !loading && !debouncedKeyword ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="search" size={32} color="#B3B3B3" />
                </View>
                <Text style={styles.emptyTitle}>Start searching</Text>
                <Text style={styles.emptyText}>
                  Enter a name or username to find people
                </Text>
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
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
    paddingHorizontal: 20,
    paddingVertical: 15,
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

  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111111",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1F1F1F",
    paddingHorizontal: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  searchIcon: {
    marginRight: 12,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
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
    marginTop: 12,
  },

  errorContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },

  errorIcon: {
    marginBottom: 12,
  },

  errorText: {
    fontSize: 16,
    color: "#E60023",
    fontWeight: "500",
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  listContent: {
    paddingBottom: 20,
  },

  userCard: {
    flex: 1,
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#1F1F1F",
    alignItems: "center",
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
    marginBottom: 12,
  },

  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2A2A2A",
    zIndex: 2,
  },

  userAvatarRing: {
    position: "absolute",
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "#E60023",
    top: -4,
    left: -4,
    zIndex: 1,
  },

  userAvatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  userInfo: {
    alignItems: "center",
    width: "100%",
  },

  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
    textAlign: "center",
  },

  userUsername: {
    fontSize: 14,
    color: "#B3B3B3",
    fontWeight: "400",
    textAlign: "center",
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
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

  emptyIcon: {
    fontSize: 32,
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
