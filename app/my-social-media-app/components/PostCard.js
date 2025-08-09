import { useNavigation } from "@react-navigation/native";
import React from "react";
import MasonryList from "react-native-masonry-list";
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";

const { width } = Dimensions.get("window");

export default function PostCard({ posts }) {
  const navigation = useNavigation();

  const cardWidth = (width - 16) / 2; // Account for minimal padding and spacing

  const formattedPosts = posts.map((post, index) => ({
    id: post._id,
    uri: post.imgUrl || "/icon.png",
    width: cardWidth,
    height: cardWidth * (1.3 + Math.random() * 0.5), // More consistent height variation
    content: post.content,
    author: post.author,
  }));

  return (
    <View style={styles.container}>
      <MasonryList
        images={formattedPosts}
        columns={2}
        spacing={3}
        onPressImage={(item) => {
          navigation.navigate("PostDetail", { postId: item.id, _id: item.id });
        }}
        style={styles.masonryList}
        contentContainerStyle={styles.masonryContent}
        backgroundColor="#0A0A0A"
        imageContainerStyle={styles.imageContainer}
        renderImage={(item) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PostDetail", { postId: item.id })
            }
            style={styles.postCard}
            activeOpacity={0.8}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item.uri }}
                style={[
                  styles.postImage,
                  {
                    width: item.width,
                    height:
                      item.height -
                      (item.content ? 60 : 0) -
                      (item.author ? 48 : 0), // Subtract overlay heights
                  },
                ]}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />
            </View>

            {/* Content Overlay */}
            {item.content && (
              <View style={styles.contentOverlay}>
                <Text style={styles.contentText} numberOfLines={3}>
                  {item.content}
                </Text>
              </View>
            )}

            {/* Author Info */}
            {item.author && (
              <View style={styles.authorInfo}>
                <View style={styles.authorAvatar}>
                  <Text style={styles.authorAvatarText}>
                    {item.author.username
                      ? item.author.username[0].toUpperCase()
                      : "?"}
                  </Text>
                </View>
                <Text style={styles.authorName} numberOfLines={1}>
                  {item.author.username}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },

  masonryList: {
    flex: 1,
  },

  masonryContent: {
    padding: 8,
    paddingBottom: 32,
  },

  imageContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },

  postCard: {
    backgroundColor: "#111111",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1F1F1F",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 1,
    position: "relative",
  },

  imageWrapper: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
  },

  postImage: {
    width: "100%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },

  contentOverlay: {
    position: "absolute",
    bottom: 48, // Position above author info
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 12,
  },

  contentText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
  },

  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1A1A1A",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E60023",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  authorAvatarText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  authorName: {
    color: "#B3B3B3",
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
});
