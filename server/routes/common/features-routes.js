const express = require('express');
const {addFeaturesImage,getFeaturesImages} = require("../../controller/common/features-controller")
const router = express.Router();

router.post("/add",addFeaturesImage)
router.get("/get",getFeaturesImages);

module.exports = router;