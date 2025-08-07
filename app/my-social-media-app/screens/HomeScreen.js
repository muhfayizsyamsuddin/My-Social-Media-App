import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import PostCard from "../components/PostCard";
import { gql, useQuery } from "@apollo/client";

const GET_POSTS = gql`
  query GetPosts {
    getPosts {
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

export default function HomeScreen() {
  const { loading, error, data } = useQuery(GET_POSTS);
  console.log({ loading, error, data });
  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "white" }}>Loading posts...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>Failed to fetch posts.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* <Pressable
        onPress={() => navigation.navigate("PostDetail")}
        style={{ flex: 1 }}
      > */}
      <PostCard posts={data?.getPosts} />
      {/* </Pressable> */}
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#282c34",
//     // backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
