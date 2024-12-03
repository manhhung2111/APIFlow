import express from "express";
import authentication from "@middleware/authentication";
import {workspaceViewable} from "@middleware/workspace";

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
router.get("/:id", getFolderById);

// Edit routes
router.put("/:id", updateFolder);
router.patch("/:id/name", updateFolderName);
router.patch("/:id/content", updateFolderContent);
router.put("/:id/move", moveFolder);

// Create routes
router.post("/", createNewFolder);
router.post("/:id/duplicate", duplicateFolder);

// Delete routes
router.delete("/:id", deleteFolder);

export default router;
