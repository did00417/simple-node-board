const pageNavigation = ((page, totalcount, url, param)=>{
    let html = '';

    let totalPage = parseInt(totalcount/10);
    if(totalcount%10 != 0) {
        totalPage++;
    }

    if(totalPage > 0) {
        start = parseInt((page - 1) / 10) * 10 + 1;
        end = start + 9;

        html += '<nav aria-label="Page navigation example">';
        html += '<ul class="pagination justify-content-center">';

        if(totalPage < end) {
            end = totalPage;
        }

        if(page > 10) {
            prePage = start - 1;
            html += '<li class="page-item">';
            html += '<a class="page-link" href="' + url + '?page='+ prePage + param +'" tabindex="-1" aria-disabled="true">Previous</a>'
            html += '</li>';
        } else {
            html += '<li class="page-item disabled">';
            html += '<a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>'
            html += '</li>';
        }

        for(let i=start; i<=end; i++) {
            if(page == i) {
                html += '<li class="page-item active"><a class="page-link" href="'+ url +'?page=' + i + param + '">' + i + '</a></li>';
            } else {
                html += '<li class="page-item"><a class="page-link" href="'+ url +'?page=' + i + param + '">' + i +'</a></li>';
            }
        }

        if(end < totalPage) {
            let nextPage = end + 1;

            html += '<li class="page-item">'
            html += '<a class="page-link" href="'+ url +'?page='+ nextPage + param +'">Next</a>'
            html += '</li>'
        } else {
            html += '<li class="page-item disabled">'
            html += '<a class="page-link" href="#">Next</a>'
            html += '</li>'
        }

        html += '</ul>';
        html += '</nav>';
    }

    return html;
});

const dateFormat = ((date)=>{
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;

    return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
});

const alertAndGo = (res, msg, url) => {
    let html = '<script>';

    if (msg != '') {
        html += 'alert("' + msg + '");';
    }

    if (url != '') {
        if (url == 'history.back') {
            html += 'history.back();';
        } else {
            html += 'location.href = \'' + url + '\'';
        }
    }

    html += '</script>';

    res.send(html);
    res.end();
}

const checkLogin = (req, res, isMust = true)=>{
    let loginUserInfo = req.session.user;

    if(isMust && loginUserInfo == undefined) {
        alertAndGo(res, '로그인이 필요합니다.', '/member/login');
        return;
    }

    return loginUserInfo;
}

const replaceNLtoBR = ((str)=>{
    return str.replaceAll('\n', '<br/>');
});

module.exports = {
    pageNavigation,
    dateFormat,
    alertAndGo,
    checkLogin,
    replaceNLtoBR
}