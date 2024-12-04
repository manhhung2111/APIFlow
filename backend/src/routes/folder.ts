import express from "express";
import authentication from "@middleware/authentication";
import {workspaceEditable, workspaceViewable} from "@middleware/workspace";

import {
	createNewFolder,
	deleteFolder,
	duplicateFolder,
	getAllFolders,
	getFolderById,
	moveFolder,
	updateFolder,
	updateFolderContent,
	updateFolderName,
} from "@controllers/folder";

const router = express.Router();

router.use(authentication);

// Get routes
router.get("/", workspaceViewable, getAllFolders);
router.get("/:folder_id", workspaceViewable, getFolderById);

// Edit routes
router.put("/:folder_id", workspaceEditable, updateFolder);
router.put("/:folder_id/name", workspaceEditable, updateFolderName);
router.put("/:folder_id/content", workspaceEditable, updateFolderContent);
router.put("/:folder_id/move", workspaceEditable, moveFolder);

// Create routes
router.post("/", workspaceEditable, createNewFolder);
router.post("/:folder_id/duplicate", workspaceEditable, duplicateFolder);

// Delete routes
router.delete("/:folder_id", workspaceEditable, deleteFolder);

export default router;
