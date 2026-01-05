const common = require('../config/common');

const home = ((req, res)=>{
    let loginUserInfo = common.checkLogin(req, res, false);
    res.render('index', {loginUserInfo});
});

module.exports = {
    home
};