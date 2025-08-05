"use strict";
const { database } = require("../config/mongodb");
// const { hashPassword, comparePassword } = require("../helpers/bcrypt");
// const { signToken } = require("../helpers/jwt");
const post = require("../schemas/post");
const follow = require("../schemas/follow");
const { ObjectId } = require("mongodb");

class FollowModel {
  static collection() {
    return database.collection("follows");
  }
  static async createFollow({ followerId, followingId }) {
    const follow = {
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await this.collection().insertOne(follow);
    return await this.collection().findOne({ _id: result.insertedId });
  }
}
module.exports = FollowModel;
