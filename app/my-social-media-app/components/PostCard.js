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

export default function PostCard({ posts }) {
  // Contoh tampilan home seperti Pinterest (grid masonry sederhana)
  const navigation = useNavigation();

  const formattedPosts = posts.map((post) => ({
    id: post._id,
    uri: post.imgUrl || "/icon.png",
    width: Dimensions.get("window").width / 2 - 16, // Set width for each image
    height: (Dimensions.get("window").width / 2 - 16) * 1.5, // Adjust height based on your design
  }));

  return (
    <View style={styles.container}>
      <MasonryList
        images={formattedPosts}
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
