import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  //db operations
  const { username, email, password } = req.body;

  try {
    // first hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // here 10 represents 10 time hash
    // console.log(hashedPassword);

    // create new user to db
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log(newUser);

    res.status(201).json({
      message: "User Created Sucessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to create user",
    });
  }
  console.log(req.body);
};

export const login = async (req, res) => {
  //db operations
  const { email, password } = req.body;

  try {
    // check both filed are avilable
    if (!email || !password) {
      return res.status(400).json({
        message: "Both fields are required!",
      });
    }
    // check user exist or not
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials!",
      });
    }

    // check password correct hai ya nhi

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Wrong Password!",
      });
    }

    // sb sahi hai to cookie token generate and send to user
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id:user.id,
        isAdmin: false,
      }, process.env.JWT_SECRET_KEY,{expiresIn: age}
      );

      const {password: userPassword, ...userInfo} = user; // use for securing password
    res
      .cookie("token", token, {
        httpOnly: true,
        // secure:true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to login!",
    });
  }
};
export const logout = async (req, res) => {
  //db operations
  res.clearCookie("token").status(200).json({ 
    message: "Logout Successful" 
  });
};
