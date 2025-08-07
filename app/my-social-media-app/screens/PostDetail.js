import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// const post = {
//   id: 1,
//   image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
//   title: "Beautiful Landscape",
//   description: "A breathtaking view of the mountains during sunset.",
//   user: {
//     name: "John Doe",
//     avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//   },
//   tags: ["nature", "mountain", "sunset"],
//   createdAt: "2024-06-01",
// };

export default function PostDetail({ route }) {
  const { postId } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: postId.imgUrl }} style={styles.image} />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.content}>{postId.content}</Text>
        <Text style={styles.description}>{postId.description}</Text>
        {/* <View style={styles.userRow}>
          <Image source={{ uri: postId.user.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{postId.user.name}</Text>
          <Text style={styles.date}>{postId.createdAt}</Text>
        </View> */}
        {/* <View style={styles.tagsRow}>
          {postId.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: {
    width: "100%",
    height: 350,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  overlay: {
    position: "absolute",
    top: 30,
    right: 20,
    zIndex: 2,
  },
  saveButton: {
    backgroundColor: "#e60023",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 24,
    elevation: 2,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  infoContainer: { padding: 20 },
  content: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  description: { fontSize: 16, color: "#555", marginBottom: 16 },
  userRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: "bold", fontSize: 16, marginRight: 10 },
  date: { color: "#aaa", fontSize: 14 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  tag: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { color: "#333", fontSize: 14 },
});
