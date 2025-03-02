// Import Prisma client and any other necessary modules
import prisma from "../middleware/prisma.js";
export const getFeeById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const tuitionRecord = await prisma.tuition.findUnique({
      where: {
        id,
      },
    });

    const examRecord = await prisma.exam.findUnique({
      where: {
        id,
      },
    });

    if (tuitionRecord) {
      return res.status(200).json({
        message: "Tuition record found",
        record: tuitionRecord,
      });
    } else if (examRecord) {
      return res.status(200).json({
        message: "Exam record found",
        record: examRecord,
      });
    } else {
      return res
        .status(404)
        .json({ message: "No record found with the given ID" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFeeDetails = async (req, res) => {
  try {
    const { rollno } = req.body;

    if (!rollno) {
      return res.status(400).json({ message: "Roll number is required" });
    }

    const tuitionRecords = await prisma.tuition.findMany({
      where: {
        rollno,
        enabled: 1,
      },
    });

    const examRecords = await prisma.exam.findMany({
      where: {
        rollno,
      },
    });

    const alumniRecords = await prisma.alumni.findMany({
      where: {
        rollno,
      },
    });

    const allRecords = [...tuitionRecords, ...examRecords, ...alumniRecords];

    if (allRecords.length > 0) {
      return res.status(200).json({
        message: "Following Fees are Enabled",
        records: allRecords,
      });
    } else {
      return res.status(400).json({ message: "No Fees Enabled" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default getFeeDetails;
