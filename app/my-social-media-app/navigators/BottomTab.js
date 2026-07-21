import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import AddPostScreen from "../screens/AddPostScreen";
import AddCommentScreen from "../screens/AddCommentScreen";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <>
      {/* <StatusBar backgroundColor="#000" /> */}
      {/* <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}> */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "PostList") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person-sharp" : "person-outline";
            } else if (route.name === "Search") {
              iconName = focused ? "search-sharp" : "search-outline";
            } else if (route.name === "AddPost") {
              iconName = focused ? "add-circle-sharp" : "add-circle-outline";
            } else if (route.name === "AddComment") {
              iconName = focused
                ? "chatbubble-ellipses-sharp"
                : "chatbubble-ellipses-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#ffffff",
          tabBarInactiveTintColor: "#b0b0b0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#000000ff",
            borderTopWidth: 0,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          },
          // headerShown: false, // Hide header for all tabs
          tabBarItemStyle: {
            paddingVertical: 5,
            paddingHorizontal: 10,
          },
          tabBarIconStyle: {
            marginBottom: -5,
          },
          tabBarButtonStyle: {
            borderRadius: 30,
            marginHorizontal: 5,
            marginBottom: 5,
          },
          // headerStyle: { backgroundColor: "#000" },
          // headerTintColor: "#fff",
          // headerTitleStyle: { fontWeight: "bold" },
        })}
      >
        <Tab.Screen
          name="PostList"
          options={{
            title: "Home",
            headerStyle: { backgroundColor: "#000000ff" },
            headerTintColor: "#ffffff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
          component={HomeScreen}
        />
        <Tab.Screen
          name="Search"
          options={{
            title: "Search",
            headerStyle: { backgroundColor: "#000000ff" },
            headerTintColor: "#ffffff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
          component={SearchScreen}
        />
        <Tab.Screen
          name="AddPost"
          options={{
            title: "Add Post",
            headerStyle: { backgroundColor: "#000000ff" },
            headerTintColor: "#ffffff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
          component={AddPostScreen}
        />
        {/* <Tab.Screen
          name="AddComment"
          options={{
            title: "Add Comment",
            headerStyle: { backgroundColor: "#000000ff" },
            headerTintColor: "#ffffff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
          component={AddCommentScreen}
        /> */}
        <Tab.Screen
          name="Profile"
          options={{
            title: "Profile",
            headerStyle: { backgroundColor: "#000000ff" },
            headerTintColor: "#ffffff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
          component={ProfileScreen}
        />
      </Tab.Navigator>
      {/* </SafeAreaView> */}
    </>
  );
}
