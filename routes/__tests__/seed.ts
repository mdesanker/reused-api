import { faker } from "@faker-js/faker";
import User, { IUser } from "../../models/User";

const users: any[] = [];

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
    email: faker.internet.email(),
    password: "$2a$10$Gul09bCyJD5IKoecO/WCPOcFONVyLTE3E9SxZMDD3gJ0OnBfFRjem", // "password" hashed
    userType: "user",
  });

  users.push(user);
};

// SEED FUNCTION
const seedDB = async () => {
  // Generate
  generateJane();
  generateJohn();
  generateUser();

  // Save to db
  for (let user of users) {
    try {
      await user.save();
    } catch (err) {
      err;
    }
  }

  // console.log(users);
  return { users };
};

export default seedDB;
