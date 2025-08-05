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
    tags: [String]
    imgUrl: String
    authorId: ID!
    comments: [CommentInput]
    likes: [LikeInput]
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
    getPostById(_id: ID!): Post
  }
  type Mutation {
    addPost(newPost: NewPost): Post
    commentPost(postId: ID!, comment: CommentInput): Post
    likePost(postId: ID!, like: LikeInput): Post
  }
`;

const resolvers = {
  Query: {
    getPosts: async () => {
      const posts = await PostModel.getAllPosts();
      return posts;
    },
    getPostById: async (_, { id }) => {
      const post = await PostModel.getPostById(id);
      return post;
    },
  },
  Mutation: {
    addPost: async (_, { newPost }, { auth }) => {
      //   await auth();
      const {
        _id,
        content,
        tags,
        imgUrl,
        authorId,
        comments,
        likes,
        createdAt,
        updatedAt,
      } = newPost;
      const post = {
        _id,
        content,
        tags,
        imgUrl,
        authorId,
        comments,
        likes,
        createdAt,
        updatedAt,
      };
      const createdPost = await PostModel.addPost(post);
      return createdPost;
    },
    commentPost: async (_, { postId, comment }, { auth }) => {
      //   await auth();
      const updatedPost = await PostModel.addCommentToPost(postId, comment);
      return updatedPost;
    },
    likePost: async (_, { postId, like }, { auth }) => {
      //   await auth();
      const updatedPost = await PostModel.addLikeToPost(postId, like);
      return updatedPost;
    },
  },
};

module.exports = { postTypeDefs: typeDefs, postResolvers: resolvers };
