const express = require("express");
const router = express.Router();
const loyaltyController = require("../controllers/loyaltyController");
const auth = require("../middleware/auth");

// ADMIN
router.get("/cards", auth, loyaltyController.getCards);
router.post("/reward", auth, loyaltyController.setReward);
router.get("/reward", auth, loyaltyController.getReward);

// PUBLIC (checkout)
router.post("/record", loyaltyController.recordPurchase);

module.exports = router;
