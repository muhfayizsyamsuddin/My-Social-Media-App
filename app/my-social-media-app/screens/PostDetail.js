import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { getSecure } from "../helpers/SecureStore";

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

const ADD_COMMENT = gql`
  mutation CommentPost($postId: ID!, $comment: CommentInput) {
    commentPost(postId: $postId, comment: $comment)
  }
`;

const ADD_LIKE = gql`
  mutation LikePost($postId: ID!, $like: LikeInput) {
    likePost(postId: $postId, like: $like)
  }
`;

export default function PostDetail({ route }) {
  const [comment, setComment] = useState("");
  const [like, setLike] = useState(false);
  const { postId, _id } = route.params;
  const { data, loading, error, refetch } = useQuery(GET_POST_BY_ID, {
    variables: {
      getPostByIdId: postId,
    },
  });

  const [addComment] = useMutation(ADD_COMMENT);
  const [addLike] = useMutation(ADD_LIKE);

  const handleAddComment = async () => {
    console.log("Adding comment:", comment);
    if (!comment.trim()) {
      Alert.alert("Comment cannot be empty");
      return;
    }
    try {
      const username = await getSecure("username");
      if (!username) {
        Alert.alert("You must be logged in to comment");
        return;
      }
      const result = await addComment({
        variables: {
          postId: postId,
          comment: { content: comment, username: username },
        },
      });
      console.log("Add comment result:", result);
      Alert.alert("Comment added!", comment);
      setComment("");
      await refetch();
    } catch (err) {
      Alert.alert("Error adding comment:", err.message);
      console.error("Error adding comment:", err, err.message);
    }
    // navigation.goBack("PostDetail"); // Navigate back to PostDetail screen
  };

  const handleAddLike = async () => {
    try {
      const username = await getSecure("username");
      if (!username) {
        Alert.alert("You must be logged in to like a post");
        return;
      }
      // Cek apakah user sudah like
      const alreadyLiked = data?.getPostById?.likes.some(
        (l) => l.username === username
      );

      if (alreadyLiked) {
        Alert.alert("You have already liked this post");
        return; // Stop di sini agar tidak kirim mutation lagi
      }
      const result = await addLike({
        variables: {
          postId: postId,
          like: { username: username },
        },
      });
      console.log("Add like result:", result);
      setLike(true);
      Alert.alert("Post liked!");
      await refetch();
    } catch (err) {
      Alert.alert("Error liking post:", err.message);
      console.error("Error liking post:", err, err.message);
    }
  };

  useEffect(() => {
    const checkIfLiked = async () => {
      const username = await getSecure("username");
      const alreadyLiked = data?.getPostById?.likes.some(
        (l) => l.username === username
      );
      setLike(alreadyLiked);
    };

    if (data) {
      checkIfLiked();
    }
  }, [data]);

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

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
          Post not found.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, backgroundColor: "#000" }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={{ paddingHorizontal: 13, paddingTop: 16 }}>
          <Image source={{ uri: post.imgUrl }} style={styles.image} />
        </View>
        <View style={styles.infoContainer}>
          <Text
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: "bold",
              marginBottom: 6,
              textAlign: "center",
            }}
          >
            {post.content}
          </Text>
          <View style={[styles.tagsRow, { justifyContent: "center" }]}>
            {(post.tags || []).map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
          {/* Like button, left side */}
          <TouchableOpacity
            onPress={handleAddLike}
            style={[
              styles.likeButton,
              like && { backgroundColor: "#333" },
              // !like && { backgroundColor: "#222" },
              { marginLeft: 0, marginRight: 218, marginTop: 10 },
            ]}
            activeOpacity={0.85}
          >
            <Text
              style={[styles.likeIcon, { color: like ? "#e60023" : "#fff" }]}
            >
              {like ? "♥" : "♡"}
            </Text>
            <Text style={styles.likeText}>{like ? "Liked" : "Like"}</Text>
            <Text style={styles.likeCount}>{post.likes?.length || 0}</Text>
          </TouchableOpacity>

          <Text style={{ color: "#fff", marginTop: 10, marginLeft: 4 }}>
            Liked by:{" "}
            {(post.likes || []).length === 0
              ? "No likes yet"
              : post.likes.map((l, i) => (
                  <React.Fragment key={i}>
                    {i ? <Text style={{ color: "#fff" }}>, </Text> : null}
                    <Text style={{ color: "#e60023" }}>@{l.username}</Text>
                  </React.Fragment>
                ))}
          </Text>
          <View style={[styles.userRow, { marginTop: 16, marginBottom: 8 }]}>
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
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleString()
                  : ""}
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
              textAlign: "center",
            }}
          >
            Comments ({(post.comments || []).length})
          </Text>
          {/* Input comment */}
          <View
            style={{
              flexDirection: "row",
              marginBottom: 16,
              // backgroundColor: "#111",
              padding: 2,
              borderRadius: 8,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                backgroundColor: "#222",
                color: "#fff",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginRight: 8,
              }}
              placeholder="Add a comment..."
              placeholderTextColor="#888"
              value={comment}
              onChangeText={setComment}
              keyboardAppearance="dark"
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#e60023",
                borderRadius: 8,
                paddingHorizontal: 16,
                justifyContent: "center",
              }}
              onPress={handleAddComment}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
            </TouchableOpacity>
          </View>
          {(post.comments || []).length === 0 ? (
            <Text style={{ color: "#aaa", fontStyle: "italic" }}>
              No comments yet.
            </Text>
          ) : (
            (post.comments || []).map((c, idx) => (
              <View
                key={idx}
                style={{
                  marginBottom: 14,
                  backgroundColor: "#1b1b1b",
                  padding: 12,
                  borderRadius: 10,
                  borderColor: "#333",
                  borderWidth: 1,
                }}
              >
                <Text
                  style={{
                    color: "#e60023",
                    fontWeight: "600",
                    fontSize: 14,
                    marginBottom: 4,
                  }}
                >
                  @{c.username}
                </Text>
                <Text style={{ color: "#ddd", fontSize: 15, marginBottom: 6 }}>
                  {c.content}
                </Text>
                <Text style={{ color: "#888", fontSize: 12 }}>
                  {new Date(c.createdAt).toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  image: {
    width: "100%",
    height: 350,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    // marginBottom: 1,
    resizeMode: "cover",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
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
    paddingHorizontal: 14,
    borderRadius: 10,
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
    backgroundColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { color: "#333", fontSize: 14 },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: "#e60023",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  likeIcon: {
    fontWeight: "bold",
    fontSize: 22,
    marginRight: 6,
  },
  likeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  likeCount: {
    color: "#aaa",
    marginLeft: 8,
    fontSize: 14,
  },
});
