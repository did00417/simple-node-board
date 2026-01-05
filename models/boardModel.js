const mysql = require('mysql');
const db = require('../config/db')

const setData = ((fkmember, title, content)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "insert into board(fkmember, title, content) values (?, ?, ?)";
        const params = [fkmember, title, content];

        const con = mysql.createConnection(db);
        con.connect();
        con.query(sql, params, (err, result, fields) => {
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

const getList= ((pageSize, page, searchKey)=>{
    const promise = new Promise((resolve, reject)=>{
        let start = (page-1) * pageSize;
        searchKey = '%' + searchKey + '%';

        const sql1 = "select count(b.id) as cnt \
                      from board b \
                      inner join member m on b.fkmember = m.id \
                      where m.name like ? or b.title like ? or b.content like ?;";

        const sql2 = "select b.id, m.name, b.title, b.viewcount, b.regdate \
                      from board b \
                      inner join member m on b.fkmember = m.id \
                      where m.name like ? or b.title like ? or b.content like ? \
                      order by b.id desc limit ?, ?;";
        let params = [searchKey, searchKey, searchKey, searchKey, searchKey, searchKey, start, pageSize];

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

const updateViewcount = ((id)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "update board set viewcount = viewcount + 1 where id = ?";
        const params = [id];

        const con = mysql.createConnection(db);
        con.connect();
        con.query(sql, params, (err, result, fields) => {
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

const getData= ((id)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "select b.id, m.name, b.title, b.content, b.viewcount, b.regdate, b.fkmember \
                     from board b \
                     inner join member m on b.fkmember = m.id \
                     where b.id = ?";
        const params = [id];

        const con = mysql.createConnection(db);
        con.connect();
        con.query(sql, params, (err, result, fields) => {
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

const setDelete = ((id, fkmember)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "delete from board where fkmember = ? and id = ?";
        const params = [fkmember, id];

        const con = mysql.createConnection(db);
        con.connect();
        con.query(sql, params, (err, result, fields) => {
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

const setModify = ((id, fkmember, title, content)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "update board set title = ?, content = ? where fkmember = ? and id = ?";
        const params = [title, content, fkmember, id];

        const con = mysql.createConnection(db);
        con.connect();
        con.query(sql, params, (err, result, fields) => {
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

module.exports = {
    setData,
    getList,
    updateViewcount,
    getData,
    setDelete,
    setModify
}