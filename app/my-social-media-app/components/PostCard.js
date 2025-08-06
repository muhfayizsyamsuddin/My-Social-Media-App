import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";

export default function PostCard() {
  // Contoh tampilan home seperti Pinterest (grid masonry sederhana)

  const data = [
    {
      id: "1",
      uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "2",
      uri: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "3",
      uri: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "4",
      uri: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "5",
      uri: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "6",
      uri: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "4",
      uri: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "5",
      uri: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "6",
      uri: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
    },
  ];

  // Membagi data menjadi dua kolom
  const numColumns = 2;
  const columnWrapper = [[], []];
  data.forEach((item, idx) => {
    columnWrapper[idx % numColumns].push(item);
  });

  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: "row",
        padding: 8,
        backgroundColor: "#282c34",
      }}
    >
      {columnWrapper.map((column, colIdx) => (
        <View key={colIdx} style={{ flex: 1, marginHorizontal: 4 }}>
          {column.map((item) => (
            <TouchableOpacity key={item.id} style={{ marginBottom: 8 }}>
              <Image
                source={{ uri: item.uri }}
                style={{
                  width: Dimensions.get("window").width / 2 - 16,
                  height: 200 + Math.random() * 100, // Random height for masonry effect
                  borderRadius: 12,
                  backgroundColor: "#444",
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: "#333",
  },
});
