import express from "express";
import authentication from "@middleware/authentication";
import {workspaceViewable} from "@middleware/workspace";

import {
	createNewEnvironment,
	deleteEnvironment,
	duplicateEnvironment,
	getAllEnvironments,
	getEnvironmentById,
	updateEnvironment,
	updateEnvironmentName,
} from "@controllers/environment";

const router = express.Router();

router.use(authentication);

// Get routes
router.get("/", workspaceViewable, getAllEnvironments);
router.get("/:id", getEnvironmentById);

// Edit routes
router.put("/:id", updateEnvironment);
router.patch("/:id/name", updateEnvironmentName);

// Create routes
router.post("/", createNewEnvironment);
router.post("/:id/duplicate", duplicateEnvironment);

// Delete routes
router.delete("/:id", deleteEnvironment);

export default router;
