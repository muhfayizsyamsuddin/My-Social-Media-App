import { gql, useQuery } from "@apollo/client";
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const GET_POST_BY_ID = gql`
  query GetPostById($getPostByIdId: ID!) {
    getPostById(id: $getPostByIdId) {
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

export default function PostDetail({ route }) {
  const { postId, _id } = route.params;
  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: {
      getPostByIdId: postId,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
          Loading...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>
          Error: {error.message}
        </Text>
      </View>
    );
  }

  const post = data?.getPostById;
  console.log({ data, loading, error });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <Image source={{ uri: post.imgUrl }} style={styles.image} />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            ♥ Like
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text
          style={{
            color: "#fff",
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 6,
          }}
        >
          {post.content}
        </Text>
        <View style={styles.tagsRow}>
          {post.tags.map((tag, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.userRow, { marginTop: 16 }]}>
          <Image
            source={{
              uri:
                post.author?.avatarUrl ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(
                    post.author?.name || post.author?.username || "User"
                  ),
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.username, { color: "#fff" }]}>
              {post.author?.username || "Unknown"}
            </Text>
            <Text style={styles.date}>
              {new Date(post.createdAt).toLocaleString()}
            </Text>
          </View>
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#222",
            marginVertical: 18,
          }}
        />
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
            marginBottom: 8,
          }}
        >
          Comments ({post.comments.length})
        </Text>
        {post.comments.length === 0 ? (
          <Text style={{ color: "#aaa", fontStyle: "italic" }}>
            No comments yet.
          </Text>
        ) : (
          post.comments.map((c, idx) => (
            <View key={idx} style={{ marginBottom: 14 }}>
              <Text style={{ color: "#e60023", fontWeight: "bold" }}>
                {c.username}
              </Text>
              <Text style={{ color: "#fff" }}>{c.content}</Text>
              <Text style={{ color: "#888", fontSize: 12 }}>
                {new Date(c.createdAt).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
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
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "#111",
    borderRadius: 12,
    margin: 16,
  },
  content: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 8,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  username: { fontWeight: "bold", fontSize: 16, marginRight: 10 },
  date: { color: "#aaa", fontSize: 14 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#ccc",
  },
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
