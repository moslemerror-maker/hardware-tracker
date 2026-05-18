const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();

const prisma = new PrismaClient();


// =======================================
// LOGIN
// =======================================

router.post("/login", async (req, res) => {

  try {

    const {
      username,
      password,
    } = req.body;


    // FIND USER
    const user = await prisma.user.findUnique({

      where: {
        username,
      },

    });

    if (!user) {

      return res.status(400).json({

        message: "Invalid username or password",

      });

    }


    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({

        message: "Invalid username or password",

      });

    }


    // GENERATE TOKEN
    const token = jwt.sign(

      {
        id: user.id,
        username: user.username,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }

    );


    // RESPONSE
    res.json({

      message: "Login successful",

      token,

      user: {

        id: user.id,

        fullName: user.fullName,

        username: user.username,

      },

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server error",

    });

  }
});


// =======================================
// CREATE USER
// =======================================

router.post("/create-user", async (req, res) => {

  try {

    const {
      fullName,
      username,
      password,
    } = req.body;


    // CHECK EXISTING USER
    const existingUser =
      await prisma.user.findUnique({

        where: {
          username,
        },

      });

    if (existingUser) {

      return res.status(400).json({

        message: "Username already exists",

      });

    }


    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);


    // CREATE USER
    const user = await prisma.user.create({

      data: {

        fullName,

        username,

        password: hashedPassword,

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


// =======================================
// CHANGE PASSWORD
// =======================================

router.put("/change-password", async (req, res) => {

  try {

    const {
      username,
      oldPassword,
      newPassword,
    } = req.body;


    // FIND USER
    const user = await prisma.user.findUnique({

      where: {
        username,
      },

    });

    if (!user) {

      return res.status(404).json({

        message: "User not found",

      });

    }


    // VERIFY OLD PASSWORD
    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({

        message: "Old password incorrect",

      });

    }


    // HASH NEW PASSWORD
    const hashedPassword =
      await bcrypt.hash(newPassword, 10);


    // UPDATE PASSWORD
    await prisma.user.update({

      where: {
        username,
      },

      data: {
        password: hashedPassword,
      },

    });


    res.json({

      message: "Password changed successfully",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server error",

    });

  }
});

module.exports = router;