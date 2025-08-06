"use strict";
const { database } = require("../config/mongodb");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const user = require("../schemas/user");
const { ObjectId } = require("mongodb");

class UserModel {
  static collection() {
    return database.collection("users");
  }
  static async register(newUser) {
    const { name, username, email, password } = newUser;
    if (!email) {
      throw new Error("Email is required");
    }
    const existingUser = await this.collection().findOne({ email });
    if (existingUser) {
      throw new Error("Email is already registered");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    if (password.length < 5) {
      throw new Error("Password must be at least 5 characters long");
    }
    if (!username) {
      throw new Error("Username is required");
    }
    const existingUsername = await this.collection().findOne({ username });
    if (existingUsername) {
      throw new Error("Username is already taken");
    }
    const user = await this.collection().insertOne({
      name,
      username,
      email,
      password: hashPassword(password),
    });
    if (!user.insertedId) {
      throw new Error("Failed to register user");
    }
    return {
      _id: user.insertedId,
      name,
      username,
      email,
      // followers: [],
      // following: [],
    };
  }

  static async login({ username, password }) {
    const user = await this.collection().findOne({ username });
    return user;
  }

  static async getUserById(id) {
    // return await this.collection().findOne({ _id: new ObjectId(id) });
    const agg = [
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followingId",
          as: "UserFollowers",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followerId",
          as: "UserFollowings",
        },
      },
      {
        $lookup: {
          from: "users",
          let: {
            followerId: {
              $map: {
                input: "$UserFollowers",
                as: "f",
                in: "$$f.followerId",
              },
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$followerId"],
                },
              },
            },
          ],
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "users",
          let: {
            followingId: {
              $map: {
                input: "$UserFollowings",
                as: "f",
                in: "$$f.followingId",
              },
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$followingId"],
                },
              },
            },
          ],
          as: "followings",
        },
      },
      {
        $project: {
          password: false,
        },
      },
    ];
    // "followerId" = user yang sedang login dan menekan tombol "Follow"
    // "followingId" = target user yang ingin dia follow
    const result = await this.collection().aggregate(agg).toArray();
    console.log("🚀 ~ UserModel ~ getUserById ~ result:", result);
    return result[0];
  }

  static async searchUsers(username = "") {
    if (!username) {
      throw new Error("Username is required");
    }
    return await this.collection()
      .find({
        username: {
          $regex: username,
          $options: "i",
        },
      })
      .toArray();
  }
}
module.exports = UserModel;
