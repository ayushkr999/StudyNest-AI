import express from "express"
const router=express.Router()
import protectRoute from "../middlewares/protectRoute.js"
import { createNote, deleteNote, getNotes, updateNote } from "../controllers/note.controller.js"

router.use(protectRoute)

router.post("/",createNote)
router.get("/",getNotes)
router.put("/:id",updateNote)
router.delete("/:id",deleteNote)

export default router