const express = require('express');
const router = express.Router();

const controller = require('../controllers/homeController');

router.get('/', controller.home);

// router.get('/', (req, res)=>{
//     res.render('index');
// });

module.exports = router;