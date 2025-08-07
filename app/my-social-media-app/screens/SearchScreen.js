import React from "react";
import { TextInput } from "react-native";
import { Text, View } from "react-native";

export default function SearchScreen() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);

  const handleSearch = () => {
    // Dummy search logic, replace with API call
    // Example: fetch users whose name includes the query
    const dummyUsers = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" },
      { id: 4, name: "David" },
    ];
    const filtered = dummyUsers.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 40,
            backgroundColor: "#fff",
          }}
          placeholder="Search users"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>
      <View>
        {results.map((user) => (
          <View
            key={user.id}
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            <Text style={{ fontSize: 18 }}>{user.name}</Text>
          </View>
        ))}
        {results.length === 0 && (
          <Text style={{ textAlign: "center", color: "#888" }}>
            No users found
          </Text>
        )}
      </View>
    </View>
  );
}
