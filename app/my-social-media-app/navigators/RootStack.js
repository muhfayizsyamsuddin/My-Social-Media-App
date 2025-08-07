import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import BottomTabs from "./BottomTab";
import PostDetail from "../screens/PostDetail";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { isSignedIn } = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#282c34" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
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
