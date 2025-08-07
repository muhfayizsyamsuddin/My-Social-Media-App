import { Text, View } from "react-native";

export default function AddPostScreen() {
  return (
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
        <View
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
          }}
        >
          <Text style={{ color: "#aaa" }}>Enter content...</Text>
        </View>
      </View>
      <View style={{ width: "100%", marginBottom: 16 }}>
        <Text style={{ fontSize: 16, marginBottom: 8, color: "#fff" }}>
          Image URL
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
          }}
        >
          <Text style={{ color: "#aaa" }}>Paste image URL...</Text>
        </View>
      </View>
      {/* Tags input form */}
      <View style={{ width: "100%", marginBottom: 16 }}>
        <Text style={{ fontSize: 16, marginBottom: 8, color: "#fff" }}>
          Tags
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
          }}
        >
          <Text style={{ color: "#aaa" }}>Enter tags (comma separated)...</Text>
        </View>
      </View>
      <View style={{ width: "100%", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "#E60023",
            borderRadius: 24,
            paddingVertical: 12,
            paddingHorizontal: 40,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
            Post
          </Text>
        </View>
      </View>
    </View>
  );
}
