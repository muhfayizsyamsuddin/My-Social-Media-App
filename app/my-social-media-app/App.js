import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./navigators/RootStack";
// import BottomTabs from "./navigators/BottomTab";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <RootStack />
        {/* <BottomTabs /> */}
      </NavigationContainer>
    </ApolloProvider>
  );
}

// <View style={styles.container}>
/* <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>1Login Screen </Text>
        <Button title="Login" onPress={() => console.log("Login Pressed")} />
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Register Screen</Text>
        <Button
          title="Register"
          onPress={() => console.log("Register Pressed")}
        />
      </View> */
// <StatusBar style="auto" />
{
  /* <Text style={{ color: "black" }}>oiii!</Text>
      <Text style={{ color: "black" }}>apa kabar!!</Text> */
}
{
  /* <Button
        onPress={() => alert("Button Pressed!")}
        title="Press Me"
        color="#841584"
        accessibilityLabel="Tap me to see an alert"
      />
      <TouchableOpacity
        onPress={() => console.log("Learn More Pressed")}
        style={{
          backgroundColor: "#f194ff",
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white" }}>Learn More</Text>
      </TouchableOpacity> */
}
// </View>
