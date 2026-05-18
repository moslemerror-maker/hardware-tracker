const express = require("express");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const ExcelJS = require("exceljs");

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


// =======================================
// EXPORT TO EXCEL
// =======================================

router.get("/export/excel", authMiddleware, async (req, res) => {

  try {

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Complaints");


    // TITLE
    worksheet.mergeCells("A1:G1");

    worksheet.getCell("A1").value =
      "Hardware Complaint Tracker";

    worksheet.getCell("A1").font = {
      bold: true,
      size: 18,
    };

    worksheet.getCell("A1").alignment = {
      horizontal: "center",
    };


    // HEADER ROW
    worksheet.columns = [

      {
        header: "Date",
        key: "date",
        width: 15,
      },

      {
        header: "Department",
        key: "department",
        width: 20,
      },

      {
        header: "Description",
        key: "description",
        width: 40,
      },

      {
        header: "Priority",
        key: "priority",
        width: 15,
      },

      {
        header: "Status",
        key: "status",
        width: 15,
      },

      {
        header: "User",
        key: "user",
        width: 25,
      },

      {
        header: "Report Time",
        key: "reportTime",
        width: 15,
      },

    ];


    // FETCH DATABASE RECORDS
    const complaints = await prisma.complaint.findMany({

      include: {
        user: true,
      },

      orderBy: {
        createdAt: "desc",
      },

    });


    // INSERT ROWS
    complaints.forEach((item) => {

      worksheet.addRow({

        date: new Date(
          item.complaintDate
        ).toLocaleDateString(),

        department: item.department,

        description: item.description,

        priority: item.priority,

        status: item.status,

        user: item.user.fullName,

        reportTime: item.reportTime,

      });

    });


    // HEADER STYLING
    worksheet.getRow(2).font = {
      bold: true,
    };

    worksheet.getRow(2).fill = {

      type: "pattern",

      pattern: "solid",

      fgColor: {
        argb: "D9EAF7",
      },

    };


    // BORDER STYLING
    worksheet.eachRow((row) => {

      row.eachCell((cell) => {

        cell.border = {

          top: {
            style: "thin",
          },

          left: {
            style: "thin",
          },

          bottom: {
            style: "thin",
          },

          right: {
            style: "thin",
          },

        };

      });

    });


    // DOWNLOAD RESPONSE
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=complaints.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Excel export failed",

    });

  }
});

module.exports = router;