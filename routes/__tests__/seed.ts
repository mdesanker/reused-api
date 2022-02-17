import { faker } from "@faker-js/faker";
import User, { IUser } from "../../models/User";
import Category, { ICategory } from "../../models/Category";
import Product, { IProduct } from "../../models/Product";
import Cart, { ICart } from "../../models/Cart";
import { Types } from "mongoose";

const users: any[] = [];
const categories: any[] = [];
const products: any[] = [];
const carts: any[] = [];

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

// PRODUCTS
const generateJaneElectronicsProduct = () => {
  const product = new Product<IProduct>({
    _id: "620c1d93a23cda22fcda0569",
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    condition: "good",
    category: new Types.ObjectId("620b90e0c2b6e006dde0cb41"), // Electronics
    images: [faker.image.imageUrl()],
    owner: new Types.ObjectId("620ab20b2dffe3ba60353a22"), // Jane
  });

  products.push(product);
};

const generateJaneApparelProduct = () => {
  const product = new Product<IProduct>({
    _id: "620c1d93a23cda22fcda0570",
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    condition: "good",
    category: new Types.ObjectId("620b90e0c2b6e006dde0cb42"), // Apparel
    images: [faker.image.imageUrl()],
    owner: new Types.ObjectId("620ab20b2dffe3ba60353a22"), // Jane
  });

  products.push(product);
};

const generateJohnProduct = () => {
  const product = new Product<IProduct>({
    _id: "620c1d93a23cda22fcda0571",
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    condition: "good",
    category: new Types.ObjectId("620b90e0c2b6e006dde0cb41"), // Electronics
    images: [faker.image.imageUrl()],
    owner: new Types.ObjectId("620ab20b2dffe3ba60353a23"), // John
  });

  products.push(product);
};

const generateSecondJohnProduct = () => {
  const product = new Product<IProduct>({
    _id: "620c1d93a23cda22fcda0572",
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    condition: "excellent",
    category: new Types.ObjectId("620b90e0c2b6e006dde0cb42"), // Apparel
    images: [faker.image.imageUrl()],
    owner: new Types.ObjectId("620ab20b2dffe3ba60353a23"), // John
  });

  products.push(product);
};

const generateRandomProduct = () => {
  const product = new Product<IProduct>({
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    condition: "good",
    category: new Types.ObjectId("620b90e0c2b6e006dde0cb41"), // Electronics
    images: [faker.image.imageUrl()],
    owner: new Types.ObjectId("620ab20b2dffe3ba60353a23"), // John
  });

  products.push(product);
};

// CARTS
const generateCart = () => {
  const cart = new Cart<ICart>({
    _id: "620e1a4b2dc4a3341164625a",
    products: [
      { product: new Types.ObjectId("620c1d93a23cda22fcda0569"), quantity: 1 },
    ],
  });

  carts.push(cart);
};

const generateJohnCart = () => {
  const cart = new Cart<ICart>({
    _id: "620e1a4b2dc4a3341164625c",
    user: new Types.ObjectId("620ab20b2dffe3ba60353a23"),
    products: [
      { product: new Types.ObjectId("620c1d93a23cda22fcda0569"), quantity: 1 },
      { product: new Types.ObjectId("620c1d93a23cda22fcda0570"), quantity: 1 },
    ],
  });

  carts.push(cart);
};

// SEED FUNCTION
const seedDB = async () => {
  // Generate
  generateJane();
  generateJohn();
  generateUser();

  generateElectronics();
  generateApparel();

  generateJaneElectronicsProduct();
  generateJaneApparelProduct();
  generateJohnProduct();
  generateSecondJohnProduct();

  generateCart();
  generateJohnCart();

  for (let i = 0; i < 3; i++) {
    generateRandomProduct();
  }

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

  for (let product of products) {
    try {
      await product.save();
    } catch (err) {
      err;
    }
  }

  for (let cart of carts) {
    try {
      await cart.save();
    } catch (err) {
      err;
    }
  }

  // console.log(users);
  // console.log(categories);
  // console.log(products);
  // console.log(carts);
  return { users };
};

export default seedDB;
