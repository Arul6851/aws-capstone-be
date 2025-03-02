import prisma from "../middleware/prisma.js";

const moveOldRecords = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      where: {
        semester: 10,
      },
    });

    for (const student of students) {
      const { rollno } = student;

      const paidtuition = await prisma.tuition.findFirst({
        where: { rollno, paid: 1 },
      });
      const paidexam = await prisma.exam.findFirst({
        where: { rollno, paid: 1 },
      });

      if (student && paidtuition && paidexam) {
        try {
          await prisma.$transaction([
            prisma.oldstudent.create({ data: student }),
            prisma.oldtuition.create({ data: paidtuition }),
            prisma.oldexam.create({ data: paidexam }),

            prisma.student.delete({ where: { rollno } }),
            prisma.paidtuition.delete({ where: { id: paidtuition.id } }),
            prisma.paidexam.delete({ where: { id: paidexam.id } }),
          ]);
        } catch (transactionError) {
          console.error("Transaction failed:", transactionError);
          k;
          throw transactionError;
        }
      }
    }

    for (const student of students) {
      const { rollno } = student;

      const unpaidtuition = await prisma.tuition.findFirst({
        where: { rollno, paid: 0 },
      });
      const unpaidexam = await prisma.exam.findFirst({
        where: { rollno, paid: 0 },
      });

      if (student && unpaidtuition && unpaidexam) {
        try {
          await prisma.$transaction([
            prisma.oldstudent.create({ data: student }),
            prisma.oldtuition.create({ data: unpaidtuition }),
            // prisma.oldexam.create({ data: unpaidexam }),

            prisma.student.delete({ where: { rollno } }),
            prisma.paidtuition.delete({ where: { id: unpaidtuition.id } }),
            // prisma.paidexam.delete({ where: { id: unpaidexam.id } }),
          ]);
        } catch (transactionError) {
          console.error("Transaction failed:", transactionError);
          k;
          throw transactionError;
        }
      }
    }

    res.status(200).json({ message: "Records moved successfully", code: 200 });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", code: 500 });
  }
};

export default moveOldRecords;
