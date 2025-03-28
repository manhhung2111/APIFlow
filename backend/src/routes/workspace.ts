import express from "express";
import {workspaceAdmin, workspaceEditable, workspaceViewable} from "@middleware/workspace";
import authentication from "@middleware/authentication";

import {
    createNewWorkspace,
    deleteWorkspace,
    getAllWorkspaces,
    getRecentWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    updateWorkspaceAccessList,
} from "@controllers/workspace";

const router = express.Router();

router.use(authentication);

// Get routes
router.get("/recent", getRecentWorkspaces);
router.get("/", getAllWorkspaces);
router.get("/:workspace_id", workspaceViewable, getWorkspaceById);


// Create routes
router.post("/", createNewWorkspace);

// Edit routes
router.put("/:workspace_id", workspaceEditable, updateWorkspace);
router.put("/:workspace_id/access", workspaceAdmin, updateWorkspaceAccessList);

router.delete("/:workspace_id", workspaceAdmin, deleteWorkspace);

export default router;
