import prisma from "../../middleware/prisma.js";
import * as crypto from "crypto";
// import stripe from "../../middleware/stripe.js";
import PaymentController from "../../payment/payment.controller.js";

const paymentController = new PaymentController();

class SingleController {
  singleUpload = async (req, res) => {
    try {
      const detail = req.body;
      if (
        detail.rollno == "" ||
        detail.name == "" ||
        detail.year == "" ||
        detail.dept == "" ||
        detail.quota == "" ||
        detail.dob == "" ||
        detail.academic == ""
      ) {
        return res.status(500).json({ message: "Please fill all the details" });
      }
      const student = await prisma.student.findFirst({
        where: {
          rollno: detail.rollno,
        },
      });
      if (student) {
        const auth = await prisma.auth.findFirst({
          where: {
            rollno: detail.rollno,
          },
        });
        if (!auth) {
          const hashPassword = crypto
            .createHash("sha512")
            .update(detail.dob)
            .digest("hex");
          const login = await prisma.auth.create({
            data: {
              rollno: detail.rollno,
              pass: hashPassword,
              type: 0,
            },
          });
          if (!login) {
            return res.status(500).json({ message: "Login Not Created" });
          }
        }
        const fee = await prisma.fee.create({
          data: {
            rollno: detail.rollno,
            name: detail.feename,
            academic: Number.parseInt(detail.academic),
            tuition: Number.parseInt(detail.tuition),
            development: Number.parseInt(detail.development),
            placement: Number.parseInt(detail.placement),
            exam: Number.parseInt(detail.exam),
            revaluation: Number.parseInt(detail.revaluation),
            photocopy: Number.parseInt(detail.photocopy),
            alumni: Number.parseInt(detail.alumni),
            others: Number.parseInt(detail.others),
            total: Number.parseInt(detail.total),
          },
        });
        if (fee && fee.total != 0) {
          // const paymentIntent = await stripe.paymentIntents.create({
          //   amount: fee.total * 100,
          //   currency: "INR",
          //   metadata: {
          //     integration_check: "accept_a_payment",
          //     feeId: fee.id,
          //     rollno: student.rollno,
          //   },
          // });
          // if (!paymentIntent) {
          //   return res.status(500).json({ message: "Payment Not Created" });
          // }
          const updateFee = await prisma.fee.update({
            where: {
              id: fee.id,
            },
            data: {
              intentId: "1",
            },
          });
          if (!updateFee) {
            return res.status(500).json({ message: "Fee Not Updated" });
          }
          return res
            .status(200)
            .json({ message: "Fee Added Successfully", updateFee });
        } else {
          if (fee.total == 0) {
            const updatedFee = await prisma.fee.update({
              where: {
                id: fee.id,
              },
              data: {
                paid: 1,
              },
            });
            if (updatedFee) {
              paymentController.generatePaySlip(student, updatedFee, "-");
              return res
                .status(200)
                .json({ message: "Fee Added Successfully", updatedFee });
            }
          }
          return res.status(500).json({ message: "Fee Not Added" });
        }
      } else {
        const login = await prisma.auth.findFirst({
          where: {
            rollno: detail.rollno,
          },
        });
        if (login) {
          const student = await prisma.student.create({
            data: {
              name: detail.name,
              year: Number.parseInt(detail.year),
              dept: detail.dept,
              rollno: detail.rollno,
              quota: detail.quota,
              dob: new Date(detail.dob),
            },
          });
          if (student) {
            const fee = await prisma.fee.create({
              data: {
                rollno: detail.rollno,
                name: detail.feename,
                academic: Number.parseInt(detail.academic),
                tuition: Number.parseInt(detail.tuition),
                development: Number.parseInt(detail.development),
                placement: Number.parseInt(detail.placement),
                exam: Number.parseInt(detail.exam),
                revaluation: Number.parseInt(detail.revaluation),
                photocopy: Number.parseInt(detail.photocopy),
                alumni: Number.parseInt(detail.alumni),
                others: Number.parseInt(detail.others),
                total: Number.parseInt(detail.total),
              },
            });
            if (fee && fee.total != 0) {
              // const paymentIntent = await stripe.paymentIntents.create({
              //   amount: fee.total * 100,
              //   currency: "INR",
              //   metadata: {
              //     integration_check: "accept_a_payment",
              //     feeId: fee.id,
              //     rollno: student.rollno,
              //   },
              // });
              // if (!paymentIntent) {
              //   return res.status(500).json({ message: "Payment Not Created" });
              // }
              const updateFee = await prisma.fee.update({
                where: {
                  id: fee.id,
                },
                data: {
                  intentId: "1",
                },
              });
              if (!updateFee) {
                return res.status(500).json({ message: "Fee Not Updated" });
              }
              return res
                .status(200)
                .json({ message: "Student Added Successfully", updateFee });
            } else {
              if (fee.total == 0) {
                const updatedFee = await prisma.fee.update({
                  where: {
                    id: fee.id,
                  },
                  data: {
                    paid: 1,
                  },
                });
                if (updatedFee) {
                  paymentController.generatePaySlip(student, updatedFee, "-");
                  return res
                    .status(200)
                    .json({ message: "Fee Added Successfully", updatedFee });
                }
              }
              return res.status(500).json({ message: "Student Not Added" });
            }
          } else {
            return res.status(500).json({ message: "Student Not Added" });
          }
        } else {
          const hashPassword = crypto
            .createHash("sha512")
            .update(detail.dob)
            .digest("hex");
          const login = await prisma.auth.create({
            data: {
              rollno: detail.rollno,
              pass: hashPassword,
              type: 0,
            },
          });
          if (!login) {
            return res.status(500).json({ message: "Login Not Created" });
          } else {
            const student = await prisma.student.create({
              data: {
                name: detail.name,
                year: Number.parseInt(detail.year),
                dept: detail.dept,
                rollno: detail.rollno,
                quota: detail.quota,
                dob: new Date(detail.dob),
              },
            });
            if (student) {
              const fee = await prisma.fee.create({
                data: {
                  rollno: detail.rollno,
                  name: detail.feename,
                  academic: Number.parseInt(detail.academic),
                  tuition: Number.parseInt(detail.tuition),
                  development: Number.parseInt(detail.development),
                  placement: Number.parseInt(detail.placement),
                  exam: Number.parseInt(detail.exam),
                  revaluation: Number.parseInt(detail.revaluation),
                  photocopy: Number.parseInt(detail.photocopy),
                  alumni: Number.parseInt(detail.alumni),
                  others: Number.parseInt(detail.others),
                  total: Number.parseInt(detail.total),
                },
              });
              if (fee && fee.total != 0) {
                // const paymentIntent = await stripe.paymentIntents.create({
                //   amount: fee.total * 100,
                //   currency: "INR",
                //   metadata: {
                //     integration_check: "accept_a_payment",
                //     feeId: fee.id,
                //     rollno: student.rollno,
                //   },
                // });
                // if (!paymentIntent) {
                //   return res
                //     .status(500)
                //     .json({ message: "Payment Not Created" });
                // }
                const updateFee = await prisma.fee.update({
                  where: {
                    id: fee.id,
                  },
                  data: {
                    // intentId: "1",
                    intentId:"1"
                  },
                });
                if (!updateFee) {
                  return res.status(500).json({ message: "Fee Not Updated" });
                }
                return res
                  .status(200)
                  .json({ message: "Student Added Successfully", fee });
              } else {
                if (fee.total == 0) {
                  const updatedFee = await prisma.fee.update({
                    where: {
                      id: fee.id,
                    },
                    data: {
                      paid: 1,
                    },
                  });
                  if (updatedFee) {
                    paymentController.generatePaySlip(student, updatedFee, "-");
                    return res
                      .status(200)
                      .json({ message: "Fee Added Successfully", updatedFee });
                  }
                }
                return res.status(500).json({ message: "Student Not Added" });
              }
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  singleTuition = async (req, res) => {
    try {
      const detail = req.body;
      if (
        detail.rollno == "" ||
        detail.name == "" ||
        detail.year == "" ||
        detail.dept == "" ||
        detail.quota == "" ||
        detail.dob == "" ||
        detail.academic == ""
      ) {
        return res.status(500).json({ message: "Please fill all the details" });
      }
      const student = await prisma.student.findFirst({
        where: {
          rollno: detail.rollno,
        },
      });
      if (student) {
        const auth = await prisma.auth.findFirst({
          where: {
            rollno: detail.rollno,
          },
        });
        if (!auth) {
          const hashPassword = crypto
            .createHash("sha512")
            .update(detail.dob)
            .digest("hex");
          const login = await prisma.auth.create({
            data: {
              rollno: detail.rollno,
              pass: hashPassword,
              type: 0,
            },
          });
          if (!login) {
            return res.status(500).json({ message: "Login Not Created" });
          }
        }
        const fee = await prisma.tuition.create({
          data: {
            rollno: detail.rollno,
            name: detail.feename,
            academic: Number.parseInt(detail.academic),
            tuition: Number.parseInt(detail.tuition),
            development: Number.parseInt(detail.development),
            placement: Number.parseInt(detail.placement),
            others: Number.parseInt(detail.others),
            total: Number.parseInt(detail.total),
          },
        });
        if (fee && fee.total != 0) {
          // const paymentIntent = await stripe.paymentIntents.create({
          //   amount: fee.total * 100,
          //   currency: "INR",
          //   metadata: {
          //     integration_check: "accept_a_payment",
          //     feeId: fee.id,
          //     rollno: student.rollno,
          //   },
          // });
          // if (!paymentIntent) {
          //   return res.status(500).json({ message: "Payment Not Created" });
          // }
          const updateFee = await prisma.tuition.update({
            where: {
              id: fee.id,
            },
            data: {
              intentId: "1",
            },
          });
          if (!updateFee) {
            return res.status(500).json({ message: "Fee Not Updated" });
          }
          return res
            .status(200)
            .json({ message: "Fee Added Successfully", updateFee });
        } else {
          if (fee.total == 0) {
            const updatedFee = await prisma.tuition.update({
              where: {
                id: fee.id,
              },
              data: {
                paid: 1,
              },
            });
            if (updatedFee) {
              paymentController.generatePaySlip(student, updatedFee, "-");
              return res
                .status(200)
                .json({ message: "Fee Added Successfully", updatedFee });
            }
          }
          return res.status(500).json({ message: "Fee Not Added" });
        }
      } else {
        const login = await prisma.auth.findFirst({
          where: {
            rollno: detail.rollno,
          },
        });
        if (login) {
          const student = await prisma.student.create({
            data: {
              name: detail.name,
              year: Number.parseInt(detail.year),
              dept: detail.dept,
              rollno: detail.rollno,
              quota: detail.quota,
              dob: new Date(detail.dob),
            },
          });
          if (student) {
            const fee = await prisma.tuition.create({
              data: {
                rollno: detail.rollno,
                name: detail.feename,
                academic: Number.parseInt(detail.academic),
                tuition: Number.parseInt(detail.tuition),
                development: Number.parseInt(detail.development),
                placement: Number.parseInt(detail.placement),
                others: Number.parseInt(detail.others),
                total: Number.parseInt(detail.total),
              },
            });
            if (fee && fee.total != 0) {
              // const paymentIntent = await stripe.paymentIntents.create({
              //   amount: fee.total * 100,
              //   currency: "INR",
              //   metadata: {
              //     integration_check: "accept_a_payment",
              //     feeId: fee.id,
              //     rollno: student.rollno,
              //   },
              // });
              // if (!paymentIntent) {
              //   return res.status(500).json({ message: "Payment Not Created" });
              // }
              const updateFee = await prisma.tuition.update({
                where: {
                  id: fee.id,
                },
                data: {
                  intentId: "1",
                },
              });
              if (!updateFee) {
                return res.status(500).json({ message: "Fee Not Updated" });
              }
              return res
                .status(200)
                .json({ message: "Student Added Successfully", updateFee });
            } else {
              if (fee.total == 0) {
                const updatedFee = await prisma.tuition.update({
                  where: {
                    id: fee.id,
                  },
                  data: {
                    paid: 1,
                  },
                });
                if (updatedFee) {
                  paymentController.generatePaySlip(student, updatedFee, "-");
                  return res
                    .status(200)
                    .json({ message: "Fee Added Successfully", updatedFee });
                }
              }
              return res.status(500).json({ message: "Student Not Added" });
            }
          } else {
            return res.status(500).json({ message: "Student Not Added" });
          }
        } else {
          const hashPassword = crypto
            .createHash("sha512")
            .update(detail.dob)
            .digest("hex");
          const login = await prisma.auth.create({
            data: {
              rollno: detail.rollno,
              pass: hashPassword,
              type: 0,
            },
          });
          if (!login) {
            return res.status(500).json({ message: "Login Not Created" });
          } else {
            const student = await prisma.student.create({
              data: {
                name: detail.name,
                year: Number.parseInt(detail.year),
                dept: detail.dept,
                rollno: detail.rollno,
                quota: detail.quota,
                dob: new Date(detail.dob),
              },
            });
            if (student) {
              const fee = await prisma.tuition.create({
                data: {
                  rollno: detail.rollno,
                  name: detail.feename,
                  academic: Number.parseInt(detail.academic),
                  tuition: Number.parseInt(detail.tuition),
                  development: Number.parseInt(detail.development),
                  placement: Number.parseInt(detail.placement),
                  others: Number.parseInt(detail.others),
                  total: Number.parseInt(detail.total),
                },
              });
              if (fee && fee.total != 0) {
                // const paymentIntent = await stripe.paymentIntents.create({
                //   amount: fee.total * 100,
                //   currency: "INR",
                //   metadata: {
                //     integration_check: "accept_a_payment",
                //     feeId: fee.id,
                //     rollno: student.rollno,
                //   },
                // });
                // if (!paymentIntent) {
                //   return res
                //     .status(500)
                //     .json({ message: "Payment Not Created" });
                // }
                const updateFee = await prisma.tuition.update({
                  where: {
                    id: fee.id,
                  },
                  data: {
                    intentId: "1",
                  },
                });
                if (!updateFee) {
                  return res.status(500).json({ message: "Fee Not Updated" });
                }
                return res
                  .status(200)
                  .json({ message: "Student Added Successfully", fee });
              } else {
                if (fee.total == 0) {
                  const updatedFee = await prisma.tuition.update({
                    where: {
                      id: fee.id,
                    },
                    data: {
                      paid: 1,
                    },
                  });
                  if (updatedFee) {
                    paymentController.generatePaySlip(student, updatedFee, "-");
                    return res
                      .status(200)
                      .json({ message: "Fee Added Successfully", updatedFee });
                  }
                }
                return res.status(500).json({ message: "Student Not Added" });
              }
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  singleExam = async (req, res) => {
    try {
      const detail = req.body;
      if (
        detail.rollno == "" ||
        detail.name == "" ||
        detail.year == "" ||
        detail.dept == "" ||
        detail.quota == "" ||
        detail.dob == "" ||
        detail.academic == ""
      ) {
        return res.status(500).json({ message: "Please fill all the details" });
      }
      const student = await prisma.student.findFirst({
        where: {
          rollno: detail.rollno,
        },
      });
      if (student) {
        const auth = await prisma.auth.findFirst({
          where: {
            rollno: detail.rollno,
          },
        });
        if (!auth) {
          const hashPassword = crypto
            .createHash("sha512")
            .update(detail.dob)
            .digest("hex");
          const login = await prisma.auth.create({
            data: {
              rollno: detail.rollno,
              pass: hashPassword,
              type: 0,
            },
          });
          if (!login) {
            return res.status(500).json({ message: "Login Not Created" });
          }
        }
        const fee = await prisma.exam.create({
          data: {
            rollno: detail.rollno,
            name: detail.feename,
            academic: Number.parseInt(detail.academic),
            exam: Number.parseInt(detail.exam),
            revaluation: Number.parseInt(detail.revaluation),
            photocopy: Number.parseInt(detail.photocopy),
            others: Number.parseInt(detail.others),
            total: Number.parseInt(detail.total),
          },
        });
        if (fee && fee.total != 0) {
          // const paymentIntent = await stripe.paymentIntents.create({
          //   amount: fee.total * 100,
          //   currency: "INR",
          //   metadata: {
          //     integration_check: "accept_a_payment",
          //     feeId: fee.id,
          //     rollno: student.rollno,
          //   },
          // });
          // if (!paymentIntent) {
          //   return res.status(500).json({ message: "Payment Not Created" });
          // }
          const updateFee = await prisma.exam.update({
            where: {
              id: fee.id,
            },
            data: {
              intentId: "1",
            },
          });
          if (!updateFee) {
            return res.status(500).json({ message: "Fee Not Updated" });
          }
          return res
            .status(200)
            .json({ message: "Fee Added Successfully", updateFee });
        } else {
          if (fee.total == 0) {
            const updatedFee = await prisma.exam.update({
              where: {
                id: fee.id,
              },
              data: {
                paid: 1,
              },
            });
            if (updatedFee) {
              paymentController.generatePaySlip(student, updatedFee, "-");
              return res
                .status(200)
                .json({ message: "Fee Added Successfully", updatedFee });
            }
          }
          return res.status(500).json({ message: "Fee Not Added" });
        }
      } else {
        const login = await prisma.auth.findFirst({
          where: {
            rollno: detail.rollno,
          },
        });
        if (login) {
          const student = await prisma.student.create({
            data: {
              name: detail.name,
              year: Number.parseInt(detail.year),
              dept: detail.dept,
              rollno: detail.rollno,
              quota: detail.quota,
              dob: new Date(detail.dob),
            },
          });
          if (student) {
            const fee = await prisma.exam.create({
              data: {
                rollno: detail.rollno,
                name: detail.feename,
                academic: Number.parseInt(detail.academic),
                exam: Number.parseInt(detail.exam),
                revaluation: Number.parseInt(detail.revaluation),
                photocopy: Number.parseInt(detail.photocopy),
                others: Number.parseInt(detail.others),
                total: Number.parseInt(detail.total),
              },
            });
            if (fee && fee.total != 0) {
              // const paymentIntent = await stripe.paymentIntents.create({
              //   amount: fee.total * 100,
              //   currency: "INR",
              //   metadata: {
              //     integration_check: "accept_a_payment",
              //     feeId: fee.id,
              //     rollno: student.rollno,
              //   },
              // });
              // if (!paymentIntent) {
              //   return res.status(500).json({ message: "Payment Not Created" });
              // }
              const updateFee = await prisma.exam.update({
                where: {
                  id: fee.id,
                },
                data: {
                  intentId: "1",
                },
              });
              if (!updateFee) {
                return res.status(500).json({ message: "Fee Not Updated" });
              }
              return res
                .status(200)
                .json({ message: "Student Added Successfully", updateFee });
            } else {
              if (fee.total == 0) {
                const updatedFee = await prisma.exam.update({
                  where: {
                    id: fee.id,
                  },
                  data: {
                    paid: 1,
                  },
                });
                if (updatedFee) {
                  paymentController.generatePaySlip(student, updatedFee, "-");
                  return res
                    .status(200)
                    .json({ message: "Fee Added Successfully", updatedFee });
                }
              }
              return res.status(500).json({ message: "Student Not Added" });
            }
          } else {
            return res.status(500).json({ message: "Student Not Added" });
          }
        } else {
          const hashPassword = crypto
            .createHash("sha512")
            .update(detail.dob)
            .digest("hex");
          const login = await prisma.auth.create({
            data: {
              rollno: detail.rollno,
              pass: hashPassword,
              type: 0,
            },
          });
          if (!login) {
            return res.status(500).json({ message: "Login Not Created" });
          } else {
            const student = await prisma.student.create({
              data: {
                name: detail.name,
                year: Number.parseInt(detail.year),
                dept: detail.dept,
                rollno: detail.rollno,
                quota: detail.quota,
                dob: new Date(detail.dob),
              },
            });
            if (student) {
              const fee = await prisma.exam.create({
                data: {
                  rollno: detail.rollno,
                  name: detail.feename,
                  academic: Number.parseInt(detail.academic),
                  exam: Number.parseInt(detail.exam),
                  revaluation: Number.parseInt(detail.revaluation),
                  photocopy: Number.parseInt(detail.photocopy),
                  others: Number.parseInt(detail.others),
                  total: Number.parseInt(detail.total),
                },
              });
              if (fee && fee.total != 0) {
                // const paymentIntent = await stripe.paymentIntents.create({
                //   amount: fee.total * 100,
                //   currency: "INR",
                //   metadata: {
                //     integration_check: "accept_a_payment",
                //     feeId: fee.id,
                //     rollno: student.rollno,
                //   },
                // });
                // if (!paymentIntent) {
                //   return res
                //     .status(500)
                //     .json({ message: "Payment Not Created" });
                // }
                const updateFee = await prisma.exam.update({
                  where: {
                    id: fee.id,
                  },
                  data: {
                    intentId: "1",
                  },
                });
                if (!updateFee) {
                  return res.status(500).json({ message: "Fee Not Updated" });
                }
                return res
                  .status(200)
                  .json({ message: "Student Added Successfully", fee });
              } else {
                if (fee.total == 0) {
                  const updatedFee = await prisma.exam.update({
                    where: {
                      id: fee.id,
                    },
                    data: {
                      paid: 1,
                    },
                  });
                  if (updatedFee) {
                    paymentController.generatePaySlip(student, updatedFee, "-");
                    return res
                      .status(200)
                      .json({ message: "Fee Added Successfully", updatedFee });
                  }
                }
                return res.status(500).json({ message: "Student Not Added" });
              }
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  singleAlumni = async (req, res) => {
    try {
      const detail = req.body;
      if (
        detail.rollno == "" ||
        detail.name == "" ||
        detail.year == "" ||
        detail.dept == "" ||
        detail.quota == "" ||
        detail.dob == "" ||
        detail.academic == ""
      ) {
        return res.status(500).json({ message: "Please fill all the details" });
      }
      const student = await prisma.student.findFirst({
        where: {
          rollno: detail.rollno,
        },
      });
      if (student) {
        const auth = await prisma.auth.findFirst({
          where: {
            rollno: detail.rollno,
          },
        });
        if (!auth) {
          const hashPassword = crypto
            .createHash("sha512")
            .update(detail.dob)
            .digest("hex");
          const login = await prisma.auth.create({
            data: {
              rollno: detail.rollno,
              pass: hashPassword,
              type: 0,
            },
          });
          if (!login) {
            return res.status(500).json({ message: "Login Not Created" });
          }
        }
        const fee = await prisma.alumni.create({
          data: {
            rollno: detail.rollno,
            name: detail.feename,
            academic: Number.parseInt(detail.academic),
            alumni: Number.parseInt(detail.alumni),
            others: Number.parseInt(detail.others),
            total: Number.parseInt(detail.total),
          },
        });
        if (fee && fee.total != 0) {
          // const paymentIntent = await stripe.paymentIntents.create({
          //   amount: fee.total * 100,
          //   currency: "INR",
          //   metadata: {
          //     integration_check: "accept_a_payment",
          //     feeId: fee.id,
          //     rollno: student.rollno,
          //   },
          // });
          // if (!paymentIntent) {
          //   return res.status(500).json({ message: "Payment Not Created" });
          // }
          const updateFee = await prisma.alumni.update({
            where: {
              id: fee.id,
            },
            data: {
              intentId: "1",
            },
          });
          if (!updateFee) {
            return res.status(500).json({ message: "Fee Not Updated" });
          }
          return res
            .status(200)
            .json({ message: "Fee Added Successfully", updateFee });
        } else {
          if (fee.total == 0) {
            const updatedFee = await prisma.alumni.update({
              where: {
                id: fee.id,
              },
              data: {
                paid: 1,
              },
            });
            if (updatedFee) {
              paymentController.generatePaySlip(student, updatedFee, "-");
              return res
                .status(200)
                .json({ message: "Fee Added Successfully", updatedFee });
            }
          }
          return res.status(500).json({ message: "Fee Not Added" });
        }
      } else {
        const login = await prisma.auth.findFirst({
          where: {
            rollno: detail.rollno,
          },
        });
        if (login) {
          const student = await prisma.student.create({
            data: {
              name: detail.name,
              year: Number.parseInt(detail.year),
              dept: detail.dept,
              rollno: detail.rollno,
              quota: detail.quota,
              dob: new Date(detail.dob),
            },
          });
          if (student) {
            const fee = await prisma.alumni.create({
              data: {
                rollno: detail.rollno,
                name: detail.feename,
                academic: Number.parseInt(detail.academic),
                alumni: Number.parseInt(detail.alumni),
                others: Number.parseInt(detail.others),
                total: Number.parseInt(detail.total),
              },
            });
            if (fee && fee.total != 0) {
              // const paymentIntent = await stripe.paymentIntents.create({
              //   amount: fee.total * 100,
              //   currency: "INR",
              //   metadata: {
              //     integration_check: "accept_a_payment",
              //     feeId: fee.id,
              //     rollno: student.rollno,
              //   },
              // });
              // if (!paymentIntent) {
              //   return res
              //     .status(500)
              //     .json({ message: "Payment Not Created" });
              // }
              const updateFee = await prisma.alumni.update({
                where: {
                  id: fee.id,
                },
                data: {
                  intentId: "1",
                },
              });
              if (!updateFee) {
                return res.status(500).json({ message: "Fee Not Updated" });
              }
              return res
                .status(200)
                .json({ message: "Student Added Successfully", updateFee });
            } else {
              if (fee.total == 0) {
                const updatedFee = await prisma.alumni.update({
                  where: {
                    id: fee.id,
                  },
                  data: {
                    paid: 1,
                  },
                });
                if (updatedFee) {
                  paymentController.generatePaySlip(student, updatedFee, "-");
                  return res
                    .status(200)
                    .json({ message: "Fee Added Successfully", updatedFee });
                }
              }
              return res.status(500).json({ message: "Student Not Added" });
            } 
          } else {
            return res.status(500).json({ message: "Student Not Added" });
          } 
        } else {
          const hashPassword = crypto
            .createHash("sha512")
            .update(detail.dob)
            .digest("hex");
          const login = await prisma.auth.create({
            data: {
              rollno: detail.rollno,
              pass: hashPassword,
              type: 0,
            },
          });
          if (!login) {
            return res.status(500).json({ message: "Login Not Created" });
          } else {
            const student = await prisma.student.create({
              data: {
                name: detail.name,
                year: Number.parseInt(detail.year),
                dept: detail.dept,
                rollno: detail.rollno,
                quota: detail.quota,
                dob: new Date(detail.dob),
              },
            });
            if (student) {
              const fee = await prisma.alumni.create({
                data: {
                  rollno: detail.rollno,
                  name: detail.feename,
                  academic: Number.parseInt(detail.academic),
                  alumni: Number.parseInt(detail.alumni),
                  others: Number.parseInt(detail.others),
                  total: Number.parseInt(detail.total),
                },
              });
              if (fee && fee.total != 0) {
                // const paymentIntent = await stripe.paymentIntents.create({
                //   amount: fee.total * 100,
                //   currency: "INR",
                //   metadata: {
                //     integration_check: "accept_a_payment",
                //     feeId: fee.id,
                //     rollno: student.rollno,
                //   },
                // });
                // if (!paymentIntent) {
                //   return res
                //     .status(500)
                //     .json({ message: "Payment Not Created" });
                // }
                const updateFee = await prisma.alumni.update({
                  where: {
                    id: fee.id,
                  },
                  data: {
                    intentId: "1",
                  },
                });
                if (!updateFee) {
                  return res.status(500).json({ message: "Fee Not Updated" });
                }
                return res
                  .status(200)
                  .json({ message: "Student Added Successfully", fee });
              } else {
                if (fee.total == 0) {
                  const updatedFee = await prisma.alumni.update({
                    where: {
                      id: fee.id,
                    },
                    data: {
                      paid: 1,
                    },
                  });
                  if (updatedFee) {
                    paymentController.generatePaySlip(student, updatedFee, "-");
                    return res
                      .status(200)
                      .json({ message: "Fee Added Successfully", updatedFee });
                  }
                }
                return res.status(500).json({ message: "Student Not Added" });
              } 
            } 
          } 
        } 
      }
    }
    catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default SingleController;
