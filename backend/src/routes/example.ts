import express from "express";
import authentication from "@middleware/authentication";
import {workspaceEditable, workspaceViewable} from "@middleware/workspace";

import {
	createNewExample,
	deleteExample,
	duplicateExample,
	getAllExamples,
	getExampleById,
	moveExample,
	updateExampleName,
} from "@controllers/example";

const router = express.Router();

router.use(authentication);

// Get routes
router.get("/", workspaceViewable, getAllExamples);
router.get("/:example_id", workspaceViewable, getExampleById);

// Edit routes
router.put("/:example_id/name", workspaceEditable, updateExampleName);
router.put("/:example_id/move", workspaceEditable, moveExample);

// Create routes
router.post("/", workspaceEditable, createNewExample);
router.post("/:example_id/duplicate", workspaceEditable, duplicateExample);

// Delete routes
router.delete("/:example_id", workspaceEditable, deleteExample);

export default router;
