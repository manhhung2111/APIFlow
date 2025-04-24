import express from "express";
import authentication from "@middleware/authentication";
import {workspaceEditable, workspaceViewable} from "@middleware/workspace";
import {
    createNewPersona,
    deletePersona,
    duplicatePersona,
    getPersonaById,
    getPersonasByWorkspace,
    updatePersona,
    updatePersonaName
} from "@controllers/persona";

const router = express.Router();

router.use(authentication);

// Get routes
router.get("/", workspaceViewable, getPersonasByWorkspace);
router.get("/:persona_id", workspaceViewable, getPersonaById);

// Edit routes
router.put("/:persona_id", workspaceEditable, updatePersona);
router.patch("/:persona_id/name", workspaceEditable, updatePersonaName);

// Create routes
router.post("/", workspaceEditable, createNewPersona);
router.post("/:persona_id/duplicate", workspaceEditable, duplicatePersona);

// Delete routes
router.delete("/:persona_id", workspaceEditable, deletePersona);

export default router;
