import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./navigators/RootStack";
// import BottomTabs from "./navigators/BottomTab";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import AuthProvider from "./contexts/AuthContext";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <RootStack />
          {/* <BottomTabs /> */}
          <StatusBar style="light" backgroundColor="#000" translucent={false} />
        </NavigationContainer>
      </ApolloProvider>
    </AuthProvider>
  );
}
