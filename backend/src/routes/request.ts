import express from "express";
import authentication from "@middleware/authentication";
import {workspaceEditable, workspaceViewable} from "@middleware/workspace";

import {
	createNewRequest,
	deleteRequest,
	duplicateRequest,
	getRequestById,
	getRequestsByWorkspace,
	moveRequest,
	sendRequest,
	updateRequest,
	updateRequestContent,
	updateRequestName,
} from "@controllers/request";

const router = express.Router();

router.use(authentication);

// Get routes
router.get("/", workspaceViewable, getRequestsByWorkspace);
router.get("/:request_id", workspaceViewable, getRequestById);

// Edit routes
router.put("/:request_id", workspaceEditable, updateRequest);
router.put("/:request_id/name", workspaceEditable, updateRequestName);
router.put("/:request_id/content", workspaceEditable, updateRequestContent);
router.put("/:request_id/move", workspaceEditable, moveRequest);

// Create routes
router.post("/", workspaceEditable, createNewRequest);
router.post("/:request_id/duplicate", workspaceEditable, duplicateRequest);

// Delete routes
router.delete("/:request_id", workspaceEditable, deleteRequest);

// Other routes
router.post("/:request_id/send", workspaceViewable, sendRequest);

export default router;
