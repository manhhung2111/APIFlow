import jwt from "jsonwebtoken";
import Response from "../ap/response";

const authentication = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ ...Response.error("Authorization token required") });
  }

  try {
    req.user = await jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ ...Response.error(error?.message) });
  }
};

export default authentication;
