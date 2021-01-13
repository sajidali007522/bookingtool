import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  public template = {"$type": "SearchCriteriaDefinition",
    "displayPriceBucketGaps": true,
    "templateID": "824ab397-9dc4-44f0-a3fc-960248826a92",
    "name": "Shuttle/Shuttle/Room",
    "resources": [
      {
        "$type": "Resource",
        "resourceTypeID": "859fc967-e5d0-4bef-babc-695a3f34b03b",
        "timePropertyID": "00000000-0000-0000-0000-000000000000",
        "timeProperty": "0",
        "requiresEndDate": true,
        "resourceItems": [
          {
            "$type": "ResourceItem",
            "text": "Charter Bus",
            "isBlockable": true,
            "beginTime": "",
            "endTime": ""
          },
          {
            "$type": "ResourceItem",
            "text": "Charter Bus",
            "isBlockable": true,
            "index": 1,
            "beginTime": "",
            "endTime": ""
          }
        ],
        "searchFields": [
          {
            "$type": "SearchField",
            "name": "From",
            "fieldRelation": "881b2c40-8e35-41ea-99a0-93a58f9a23ca",
            "isRequired": true,
            "searchCriteriaID": "51bcf7d0-852c-487c-8c00-68b56fdc727e",
            "type": 2,
            "defaultValue": "",
            "defaultText": "",
            "isLookupSearch": true,
            "regularExpression": "",
            "validationDescription": ""
          },
          {
            "$type": "SearchField",
            "name": "To",
            "fieldRelation": "590b4628-b202-4d5e-9bed-b31305919a73",
            "isRequired": true,
            "searchCriteriaID": "5ba629ee-2ec3-4c89-bd3a-b255c432f173",
            "type": 2,
            "defaultValue": "",
            "defaultText": "",
            "isLookupSearch": true,
            "regularExpression": "",
            "validationDescription": ""
          },
          {
            "$type": "SearchField",
            "name": "Contract",
            "fieldRelation": "9",
            "isRequired": true,
            "searchCriteriaID": "2080eb2f-b67d-4c15-8f75-1b6505e37f5f",
            "defaultValue": "",
            "defaultText": "",
            "isLookupSearch": true,
            "regularExpression": "",
            "validationDescription": ""
          }
        ]
      },
      {
        "$type": "Resource",
        "resourceTypeID": "6301cefd-5b43-4f8d-aa4a-583fd3c05033",
        "timePropertyID": "42e07a55-e2f2-49b3-8253-a30fdc533328",
        "timeProperty": "1440",
        "requiresEndDate": true,
        "resourceItems": [
          {
            "$type": "ResourceItem",
            "text": "Room",
            "index": 2,
            "beginTime": "",
            "endTime": ""
          }
        ],
        "searchFields": [
          {
            "$type": "SearchField",
            "name": "Site",
            "fieldRelation": "SiteID",
            "isRequired": true,
            "searchCriteriaID": "79ebaa26-b35d-4e01-8fe9-92d7419e9196",
            "type": 5,
            "defaultValue": "",
            "defaultText": "",
            "isLookupSearch": true,
            "regularExpression": "",
            "validationDescription": ""
          },
          {
            "$type": "SearchField",
            "name": "Room Type",
            "fieldRelation": "PrimaryFeatureTypeID",
            "isRequired": true,
            "searchCriteriaID": "20c4ca12-6fb8-496d-9668-f7aafc1ca68b",
            "type": 2,
            "defaultValue": "",
            "defaultText": "",
            "isLookupSearch": true,
            "regularExpression": "",
            "validationDescription": ""
          },
          {
            "$type": "SearchField",
            "name": "Contract",
            "fieldRelation": "9",
            "isRequired": true,
            "searchCriteriaID": "81da6832-c6ef-4848-a940-47da6223db37",
            "defaultValue": "",
            "defaultText": "",
            "isLookupSearch": true,
            "regularExpression": "",
            "validationDescription": ""
          }
        ]
      }
    ]
  }
}

