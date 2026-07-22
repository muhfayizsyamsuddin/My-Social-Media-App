"use strict";
const { database } = require("../config/mongodb");
const post = require("../schemas/post");
const { ObjectId } = require("mongodb");

class PostModel {
  static collection() {
    return database.collection("posts");
  }
  static async addPost({
    content,
    tags = [],
    imgUrl,
    authorId,
    // comments = [],
    // likes = [],
  }) {
    if (!content) {
      throw new Error("Content is required");
    }
    if (!authorId) {
      throw new Error("Author ID is required");
    }

    const now = new Date().toISOString();
    // const commentInput = comments.map((comment) => {
    //   if (!comment.username || !comment.content) {
    //     throw new Error("Comment must have a username and content");
    //   }
    //   return {
    //     username: comment.username,
    //     content: comment.content,
    //     createdAt: now,
    //     updatedAt: now,
    //   };
    // });
    // const likeInput = likes.map((like) => {
    //   if (!like.username) {
    //     throw new Error("Like must have a username");
    //   }
    //   return {
    //     username: like.username,
    //     createdAt: now,
    //     updatedAt: now,
    //   };
    // });

    const post = {
      content,
      tags,
      imgUrl,
      authorId: new ObjectId(authorId),
      comments: [],
      likes: [],
      createdAt: now,
      updatedAt: now,
    };
    const result = await this.collection().insertOne(post);
    return await this.collection().findOne({ _id: result.insertedId });
  }

  static async getAllPosts() {
    // return await this.collection().find().toArray();
    console.log("============= VERSION BARU =============");
    const agg = [
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "author.password": false,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ];
    const result = await this.collection().aggregate(agg).toArray();
    console.log("🚀 ~ PostModel ~ getAllPosts ~ result:", result);
    return result;
  }

  static async getPostById(id) {
    // return await this.collection().findOne({ _id: new ObjectId(id) });
    const agg = [
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "author.password": false,
        },
      },
    ];
    const result = await this.collection().aggregate(agg).toArray();
    console.log("🚀 ~ PostModel ~ getPostById ~ result:", result);
    return result[0];
  }

  static async addCommentToPost(postId, comment) {
    if (!comment.content || !comment.username) {
      throw new Error("Comment must have content and username");
    }
    return await this.collection().updateOne(
      { _id: new ObjectId(postId) },
      {
        $push: {
          comments: {
            content: comment.content,
            username: comment.username,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
        $set: { updatedAt: new Date().toISOString() },
      }
    );
  }

  static async addLikeToPost(postId, like) {
    if (!like.username) {
      throw new Error("Like must have a username");
    }
    return await this.collection().updateOne(
      { _id: new ObjectId(postId) },
      {
        $push: {
          likes: {
            username: like.username,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
        $set: { updatedAt: new Date().toISOString() },
      }
    );
  }
}
module.exports = PostModel;
