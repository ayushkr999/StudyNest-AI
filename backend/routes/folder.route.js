import express from "express"
const router=express.Router()
import protectRoute from "../middlewares/protectRoute.js"
import { createFolder, deleteFolder, getFolders, updateFolder } from "../controllers/folder.controller.js"

router.use(protectRoute)

router.post("/",createFolder)
router.get("/",getFolders)
router.put("/:id",updateFolder)
router.delete("/:id",deleteFolder)

export default router