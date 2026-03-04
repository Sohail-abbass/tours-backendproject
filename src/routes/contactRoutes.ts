import { Router } from "express";
import { submitContact } from "../controllers/contactController";

const router = Router();

console.log("✅ Contact routes loaded");

router.post("/", submitContact);
console.log("✅ Contact routes loaded 2");

export default router;
