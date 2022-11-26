const e = require("express");
const mongoConnectHandler = require("../utils/mongodb");

module.exports = {
  loginUser: async function ({ userInput }) {
    const { email, password } = userInput;
    const client = await mongoConnectHandler();
    try {
      const exisUser = await client
        .db("bookinn")
        .collection("users")
        .findOne({ email: email });
      if (!exisUser) {
        const error = new Error("Account not found for the email");
        throw error;
      } else if (exisUser.password !== password) {
        const error = new Error("Incorrect Password");
        throw error;
      } else {
        return exisUser;
      }
    } catch (err) {
      throw new Error(err);
    } finally {
      await client.close();
    }
  },
  signInUser: async function ({ userInput }) {
    const { email, password, name } = userInput;
    const client = await mongoConnectHandler();
    try {
      const existingEmail = await client
        .db("bookinn")
        .collection("users")
        .findOne({ email: email });
      if (existingEmail) {
        const error = new Error("Email already exists");
        throw error;
      }

      const insertedData = await client
        .db("bookinn")
        .collection("users")
        .insertOne({
          email: email,
          password: password,
          name: name,
        });
      return {
        _id: insertedData.insertedId,
        name: name,
        email: email,
      };
    } catch (err) {
      throw new Error(err);
    } finally {
      await client.close();
    }
  },
  getList: async function ({ page }) {
    const pageSkip = (page - 1) * 16;
    const client = await mongoConnectHandler();
    try {
      const docs = client
        .db("sample_airbnb")
        .collection("listingsAndReviews")
        .find({})
        .limit(16)
        .skip(pageSkip);
      const data = await docs.toArray();
      const result = data.map((el) => ({
        _id: el._id,
        name: el.name,
        images: el.images.picture_url,
        address: el.address.street,
        ratings: el.review_scores.review_scores_rating,
        price: String(el.price),
      }));
      return result;
    } catch (err) {
      throw new Error(err);
    } finally {
      await client.close();
    }
  },
};
