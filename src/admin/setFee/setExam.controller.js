import prisma from "../../middleware/prisma.js";

const setExamFee = async (req, res) => {
  try {
    const { dept, semester, exam, others } = req.body;

    if (!dept || !semester || !exam || !others) {
      return res.status(400).json({
        message:
          "Academic year, semester, alumni fee, other and total are required fields",
      });
    }

    const students = await prisma.student.findMany({
      where: {
        dept,
        semester: parseInt(semester),
      },
    });
    if (students.length === 0) {
      return res.status(404).json({
        message: "No students found for the provided department and semester",
      });
    }

    const existingExamEntry = await prisma.exam.findFirst({
      where: {
        rollno: students[0].rollno,
      },
    });

    if (existingExamEntry) {
      return res.status(400).json({
        message: `Exam fee already set for ${dept} in ${semester}th Semester.`,
      });
    }

    const promises = students.map(async (student) => {
      const result = await prisma.exam.create({
        data: {
          rollno: student.rollno,
          semester: parseInt(semester),
          exam: parseInt(exam),
          others: parseInt(others),
        },
      });
      return result;
    });

    const examEntries = await Promise.all(promises);

    if (examEntries.length === students.length) {
      return res.status(200).json({
        message: `Exam Fee successfully set for all students of ${dept} Department in ${semester}th Semester`,
        examEntries,
      });
    } else {
      return res.status(501).json({
        message: `Exam Fee successfully set for some students but not all of ${dept} Department in ${semester}th Semester`,
        examEntries,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default setExamFee;
