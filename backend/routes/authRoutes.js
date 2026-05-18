const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();


// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { username, password, fullName } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        fullName,
      },
    });

    res.json({
      message: "User created successfully",
      user,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});


// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid username",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;