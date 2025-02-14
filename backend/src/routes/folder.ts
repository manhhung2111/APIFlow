import express from "express";
import authentication from "@middleware/authentication";
import {workspaceEditable, workspaceViewable} from "@middleware/workspace";

import {
	createNewFolder,
	deleteFolder,
	duplicateFolder,
	getFolderById,
	getFoldersByWorkspace,
	moveFolder,
	updateFolder,
	updateFolderContent,
	updateFolderName,
	createNewRequestFromFolder
} from "@controllers/folder";

const router = express.Router();

router.use(authentication);

// Get routes
router.get("/", workspaceViewable, getFoldersByWorkspace);
router.get("/:folder_id", workspaceViewable, getFolderById);

// Edit routes
router.put("/:folder_id", workspaceEditable, updateFolder);
router.put("/:folder_id/name", workspaceEditable, updateFolderName);
router.put("/:folder_id/content", workspaceEditable, updateFolderContent);
router.put("/:folder_id/move", workspaceEditable, moveFolder);

// Create routes
router.post("/", workspaceEditable, createNewFolder);
router.post("/request", workspaceEditable, createNewRequestFromFolder);
router.post("/:folder_id/duplicate", workspaceEditable, duplicateFolder);

// Delete routes
router.delete("/:folder_id", workspaceEditable, deleteFolder);

export default router;
