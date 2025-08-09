import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitle}>Share your thoughts</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Content Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelWrapper}>
                <Ionicons name="create" size={18} color="#E60023" />
                <Text style={styles.inputLabel}>Content</Text>
              </View>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="What's on your mind?"
                placeholderTextColor="#808080"
                keyboardType="default"
                keyboardAppearance="dark"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                style={[styles.textInput, styles.contentInput]}
              />
            </View>

            {/* Image URL Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelWrapper}>
                <Ionicons name="image" size={18} color="#E60023" />
                <Text style={styles.inputLabel}>Image URL</Text>
              </View>
              <TextInput
                value={imgUrl}
                onChangeText={setImgUrl}
                placeholder="Enter image URL (optional)"
                placeholderTextColor="#808080"
                keyboardType="url"
                keyboardAppearance="dark"
                style={styles.textInput}
              />
            </View>

            {/* Tags Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelWrapper}>
                <Ionicons name="pricetag" size={18} color="#E60023" />
                <Text style={styles.inputLabel}>Tags</Text>
              </View>
              <TextInput
                value={tags}
                onChangeText={setTags}
                placeholder="Enter tags (comma separated)"
                placeholderTextColor="#808080"
                keyboardType="default"
                keyboardAppearance="dark"
                style={styles.textInput}
              />
              <Text style={styles.helperText}>
                Separate tags with commas (e.g., travel, food, life)
              </Text>
            </View>
          </View>

          {/* Post Button */}
          <TouchableOpacity
            onPress={handleAddPost}
            disabled={loading || !content.trim()}
            style={[
              styles.postButton,
              (!content.trim() || loading) && styles.postButtonDisabled,
            ]}
          >
            {loading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.buttonTextLoading}>Creating...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons name="send" size={18} color="#FFFFFF" />
                <Text style={styles.buttonText}>Create Post</Text>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Pinterest-inspired dark theme styles
const styles = {
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },

  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },

  headerContent: {
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#B3B3B3",
    fontWeight: "500",
    marginTop: 2,
  },

  keyboardView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  formCard: {
    backgroundColor: "#111111",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1F1F1F",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 24,
  },

  inputGroup: {
    marginBottom: 24,
  },

  inputLabelWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
    letterSpacing: 0.3,
  },

  textInput: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    fontWeight: "500",
  },

  contentInput: {
    minHeight: 100,
    maxHeight: 150,
  },

  helperText: {
    fontSize: 12,
    color: "#808080",
    marginTop: 8,
    fontWeight: "400",
  },

  postButton: {
    backgroundColor: "#E60023",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    shadowColor: "#E60023",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  postButtonDisabled: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    shadowOpacity: 0,
    elevation: 0,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
    letterSpacing: 0.5,
  },

  buttonTextLoading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
};
