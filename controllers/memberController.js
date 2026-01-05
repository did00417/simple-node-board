const model = require('../models/memberModel');
const common = require('../config/common');

const pageSize = 10;

const login = ((req, res) => {
    loginUserInfo = common.checkLogin(req, res, false);
    if (loginUserInfo != null) { //로그인 한 사람은 로그인 불가능 
        common.alertAndGo(res, '', '/');
        return;
    }
    res.render('member/login');
});

const loginProc = ((req, res) => {
    let { userid, passwd } = req.body; //post 

    if (userid == undefined || userid == '') {
        res.send("잘못된 접근입니다.");
        res.end();
    }

    if (passwd == undefined || passwd == '') {
        res.send("잘못된 접근입니다.");
        res.end();
    }

    model.loginCheck(userid, passwd)
        .then((result) => {
            console.log(result);

            if (result == undefined) {
                common.alertAndGo(res, '아이디 또는 패스워드가 틀립니다.', '/member/login');
                return;
            }

            //세션을 설정해야 합니다.
            req.session.user = {
                id: result.id,
                userid: result.userid,
                username: result.name,
                auhorized: true
            };
            //첫페이지로 이동할겁니다.
            common.alertAndGo(res, '로그인 되었습니다.', '/');
        })
        .catch((err) => {
            res.status(500).send("500 Error" + err);
        });
});

const logout = ((req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("세션 삭제 실패");
            return;
        } else {
            console.log("세션 삭제 성공");
            common.alertAndGo(res, '로그아웃 되었습니다.', '/');
        }
    });
});

const join = ((req, res) => {
    loginUserInfo = common.checkLogin(req, res, false);
    if (loginUserInfo != null) { //로그인 한 사람은 회원가입 불가능 
        common.alertAndGo(res, '', '/');
        return;
    };

    res.render('member/join');
});


const checkUniqueId = ((req, res) => {
    let { userid, id } = req.body;

    if (id == undefined) {
        id = 0;
    }

    if (userid == undefined) {
        common.alertAndGo(res, '잘못된 접근입니다.', '');
        return;
    }

    model.uniqueIdCnt(userid, id)
        .then((result) => {
            if (result.cnt > 0) {
                id = 0;
                //중복
                // let data = '{"result_code": "0"}';//중복이면 0, 정상이면 1, json
                res.send(false); //중복 됨
            } else {
                //신규
                // let data = '{"result_code": "1"}'; //중복이면 0, 정상이면 1, json
                res.send(true); //중복 안됨
            }
            res.end();
        })
        .catch((err) => {
            res.status(500).send("500 Error" + err);
        });
});

const register = ((req, res) => {
    let { username, userid, passwd } = req.body;

    if (username == undefined || username == '') {
        common.alertAndGo(res, '잘못된 접근입니다.', '');
        return;
    }

    if (userid == undefined || userid == '') {
        common.alertAndGo(res, '잘못된 접근입니다.', '');
        return;
    }

    if (passwd == undefined || passwd == '') {
        common.alertAndGo(res, '잘못된 접근입니다.', '');
        return;
    }

    model.uniqueIdCnt(userid)
        .then((result) => {
            if (parseInt(result.cnt) > 0) {
                common.alertAndGo(res, '중복된 아이디 입니다.', '');
                return;
            } else {
                model.insertMember(username, userid, passwd)
                    .then((result) => {
                        common.alertAndGo(res, '회원가입이 완료되었습니다.', '/');
                        return;
                    })
                    .catch((err) => {
                        res.status(500).send("500 Error" + err);
                    });
            }
        })
        .catch((err) => {
            res.status(500).send("500 Error" + err);
        });
});

const getMemberList = ((req, res) => {
    let {page, searchKey} = req.query;
    if(page == undefined) page = 1;
    if(searchKey == undefined) searchKey = '';

    loginUserInfo = common.checkLogin(req, res);
    if (loginUserInfo == null) return;

    model.getMemberList(pageSize, page, searchKey)
        .then((result) => {
            totalRecord = result[0][0].cnt;
            list = result[1];
            console.log(searchKey); //검색기능확인

            res.render('member/index', {loginUserInfo, pageSize, page, totalRecord, list, searchKey});
        })
        .catch((error) => {
            res.status(500).send("500 error" + error);
        });
});

const getMemberData = ((req, res) => {
    let {page, id, searchKey} = req.query;
    if (page == undefined) page = 1;
    if (searchKey == undefined) searchKey = '';

    loginUserInfo = common.checkLogin(req, res);
    if (loginUserInfo == null) return;

    model.getMemberData(id)
        .then((result) => {
            if (result[0] == null) {
                common.alertAndGo(res, '삭제되거나 없는 게시물 입니다.', 'history.back');
                return;
            }
            const viewData = result[0];
            res.render('member/view', { loginUserInfo, page, id, viewData});
        })
        .catch((error) => {
            res.status(500).send("500 error" + error);
        });
});

const modify = ((req, res)=>{
    let {page, id} = req.query;

    loginUserInfo = common.checkLogin(req, res);
    if (loginUserInfo == null) return;

    model.getMemberData(id)
    .then((result) => {
        const viewData = result[0];
        console.log(viewData)
        res.render('member/modify', {loginUserInfo, page, id, viewData});
    })
    .catch((error)=>{
        // console.log(error);  //오류 확인
        res.status(500).send("500 error" + error);
    });
});

const setUpdate = ((req, res)=>{
    let {id, userid, passwd, username} = req.body;

    loginUserInfo = common.checkLogin(req, res);
    if (loginUserInfo == null) return;

    if(userid == undefined) {
        res.send('잘못된 접근입니다.');
        return;
    }

    if(passwd == undefined || username == undefined) {
        // console.log(req.body); //오류확인
        res.send('잘못된 접근입니다.');
        return;
    }

    model.setModify(id, userid, passwd, username)
    .then((result) => {
        // console.log(result); //오류확인
        res.send('<script>alert("수정되었습니다."); location.href = "/member/";</script>');
    })
    .catch((error)=>{
        res.status(500).send("500 error" + error);
    });
});

const setDelete = ((req, res)=>{
    let {id} = req.query;

    loginUserInfo = common.checkLogin(req, res);
    if(loginUserInfo == null) return;

    model.setDelete(id)
    .then((result) => {
        common.alertAndGo(res, '삭제되었습니다.', '/member/');
    })
    .catch((error)=>{
        res.status(500).send("500 error" + error);
    });
});


module.exports = {
    login,
    loginProc,
    logout,
    join,
    checkUniqueId,
    register,
    getMemberList,
    getMemberData,
    modify,
    setUpdate,
    setDelete
}