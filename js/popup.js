var template = '<div class="row">\n' +
    '            <div class="time">{time}</div>\n' +
    '            <div class="location">\n' +
    '                {location}' +
    '            </div>\n' +
    '           </div>';

var template2 = '<p>{building}</p>';

var template3 = '<div class="error">暂无信息</div>';

var shUpdate = false, hfUpdate = false;

function extractInfo(data, campusId) {
    var pattern = /<form[\s\S]*<\/form>/g;
    $('.form').html(data.match(pattern)[0]);

    var box;

    $.each($('#user tr'), function (i, val) {
        val = $(val);
        var content = '';
        var locationPattern;

        if (campusId === 1) {
            box = $('#main');
            locationPattern = /(教.楼:[\s\S]*,)|(图书馆:[\s\S]*,)/g;
        }
        else if (campusId === 2) {
            box = $('#sh');
            locationPattern = ''; // TODO
        }
        else {
            box = $('#hf');
            locationPattern = /(宏福.号楼:[\s\S]*,)|(图书馆:[\s\S]*,)/g;
        }

        var time = val.find('td:nth-child(1)').text().trim();
        var location = val.find('td:nth-child(2)').text().trim();
        location.match(locationPattern).forEach(function (value) {
            content += template2.replace('{building}', value);
        });


        var row = template.replace('{time}', time).replace('{location}', content);
        box.append($(row))
    });
}

// 可能会出现 IP 问题
function mainCampus() {
    $.get('http://jwxt.bupt.edu.cn/zxqDtKxJas.jsp', function (data) {
        try {
            extractInfo(data, 1);
        } catch (e) {
            console.log(e);
            $('#sh').html($(template3));
        }
    }, 'text');
}

// 可能会出现 IP 问题
function shaHeCampus() {
    $.get('http://jwxt.bupt.edu.cn/shxqDtKxJas.jsp', function (data) {
        try {
            extractInfo(data, 2);
        } catch (e) {
            console.log(e);
            $('#sh').html($(template3));
        }
    }, 'text');
}

// 可能会出现 IP 问题
function hongFuCampus() {
    $.get('http://jwxt.bupt.edu.cn/hfxqDtKxJas.jsp', function (data) {
        try {
            extractInfo(data, 3);
        } catch (e) {
            console.log(e);
            $('#sh').html($(template3));
        }
    }, 'text');
}

function bindEventForTabs() {
    $('#main-campus').click(function () {
        $('.main > div').addClass('hide');
        $('#main').removeClass('hide');
        $('.tabs li').removeClass('active');
        $(this).addClass('active');
    });
    $('#sh-campus').click(function () {
        shUpdate || shaHeCampus();
        shUpdate = true;
        $('.main > div').addClass('hide');
        $('#sh').removeClass('hide');
        $('.tabs li').removeClass('active');
        $(this).addClass('active');
    });
    $('#hf-campus').click(function () {
        hfUpdate || hongFuCampus();
        hfUpdate = true;
        $('.main > div').addClass('hide');
        $('#hf').removeClass('hide');
        $('.tabs li').removeClass('active');
        $(this).addClass('active');
    });
}

$(document).ready(function () {
    bindEventForTabs();
    mainCampus();
});
