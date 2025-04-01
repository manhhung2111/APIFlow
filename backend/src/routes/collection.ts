import express from "express";
import authentication from "@middleware/authentication";
import {workspaceAdmin, workspaceEditable, workspaceViewable} from "@middleware/workspace";

import {
    createNewCollection,
    createNewRequestFromCollection,
    deleteCollection,
    duplicateCollection,
    getCollectionAssociatedWithData,
    getCollectionById,
    getCollectionExport,
    getCollectionsByWorkspace,
    importCollection,
    updateCollection,
    updateCollectionContent,
    updateCollectionName, embedRequests, searchRequests, testCollection
} from "@controllers/collection";

const router = express.Router();

// router.use(authentication);

// Get routes
router.get("/", workspaceViewable, getCollectionsByWorkspace);
router.get("/:collection_id", workspaceViewable, getCollectionById);
router.get("/data/:collection_id", workspaceViewable, getCollectionAssociatedWithData);
router.get("/export/:collection_id", workspaceViewable, getCollectionExport);

// Edit routes
router.put("/:collection_id", workspaceEditable, updateCollection);
router.put("/:collection_id/name", workspaceEditable, updateCollectionName);
router.put("/:collection_id/content", workspaceEditable, updateCollectionContent);

// Create routes
router.post("/", workspaceEditable, createNewCollection);
router.post("/:collection_id/duplicate", workspaceEditable, duplicateCollection);
router.post("/request", workspaceEditable, createNewRequestFromCollection);
router.post("/import", workspaceEditable, importCollection);

// Delete routes
router.delete("/:collection_id", workspaceEditable, deleteCollection);
router.post("/:collection_id/embed-requests", workspaceAdmin, embedRequests);
router.post("/:collection_id/search-requests", workspaceViewable, searchRequests);

router.post("/:collection_id/test", testCollection);

export default router;
