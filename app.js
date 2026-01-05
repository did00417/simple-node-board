const express = require('express');
const nunjucks = require('nunjucks');

const app = express();
app.set('view engine', 'html');

//넌적스 환경 설정
nunjucks.configure('views', {
    express: app,
    watch: true
});

//post 데이터 받기
app.use(express.urlencoded({
    extended: true
}));

//세션 사용을 하기 위한 설정
const session = require('express-session');
//const sessionFile = require('session-file-store') (session);
const db = require('./config/db');
const sessionDB = require('express-mysql-session') (session);
app.use(session({
    secret: 'kiwu',
    resave: true,
    saveUninitialized: true,
    //store: new sessionFile({logFn: function(){}})
    store: new sessionDB(db)
}));

//정적 파일 처리
app.use('/assets', express.static(__dirname + '/assets'));

//view 단을 위해 common 함수 설정
const common = require('./config/common');
app.locals.common = common;

//라우터
const homeRouter = require('./routers/home');
const memberRouter = require('./routers/member');
const boardRouter = require('./routers/board');

app.use('/', homeRouter);
app.use('/member', memberRouter);
app.use('/board', boardRouter);

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

app.listen(80, ()=>{
    console.log('80 포트에서 익스프레스 서버 대기중...');
});