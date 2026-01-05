const express = require('express');
const router = express.Router();

const controller = require('../controllers/boardController');

router.get('/', controller.getList);
router.get('/register', controller.getRegister);
router.post('/register', controller.setRegister);
router.get('/view', controller.getData);
router.get('/delete', controller.setDelete);
router.get('/modify', controller.modify);
router.post('/modify', controller.setUpdate);
//선언

module.exports = router;