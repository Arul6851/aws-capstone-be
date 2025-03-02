import prisma from "../../middleware/prisma.js";

const enableTuitionFee = async (req, res) => {
  try {
    const { year, yearPresent } = req.body;

    if (!year || !yearPresent) {
      return res
        .status(400)
        .json({ message: "Year of Completion and Current year are required" });
    }

    const students = await prisma.student.findMany({
      where: {
        year: parseInt(year),
      },
    });

    if (students.length === 0) {
      return res.status(404).json({
        message: `No students found for year ${year}`,
      });
    }

    const promises = students.map(async (student) => {
      const tuition = await prisma.tuition.findFirst({
        where: {
          rollno: student.rollno,
          academic: parseInt(year) - (5 - parseInt(yearPresent)),
        },
      });

      if (tuition) {
        await prisma.tuition.update({
          where: { id: tuition.id },
          data: { enabled: 1 },
        });
      }
    });

    await Promise.all(promises);

    return res.status(200).json({
      message: `Enabled Tuition Fee for Year ${yearPresent} of batch ${year} successfully`,
      code: 200,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default enableTuitionFee;
