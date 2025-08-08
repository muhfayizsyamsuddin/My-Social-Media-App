import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "react-native";

const ADD_POST = gql`
  mutation AddPost($newPost: NewPost) {
    addPost(newPost: $newPost) {
      _id
      content
      tags
      imgUrl
      authorId
      createdAt
      updatedAt
    }
  }
`;

export default function AddPostScreen() {
  const navigation = useNavigation();
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [tags, setTags] = useState("");
  const [addPost, { loading, error }] = useMutation(ADD_POST);

  const handleAddPost = async () => {
    try {
      const result = await addPost({
        variables: {
          newPost: {
            content,
            imgUrl,
            tags: tags.split(",").map((tag) => tag.trim()), // Split tags by comma and trim whitespace
          },
        },
      });
      setContent("");
      setImgUrl("");
      setTags("");
      Alert.alert("Success", "Post created successfully!");
      setTimeout(() => {
        navigation.replace("Home");
      }, 300); // 300ms delay
      console.log("Post added:", result.data.addPost);
    } catch (err) {
      Alert.alert("Error adding post:", err.message);
      console.error("Error adding post:", err, err.message);
      console.error("GraphQL Error:", JSON.stringify(err, null, 2));
      if (err.graphQLErrors?.length) {
        err.graphQLErrors.forEach((e) => {
          console.log("GraphQL error message:", e.message);
          console.log("GraphQL error path:", e.path);
          console.log("GraphQL error extensions:", e.extensions);
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, backgroundColor: "#000" }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: "#000",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 24,
            color: "#fff",
          }}
        >
          Create New Post
        </Text>
        <View style={{ width: "100%", marginBottom: 16 }}>
          <Text style={{ fontSize: 16, marginBottom: 8, color: "#fff" }}>
            Content
          </Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Enter content..."
            placeholderTextColor="#aaa"
            keyboardType="default"
            keyboardAppearance="dark"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 10,
              color: "#fff",
            }}
          />
        </View>
        <View style={{ width: "100%", marginBottom: 16 }}>
          <Text style={{ fontSize: 16, marginBottom: 8, color: "#fff" }}>
            Image URL
          </Text>
          <TextInput
            value={imgUrl}
            onChangeText={setImgUrl}
            placeholder="Enter image URL..."
            placeholderTextColor="#aaa"
            keyboardType="default"
            keyboardAppearance="dark"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 10,
              color: "#fff",
            }}
          />
        </View>
        {/* Tags input form */}
        <View style={{ width: "100%", marginBottom: 16 }}>
          <Text style={{ fontSize: 16, marginBottom: 8, color: "#fff" }}>
            Tags
          </Text>
          <TextInput
            value={tags}
            onChangeText={setTags}
            placeholder="Enter tags (comma separated)..."
            placeholderTextColor="#aaa"
            keyboardType="default"
            keyboardAppearance="dark"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 10,
              color: "#fff",
            }}
          />
        </View>
        <TouchableOpacity
          onPress={handleAddPost}
          disabled={loading}
          style={{
            backgroundColor: "#e60023",
            paddingVertical: 12,
            paddingHorizontal: 23,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ fontSize: 17, color: "#fff", fontWeight: "bold" }}>
              Post
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
