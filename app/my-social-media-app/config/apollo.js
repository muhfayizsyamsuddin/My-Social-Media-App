import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSecure } from "../helpers/SecureStore";

const httpLink = createHttpLink({
  uri: "https://api-mysosmed.faizms.com/",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await getSecure("token");
  // return the headers to the context so httpLink can read them
  // console.log("TOKEN =", token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
