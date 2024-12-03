import express from "express";

import {
	createNewWorkspace,
	deleteWorkspace,
	getAllWorkspaces,
	getWorkspaceById,
	updateWorkspaceContent,
	updateWorkspaceName,
} from "@controllers/workspace";

const router = express.Router();

// Get routes
router.get("/", getAllWorkspaces);
router.get("/:id", getWorkspaceById);

// Create routes
router.post("/", createNewWorkspace);

// Edit routes
router.put("/:id/name", updateWorkspaceName);
router.put("/:id/content", updateWorkspaceContent);


router.delete("/:id", deleteWorkspace);

export default router;
