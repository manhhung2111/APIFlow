import express from "express";
import authentication from "@middleware/authentication";
import {workspaceEditable, workspaceViewable} from "@middleware/workspace";

import {
	createNewEnvironment,
	deleteEnvironment,
	duplicateEnvironment,
	getEnvironmentsByWorkspace,
	getEnvironmentById,
	updateEnvironment,
	updateEnvironmentName,
} from "@controllers/environment";

const router = express.Router();

router.use(authentication);

// Get routes
router.get("/", workspaceViewable, getEnvironmentsByWorkspace);
router.get("/:environment_id", workspaceViewable, getEnvironmentById);

// Edit routes
router.put("/:environment_id", workspaceEditable, updateEnvironment);
router.patch("/:environment_id/name", workspaceEditable, updateEnvironmentName);

// Create routes
router.post("/", workspaceEditable, createNewEnvironment);
router.post("/:environment_id/duplicate", workspaceEditable, duplicateEnvironment);

// Delete routes
router.delete("/:environment_id", workspaceEditable, deleteEnvironment);

export default router;
