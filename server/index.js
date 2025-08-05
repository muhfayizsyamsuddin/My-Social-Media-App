const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const { userTypeDefs, userResolvers } = require("./schemas/user");
const { postTypeDefs, postResolvers } = require("./schemas/post");
const { followTypeDefs, followResolvers } = require("./schemas/follow");
const { verifyToken } = require("./helpers/jwt");
const UserModel = require("./models/UserModel");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
});

startStandaloneServer(server, {
  listen: { port: 3000 },
  context: async ({ req }) => {
    return {
      auth: async () => {
        const authentication = req.headers.authorization;
        if (!authentication) {
          throw new Error("You must be logged in to perform this action");
        }
        const access_token = authentication.split(" ")[1];
        if (!access_token) {
          throw new Error("You must be logged in to perform this action");
        }
        const decoded = verifyToken(access_token);
        if (!decoded) {
          throw new Error("You must be logged in to perform this action");
        }
        const user = await UserModel.getUserById(decoded.userid);
        if (!user) {
          throw new Error("You must be logged in to perform this action");
        }
        return user;
      },
    };
  },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
