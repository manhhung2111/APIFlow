import jwt from "jsonwebtoken";
import Code from "../ap/code";

const authentication = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ ...Code.error("Authorization token required") });
  }

  try {
    req.user = await jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ ...Code.error(error?.message) });
  }
};

export default authentication;
