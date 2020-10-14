function getToday() {
    var today = new Date();

    var year = today.getFullYear();

    var month = parseInt(today.getMonth()) + 1;

    var day = today.getDate();

    if (month < 10) {
        month = '0' + month;
    }

    if (day < 10) {
        day = '0' + day;
    }

    let dateNo = year.toString() + month.toString() + day.toString();

    return dateNo;

}

function strToTime(str) {
   // console.log(str);

    str = str.toString();

    if (str.includes('-')) {
        return str;
    }

    var year = str.substring(0, 4);

    var month = str.substring(4, 6);

    var day = str.substring(6, 8);

    return year + '-' + month + '-' + day;
}


function timeToStr(time) {
   // console.log(time);
   if(!time.includes('-')){
       return time;
   }
   return time.replace(/-/g, "");
}

module.exports = {getToday,strToTime,timeToStr}