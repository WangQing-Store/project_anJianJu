export function filterTime(time:any) {
    if (time== null) {
        return '';
    }
    let d = new Date(time);
    if (d.getHours() < 10) {
        var Hours: string | number = '0' + d.getHours();
    } else {
        var Hours: string | number = d.getHours();
    }
    if (d.getMinutes() < 10) {
        var Minutes: string | number = '0' + d.getMinutes();
    } else {
        var Minutes: string | number = d.getMinutes();
    }
    if (d.getSeconds() < 10) {
        var Seconds: string | number = '0' + d.getSeconds();
    } else {
        var Seconds: string | number = d.getSeconds();
    }
    let installtime =d.getFullYear() +'-' +(d.getMonth() + 1) +'-' +d.getDate() + '   ' +Hours +':' + Minutes + ':' +Seconds;
    return installtime;
}