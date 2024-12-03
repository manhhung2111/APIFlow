import express from "express";
import authentication from "@middleware/authentication";
import {workspaceViewable} from "@middleware/workspace";

import {
	createNewCollection,
	deleteCollection,
	duplicateCollection,
	getAllCollections,
	getCollectionById,
	updateCollection,
	updateCollectionContent,
	updateCollectionName,
} from "@controllers/collection";

const router = express.Router();

router.use(authentication);

// Get routes
router.get("/", workspaceViewable, getAllCollections);
router.get("/:id", getCollectionById);

// Edit routes
router.put("/:id", updateCollection);
router.patch("/:id/name", updateCollectionName);
router.patch("/:id/content", updateCollectionContent);

// Create routes
router.post("/", createNewCollection);
router.post("/:id/duplicate", duplicateCollection);

// Delete routes
router.delete("/:id", deleteCollection);

export default router;
