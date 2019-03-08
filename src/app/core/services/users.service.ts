import { Injectable } from '@angular/core';
import { Area } from '../models';
import { ApiService } from './api.service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable ,  BehaviorSubject ,  ReplaySubject, Subject } from 'rxjs';
import { map ,  distinctUntilChanged } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
declare const google: any;

@Injectable()
export class UsersService {
    private postalData = new BehaviorSubject<any>(null);
    private apiData = new BehaviorSubject<any>(null);
    private cartData = new BehaviorSubject<any>(null);
    public apiData$ = this.apiData.asObservable();
    public postalData$ = this.postalData.asObservable();
    public cartData$ = this.cartData.asObservable();
    deviceInfo = null;

    constructor(private apiService: ApiService, private http:HttpClient, private deviceService: DeviceDetectorService
    ) {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        // console.log("deviceInfo", this.deviceInfo);
     }

    loggedUser(data) {
      this.apiData.next(data);
    }

    setPostalCode(data) {
      this.postalData.next(data);
    }

    setAddedCart(data) {
        console.log("cart data", data);
        this.cartData.next(data);
      }

    getArea(username: string): Observable<Area> {
        return this.apiService.get('SearchArea/s/' + username + '?json=true')
            .pipe(map((data) => data));
    }

    // getpcode(latitude:any,longitude:any): Observable<Area> {
    // //     const httpHeaders = new HttpHeaders();
    // //     const api="https://xn--hemkrtochklart-ypb.se/get_pincode.php?lat="+latitude+"&long="+longitude;
    // //   //.set('Content-Type'https://xn--hemkrtochklart-ypb.se/get_pincode.php?lat=9.939093&long=78.121719
    // //   httpHeaders.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8');
    // //    return this.http.get(api,{responseType: 'text'}).pipe(this.extractData);//.pipe(map((res:any) =>res));
    // return this.apiService.pcode(latitude,longitude )
    // .pipe(map((data) => data));
    // }

    private extractData(res) {
        let body = res;
        return body || { };
    }
    // https://xn--hemkrtochklart-ypb.se/api/ClientSignup/email_address/ganeshkumar2@inspirepro.eu/password/hazardous/first_name/ganesh/last_name/karthik/contact_phone/9898989898
    clientRegister(credential: any): Observable<any> {
        return this.apiService.get('ClientSignup/email_address/' + credential.email + 
                                    '/password/' + credential.password + 
                                    '/first_name/'+ credential.firstName +
                                    '/last_name/'+ credential.lastName +
                                    '/contact_phone/'+ credential.mobileNumber+
                                    '?json=true')
        .pipe(map((data) => data));

    }

    clientLogin(credential: any): Observable<any> {
        return this.apiService.get('ClientLogin/email/' + credential.email + '/password/' + credential.password + '?json=true')
        .pipe(map((data) => data));
    }

    getRestaurent(merchantId) {
        return this.apiService.get('GetMerchantMenu/mtid/' + merchantId + '?json=true')
            .pipe(map((data) => data));
    }

    addtoCart(itemid, merchantid, price, qty) {
        return this.apiService.get('ajax?action=addToCart&currentController=store&item_id=' + itemid +'&merchant_id=' + merchantid + 
        '&price='+ price +"&qty="+ qty +"&json=true")
        .pipe(map((data) => data)); 
    }
    
    getCart(merchantid) {
        return this.apiService.get('LoadItemCart?merchant_id=' + merchantid + '&json=true')
            .pipe(map((data) => data));
    }

    getReviews(merchantid) {
        return this.apiService.get('LoadReviews?merchant_id=' + merchantid + '&json=true')
            .pipe(map((data) => data));
    }
    addReviews(merchantid, review_rating, review_content) {
        return this.apiService.get('AddReviews?merchant_id=' + merchantid + "&review_rating="+ review_rating +"&review_content="+review_content+'&json=true')
            .pipe(map((data) => data));
    }
    GetFoodItem(itemId, merchantid) {
        return this.apiService.get('GetFoodItem/item_id/'+ itemId +'/mtid/' + merchantid + '?json=true')
            .pipe(map((data) => data));
    }
    getCity(city){
        return this.apiService.get('SearchArea/city/'+ city +'?json=true')
            .pipe(map((data) => data));
    }
    deleteCart(index){
        return this.apiService.get('DeleteItem/?row='+ index +'&json=true')
            .pipe(map((data) => data));
    }
    updateCart(itemid, merchantid, qty, price, index) {
        return this.apiService.get('ajax?action=addToCart&currentController=store&item_id=' + itemid +'&merchant_id=' + merchantid + 
        '&row='+ index +'&qty='+ qty +'&price='+ price +"&json=true")
        .pipe(map((data) => data)); 
    }
    
