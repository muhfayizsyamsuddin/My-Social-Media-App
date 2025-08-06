import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import PostCard from "../components/PostCard";

export default function HomeScreen() {
  const navigation = useNavigation();

  return <PostCard />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282c34",
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
