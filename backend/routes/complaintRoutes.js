const express = require("express");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();

const prisma = new PrismaClient();


// =======================================
// AUTH MIDDLEWARE
// =======================================

const authMiddleware = (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {

    return res.status(401).json({
      message: "No token provided",
    });

  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid token",
    });

  }
};


// =======================================
// CREATE COMPLAINT
// =======================================

router.post("/", authMiddleware, async (req, res) => {

  try {

    const {
      department,
      description,
      reportTime,
      complaintDate,
      priority,
    } = req.body;

    const complaint = await prisma.complaint.create({

      data: {

        complaintDate: new Date(complaintDate),

        department,

        description,

        reportTime,

        priority,

        status: "Pending",

        userId: req.user.id,

      },

    });

    res.json({

      message: "Complaint created successfully",

      complaint,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server error",

    });

  }
});


// =======================================
// GET ALL COMPLAINTS
// =======================================

router.get("/", authMiddleware, async (req, res) => {

  try {

    const complaints = await prisma.complaint.findMany({

      include: {
        user: true,
      },

      orderBy: {
        createdAt: "desc",
      },

    });

    res.json(complaints);

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server error",

    });

  }
});


// =======================================
// UPDATE STATUS
// =======================================

router.put("/:id/status", authMiddleware, async (req, res) => {

  try {

    const { status } = req.body;

    const complaint = await prisma.complaint.update({

      where: {
        id: Number(req.params.id),
      },

      data: {
        status,
      },

    });

    res.json({

      message: "Status updated",

      complaint,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server error",

    });

  }
});


// =======================================
// DELETE COMPLAINT
// =======================================

router.delete("/:id", authMiddleware, async (req, res) => {

  try {

    await prisma.complaint.delete({

      where: {
        id: Number(req.params.id),
      },

    });

    res.json({

      message: "Complaint deleted successfully",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server error",

    });

  }
});


// =======================================
// UPDATE FULL COMPLAINT
// =======================================

router.put("/:id", authMiddleware, async (req, res) => {

  try {

    const {
      department,
      description,
      reportTime,
      complaintDate,
      priority,
      status,
    } = req.body;

    const complaint = await prisma.complaint.update({

      where: {
        id: Number(req.params.id),
      },

      data: {

        complaintDate: new Date(complaintDate),

        department,

        description,

        reportTime,

        priority,

        status,

      },

    });

    res.json({

      message: "Complaint updated successfully",

      complaint,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server error",

    });

  }
});

module.exports = router;