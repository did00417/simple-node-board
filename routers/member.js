const express = require('express');
const router = express.Router();

const controller = require('../controllers/memberController');

router.get('/', controller.getMemberList);

router.get('/login', controller.login);
router.post('/login', controller.loginProc);
router.get('/logout', controller.logout);

router.get('/join', controller.join);
router.post('/checkUniqueId', controller.checkUniqueId);
router.post('/register', controller.register);

router.get('/view', controller.getMemberData);
router.get('/modify', controller.modify);
router.post('/modify', controller.setUpdate);
router.get('/delete', controller.setDelete);

module.exports = router;