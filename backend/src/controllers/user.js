import { getParcelById, loginUser, verifyUser } from "../services/userServices";

const handleLoginUser = async (req, res) => {
  const { user_name, password } = req.body;
  const result = await loginUser(user_name, password);

  const statusCode =
    result.errorCode === 0 ? 200 : result.errorCode === 1 ? 400 : 500;
  return res.status(statusCode).json({
    ...result,
  });
};

const handleGetParcelById = async (req, res) => {
  const id = req.query.id;
  const result = await getParcelById(id);
  const statusCode =
    result.errorCode === 0 ? 200 : result.errorCode === 1 ? 400 : 500;
  return res.status(statusCode).json({
    ...result,
  });
};

const handleVerifyUser = async (req, res) => {
  const { authorization } = req.headers;
  const result = await verifyUser(authorization);
  const statusCode =
    result.errorCode === 0 ? 200 : result.errorCode === 1 ? 401 : 500;
  return res.status(statusCode).json({
    ...result,
  });
};

export { handleLoginUser, handleGetParcelById, handleVerifyUser };
