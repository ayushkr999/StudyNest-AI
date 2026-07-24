import express from "express"
import protectRoute from "../middlewares/protectRoute.js"
import { getUserStats } from "../controllers/stat.controller.js"
const router=express.Router()

router.get("/",protectRoute,getUserStats)

export default router