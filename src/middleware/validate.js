import prisma from "./prisma.js";

const validateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      const validToken = await prisma.auth.findFirst({
        where: {
          token: token?.split(" ")[1],
        },
      });
      if (validToken) {
        if (validToken.type === 0) {
          res.locals.user = validToken;
          next();
        } else {
          return res.status(401).json({ message: "Not a Student User" });
        }
      } else {
        return res.status(401).json({ message: "User Token is invalid" });
      }
    } else {
      return res.status(401).json({ message: "Please log in again" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const validateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      const validToken = await prisma.auth.findFirst({
        where: {
          token: token.split(" ")[1],
        },
      });
      if (validToken) {
        if (validToken.type === 1) {
          res.locals.user = validToken;
          next();
        } else {
          return res.status(401).json({ message: "Not an admin User" });
        }
      } else {
        console.log("Valid Token : ", validToken);
        console.log("Token : ", token.split(" ")[1]);
        return res.status(401).json({ message: "Admin Token is invalid" });
      }
    } else {
      return res.status(401).json({ message: "Please log in again" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { validateUser, validateAdmin };
