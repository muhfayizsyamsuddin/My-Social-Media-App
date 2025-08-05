"use strict";
const { database } = require("../config/mongodb");
const post = require("../schemas/post");
const { ObjectId } = require("mongodb");

class PostModel {
  static collection() {
    return database.collection("posts");
  }
  static async addPost({ content, tags = [], imgUrl, authorId }) {
    if (!content) {
      throw new Error("Content is required");
    }
    if (!authorId) {
      throw new Error("Author ID is required");
    }
    const post = {
      content,
      tags,
      imgUrl,
      authorId: new ObjectId(authorId),
      //   comments: [],
      //   likes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await this.collection().insertOne(post);
    return await this.collection().findOne({ _id: result.insertedId });
  }

  //   static async getAllPosts() {
  //     return await this.collection().find().toArray();
  //   }

  //   static async getPostById(id) {
  //     return await this.collection().findOne({ _id: new ObjectId(id) });
  //   }
}
module.exports = PostModel;
