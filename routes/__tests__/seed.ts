import { faker } from "@faker-js/faker";
import User, { IUser } from "../../models/User";
import Category, { ICategory } from "../../models/Category";

const users: any[] = [];
const categories: any[] = [];

// USERS
const generateJane = () => {
  const user = new User<IUser>({
    _id: "620ab20b2dffe3ba60353a22",
    username: "jsmith",
    email: "jane@gmail.com",
    password: "$2a$10$dexhl0xuphcSioluvPGFk.FsLMe3uhhy/AjKCYeeBnaXRDfXrumZ.", // "password" hashed
    userType: "admin",
  });

  users.push(user);
};

const generateJohn = () => {
  const user = new User<IUser>({
    _id: "620ab20b2dffe3ba60353a23",
    username: "jdoe",
    email: "john@gmail.com",
    password: "$2a$10$Gul09bCyJD5IKoecO/WCPOcFONVyLTE3E9SxZMDD3gJ0OnBfFRjem", // "password" hashed
    userType: "user",
  });

  users.push(user);
};

const generateUser = () => {
  const user = new User<IUser>({
    _id: "620ab20b2dffe3ba60353a99",
    username: faker.internet.userName(),
    email: "email@gmail.com",
    password: "$2a$10$Gul09bCyJD5IKoecO/WCPOcFONVyLTE3E9SxZMDD3gJ0OnBfFRjem", // "password" hashed
    userType: "user",
  });

  users.push(user);
};

// CATEGORIES
const generateElectronics = () => {
  const category = new Category<ICategory>({
    _id: "620b90e0c2b6e006dde0cb41",
    name: "Electronics",
    description: "Electrons go brrr",
  });

  categories.push(category);
};

const generateApparel = () => {
  const category = new Category<ICategory>({
    _id: "620b90e0c2b6e006dde0cb42",
    name: "Apparel",
    description: faker.commerce.productDescription(),
  });

  categories.push(category);
};

// SEED FUNCTION
const seedDB = async () => {
  // Generate
  generateJane();
  generateJohn();
  generateUser();

  generateElectronics();
  generateApparel();

  // Save to db
  for (let user of users) {
    try {
      await user.save();
    } catch (err) {
      err;
    }
  }

  for (let category of categories) {
    try {
      await category.save();
    } catch (err) {
      err;
    }
  }

  // console.log(users);
  // console.log(categories);
  return { users };
};

export default seedDB;
