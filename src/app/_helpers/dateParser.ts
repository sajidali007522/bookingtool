import { Injectable } from '@angular/core';

@Injectable()
export class DateParser {
  parseDateToTime(date){
    let d = new Date(Date.parse(date));
    return d.getHours()+":"+d.getMinutes();
  }

  parseDateStringToDate(date){
    let d = new Date(Date.parse(date));
    let month = (d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1) ;
    let day = d.getDay() < 10 ? '0'+d.getDay() : d.getDay();
    return d.getFullYear()+"-"+month+"-"+day+" "+d.getHours()+":"+d.getMinutes();
  }

  parseDate(date){
    let d = new Date(Date.parse(date));
    let month = (d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1) ;
    let day = d.getDay() < 10 ? '0'+d.getDay() : d.getDay();
    return d.getFullYear()+"-"+month+"-"+day;
  }

}
