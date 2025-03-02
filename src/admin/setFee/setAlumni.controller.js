import prisma from "../../middleware/prisma.js";

const setAlumniFee = async (req, res) => {
  try {
    const { academic, alumni, others } = req.body;

    if (!academic || !alumni || !others) {
      return res.status(400).json({
        message:
          "Academic year, alumni fee, other and total are required fields",
      });
    }

    const students = await prisma.student.findMany({
      where: {
        year: parseInt(academic),
      },
    });

    if (students.length === 0) {
      return res.status(404).json({
        message:
          "No students found for the provided academic year and semester",
      });
    }
    const existingAlumniEntry = await prisma.alumni.findFirst({
      where: {
        academic: parseInt(academic),
      },
    });
    if (existingAlumniEntry) {
      return res.status(400).json({
        message: `Alumni fee already set for Batch ${academic}.`,
      });
    }

    const promises = students.map(async (student) => {
      const result = await prisma.alumni.create({
        data: {
          rollno: student.rollno,
          name: student.name,
          academic: parseInt(academic),
          alumni: parseInt(alumni),
          others: parseInt(others),
        },
      });
      return result;
    });

    const alumniEntries = await Promise.all(promises);
    if (alumniEntries.length === students.length) {
      return res.status(200).json({
        message: `Alumni Fee successfully set for all students of Batch ${academic}`,
        alumniEntries,
      });
    } else {
      return res.status(501).json({
        message: `Alumni Fee successfully set for some students but not all of Batch ${academic}`,
        alumniEntries,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default setAlumniFee;
