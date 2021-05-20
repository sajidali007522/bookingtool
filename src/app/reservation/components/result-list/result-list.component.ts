import {AfterViewInit, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {LabelType, Options} from "ng5-slider";
import {HttpService} from "../../../http.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as $ from "jquery";
import {split} from "ts-node";
import {ReservationServiceV4} from "../../../_services/reservation_v4.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../../auth.service";
import {DateParser} from "../../../_helpers/dateParser";

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css']
})
export class ResultListComponent implements OnInit,AfterViewInit {
  @ViewChild('policyListFilter') policyListFilter;
  @ViewChild('airlineListFilter') airlineListFilter;
  value: number = 40;
  highValue: number = 60;
  options: Options = {
    floor: 0,
    ceil: 100
  };
  state= {
    sortFilter: 'LowestPrice',
    replacement:{
      cartIndex:-1,
      uniqueId:''
    },
    selectedIndece: 0,
    selectedResource: {},
    searchSkeleton: {},
    searchIndeces: [],
    sessionID: '',
    resourceTypeID: '',
    gridCell: '00',
    resources: [],
    bookingContentArea: false,
    bookingID: '',
    searchId: '',
    grid_filter: '',
    processing: false,
    cart: [],
    metaDataGridOptions: [],
    bookingRows: [],
    gridFilter: {
      totalResults: 0,
      rows: [],
      columns: []
    },
    price : {
      metadataitems:[],
      options: {
        floor: 0,
        ceil: 100
      }
    },
    arrival: {
      metadataitems:[],
      options: {
        floor: 0,
        ceil: 24
      }
    },
    departure: {
      metadataitems:[],
      options: {
        floor: 0,
        ceil: 24
      }
    },
    maxStoptime: {
      metadataitems:[],
      interval: 1,
      options: {
        floor: 0,
        ceil: 24
      }
    },
    filterBk:{
      price : {
        value: 40,
        highValue: 60
      },
      arrival: {
        value: 12,
        highValue: 18
      },
      departure: {
        value: 12,
        highValue: 18
      },
      maxStoptime: {
        value: 12,
        highValue: 18
      },
      policy:[],
      airlines:[],
      stops:[],
      channel: [],
      options: [],
      connectingCity: [],
      fareType: []
    },
    filter:{
      price : {
        value: 40,
        highValue: 60
      },
      arrival: {
        value: 12,
        highValue: 18
      },
      departure: {
        value: 12,
        highValue: 18
      },
      maxStoptime: {
        value: 12,
        highValue: 18
      },
      policy:[],
      airlines:[],
      stops:[],
      channel: [],
      options: [],
      connectingCity: [],
      fareType: []
    },
    records:{}
  }

