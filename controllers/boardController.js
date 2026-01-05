const model = require('../models/boardModel');
const common = require('../config/common');

const pageSize = 10;

const getList = ((req, res)=>{
    let {page, searchKey} = req.query;
    if(page == undefined) page = 1;
    if(searchKey == undefined) searchKey = '';

    loginUserInfo = common.checkLogin(req, res);
    if(loginUserInfo == null) return;

    model.getList(pageSize, page, searchKey)
    .then((result) => {
        totalRecord = result[0][0].cnt;
        list = result[1];

        res.render('board/index', {loginUserInfo, pageSize, page, totalRecord, list, searchKey});
    })
    .catch((error)=>{
        res.status(500).send("500 error" + error);
    });
});

const getRegister = ((req, res)=>{
    let {page} = req.query;
    if(page == undefined) page = 1;

    loginUserInfo = common.checkLogin(req, res);
    if(loginUserInfo == null) return;
    
    res.render('board/register', {loginUserInfo, page});
});

const getData = ((req, res)=>{
    let {page, id, searchKey} = req.query;
    if(page == undefined) page = 1;
    if(searchKey == undefined) searchKey = '';

    loginUserInfo = common.checkLogin(req, res);
    if(loginUserInfo == null) return;

    model.updateViewcount(id)
    .then(() => {
        model.getData(id)
        .then((result) => {
            if(result[0] == null){
                common.alertAndGo(res, '삭제되거나 없는 게시물 입니다.', 'history.back');
                return;
            }
            const viewData = result[0];
            res.render('board/view', {loginUserInfo, page, id, viewData});
        })
        .catch((error)=>{
            res.status(500).send("500 error" + error);
        });
    })
    .catch((error)=>{
        res.status(500).send("500 error" + error);
    });
});

const setRegister = ((req, res)=>{
    let {title, content} = req.body;

    loginUserInfo = common.checkLogin(req, res);
    if(loginUserInfo == null) return;

    let fkmember = loginUserInfo.id;

    if(title == undefined) {
        common.alertAndGo(res, '잘못된 접근입니다.', '');
        return;
    }

    if(content == undefined) {
        common.alertAndGo(res, '잘못된 접근입니다.', '');
        return;
    }

    model.setData(fkmember, title, content)
    .then((result) => {
        common.alertAndGo(res, '저장되었습니다.', '/board/');
    })
    .catch((error)=>{
        res.status(500).send("500 error" + error);
    });
});

const setDelete = ((req, res)=>{
    let {id} = req.query;

    loginUserInfo = common.checkLogin(req, res);
    if(loginUserInfo == null) return;

    let fkmember = loginUserInfo.id;

    model.setDelete(id, fkmember)
    .then((result) => {
        common.alertAndGo(res, '삭제되었습니다.', '/board/');
        // '/board/' -> 삭제하고 나면 목록 전체가 바뀌기 때문에 무조건 첫페이지로 감
    })
    .catch((error)=>{
        res.status(500).send("500 error" + error);
    });
});

const modify = ((req, res)=>{
    let {page, id} = req.query;

    loginUserInfo = common.checkLogin(req, res);
    if(loginUserInfo == null) return;

    let fkmember = loginUserInfo.id;

    model.getData(id, fkmember)
    .then((result) => {
        const viewData = result[0];
        res.render('board/modify', {loginUserInfo, page, id, viewData});
    })
    .catch((error)=>{
        res.status(500).send("500 error" + error);
    });
});

const setUpdate = ((req, res)=>{
    let {id, title, content} = req.body;

    loginUserInfo = common.checkLogin(req, res);
    if(loginUserInfo == null) return;

    let fkmember = loginUserInfo.id;

    if(title == undefined) {
        res.send('잘못된 접근입니다.');
        return;
    }

    if(content == undefined) {
        res.send('잘못된 접근입니다.');
        return;
    }

    model.setModify(id, fkmember, title, content)
    .then((result) => {
        res.send('<script>alert("수정되었습니다."); location.href = "/board/";</script>');
    })
    .catch((error)=>{
        res.status(500).send("500 error" + error);
    });
});

module.exports = {
    getList,
    getRegister,
    setRegister,
    getData,
    setDelete,
    modify,
    setUpdate
}