import prisma from "../../middleware/prisma.js";
const updateStudentSemester = async (req, res) => {
  try {
    const { year, semester } = req.body;

    if (!year || !semester) {
      return res
        .status(400)
        .json({ message: "Year and semester are required parameters" });
    }

    const updatedStudents = await prisma.student.updateMany({
      where: {
        year: parseInt(year),
      },
      data: {
        semester: parseInt(semester),
      },
    });

    if (updatedStudents.count > 0) {
      return res.status(200).json({
        message: `Semester updated successfully for ${updatedStudents.count} students with year ${year}`,
      });
    } else {
      return res.status(404).json({
        message: `No students found with year ${year}`,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default updateStudentSemester;
