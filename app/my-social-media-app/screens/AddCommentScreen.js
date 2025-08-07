import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text, View, TextInput, Button, StyleSheet, Alert } from "react-native";

export default function AddCommentScreen({ route, navigation }) {
  const [comment, setComment] = useState("");

  // Assume postId is passed via route.params
  const postId = route?.params?.postId;

  const handleAddComment = () => {
    if (!comment.trim()) {
      Alert.alert("Comment cannot be empty");
      return;
    }
    // TODO: Replace with your API call or state update logic
    // Example: await api.addComment(postId, comment);
    Alert.alert("Comment added!", comment);
    setComment("");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Comment</Text>
      <TextInput
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
