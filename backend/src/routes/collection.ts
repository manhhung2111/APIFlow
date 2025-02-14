import express from "express";
import authentication from "@middleware/authentication";
import {workspaceEditable, workspaceViewable} from "@middleware/workspace";

import {
	createNewCollection,
	deleteCollection,
	duplicateCollection,
	getCollectionById,
	getCollectionsByWorkspace,
	updateCollection,
	updateCollectionContent,
	updateCollectionName,
	createNewRequestFromCollection
} from "@controllers/collection";

const router = express.Router();

router.use(authentication);

// Get routes
router.get("/", workspaceViewable, getCollectionsByWorkspace);
router.get("/:collection_id", workspaceViewable, getCollectionById);

// Edit routes
router.put("/:collection_id", workspaceEditable, updateCollection);
router.put("/:collection_id/name", workspaceEditable, updateCollectionName);
router.put("/:collection_id/content", workspaceEditable, updateCollectionContent);

// Create routes
router.post("/", workspaceEditable, createNewCollection);
router.post("/:collection_id/duplicate", workspaceEditable, duplicateCollection);
router.post("/request", workspaceEditable, createNewRequestFromCollection);

// Delete routes
router.delete("/:collection_id", workspaceEditable, deleteCollection);

export default router;
