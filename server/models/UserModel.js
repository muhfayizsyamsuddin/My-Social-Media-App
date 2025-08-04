"use strict";

class UserModel {
  static async addUser(newUser) {
    const { name, username, email, password } = newUser;
    const user = {
      name,
      username,
      email,
      password,
    };
    await database.collection("users").insertOne(user);
    return user;
  }
}
