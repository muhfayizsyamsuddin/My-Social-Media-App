"use strict";
const { database } = require("../config/mongodb");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const user = require("../schemas/user");

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
    return await this.collection().findOne({ _id: user.insertedId });
  }

  static async login(userLogin) {
    const { username, password } = userLogin;
    if (!username) {
      throw new Error("Username is required");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    if (password.length < 5) {
      throw new Error("Password must be at least 5 characters long");
    }
    const user = await this.collection().findOne({ username });
    if (!user) {
      throw new Error("Username not found");
    }
    if (!user.password) {
      throw new Error("Password not found");
    }
    const isValidPassword = comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }
    const access_token = signToken({ id: user._id, username: user.username });
    return access_token;
  }

  static async getAllUsers() {
    return await this.collection().find({}).toArray();
  }

  static async getUserById(id) {
    return await this.collection()
      .find({ _id: new ObjectId(id) })
      .toArray();
  }

  static async getUserByUsername(username = "") {
    if (!username) {
      throw new Error("Username is required");
    }
    return await this.collection().findOne({
      username: {
        $regex: username,
        $options: "i",
      },
    });
  }
}
module.exports = UserModel;
