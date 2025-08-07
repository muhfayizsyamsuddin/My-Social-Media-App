import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://lp09z9l8-3000.asse.devtunnels.ms/",
  cache: new InMemoryCache(),
});

export default client;
