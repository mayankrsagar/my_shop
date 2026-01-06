import express from "express";
import { authenticate } from "../middleware/auth.js";
import { toggleFavorite, getFavorites, checkFavoriteStatus } from "../controllers/favoritesController.js";

const router = express.Router();

router.post("/favorites/:productId", authenticate, toggleFavorite);
router.get("/favorites", authenticate, getFavorites);
router.get("/favorites/check/:productId", authenticate, checkFavoriteStatus);

export default router;