import { Router } from "express";
import auth from "../middlewares/auth.js";
import * as addonsController from "../controllers/addonsController.js";

const router = Router();

router.get("/", addonsController.getAllAddons);
router.post("/", auth, addonsController.createAddon);
router.put("/:id", auth, addonsController.updateAddon);
router.delete("/:id", auth, addonsController.deleteAddon);

// ✅ rota de estoque (já existia, mantida)
router.patch("/:id/stock", auth, addonsController.toggleAddonStock);

export default router;
