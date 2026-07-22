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
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
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
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.centerContainer}>
          <Ionicons name="hourglass-outline" size={48} color="#e60023" />
          <Text style={styles.loadingText}>Loading post...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ff4444" />
          <Text style={styles.errorText}>Error loading post</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const post = data?.getPostById;
  // console.log({ data, loading, error });

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.centerContainer}>
          <Ionicons name="document-outline" size={48} color="#666" />
          <Text style={styles.emptyText}>Post not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Container */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: post.imgUrl }} style={styles.image} />
          </View>

          {/* Content Container */}
          <View style={styles.contentCard}>
            {/* Title */}
            <Text style={styles.postTitle}>{post.content}</Text>

            {/* Tags */}
            {(post.tags || []).length > 0 && (
              <View style={styles.tagsContainer}>
                {post.tags.map((tag, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Author Info */}
            <View style={styles.authorContainer}>
              <Image
                source={{
                  uri:
                    post.author?.avatarUrl ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(
                        post.author?.name || post.author?.username || "User"
                      ),
                }}
                style={styles.authorAvatar}
              />
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>
                  {post.author?.username || "Unknown"}
                </Text>
                <Text style={styles.postDate}>
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : ""}
                </Text>
              </View>
            </View>

            {/* Like Section */}
            <View style={styles.likeSection}>
              <TouchableOpacity
                onPress={handleAddLike}
                style={[styles.likeButton, like && styles.likeButtonActive]}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={like ? "heart" : "heart-outline"}
                  size={20}
                  color={like ? "#e60023" : "#fff"}
                />
                <Text style={[styles.likeText, like && styles.likeTextActive]}>
                  {like ? "Liked" : "Like"}
                </Text>
                <Text style={styles.likeCount}>{post.likes?.length || 0}</Text>
              </TouchableOpacity>
            </View>

            {/* Liked By */}
            <View style={styles.likedByContainer}>
              <Text style={styles.likedByText}>
                Liked by:{" "}
                {(post.likes || []).length === 0
                  ? "No likes yet"
                  : post.likes.map((l, i) => (
                      <React.Fragment key={i}>
                        {i ? <Text style={styles.separator}>, </Text> : null}
                        <Text style={styles.usernameHighlight}>
                          @{l.username}
                        </Text>
                      </React.Fragment>
                    ))}
              </Text>
            </View>

            {/* Comments Section */}
            <View style={styles.commentsSection}>
              <Text style={styles.commentsTitle}>
                Comments ({(post.comments || []).length})
              </Text>

              {/* Add Comment Input */}
              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  placeholderTextColor="#666"
                  value={comment}
                  onChangeText={setComment}
                  keyboardAppearance="dark"
                  multiline
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleAddComment}
                  activeOpacity={0.8}
                >
                  <Ionicons name="send" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Comments List */}
              <View style={styles.commentsList}>
                {(post.comments || []).length === 0 ? (
                  <View style={styles.emptyCommentsContainer}>
                    <Ionicons
                      name="chatbubbles-outline"
                      size={32}
                      color="#666"
                    />
                    <Text style={styles.emptyCommentsText}>
                      No comments yet
                    </Text>
                    <Text style={styles.emptyCommentsSubtext}>
                      Be the first to comment!
                    </Text>
                  </View>
                ) : (
                  (post.comments || []).map((c, idx) => (
                    <View key={idx} style={styles.commentCard}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentUsername}>
                          @{c.username}
                        </Text>
                        <Text style={styles.commentDate}>
                          {new Date(c.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text style={styles.commentContent}>{c.content}</Text>
                    </View>
                  ))
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  errorSubtext: {
    color: "#999",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  imageContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  image: {
    width: "100%",
    height: 400,
    borderRadius: 20,
    resizeMode: "cover",
    backgroundColor: "#111",
  },
  contentCard: {
    backgroundColor: "#0a0a0a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 16,
    paddingTop: 24,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  postTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 32,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  tag: {
    backgroundColor: "#e60023",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    marginVertical: 3,
  },
  tagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#333",
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  postDate: {
    color: "#999",
    fontSize: 14,
  },
  likeSection: {
    alignItems: "flex-start",
    marginBottom: 16,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  likeButtonActive: {
    backgroundColor: "#1a0a0a",
    borderColor: "#e60023",
  },
  likeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
  likeTextActive: {
    color: "#e60023",
  },
  likeCount: {
    color: "#999",
    marginLeft: 8,
    fontSize: 14,
  },
  likedByContainer: {
    marginBottom: 24,
  },
  likedByText: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },
  separator: {
    color: "#666",
  },
  usernameHighlight: {
    color: "#e60023",
    fontWeight: "500",
  },
  commentsSection: {
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingTop: 20,
  },
  commentsTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  commentInputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#111",
    color: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#e60023",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  commentsList: {
    marginTop: 8,
  },
  emptyCommentsContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyCommentsText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
  },
  emptyCommentsSubtext: {
    color: "#555",
    fontSize: 14,
    marginTop: 4,
  },
  commentCard: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#222",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  commentUsername: {
    color: "#e60023",
    fontWeight: "600",
    fontSize: 14,
  },
  commentDate: {
    color: "#888",
    fontSize: 12,
  },
  commentContent: {
    color: "#ddd",
    fontSize: 15,
    lineHeight: 22,
  },
});