    cashOnDelievery(orderVal) {
        console.log("orderVal.floor", orderVal);
        return this.apiService.get('PlaceOrder?door=' + orderVal.door +'&floor=' + orderVal.floor + 
            '&street='+ orderVal.address +'&location_name='+ orderVal.apartment +'&zipcode='+ orderVal.zipcode +
            '&delivery_instruction=' + orderVal.information +'&contact_phone='+ orderVal.mobilnumber +
            '&browser_data='+ this.deviceInfo.userAgent + "&payment_opt=cod&json=true")
        .pipe(map((data) => data)); 
    }

    CODNewUser(orderVal) {
        console.log("orderVal.floor", orderVal.address);
        return this.apiService.get('PlaceOrder?door=' + orderVal.door +'&floor=' + orderVal.floor + 
            '&street='+ orderVal.address +'&location_name='+ orderVal.apartment +'&zipcode='+ orderVal.zipcode +
            '&contact_phone='+ orderVal.mobilnumber +'&delivery_instruction='+ orderVal.information +'&browser_data='+ this.deviceInfo.userAgent +
            '&first_name='+ orderVal.first_name +'&last_name='+ orderVal.last_name +'&email_address='+ orderVal.email +
            '&password='+ orderVal.password + "&payment_opt=cod&json=true")
        .pipe(map((data) => data)); 
    }

    delieveryType(type){
        return this.apiService.get('SetDeliveryOptions/?delivery_type='+ type +'&json=true')
            .pipe(map((data) => data));
    }

    ClearCart(){
        return this.apiService.get('ClearCart?json=true')
            .pipe(map((data) => data));
    }

    currentClientDetails() {
        return this.apiService.get('ClientDetails?json=true')
        .pipe(map((data) => data));
    }

    getPostalCode() {
        return this.apiService.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=true')
        .pipe(map((data) => data));
    }

    getLocation(latitude, longitude): Observable<any> {
        let geocoder = new google.maps.Geocoder();
        // latlan = "13.039347699999999,80.193075";
        let latlng = {lat: latitude, lng: longitude};
        return Observable.create(observer => {
            geocoder.geocode({
                'location': latlng
            }, (results, status) => {
                console.log('******>: ', results, ' & Status: ', status);
            // return results;
            if (status == google.maps.GeocoderStatus.OK) {
                observer.next(results[0].address_components);
                observer.complete();
            } else {
                console.log('Error: ', results, ' & Status: ', status);
                observer.error();
            }
            });
        });
    }

    // getProfile(username) {
    //     return this.apiService.get('profiles/'+ username +'&json=true')
    //     .pipe(map((data) => data));
    // }
    getReciept(orderId) {
      return this.apiService.get('GetReceipt/?id='+ orderId +'&json=true')
      .pipe(map((data) => data));
  } 

  checkConfirmation(orderId) {
    return this.apiService.get('checkconfirmation/backend=1&o='+ orderId +'&json=true')
    .pipe(map((data) => data));
  } 

   getMerchantInfo(postalcode, merchantId){
    return this.apiService.get('SearchArea/s/'+ postalcode +'mtid/' + merchantId + '?json=true')
    .pipe(map((data) => data));

   }

   getBannersList(postalcode){
    return this.apiService.get('getBanners?json=true/zipcode='+ postalcode)
    .pipe(map((data) => data));

   }
   
   ForgotPassword(value){
    return this.apiService.get('ForgotPassword/email/'+ value.email + '?json=true')
    .pipe(map((data) => data));

   }

   updateProfile(value){
    return this.apiService.get('ajax?action=updateClientProfile&currentController=store&first_name=ann&last_name=DGDFG&street=fghfg&city=jkhk&zipcode=72210&location_name=werewr&door=23423&floor=12312&contact_phone=98543213&password=tets')
    .pipe(map((data) => data));

   }
   
}
