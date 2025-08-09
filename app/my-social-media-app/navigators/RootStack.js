import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import BottomTabs from "./BottomTab";
import PostDetail from "../screens/PostDetail";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import UserProfile from "../screens/UserProfile";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { isSignedIn } = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: "#000000ff" },
        headerStyle: { backgroundColor: "#000000ff" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "bold" },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerBackTitleVisible: false, // Hide back button text
        headerBackTitle: "Back", // Optional: Set a custom back button title
        headerBackImage: () => (
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        ), // Custom back button icon
        // headerTitle: "My Social Media App", // Set a custom title for the header
        headerShown: true, // Show header for all screens
        animation: "fade", // Set a custom animation for screen transitions
      }}
    >
      {isSignedIn ? (
        <>
          <Stack.Screen
            name="Home"
            options={{
              //   title: "Welcome",
              headerShown: false, // Hide header for Home screen
            }}
            component={BottomTabs}
          />
          <Stack.Screen name="PostDetail" component={PostDetail} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
