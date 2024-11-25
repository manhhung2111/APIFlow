import Response from "../ap/response";

const workspaceViewable = async (req, res, next) => {
  const { acl } = req.user;

  if (!acl.viewable) {
    return res.status(403).json({
      ...Response.error("You dont have permisson to access this resource"),
    });
  }

  next();
};

const workspaceCommentable = async (req, res, next) => {
  const { acl } = req.user;

  if (!acl.commentable) {
    return res.status(403).json({
      ...Response.error("You dont have permisson to access this resource"),
    });
  }

  next();
};

const workspaceEditable = async (req, res, next) => {
  const { acl } = req.user;

  if (!acl.editable) {
    return res.status(403).json({
      ...Response.error("You dont have permisson to access this resource"),
    });
  }

  next();
};

const workspaceAdmin = async (req, res, next) => {
  const { acl } = req.user;

  if (!acl.full_access) {
    return res.status(403).json({
      ...Response.error("You dont have permisson to access this resource"),
    });
  }

  next();
};

module.exports = {
  workspaceAdmin,
  workspaceViewable,
  workspaceEditable,
  workspaceCommentable,
};
