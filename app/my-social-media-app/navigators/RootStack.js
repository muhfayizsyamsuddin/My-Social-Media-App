import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import BottomTabs from "./BottomTab";
import PostDetail from "../screens/PostDetail";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#282c34" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="PostDetail" component={PostDetail} />
      <Stack.Screen
        name="Home"
        options={{
          //   title: "Welcome",
          headerShown: false, // Hide header for Home screen
        }}
        component={BottomTabs}
      />
    </Stack.Navigator>
  );
}
