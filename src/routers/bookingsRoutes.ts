import { Router } from "express";
import { verifyBookingNumbers } from "../controllers/bookingsController";

const bookingsRoutes = Router();

bookingsRoutes.post("/verify", verifyBookingNumbers);

export default bookingsRoutes;
