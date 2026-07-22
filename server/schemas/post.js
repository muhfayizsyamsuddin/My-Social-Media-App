const redis = require("../config/redis");
const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");

const typeDefs = `#graphql
  type Post{
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: ID
    author: User
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }
  type Comment {
    username: String
    content: String
    createdAt: String
    updatedAt: String
  }
  type Like {
    username: String
    createdAt: String
    updatedAt: String
  }
  input NewPost {
    content: String!
    tags: [String!]!
    imgUrl: String!
    # comments: [CommentInput]
    # likes: [LikeInput]
    # createdAt: String
    # updatedAt: String
  }
  input CommentInput {
    username: String
    content: String
  }
  input LikeInput {
    username: String!
}
  type Query {
    getPosts: [Post]
    getPostById(id: ID!): Post
  }
  type Mutation {
    addPost(newPost: NewPost): Post
    commentPost(postId: ID!, comment: CommentInput): String
    likePost(postId: ID!, like: LikeInput): String
  }
`;

const resolvers = {
  Query: {
    getPosts: async (_, __, { auth }) => {
      await auth();
      const postsCache = await redis.get("posts");
      console.log("CACHE =", postsCache);
      if (postsCache) {
        console.log("masuk cached ");
        return JSON.parse(postsCache);
      }

      const posts = await PostModel.getAllPosts();
      console.log("masuk mongodb");
      await redis.set("posts", JSON.stringify(posts));
      console.log("BERHASIL SIMPAN KE REDIS");
      return posts;
    },
    getPostById: async (_, { id }, { auth }) => {
      await auth();
      const post = await PostModel.getPostById(id);
      return post;
    },
  },
  Mutation: {
    addPost: async (_, { newPost }, { auth }) => {
      const user = await auth();
      const { _id, content, tags, imgUrl, createdAt, updatedAt } = newPost;
      const post = {
        _id,
        content,
        tags,
        imgUrl,
        createdAt,
        updatedAt,
        authorId: user._id,
      };
      const createdPost = await PostModel.addPost(post);
      await redis.del("posts"); // Clear cache after adding a new post
      return createdPost;
    },
    commentPost: async (_, { postId, comment }, { auth }) => {
      await auth();
      await PostModel.addCommentToPost(postId, comment);
      await redis.del("posts"); // Clear cache after adding a new post
      return "Comment added successfully";
    },
    likePost: async (_, { postId, like }, { auth }) => {
      await auth();
      await PostModel.addLikeToPost(postId, like);
      await redis.del("posts"); // Clear cache after adding a new post
      return "Like added successfully";
    },
  },
};

module.exports = { postTypeDefs: typeDefs, postResolvers: resolvers };
