import express from "express";
import {
    createRoom,
    joinRoom,
    leaveRoom,
    getRoomDetails,
    getActiveRooms
} from "../controllers/studyRoom.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/create", protectRoute, createRoom);
router.post("/join/:roomId", protectRoute, joinRoom);
router.post("/leave/:roomId", protectRoute, leaveRoom);
router.get("/:roomId", protectRoute, getRoomDetails);
router.get("/", protectRoute, getActiveRooms);

export default router;