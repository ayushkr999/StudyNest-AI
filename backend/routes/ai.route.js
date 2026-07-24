import express from "express"
import protectRoute from "../middlewares/protectRoute.js"
import { handleAIAction } from "../controllers/ai.controller.js"
const router=express.Router()

router.post("/folder/:folderId",protectRoute,handleAIAction)

export default router