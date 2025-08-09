import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";

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
  // const { isSignedIn } = useContext(AuthContext);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const { currentUserId } = useContext(AuthContext);

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
  console.log({ loading, error, data });
  const results = data?.searchUsers || [];
  console.log(results, "results");

  const handlePressUser = (userId) => {
    console.log("Pressed user ID:", userId);
    if (userId === currentUserId) {
      navigation.navigate("ProfileScreen"); // tab profil user sendiri
    } else {
      navigation.navigate("UserProfile", { userId });
    }
  };

  const isDark = true;

  const colors = {
    background: isDark ? "#000" : "#fff",
    text: isDark ? "#fff" : "#222",
    inputBg: isDark ? "#000" : "#F3F3F3",
    inputText: isDark ? "#fff" : "#000",
    placeholder: isDark ? "#aaa" : "#888",
    cardBg: isDark ? "#000" : "#fff",
    border: isDark ? "#ccc" : "#F3F3F3",
    accent: "#fff",
    shadow: "#000",
    error: "#f00",
    secondaryText: isDark ? "#aaa" : "#888",
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <TextInput
        placeholder="Search users..."
        placeholderTextColor={colors.placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        value={keyword}
        onChangeText={setKeyword}
        keyboardAppearance={isDark ? "dark" : "light"}
        style={{
          borderWidth: 1,
          borderRadius: 15,
          padding: 12,
          marginBottom: 16,
          color: colors.inputText,
          backgroundColor: colors.inputBg,
          fontSize: 16,
          shadowColor: colors.shadow,
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2,
          marginTop: 10,
          marginHorizontal: 4,
          fontWeight: "500",
          borderColor: "#ccc",
          shadowOffset: { width: 0, height: 0 },
        }}
      />

      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.accent}
          style={{ marginVertical: 24 }}
        />
      )}

      {error && (
        <Text
          style={{ color: colors.error, textAlign: "center", marginBottom: 12 }}
        >
          Something went wrong!
        </Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 8,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePressUser(item._id)}
            style={{
              flex: 1,
              marginHorizontal: 3,
              backgroundColor: colors.cardBg,
              borderRadius: 14,
              paddingVertical: 12,
              paddingHorizontal: 8,
              marginBottom: 4,
              shadowColor: colors.shadow,
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 1,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
            }}
            activeOpacity={0.85}
          >
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: "#fff", // avatar putih
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    color: colors.accent,
                    fontWeight: "bold",
                    fontSize: 18,
                  }} // teks merah
                >
                  {item.name
                    ? item.name[0].toUpperCase()
                    : item.username[0].toUpperCase()}
                </Text>
              </View>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 14,
                  color: colors.text,
                  textAlign: "center",
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{ color: colors.accent, fontSize: 12, marginTop: 2 }}
              >
                @{item.username}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && debouncedKeyword ? (
            <Text
              style={{
                textAlign: "center",
                marginTop: 32,
                color: colors.secondaryText,
                fontSize: 16,
              }}
            >
              No users found for "{debouncedKeyword}"
            </Text>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
