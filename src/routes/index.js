const express = require('express');
const uploadRoutes = require("./upload")


const router = express.Router();

router.get('/status', (req, res) => res.send('OK'));
router.use("/upload", uploadRoutes)


module.exports = router;