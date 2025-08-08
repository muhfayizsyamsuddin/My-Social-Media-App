import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { Text, View, TextInput, Button, StyleSheet, Alert } from "react-native";

const ADD_COMMENT = gql`
  mutation CommentPost($postId: ID!, $comment: CommentInput) {
    commentPost(postId: $postId, comment: $comment)
  }
`;

export default function AddCommentScreen({ route, navigation }) {
  const [comment, setComment] = useState("");
  const [addComment] = useMutation(ADD_COMMENT);

  const handleAddComment = async () => {
    console.log("Adding comment:", comment);
    const result = await addComment({
      variables: {
        postId: route.params.postId,
        comment: { content: comment },
      },
    });
    console.log("Add comment result:", result);
    if (!comment.trim()) {
      Alert.alert("Comment cannot be empty");
      return;
    }
    Alert.alert("Comment added!", comment);
    setComment("");

    navigation.goBack("PostDetail"); // Navigate back to PostDetail screen
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Add a Comment</Text>
        <TextInput
          onPress={handleAddComment}
          style={styles.input}
          placeholder="Write your comment..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleAddComment}>
          <Text style={styles.buttonText}>Post Comment</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#333",
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
