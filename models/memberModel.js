const mysql = require('mysql');
const db = require('../config/db')

const loginCheck = ((userid, passwd) => {
    const promise = new Promise((resolve, reject) => {
        const sql = "select id, userid, name from member where userid = ? and passwd = ?";
        const param = [userid, passwd];

        const con = mysql.createConnection(db);

        con.connect();
        con.query(sql, param, (err, result, fields) => {
            if (err) {
                con.end();
                reject(err);
            } else {
                con.end();
                resolve(result[0]);
            }
        });
    });

    return promise;
});

const uniqueIdCnt = ((userid, id) => {
    const promise = new Promise((resolve, reject) => {
        const sql = "select count(id) as cnt from member where userid = ? and id != ?";
        const param = [userid, id];

        const con = mysql.createConnection(db);

        con.connect();
        con.query(sql, param, (err, result, fields) => {
            if (err) {
                con.end();
                reject(err);
            } else {
                con.end();
                resolve(result[0]);
            }
        });
    });

    return promise;
});

const insertMember = ((username, userid, passwd) => {
    const promise = new Promise((resolve, reject) => {
        const sql = "insert into member(userid, passwd, name) values (?, ? ,?);";
        const param = [userid, passwd, username];

        const con = mysql.createConnection(db);

        con.connect();
        con.query(sql, param, (err, result, fields) => {
            if (err) {
                con.end();
                reject(err);
            } else {
                con.end();
                resolve(result);
            }
        });
    });

    return promise;
});

const getMemberList = ((pageSize, page, searchKey) => {
    const promise = new Promise((resolve, reject) => {
        let start = (page - 1) * pageSize;
        searchKey = '%' + searchKey + '%';

        const sql1 = "select count(m.id) as cnt \
                      from member m \
                      where m.userid like ? or m.name like ?; ";

        const sql2 = "select m.id, m.userid, m.name, m.regdate \
                      from member m \
                      where m.userid like ? or m.name like ? \
                      order by m.id desc limit ?, ?;";

        let params = [searchKey, searchKey, searchKey, searchKey, start, pageSize];

        const con = mysql.createConnection(db);
        con.connect();
        con.query(sql1 + sql2, params, (err, result, fields) => {
            con.end();
            if(err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });

    return promise;
});


const getMemberData = ((id) => {
    const promise = new Promise((resolve, reject) => {
        const sql = "select m.id, m.userid, m.name, m.passwd, m.regdate \
                     from member m \
                     where m.id = ?; ";

        const params = [id];

        const con = mysql.createConnection(db);
        con.connect();
        con.query(sql, params, (err, result, fields) => {
            con.end();
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
    return promise;
});

const setModify = ((id, userid, passwd, name) => {
    const promise = new Promise((resolve, reject) => {
        const sql = "update member set userid = ?, passwd = ?, name = ? where id = ?";
        const params = [userid, passwd, name, id];

        const con = mysql.createConnection(db);
        con.connect();
        con.query(sql, params, (err, result, fields) => {
            con.end();
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });

    return promise;
});

const setDelete = ((id) => {
    const promise = new Promise((resolve, reject) => {
        const sql = "delete from member where id = ?";
        const params = [id];

        const con = mysql.createConnection(db);
        con.connect();
        con.query(sql, params, (err, result, fields) => {
            con.end();
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });

    return promise;
});


module.exports = {
    loginCheck,
    uniqueIdCnt,
    insertMember,
    getMemberList,
    getMemberData,
    setModify,
    setDelete
}