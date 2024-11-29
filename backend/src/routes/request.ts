import express from "express";

import {
    createNewRequest,
    deleteRequest,
    duplicateRequest,
    getAllRequests,
    getRequestById,
    moveRequest,
    sendRequest,
    updateRequest,
    updateRequestContent,
    updateRequestName
} from "@controllers/request";

const router = express.Router();

// Get routes
router.get("/", getAllRequests)
router.get("/:id", getRequestById);

// Edit routes
router.put("/:id", updateRequest);
router.patch("/:id/name", updateRequestName);
router.patch("/:id/content", updateRequestContent);
router.put("/:id/move", moveRequest);

// Create routes
router.post("/", createNewRequest);
router.post("/:id/duplicate", duplicateRequest);

// Delete routes
router.delete("/:id", deleteRequest);

// Other routes
router.post("/send", sendRequest);

export default router;
