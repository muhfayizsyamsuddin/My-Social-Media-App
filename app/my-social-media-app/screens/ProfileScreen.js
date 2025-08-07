import React, { useContext } from "react";
import { Button, Text, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { deleteSecure } from "../helpers/SecureStore";
import { TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  const { setIsSignedIn } = useContext(AuthContext);
  // Misal: ambil userId dari props atau navigation params
  // Untuk contoh, kita hardcode userId
  const userId = 1;
  // Data user hardcode
  // Data user hardcode
  const hardcodedUser = {
    username: "abdul",
    email: "abdul@example.com",
    listsCount: 5,
    followersCount: 120,
    followingCount: 80,
  };
  // State untuk data user
  const [user, setUser] = React.useState(hardcodedUser);
  const [loading, setLoading] = React.useState(false);

  // Jika ingin fetch dari API, bisa aktifkan useEffect di bawah ini
  /*
  React.useEffect(() => {
    async function fetchUserProfile() {
      setLoading(true);
      try {
        const res = await fetch(`https://your-api.com/users/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setUser(null);
      }
      setLoading(false);
    }
    fetchUserProfile();
  }, [userId]);
  */
  // State untuk data user
  // const [user, setUser] = React.useState(null);
  // const [loading, setLoading] = React.useState(true);

  // React.useEffect(() => {
  //   // Ganti dengan fetch API sesuai backend Anda
  //   async function fetchUserProfile() {
  //     setLoading(true);
  //     try {
  //       // Contoh endpoint, sesuaikan dengan backend Anda
  //       const res = await fetch(`https://your-api.com/users/${userId}`);
  //       const data = await res.json();
  //       setUser(data);
  //     } catch (err) {
  //       setUser(null);
  //     }
  //     setLoading(false);
  //   }
  //   fetchUserProfile();
  // }, [userId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: 40,
        backgroundColor: "#000",
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "bold", color: "#fff" }}>
        {user.username}
      </Text>
      <Text style={{ fontSize: 16, color: "gray", marginBottom: 20 }}>
        {user.email}
      </Text>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <View style={{ alignItems: "center", marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
            {user.listsCount}
          </Text>
          <Text style={{ color: "#fff" }}>Posts</Text>
        </View>
        <View style={{ alignItems: "center", marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
            {user.followersCount}
          </Text>
          <Text style={{ color: "#fff" }}>Followers</Text>
        </View>
        <View style={{ alignItems: "center", marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
            {user.followingCount}
          </Text>
          <Text style={{ color: "#fff" }}>Following</Text>
        </View>
      </View>
      {/* Tambahkan komponen lain seperti list pin user di sini */}
      {/* <Button
        title="Logout"
        color="#e60023"
        onPress={async () => {
          console.log("Logout Pressed");
          await deleteSecure("token");
          setIsSignedIn(false);
        }}
      /> */}
      <TouchableOpacity
        onPress={async () => {
          console.log("Logout Pressed");
          await deleteSecure("token");
          setIsSignedIn(false);
        }}
        style={{
          backgroundColor: "#e60023",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
