import { Router } from "express";
import { vote } from "../controllers/voteController";

const voteRoutes = Router();

voteRoutes.post("/vote", vote);

export default voteRoutes;
