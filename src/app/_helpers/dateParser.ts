import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DateParser {
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

}
