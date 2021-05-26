import { Injectable } from '@angular/core';

@Injectable()
export class DateParser {
  private month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  private day =  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  parseDateToTime(date){
    let d = new Date(Date.parse(date));
    let minutes = d.getMinutes() < 10 ? '0'+(d.getMinutes()) : d.getMinutes();
    let hours = d.getHours() < 10 ? '0'+(d.getHours()) : d.getHours();
    return hours+":"+minutes;
  }

  parseDateStringToDate(date){
    let d = new Date(Date.parse(date));
    let month = (d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1) ;
    let day = (d.getDate()) < 10 ? '0'+d.getDate() : d.getDate() ;
    let minutes = d.getMinutes() < 10 ? '0'+(d.getMinutes()) : d.getMinutes();
    let hours = d.getHours() < 10 ? '0'+(d.getHours()) : d.getHours();
    return d.getFullYear()+"-"+month+"-"+day+" "+hours+":"+minutes;
  }

  parseDate(date){
    let d = new Date(Date.parse(date));
    let month = (d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1) ;
    let day = (d.getDate()) < 10 ? '0'+d.getDate() : d.getDate() ;
    return d.getFullYear()+"-"+month+"-"+day;
  }

  formatDate(dateObj) {
    let month = (dateObj.getMonth()+1) < 10 ? '0'+(dateObj.getMonth()+1) : (dateObj.getMonth()+1) ;
    let day = (dateObj.getDate()) < 10 ? '0'+dateObj.getDate() : dateObj.getDate() ;
    return dateObj.getFullYear()+"-"+month+"-"+day;
  }

  formatDateToTime(dateObj) {
    let month = (dateObj.getMonth()+1) < 10 ? '0'+(dateObj.getMonth()+1) : (dateObj.getMonth()+1) ;
    let day = (dateObj.getDate()) < 10 ? '0'+dateObj.getDate() : dateObj.getDate() ;
    let minutes = dateObj.getMinutes() < 10 ? '0'+(dateObj.getMinutes()) : dateObj.getMinutes();
    let hours = dateObj.getHours() < 10 ? '0'+(dateObj.getHours()) : dateObj.getHours();

    return dateObj.getFullYear()+"-"+month+"-"+day+" "+hours+":"+minutes;
  }

  formatDateForCart(date) {
    let d = new Date(Date.parse(date));
    let month = (d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1) ;
    let day = (d.getDate()) < 10 ? '0'+d.getDate() : d.getDate() ;
    return this.day[d.getDay()]+', '+ this.month[d.getMonth()]+' '+day;
  }

  formatDateBy12HourTime(date) {
    let d = new Date(Date.parse(date));
    let minutes = d.getMinutes() < 10 ? '0'+(d.getMinutes()) : d.getMinutes();
    let hours = d.getHours() < 10 ? '0'+(d.getHours()) : d.getHours();
    return (d.getHours()%12)+":"+minutes + (d.getHours()/12 >=1 ? ' PM' : ' AM');
  }

  calculateDifferenceInTime(beginDate, endDate) {
    if(!beginDate || !endDate) return;
    console.log(new Date(Date.parse(beginDate)).getTime(), new Date(Date.parse(endDate)).getTime())
    let date1 = new Date(Date.parse(beginDate)).getTime()
    let date2 = new Date(Date.parse(endDate)).getTime()
    var diff = date2 - date1;
    var diff_as_date = new Date(diff);
    console.log(diff_as_date)
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    var str = '';
    if(hours > 0 ) {
      str += hours+' hours '
    }
    return str+minutes+' minutes'; // hours
  }

}
