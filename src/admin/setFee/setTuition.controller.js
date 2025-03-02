import prisma from "../../middleware/prisma.js";

class SetTuitionFee {
  setTuitionFee = async (req, res) => {
    try {
      const { academic, tuition, placement, development, quota, others } =
        req.body;
      console.log(req.body);
      if (
        !academic ||
        !tuition ||
        !placement ||
        !development ||
        !quota ||
        !others
      ) {
        return res.status(400).json({
          message:
            "Year of completion, tuition fee, placement fee, development fee, quota, and other fees are required fields",
        });
      }

      const students = await prisma.student.findMany({
        where: {
          year: parseInt(academic),
          quota,
        },
      });

      if (students.length === 0) {
        return res.status(404).json({
          message: "No students found for the provided academic year and quota",
        });
      }

      const promises = students.map(async (student) => {
        const tuitionEntries = [];
        for (let i = 1; i <= 4; i++) {
          const existingTuitionEntry = await prisma.tuition.findFirst({
            where: {
              rollno: student.rollno,
              academic: parseInt(academic) - i,
            },
          });

          if (existingTuitionEntry) {
            console.log(
              `Tuition entry already exists for student ${
                student.rollno
              } in academic year ${parseInt(academic) - i}`
            );
            continue;
          }

          const result = await prisma.tuition.create({
            data: {
              rollno: student.rollno,
              academic: parseInt(academic) - i,
              tuition: parseInt(tuition),
              placement: parseInt(placement),
              development: parseInt(development),
              others: parseInt(others),
            },
          });
          tuitionEntries.push(result);
        }
        return tuitionEntries;
      });

      const tuitionEntries = await Promise.all(promises);

      if (tuitionEntries.flat().length === 0) {
        return res.status(400).json({
          message: `Tuition fee already set for the of Batch ${academic} for all 4 years`,
        });
      }

      if (tuitionEntries.length === students.length) {
        return res.status(200).json({
          message: `Tuition Fee successfully set for all students for all 4 years of Batch ${academic}`,
          tuitionEntries,
        });
      } else {
        return res.status(501).json({
          message: `Tuition Fee successfully set for some students but not all of Batch ${academic}`,
          tuitionEntries,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  setScholarshipFee = async (req, res) => {
    try {
      const { rollNo, tuition, placement, development, others } = req.body;

      if (!rollNo || !tuition || !placement || !development || !others) {
        return res.status(400).json({
          message:
            "Roll number, tuition fee, placement fee, development fee, and others are required fields",
        });
      }

      const student = await prisma.student.findUnique({
        where: {
          rollno: rollNo,
        },
      });

      if (!student) {
        return res.status(404).json({
          message: "Student not found with the provided roll number",
        });
      }

      const tuitionRecords = await prisma.tuition.findMany({
        where: {
          rollno: rollNo,
        },
      });

      if (!tuitionRecords || tuitionRecords.length === 0) {
        return res.status(404).json({
          message: "Tuition records not found for the provided roll number",
        });
      }

      const updatedTuitions = [];
      for (const tuitionRecord of tuitionRecords) {
        const updatedTuition = await prisma.tuition.update({
          where: {
            id: tuitionRecord.id,
          },
          data: {
            tuition: parseInt(tuition),
            placement: parseInt(placement),
            development: parseInt(development),
            others: parseInt(others),
          },
        });
        updatedTuitions.push(updatedTuition);
      }

      if (updatedTuitions.length === 0) {
        return res.status(400).json({
          message: "No tuition records were updated",
        });
      }

      return res.status(200).json({
        message: "Tuition Fee updated successfully",
        updatedTuitions,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default SetTuitionFee;
