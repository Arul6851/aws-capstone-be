import prisma from "../../middleware/prisma.js";

class FetchController {
  // fetchAll = async (req, res) => {
  //   try {
  //     const newrawdetails = await prisma.$queryRaw`
  //               SELECT
  //                   student.name,
  //                   student.dept,
  //                   student.year,
  //                   student.rollno,
  //                   fee.id,
  //                   fee.name as feename,
  //                   fee.academic,
  //                   fee.tuition,
  //                   fee.exam,
  //                   fee.development,
  //                   fee.placement,
  //                   fee.revaluation,
  //                   fee.photocopy,
  //                   fee.alumni,
  //                   fee.others,
  //                   fee.total,
  //                   fee.paiddate,
  //                   fee.paid
  //               FROM
  //                   student
  //               RIGHT JOIN
  //                   fee
  //               ON
  //                   student.rollno = fee.rollno
  //           `;

  //     const oldrawdetails = await prisma.$queryRaw`
  //               SELECT
  //                   student.name,
  //                   student.dept,
  //                   student.year,
  //                   student.rollno,
  //                   oldfee.id,
  //                   oldfee.name as feename,
  //                   oldfee.academic,
  //                   oldfee.tuition,
  //                   oldfee.exam,
  //                   oldfee.development,
  //                   oldfee.placement,
  //                   oldfee.revaluation,
  //                   oldfee.photocopy,
  //                   oldfee.alumni,
  //                   oldfee.others,
  //                   oldfee.total,
  //                   oldfee.paiddate,
  //                   oldfee.paid
  //               FROM
  //                   student
  //               RIGHT JOIN
  //                   oldfee
  //               ON
  //                   student.rollno = oldfee.rollno
  //           `;

  //     const rawdetails = newrawdetails.concat(oldrawdetails);

  //     if (rawdetails) {
  //       return res.status(200).json({ details: rawdetails });
  //     } else {
  //       return res.status(204).json({ message: "No details Available" });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     return res.status(500).json({ message: "Internal Server Error" });
  //   }
  // };

  fetchStudents = async (req, res) => {
    try {
      const rawdetails = await prisma.$queryRaw`
                SELECT
                    student.name,
                    student.regno,
                    student.dept,
                    student.year,
                    student.rollno,
                    student.semester,
                    student.quota,
                    student.dob
                FROM
                    student
            `;
      if (rawdetails) {
        return res.status(200).json({ details: rawdetails });
      } else {
        return res.status(204).json({ message: "No details Available" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  fetchTuition = async (req, res) => {
    try {
      const newrawdetails = await prisma.$queryRaw`
      SELECT
          student.name,
          student.regno,
          student.dept,
          student.year,
          student.quota,
          student.semester,
          student.rollno,
          tuition.id,
          tuition.academic,
          tuition.tuition,
          tuition.development,
          tuition.placement,
          tuition.others,
          tuition.paiddate,
          tuition.paid,
          tuition.enabled
      FROM
          student
      RIGHT JOIN
          tuition
      ON
          student.rollno = tuition.rollno
  `;
      const rawdetails = newrawdetails;

      if (rawdetails) {
        return res.status(200).json({ details: rawdetails });
      } else {
        return res.status(204).json({ message: "No details Available" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  fetchExam = async (req, res) => {
    try {
      const newrawdetails = await prisma.$queryRaw`
      SELECT
          student.name,
          student.regno,
          student.dept,
          student.year,
          student.rollno,
          exam.id,
          exam.semester,
          exam.exam,
          exam.arrear,
          exam.others,
          exam.intentId,
          exam.paiddate,
          exam.paid
      FROM
          student
      RIGHT JOIN
          exam
      ON
          student.rollno = exam.rollno
  `;
      const rawdetails = newrawdetails;

      if (rawdetails) {
        return res.status(200).json({ details: rawdetails });
      } else {
        return res.status(204).json({ message: "No details Available" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  fetchAlumni = async (req, res) => {
    try {
      const newrawdetails = await prisma.$queryRaw`
      SELECT
          student.name,
          student.regno,
          student.dept,
          student.year,
          student.rollno,
          alumni.id,
          alumni.name as feename,
          alumni.alumni,
          alumni.others,
          alumni.total,
          alumni.paiddate,
          alumni.paid
      FROM
          student
      RIGHT JOIN
          alumni
      ON
          student.rollno = alumni.rollno
  `;

      const oldrawdetails = await prisma.$queryRaw`
      SELECT
          student.name,
          student.regno,
          student.dept,
          student.year,
          student.rollno,
          oldalumni.id,
          oldalumni.name as feename,
          oldalumni.alumni,
          oldalumni.others,
          oldalumni.total,
          oldalumni.paiddate,
          oldalumni.paid
      FROM
          student
      RIGHT JOIN
          oldalumni
      ON
          student.rollno = oldalumni.rollno
  `;

      const rawdetails = newrawdetails.concat(oldrawdetails);

      if (rawdetails) {
        return res.status(200).json({ details: rawdetails });
      } else {
        return res.status(204).json({ message: "No details Available" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default FetchController;