  constructor( private renderer: Renderer2,
               private router: Router,
               private _http: HttpService,
               private activatedRoute: ActivatedRoute,
               public resService:ReservationServiceV4,
               private toastr: ToastrService,
               private dateParse: DateParser,
  ) {
    this.renderer.removeClass(document.body, 'menu-fullwidth');
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.state.bookingID = params["booking_id"];
      this.state.sessionID = params["session_id"];
      this.state.resourceTypeID = params['resource_typeid'];
    });
    console.log(this.state.bookingID, this.state.searchId )
    //this.state.resources = JSON.parse(window.localStorage.getItem('resources')) || this.state.resources;
    ///api4/booking/{bookingID}/SearchCriteriaDefinition/{resourceTypeID}
    this.state.processing=true;
    this.resService.getSearchCriteriaForResource(this.state.bookingID, this.state.resourceTypeID, {sessionID: this.state.sessionID}).subscribe(
      res => {
        this.state.resources = res['data']['resources'];
        this.state.searchSkeleton = res['data'];
        this.state.selectedResource =this.state.resources[0]['resourceItems'][0];
        this.resService.makeSearch(this.state.bookingID, this.prepareBodyForSearchID(res['data']), {sessionID: this.state.sessionID})
          .subscribe(data => {
              console.log(data);
              //     this.state.selectedTemplate['resources'][resourceIndex]['searching'] = false;
              this.state.searchId = data['data']['searchID'];
              this.state.searchIndeces = data['data']['searchIndeces']
              this.state.selectedIndece = 0;
              this.checkSearchStatus();
            },
            err => {
              console.log(err)
            });
      },
      err => {
        console.log(err);
      }
    )


    //this.getSortFields();
  }

  selectResource(resource, resourceIndex, itemIndex, searchIndex) {
    this.state.selectedResource= resource;
  }
  toggleAccordion(ele:any){
    //console.log(ele.target)
    $(ele.target).parents('.accordion-group').toggleClass('group-active')
  }
  prepareBodyForSearchID(data){
    let selectedItems = []
    let index=0;
    data.resources.filter(resource=>{
      console.log(resource)
      resource.resourceItems.filter(rItem=> {
        let items = {
          "isReturn": rItem.isReturn,
          "beginDate": ( rItem.isReturn ? this.dateParse.parseDate(rItem['endDate']) : this.dateParse.parseDate(rItem['beginDate'])),
          "endDate": this.dateParse.parseDate(rItem['endDate']),
          "beginTime": (rItem['beginTime'] ? this.dateParse.parseDate(rItem['beginTime']) : ""),
          "endTime": (rItem['beginTime'] ? this.dateParse.parseDate(rItem['beginTime']) : ""),
          "searchIndeces": [0],
          "selectedItems": [],
        };
        resource.searchFields.filter(field=>{
          items.selectedItems.push(
            {
              "relation": field.fieldRelation,
              "selection": field.defaultValue,
              "type": 1,
              "selectionText": field.defaultText
            }
          )
        })
        selectedItems.push(items)
      })

    });

    return {
      "resourceTypeID": this.state.resourceTypeID,
      "criteria": selectedItems
    }

  }

  ngAfterViewInit() {
    // $("body").on("click", ".accordon-heading a", function(){
    //   $(this).parent().parent().toggleClass('group-active');
    // });
    $(document).on("click", '.display-detail', function(){
      $(this).parents('.article-content-booking').find('.more-reservation-wrap').slideToggle();
    });
  }

  checkSearchStatus () {
    this.state.processing = true;
    //this._http._get('booking/'+this.state.bookingID+'/Search/'+this.state.searchId, {sessionID: this.state.sessionID})
    this.resService.getSearchStatus(this.state.bookingID, this.state.searchId,  {sessionID: this.state.sessionID})
      .subscribe(data => {
        if(data['status'] != 500 ) {
          if(data['data']['isCompleted']) {
            this.state.processing = false;
            this.getSortFields();
          } else {
            this.checkSearchStatus();
          }
        } else {
          this.state.processing = false;
          let err = data['message'].split('.');
          this.toastr.error(err[0], 'Error!');
        }
      })
  }

  getSortFields () {
    // /api2/booking/{bookingID}/GetSearchSortFields/{searchID}/{searchIndex}
    this.state.processing=true;
    //this._http._get('booking/'+this.state.bookingID+'/GetSearchSortFields/'+this.state.searchId+'/0', {})
    this.resService.getSortFields(this.state.bookingID, this.state.searchId, this.state.searchIndeces[this.state.selectedIndece] , {sessionID: this.state.sessionID})
      .subscribe(data => {
        this.state.processing=false;
        this.getSearchResults();
      },
        error => {
        this.state.processing = false;
        console.log(error);
        });
  }

  selectIt (bookRow, bookIndex, currentItem, priceArray) {
    this.shakeIt(true);
    // let check = currentItem.values2.$selected;
    // if(check) {
    //   this.markAsAddedToCart(bookRow, bookIndex, currentItem, check);
    //   return;
    // }
    let check = false
    currentItem.$isProcessing = true;
    let postBody = [];
    postBody.push({
      cartPreview: {
        UniqueID: bookRow.UniqueID,
        provider: bookRow.ProviderName,
        providerLogo: bookRow.ProviderLogo.split('.png').join('_50.png'),
        Date: this.getDateFromDateTime(bookRow.BeginDate),
        From: this.formatDateIntoTime(bookRow.BeginDate) + ": " + bookRow.From,
        To: this.formatDateIntoTime(bookRow.EndDate) + ": " + bookRow.To,
        Price: currentItem,
        searchIndece: this.state.selectedIndece
      },
      "resultID": bookRow.UniqueID,
      "searchID": this.state.searchId,
      "searchIndex": this.state.searchIndeces[this.state.selectedIndece],
      "priceID": currentItem.values2.UniqueID,
      "beginDate": this.parseDateIntoObject(bookRow.BeginDate).toDateString(),
      "endDate": this.parseDateIntoObject(bookRow.EndDate).toDateString(),
      "resourceTypeID":  "00000000-0000-0000-0000-000000000000",//"ecf6f1a3-8867-40cc-8118-5defb120d5ee",
      "isReturn": false,
      "timePropertyID": "00000000-0000-0000-0000-000000000000",
      "beginTime": "",
      "endTime": "",
      "isDynamic": false
    });
    //console.log(this.state.searchIndeces, this.state.selectedIndece, postBody)
    if((this.state.selectedIndece+1) <= this.state.searchIndeces.length){
      this.state.selectedIndece = this.state.selectedIndece+1;
      if(this.state.replacement.cartIndex>=0){
        this.state.cart.splice(this.state.replacement.cartIndex, 1)
      }
      this.state.cart.push(postBody[0]);
      this.state.replacement.cartIndex=-1;
      this.state.replacement.uniqueId='';
      if(this.state.selectedIndece < this.state.searchIndeces.length){
        this.getSearchResults()
        return;
      }
      //this.markAsAddedToCart(bookRow, bookIndex, currentItem, check, JSON.stringify(postBody[0]))

    }

    //this._http._post('booking/'+this.state.bookingID+'/Book',postBody,
    if(this.state.processing) return;
    this.state.processing=true;
    let cart = JSON.parse(JSON.stringify(this.state.cart));
    cart.filter(item=>{delete item['cartPreview']})
    this.resService.bookResource(this.state.bookingID, cart,
      {resourceTypeID: "ECF6F1A3-8867-40CC-8118-5DEFB120D5EE", sessionID: this.state.sessionID})
      .subscribe(data => {
        currentItem.$isProcessing = false;
        this.state.processing=false;
        if(data['status'] == 500) {
          let err = data['message'].split('.');
          this.toastr.error(data['message'], 'Error!');
          this.state.selectedIndece = this.state.selectedIndece-1;
          this.state.cart.splice(this.state.cart.length-1, 1)
        }
        else {
          this.state.processing=false;
          if (data['data']['allResourceBooked']) {
            this.router.navigate(['/reservation/' + this.state.bookingID + '/business-profile/' + this.state.sessionID]);
          } else {
            this.state.selectedIndece = this.state.selectedIndece + 1;
            this.getSearchResults()
            this.markAsAddedToCart(bookRow, bookIndex, currentItem, check, String(data))
          }
        }
    })


  }

  markAsAddedToCart(bookRow, bookIndex, currentItem, check, searchRes= '') {
    this.state.bookingRows.filter(r => {
      r.bookingChannels = this.resetBookingChannels(r.bookingChannels);
    })

    if(!check) {
      this.state.cart= [];

      this.state.cart.push({
        UniqueID: bookRow.UniqueID,
        provider: bookRow.ProviderName,
        providerLogo: bookRow.ProviderLogo.split('.png').join('_50.png'),
        Date: this.getDateFromDateTime(bookRow.BeginDate),
        From: this.formatDateIntoTime(bookRow.BeginDate)+": "+bookRow.From,
        To: this.formatDateIntoTime(bookRow.EndDate)+": "+bookRow.To,
        Price: currentItem,
        postResponse: searchRes
      });
      currentItem.values2.$selected = true;
    }
    else {
      let index =0;
      let removeMe = -1;
      this.state.cart.filter(function(c){
        if(c.UniqueID == bookRow.UniqueID){
          removeMe = index;
        }
        index++;
      });

      this.state.cart.splice(removeMe, 1);
      currentItem.values2.$selected = false;
    }
    this.shakeIt();
  }

  shakeIt(remove=false) {
    if(remove) {
      $(document).find(".booking-article-bot a.new-booking").removeClass('shakeClass');
      console.log("removed");
    } else {
      console.log("shaked");
      $(document).find(".booking-article-bot a.new-booking").addClass('shakeClass');
    }
  }

  removeItemFromCart(UniqueId, index, priceId) {
    this.shakeIt(true);
    /*this.state.bookingRows.filter(row => {
      //console.log(row.values2.UniqueID == UniqueId, row.values2.UniqueID, '==', UniqueId)
      if(row.values2.UniqueID == UniqueId) {
        row.bookingChannels = this.resetBookingChannels(row.bookingChannels);
      }
    });*/
    this.state.selectedIndece=this.state.cart[index].cartPreview.searchIndece;
    this.getSearchResults();
    this.state.cart.splice(index, 1);
    /*if(this.state.cart.length == 0) {
      this.toggleBookingContentArea(false);
    }*/
    this.shakeIt();
    this.toggleBookingContentArea(false)
  }

  reselectResource(uniqueId, index, priceId){
    console.log(this.state.cart)
    this.state.selectedIndece=this.state.cart[index].cartPreview.searchIndece;
    this.state.replacement.cartIndex=index;
    this.state.replacement.uniqueId =priceId;
    this.getSearchResults();
    this.toggleBookingContentArea(false)
  }

  resetBookingChannels(bookingChannels){
    bookingChannels.filter(function(channel){
      channel.prices.filter(function( p ){
        p.values2.$selected = false;
      })
    });
    return bookingChannels;
  }
  setGridCell (cell){
    this.state.gridCell = cell;
  }
  filterResultSet ( item) {
    this.applyFilters(item);
  }

  filterResultSetByGrid ( items, row:number, column:number = -1, isMultipleArray:boolean=false ) {
    this.resetFilterState('none');
    this.resetPriceState('');
    if(isMultipleArray){
      for (let i=0; i < this.state.gridFilter.rows.length; i++) {
        if (i != row && row != -1) { continue; }
        this.parseFilterResultSetByGrid(this.state.gridFilter.rows[i].items, row, (column == -1 ? -100 : column));
      }
    }
    else {
      this.parseFilterResultSetByGrid(items, row, column);
    }
  }

  parseFilterResultSetByGrid(items, row, column) {
    console.log(row, column);
    for (let i=0; i < items.length; i++) {
      if(i!=column && column != -100) { continue;}
      if(i==column || column == -100) {
        items[i].bookingItemIDs.filter((bookId) => {
          console.log(this.makeValidEleId(bookId))
          if(bookId) {
            bookId = this.makeValidEleId(bookId);
            this.setStyleProperty("div_" + bookId, 'display', '');
          }
        });
      }
    }
  }

  resetFilterState (displayProp='') {
    $(document).find(".article-content-booking").css({'display': displayProp});
  }

  resetPriceState (displayProp ='') {
    $(document).find(".article-content-booking td").css({'display': displayProp});
  }

  filterSlider (type) {
    switch (type) {
      case 'price':
          this.filterBySlider(this.state.price.metadataitems, this.state.filter.price);
        break;
      case 'departure':
        this.filterDateTimeBySlider(this.state.departure.metadataitems, this.state.filter.departure);
        break;
      case 'arrival':
        this.filterDateTimeBySlider(this.state.arrival.metadataitems, this.state.filter.arrival);
        break;
      case 'max-stops':
        this.filterDateTimeBySlider(this.state.maxStoptime.metadataitems, this.state.filter.maxStoptime, false, this.state.maxStoptime.interval);
        break;
    }
  }
  showResultSet() {

  }
  applyFilters (item) {
    if(item.priceIDs.length > 0) {
      item.priceIDs.filter((price) => {
        price.priceIDs.filter((id) => {
          if(id) {
            id = this.makeValidEleId(id);
            if (item.checked) {
              this.setStyleProperty("price_" + id, 'display', '');
            } else {
              this.setStyleProperty("price_" + id, 'display', 'none');
            }
          }
        });
      });
    }
    if(item.priceIDs.length == 0) {
      item.bookingItemIDs.filter((bookId) => {
        if(bookId) {
          bookId = this.makeValidEleId(bookId);
          if (item.checked) {
            this.setStyleProperty("div_" + bookId, 'display', '');
          } else {
            this.setStyleProperty("div_" + bookId, 'display', 'none');
          }

        }
      });
    }
  }

  filterBySlider (metadataItems, range) {
    this.resetFilterState('none');
    this.resetPriceState('none');
    metadataItems.filter((row) => {
      //console.log((row.key*multiplier), '<=', range.highValue, '&&', (row.key*multiplier), '>=', range.value);
      if(row.key <= range.highValue && row.key >= range.value ) {
        if(row.priceIDs.length > 0 ) {
          this.hidePriceCells(row.priceIDs, '');
        }
        this.setBookItemsState(row.bookingItemIDs, 'none', true);
      }
    });
  }

  filterDateTimeBySlider (metadataItems, range, isDate = true, multiplier=1) {
    this.resetFilterState('none');
    this.resetPriceState('');
    metadataItems.filter((row) => {
      //console.log(Date.parse(row.key), '<=', range.highValue || Date.parse(row.key) >= range.value)
      if(Date.parse(row.key) <= range.highValue && Date.parse(row.key) >= range.value && isDate) {
        this.setBookItemsState(row.bookingItemIDs, '');
      }
      if((row.key*multiplier) <= range.highValue && (row.key*multiplier) >= range.value && !isDate) {
        this.setBookItemsState(row.bookingItemIDs, '');
      }
    });
  }

  setBookItemsState(bookingItems, prop, checkCell=false) {
    bookingItems.filter((bookId) => {

      if($("#div_"+this.makeValidEleId(bookId)).find('td:visible').length == 0 && checkCell) {
        this.setStyleProperty("div_" + this.makeValidEleId(bookId), 'display', prop);
      }

      if($("#div_"+this.makeValidEleId(bookId)).find('td:visible').length == 0 && !checkCell) {
        this.setStyleProperty("div_" + this.makeValidEleId(bookId), 'display', prop);
      }
    })
  }

  hidePriceCells (priceIDs, prop) {
    priceIDs.filter((price) => {
      this.setStyleProperty("div_" + this.makeValidEleId(price.bookingItemID), 'display', '');
      price.priceIDs.filter((id)=> {
        if(id) {
          this.setStyleProperty("price_" + this.makeValidEleId(id), 'display', prop);
        }
      });
    });
  }

  setStyleProperty (ele, property, value) {
    //console.log(ele);
    document.getElementById(ele).style[property] = value;
  }
  makeValidEleId (string) {
    return (''+string).replace(/[|/:\s]/g,'_');
  }

  getSearchResults () {
    // /api2/booking/{bookingID}/SearchResults/{searchID}
    this.state.processing=true;
    //this._http._get('booking/'+this.state.bookingID+'/SearchResults/'+this.state.searchId+'', {
    this.resService.getSearchResults(this.state.bookingID, this.state.searchId,  this.state.searchIndeces[this.state.selectedIndece] ,{
      sessionID: this.state.sessionID,
      flattenValues: true,
      searchIndex: this.state.searchIndeces[this.state.selectedIndece] ,
      sortProperties:this.state.sortFilter,
      isAscending: true,
      bookingItemProperties: 'BeginDate|EndDate|From|FromName|To|ToName|ProviderName|UniqueID|ProviderLogo|ConnectionDescriptionExtended|FullConnectionDescription|SegmentCount|Provider',
      priceProperties: 'TotalPrice|UniqueID|GetFareNameShort|BasePrice',
      tripProperties: 'BeginDate|EndDate|From|FromName|To|ToName|ProviderName|ProviderLogo|Provider|Identifier'
    })
      .subscribe(res => {
          if(res['success']) {
            let data = res['data']
            //setting up data to render
            for (let index = 0; index < data['metadata'].length; index++) {
              //checking for price
              if (data['metadata'][index].name == 'Price' && data['metadata'][index]['metadataItems'].length > 0 ) {

                this.state.filter.price.value = Number(data['metadata'][index]['metadataItems'][0].key);
                this.state.filter.price.highValue = Number(data['metadata'][index]['metadataItems'][data['metadata'][index]['metadataItems'].length - 1].key);
                this.state.price.options.floor = Number(data['metadata'][index]['metadataItems'][0].key);
                this.state.price.options.ceil = Number(data['metadata'][index]['metadataItems'][data['metadata'][index]['metadataItems'].length - 1].key);
                this.state.price.options['step'] = data['metadata'][index].interval;
                this.state.price.metadataitems = data['metadata'][index].metadataItems;

              }
              //checking for Departure
              if (data['metadata'][index].name == "Departure" && data['metadata'][index]['metadataItems'].length > 0) {

                this.state.filter.departure.value = Date.parse(data['metadata'][index]['metadataItems'][0].key);
                this.state.filter.departure.highValue = Date.parse(data['metadata'][index]['metadataItems'][data['metadata'][index]['metadataItems'].length - 1].key);
                this.state.departure.options.floor = Date.parse(data['metadata'][index]['metadataItems'][0].key);
                this.state.departure.options.ceil = Date.parse(data['metadata'][index]['metadataItems'][data['metadata'][index]['metadataItems'].length - 1].key)
                this.state.departure.options['step'] = data['metadata'][index].interval;
                this.state.departure.metadataitems = data['metadata'][index].metadataItems;
                this.state.departure.options['translate'] = (value: number, label: LabelType): string => {
                  return this.parseTime(value)
                }
              }
              //checking for arrival
              if (data['metadata'][index].name == "Arrival" && data['metadata'][index]['metadataItems'].length > 0) {
                this.state.filter.arrival.value = Date.parse(data['metadata'][index]['metadataItems'][0].key);
                this.state.filter.arrival.highValue = Date.parse(data['metadata'][index]['metadataItems'][data['metadata'][index]['metadataItems'].length - 1].key);
                this.state.arrival.options.floor = Date.parse(data['metadata'][index]['metadataItems'][0].key);
                this.state.arrival.options.ceil = Date.parse(data['metadata'][index]['metadataItems'][data['metadata'][index]['metadataItems'].length - 1].key)
                this.state.arrival.options['step'] = data['metadata'][index].interval;
                this.state.arrival.metadataitems = data['metadata'][index].metadataItems;
                this.state.arrival.options['translate'] = (value: number, label: LabelType): string => {
                  return this.parseTime(value)
                }
              }
              //checking for Max Number of Stops
              if (data['metadata'][index].name == "Max Stop Time" && data['metadata'][index]['metadataItems'].length > 0) {
                this.state.filter.maxStoptime.value = Number(data['metadata'][index]['metadataItems'][0].key) * data['metadata'][index].interval;
                this.state.filter.maxStoptime.highValue = Number(data['metadata'][index]['metadataItems'][data['metadata'][index]['metadataItems'].length - 1].key) * data['metadata'][index].interval;
                this.state.maxStoptime.options.floor = Number(data['metadata'][index]['metadataItems'][0].key) * data['metadata'][index].interval;
                this.state.maxStoptime.options.ceil = Number(data['metadata'][index]['metadataItems'][data['metadata'][index]['metadataItems'].length - 1].key) * data['metadata'][index].interval;
                this.state.maxStoptime.options['step'] = data['metadata'][index].interval;
                this.state.maxStoptime.metadataitems = data['metadata'][index].metadataItems;
                this.state.maxStoptime.interval = data['metadata'][index].interval;
                this.state.maxStoptime.options['translate'] = (value: number, label: LabelType): string => {
                  if (value <= 0) {
                    return 'non stop';
                  }
                  let hour = Math.floor(value / 60);
                  let mins = value % 60;
                  return hour + " hours and " + mins + "Minutes";
                }
              }
              //checking for Policy
              if (data['metadata'][index].name == "Policy") {
                this.state.filter.policy = this.renderMetaDataItems(data['metadata'][index], "checkbox");
              }
              //checking for Airlines
              if (data['metadata'][index].name == "Airlines") {
                this.state.filter.airlines = this.renderMetaDataItems(data['metadata'][index], 'checkbox');
              }
              //checking for Airlines
              if (data['metadata'][index].name == "Stops") {
                this.state.filter.stops = this.renderMetaDataItems(data['metadata'][index], 'checkbox');
              }
              //checking for Airlines
              if (data['metadata'][index].name == "Channel") {
                this.state.filter.channel = this.renderMetaDataItems(data['metadata'][index], 'checkbox');
              }
              //checking for Airlines
              if (data['metadata'][index].name == "Options") {
                this.state.filter.options = this.renderMetaDataItems(data['metadata'][index], 'checkbox');
              }
              //checking for Airlines
              if (data['metadata'][index].name == "Connecting City") {
                this.state.filter.connectingCity = this.renderMetaDataItems(data['metadata'][index], 'checkbox');
              }
              //checking for Airlines
              if (data['metadata'][index].name == "Fare Type") {
                this.state.filter.fareType = this.renderMetaDataItems(data['metadata'][index], 'checkbox');
              }
            }
            this.state.filterBk = this.copyObject(this.state.filter);
            this.state.processing = false;
            if(data['metadataGridOptions'].length > 0 ) {
              this.state.metaDataGridOptions = data['metadataGridOptions'];
              this.state.grid_filter = data['metadataGridOptions'][0].value;
              this.state.bookingRows = data['results'];
              this.renderFilterGrid();
            }
          }
        },
        error => {
        this.state.processing = false;
        console.log(error);
        },
        ()=>{
          if(this.state.cart.length > 0){
            this.state.replacement.uniqueId = '';
            this.state.cart.filter(item=>{
              if(item.cartPreview.searchIndece == this.state.selectedIndece){
                this.state.replacement.uniqueId = item.priceID
              }
            })
          }
        })
  }

  copyObject( obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  renderMetaDataItems (metaData, type) {
    var returnObj= [];
    if(type == 'checkbox') {
      // <li><label for="airCanada"><input type="checkbox" class="checkbox" id="airCanada"> Air Canada <span class="label-num">$294</span> </label></li>
      if(metaData.metadataItems.length > 0) {
        for (let i =0; i< metaData.metadataItems.length; i++) {
          returnObj.push({
            label: metaData.metadataItems[i].name,
            value: metaData.metadataItems[i].key,
            id: metaData.metadataItems[i].name.split(" ").join("_"),
            price: metaData.metadataItems[i].minPrice,
            checked: true,//metaData.metadataItems[i].isSelected,
            priceIDs: metaData.metadataItems[i].priceIDs,
            bookingItemIDs: metaData.metadataItems[i].bookingItemIDs
          })
        }
      }
      return returnObj;
    }
  }

  renderFilterGrid () {
    this.state.processing=true;
    ///api2/booking/{bookingID}/SearchFilterGrid/{searchID}/{searchIndex}/{columnMetadataKey}/{rowMetadataKey}
    let filterOption = this.state.grid_filter.split("|");
    //this._http._get('booking/'+this.state.bookingID+'/SearchFilterGrid/'+this.state.searchId+'/0/'+filterOption[0]+"/"+filterOption[1], {})
    this.resService.renderFilterGrid(this.state.bookingID, this.state.searchId,  this.state.searchIndeces[this.state.selectedIndece], filterOption[0], filterOption[1], {sessionID: this.state.sessionID})
      .subscribe(res => {
        if(res['success']) {
          let data = res['data']
          this.state.processing = false;
          this.state.gridFilter.rows = data['rows'];
          this.state.gridFilter.columns = data['columns'];
          this.state.gridFilter['totalResults'] = data['totalResults'];
          //this.resetFilterState();
          //this.setGridCell('00');
          //this.resetFilters();
        }
      });
  }

  parseTime(miliseconds) {
    let d = new Date(miliseconds); // this will translate label to time stamp.
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let minut = minutes < 10 ? '0'+minutes : minutes;
    return hours + ':' + minut + ' ' + ampm;
  }

  parseDateIntoObject(date) {
    return new Date(Date.parse(date));
  }

  parseDate (date, param) {
    let d = this.parseDateIntoObject(date);
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    if(param == 'month') {
      return month[d.getMonth()];
    }
    if (param == 'date') {
      return d.getDate();
    }
  }

  getDateFromDateTime (date) {
    let d = date.split(" ");
    return d[0];
  }
  skipSeconds(date){
    let d = date.split(" ");
    let hours = d[1].split(":");
    return d[0]+" "+hours[0]+":"+hours[1]+" "+d[2];
  }

  formatDateIntoTime(date) {
    let d = date.split(" ");
    let hours = d[1].split(":");
    return hours[0]+":"+hours[1]+" "+d[2];
  }

  toggleBookingContentArea (state) {
    this.state.bookingContentArea = state;
  }

  resetFilter(filter, object=[]) {
    switch (filter) {
      case 'price':

        break;
      case 'departure':
        break;
      case 'arrival':
        break;
      case 'max-stops':
        break;
      case 'policy':
      case 'airlines':
      case 'stops':
      case 'options':
      case 'connecting-city':
      case 'fare-type':
        this.resetLeftFilters(object);
        break;

    }
  }

  resetFilters () {
    this.state.filter = this.copyObject(this.state.filterBk);
    $(document).find(".content-booking-wrapper > div").css({'display': ''});
    $(document).find(".content-booking-wrapper > div td").css({'display': ''});
  }

  resetLeftFilters(object) {
    let metaDataItems=[];
    let PriceItems= [];

    object.filter(obj=>{
      obj.checked=true;
      PriceItems = PriceItems.concat(obj.priceIDs)
      metaDataItems = metaDataItems.concat(obj.bookingItemIDs);
    });

    metaDataItems.filter(bookId => {
      bookId = this.makeValidEleId(bookId);
      this.setStyleProperty("div_" + bookId, 'display', '');
    });
    PriceItems.filter(price => {
      price.priceIDs.filter((id) => {
        id = this.makeValidEleId(id);
        this.setStyleProperty("price_" + id, 'display', '');
      });
    });
  }

  setFilterStateByGrid(row, column){
    // console.log(column);
    // console.log(row);
    // console.log(this.state.gridFilter.columns, this.state.gridFilter.columns[column]);
    let filter = this.state.grid_filter.split("|");//filter=>0 column, filter => 1 ----- row
    this.setRows(filter[1], row)
    this.setColumns(filter[0], column)
  }

  setRows(row, targetRow){
    console.log(row, targetRow);
    if(targetRow < 0) { return; }
    let targetR=this.state.gridFilter.rows[targetRow];
    switch (row) {
      case 'Provider':
        this.setFilterState(this.state.filter.airlines, targetR);
        break;
      case 'Connection'://ConnectionCity|Provider
        this.setFilterState(this.state.filter.stops, targetR);
        break;
      case 'ConnectionCity'://ConnectionCity|Provider
        this.setFilterState(this.state.filter.connectingCity, targetR);
        break;
      case 'ConnectionCountry'://ConnectionCity|Provider
        //this.setFilterState(this.state.filter.options, targetR);
        break;
      case 'FareBucket'://ConnectionCity|Provider
        this.setFilterState(this.state.filter.fareType, targetR);
        break;
    }
  }

  setColumns(column, targetColumn){
    console.log(column, targetColumn);
    if(targetColumn < 0) { return; }
    let col = this.state.gridFilter.columns[targetColumn];
    switch (column) {
      case 'Connection':
        this.setFilterState(this.state.filter.stops, col);
        break;
      case 'ConnectionCity'://ConnectionCity
        this.setFilterState(this.state.filter.connectingCity, col);
        break;
      case 'ConnectionCountry'://ConnectionCity
        //this.setFilterState(this.state.filter.options, col);
        break;
      case 'FareBucket'://ConnectionCity
        this.setFilterState(this.state.filter.fareType, col);
        break;
      case 'Provider'://ConnectionCity
        this.setFilterState(this.state.filter.airlines, col);
        break;
    }
  }

  setFilterState(object, checkObject) {
    object.filter(r=>{
      if(r.value !== checkObject.key){
        r.checked = false;
      }
      if(r.value === checkObject.key) {
        r.checked = true;
      }
    });
  }

}
