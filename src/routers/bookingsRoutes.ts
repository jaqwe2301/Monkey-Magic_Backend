import { Router } from "express";
import {
  verifyBookingNumbers,
  saveBooking,
} from "../controllers/bookingsController";

const bookingsRoutes = Router();

bookingsRoutes.post("/verify", verifyBookingNumbers);
bookingsRoutes.post("/save", saveBooking);

export default bookingsRoutes;
