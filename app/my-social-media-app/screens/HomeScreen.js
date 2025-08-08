import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import PostCard from "../components/PostCard";
import { gql, useQuery } from "@apollo/client";
import { StatusBar } from "expo-status-bar";

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
  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    fetchPolicy: "network-only",
  });
  console.log({ loading, error, data });
  const navigation = useNavigation();
  // await refetch();
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
  // useEffect(() => {
  //   refetch();
  // }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ffffff" />
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
    <>
      <StatusBar
        style="//#endregion"
        backgroundColor="#000"
        translucent={false}
      />
      <View style={{ flex: 1, backgroundColor: "#000000ff" }}>
        {/* <Pressable
        onPress={() => navigation.navigate("PostDetail")}
        style={{ flex: 1 }}
      > */}

        <PostCard posts={data?.getPosts} />
        {/* </Pressable> */}
      </View>
    </>
  );
}
