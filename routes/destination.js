import express from "express";
import { createDestination, deleteDestination, getAllDestinations, getSingleDestination, updateDestination, getAllAddresses } from "../controllers/tourController.js";

const router = express.Router();

router.post("/", createDestination);

router.put("/:id", updateDestination);

router.delete("/:id", deleteDestination);

router.get("/:id", getSingleDestination);

router.get("/", getAllDestinations);

router.get("/address/:id", getAllAddresses); //address

export default router;
