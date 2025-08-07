import { useNavigation } from "@react-navigation/native";
import React from "react";
import MasonryList from "react-native-masonry-list";

import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";

export default function PostCard() {
  // Contoh tampilan home seperti Pinterest (grid masonry sederhana)
  const navigation = useNavigation();
  const data = [
    {
      id: "1",
      uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "2",
      uri: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "3",
      uri: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "4",
      uri: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "5",
      uri: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "6",
      uri: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "7",
      uri: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "8",
      uri: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "9",
      uri: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "10",
      uri: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
    },
  ];

  // Ganti FlatList dengan MasonryList di return function PostCard

  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth / 2 - 16;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate("PostDetail", { postId: item.id })}
    >
      <Image
        source={{ uri: item.uri }}
        style={{
          width: imageWidth,
          height: item.height,
          borderRadius: 12,
          backgroundColor: "#444",
        }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MasonryList
        images={data}
        columns={2}
        spacing={4}
        onPressImage={(item) => {
          navigation.navigate("PostDetail", { postId: item.id });
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: "#282c34",
  },
});
