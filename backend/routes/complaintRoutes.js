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
      respondTime,
      complaintDate,
      priority,
    } = req.body;


    // ===================================
    // CALCULATE INTERVAL
    // ===================================

    let intervalMinute = null;

    if (reportTime && respondTime) {

      const report = new Date(
        `2000-01-01T${reportTime}`
      );

      const respond = new Date(
        `2000-01-01T${respondTime}`
      );

      const diffMs = respond - report;

      const totalMinutes = Math.floor(
        diffMs / 60000
      );

      const hours = String(
        Math.floor(totalMinutes / 60)
      ).padStart(2, "0");

      const minutes = String(
        totalMinutes % 60
      ).padStart(2, "0");

      intervalMinute = `${hours}:${minutes}`;
    }


    // ===================================
    // CREATE DATABASE ENTRY
    // ===================================

    const complaint = await prisma.complaint.create({

      data: {

        complaintDate: new Date(complaintDate),

        department,

        description,

        reportTime,

        respondTime,

        intervalMinute,

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
// UPDATE STATUS + RESPOND TIME
// =======================================

router.put("/:id/status", authMiddleware, async (req, res) => {

  try {

    const {
      status,
      respondTime,
    } = req.body;


    // ===================================
    // GET EXISTING COMPLAINT
    // ===================================

    const existingComplaint =
      await prisma.complaint.findUnique({

        where: {
          id: Number(req.params.id),
        },

      });


    // ===================================
    // CALCULATE INTERVAL
    // ===================================

    let intervalMinute = null;

    if (
      existingComplaint.reportTime &&
      respondTime
    ) {

      const report = new Date(
        `2000-01-01T${existingComplaint.reportTime}`
      );

      const respond = new Date(
        `2000-01-01T${respondTime}`
      );

      const diffMs = respond - report;

      const totalMinutes = Math.floor(
        diffMs / 60000
      );

      const hours = String(
        Math.floor(totalMinutes / 60)
      ).padStart(2, "0");

      const minutes = String(
        totalMinutes % 60
      ).padStart(2, "0");

      intervalMinute = `${hours}:${minutes}`;
    }


    // ===================================
    // UPDATE DATABASE
    // ===================================

    const complaint = await prisma.complaint.update({

      where: {
        id: Number(req.params.id),
      },

      data: {

        status,

        respondTime,

        intervalMinute,

      },

    });

    res.json({

      message: "Complaint completed",

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
      respondTime,
      complaintDate,
      priority,
      status,
    } = req.body;


    // ===================================
    // RECALCULATE INTERVAL
    // ===================================

    let intervalMinute = null;

    if (reportTime && respondTime) {

      const report = new Date(
        `2000-01-01T${reportTime}`
      );

      const respond = new Date(
        `2000-01-01T${respondTime}`
      );

      const diffMs = respond - report;

      const totalMinutes = Math.floor(
        diffMs / 60000
      );

      const hours = String(
        Math.floor(totalMinutes / 60)
      ).padStart(2, "0");

      const minutes = String(
        totalMinutes % 60
      ).padStart(2, "0");

      intervalMinute = `${hours}:${minutes}`;
    }


    // ===================================
    // UPDATE DATABASE ENTRY
    // ===================================

    const complaint = await prisma.complaint.update({

      where: {
        id: Number(req.params.id),
      },

      data: {

        complaintDate: new Date(complaintDate),

        department,

        description,

        reportTime,

        respondTime,

        intervalMinute,

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


    // =====================================
    // TITLE
    // =====================================

    worksheet.mergeCells("A1:I1");

    const titleCell = worksheet.getCell("A1");

    titleCell.value = "Hardware Complaint Tracker";

    titleCell.font = {
      bold: true,
      size: 20,
    };

    titleCell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    worksheet.getRow(1).height = 30;


    // =====================================
    // COLUMN HEADINGS
    // =====================================

    worksheet.getRow(2).values = [

      "Date",
      "Department",
      "Description",
      "Priority",
      "Status",
      "User",
      "Report Time",
      "Respond Time",
      "Interval",

    ];

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


    // =====================================
    // COLUMN WIDTHS
    // =====================================

    worksheet.columns = [

      { key: "date", width: 15 },

      { key: "department", width: 20 },

      { key: "description", width: 40 },

      { key: "priority", width: 15 },

      { key: "status", width: 15 },

      { key: "user", width: 25 },

      { key: "reportTime", width: 15 },

      { key: "respondTime", width: 15 },

      { key: "intervalMinute", width: 15 },

    ];


    // =====================================
    // FETCH DATABASE RECORDS
    // =====================================

    const complaints = await prisma.complaint.findMany({

      include: {
        user: true,
      },

      orderBy: {
        createdAt: "desc",
      },

    });


    // =====================================
    // INSERT ROWS
    // =====================================

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

        reportTime: item.reportTime || "",

        respondTime: item.respondTime || "",

        intervalMinute: item.intervalMinute || "",

      });

    });


    // =====================================
    // BORDER STYLING
    // =====================================

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


    // =====================================
    // ALIGNMENT
    // =====================================

    worksheet.eachRow((row) => {

      row.eachCell((cell) => {

        cell.alignment = {
          vertical: "middle",
          horizontal: "left",
          wrapText: true,
        };

      });

    });


    // =====================================
    // DOWNLOAD RESPONSE
    // =====================================

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