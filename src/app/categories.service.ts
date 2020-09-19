import { Injectable } from '@angular/core';
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  categories;
  constructor(private _http: HttpService) { }

  public loadCategories (children=false) {
    let params = {action : 'load-categories'}
    if(children) {
      params['children'] = children;
    }
    return this._http._get('categories', params);
  }

  public setChildren(categories, category, children) {
    return this.parseChildren(categories, category, children);
  }

  public parseChildren(categories, category, children) {
    for(let i=0; i < categories.length; i++ ) {

      if(categories[i].id == category.id) {
        categories[i].children = children;
        break;
      } else if(categories[i].id != category.id && categories[i].children.length > 0){
        this.parseChildren(categories[i].children, category, children);
      }
    }
    return categories
  }
}
