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
    private userData = new BehaviorSubject<any>(null);
    private orderData = new BehaviorSubject<any>(null);
    public apiData$ = this.apiData.asObservable();
    public postalData$ = this.postalData.asObservable();
    public cartData$ = this.cartData.asObservable();
    public userData$ = this.userData.asObservable();
    public orderData$ = this.orderData.asObservable();
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
        this.cartData.next(data);
    }

    getUserData(data) {
        this.userData.next(data);
    }
    callConfirmation(data){
        this.orderData.next(data);
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

    addtoCart(itemid, merchantid, price, qty, action, item_index, foodItemSize) {
        var updateIndex = '';
        var city = '';
        var api = ''
        if(action == "edit") {
            updateIndex = '&row='+ (item_index + 1) + "&";
        } else {
            updateIndex = "&";
        }
        if(localStorage.getItem("isWorkorder") == 'true') {
            city = "city="+ localStorage.getItem("selctedCity")+ "&";
            api = "addToWorkCart"
        } else {
            api = "addToCart"
        }
        return this.apiService.get('ajax?action=' + api + '&currentController=store&item_id=' + itemid +'&merchant_id=' + merchantid + 
        '&price='+ price + "|"+foodItemSize + "&qty="+ qty + updateIndex + city +"json=true")
        .pipe(map((data) => data)); 
    }

    addtoCartAddon(item_index, action,itemid, merchantid, addedItems, price, foodItemSize, qty) {
        addedItems = addedItems.replace(/&&/g,"&");
        var updateIndex = '';
        var city = '';
        var api = ''
        if(action == "edit") {
            updateIndex = '&row='+ (item_index + 1) + "&";
        }
        if(localStorage.getItem("isWorkorder") == 'true') {
            city = "city="+ localStorage.getItem("selctedCity")+ "&";
            api = "addToWorkCart"
        } else {
            api = "addToCart"
        }
        return this.apiService.get('ajax?action=' + api + '&currentController=store&item_id=' + itemid + '&merchant_id=' + merchantid + 
        '&discount=&price=' + price + "|"+foodItemSize+"&qty="+ qty + "&" + addedItems + updateIndex + city + "json=true")
        .pipe(map((data) => data)); 
    }

    
    deleteCart(index){
        var api = '';
        if(localStorage.getItem("isWorkorder") == 'true') {
            api = "DeleteWorkItem"
        } else {
            api = "DeleteItem"
        }
        return this.apiService.get(api+ '/?row='+ index +'&json=true')
            .pipe(map((data) => data));
    }

    updateCart(itemid, merchantid, qty, price, index) {
        var city = '';
        var api = ''
        if(localStorage.getItem("isWorkorder") == 'true') {
            city = "city="+ localStorage.getItem("selctedCity");
            api = "addToWorkCart"
        } else {
            api = "addToCart"
        }
        return this.apiService.get('ajax?action=addToCart&currentController=store&item_id=' + itemid +'&merchant_id=' + merchantid + 
        '&row='+ index +'&qty='+ qty +'&price='+ price + city + "&json=true")
        .pipe(map((data) => data)); 
    }

    getCart(merchantid) {
        var url = ''
        if(localStorage.getItem("isWorkorder") == 'true') {
            url = 'LoadWorkItemCart'+ '?json=true';
        } else {
            url = 'LoadItemCart?merchant_id=' + merchantid+ '&json=true';
        }
        return this.apiService.get( url )
            .pipe(map((data) => data));
    }
    ClearCart(){
        var api = '';
        if(localStorage.getItem("isWorkorder") == 'true') {
            api = 'ClearWorkCart';
        } else {
            api = 'ClearCart';
        }
        return this.apiService.get(api + '?json=true')
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

    
    cashOnDelievery(orderVal) {
       // console.log("orderVal.floor", orderVal);
       if(localStorage.getItem("isWorkorder") == 'true') {
            return this.apiService.get('WorkPlaceOrder?delivery_instruction=' + orderVal.information +'&contact_phone='+ orderVal.mobilnumber +
                '&browser_data='+ this.deviceInfo.userAgent + "&payment_opt=cod&json=true")
            .pipe(map((data) => data)); 
        } else {
            return this.apiService.get('PlaceOrder?door=' + orderVal.door +'&floor=' + orderVal.floor + 
                '&street='+ orderVal.address +'&location_name='+ orderVal.apartment +'&zipcode='+ orderVal.zipcode +
                '&delivery_instruction=' + orderVal.information +'&contact_phone='+ orderVal.mobilnumber +
                '&browser_data='+ this.deviceInfo.userAgent + "&payment_opt=cod&json=true")
            .pipe(map((data) => data));         
        }

    }


    CODNewUser(orderVal) {
        //console.log("orderVal.floor", orderVal.address);
        if(localStorage.getItem("isWorkorder") == 'true') {
            return this.apiService.get('WorkPlaceOrder?delivery_instruction='+ orderVal.information +'&browser_data='+ this.deviceInfo.userAgent +
                '&contact_phone='+ orderVal.mobilnumber + '&first_name='+ orderVal.first_name +'&last_name='+ orderVal.last_name +'&email_address='+ orderVal.email +
                '&password='+ orderVal.password + "&payment_opt=cod&json=true")
            .pipe(map((data) => data));
        } else {
            return this.apiService.get('PlaceOrder?door=' + orderVal.door +'&floor=' + orderVal.floor + 
                '&street='+ orderVal.address +'&location_name='+ orderVal.apartment +'&zipcode='+ orderVal.zipcode +
                '&contact_phone='+ orderVal.mobilnumber +'&delivery_instruction='+ orderVal.information +'&browser_data='+ this.deviceInfo.userAgent +
                '&first_name='+ orderVal.first_name +'&last_name='+ orderVal.last_name +'&email_address='+ orderVal.email +
                '&password='+ orderVal.password + "&payment_opt=cod&json=true")
            .pipe(map((data) => data));
        }

    }

    delieveryType(type){
        return this.apiService.get('SetDeliveryOptions/?delivery_type='+ type +'&json=true')
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
                //console.log('******>: ', results, ' & Status: ', status);
            // return results;
            if (status == google.maps.GeocoderStatus.OK) {
                observer.next(results[0].address_components);
                observer.complete();
            } else {
                //console.log('Error: ', results, ' & Status: ', status);
                observer.error();
            }
            });
        });
    }

    getReciept(orderId) {
        var api = ''
        if(localStorage.getItem("isWorkorder") == 'true') {
            api = "getWorkReceipt";
        } else {
            api = "GetReceipt";
        }
        return this.apiService.get(api+'/?id='+ orderId +'&json=true')
        .pipe(map((data) => data));
    } 

    checkConfirmation(orderId) {
        return this.apiService.get('checkconfirmation?backend=1&o='+ orderId +'&json=true')
        .pipe(map((data) => data));
    } 

    getMerchantInfo(postalcode, merchantId){
        return this.apiService.get('SearchArea/s/'+ postalcode +'/mtid/' + merchantId + '?json=true')
        .pipe(map((data) => data));
    }

    getBannersList(postalcode){
        return this.apiService.get('getBanners?json=true&zipcode='+ postalcode)
        .pipe(map((data) => data));
    }

    ForgotPassword(value){
        return this.apiService.get('ForgotPassword/email/'+ value.email + '?json=true')
        .pipe(map((data) => data));

    }

    updateProfile(userdata){
            if(!userdata.password) {
                userdata.password = '';
            }
        return this.apiService.get('ajax?action=updateClientProfile&currentController=store&password=' + userdata.password + 
                                                                '&first_name='+ userdata.first_name +
                                                                '&last_name='+ userdata.last_name +
                                                                '&contact_phone='+ userdata.contact_phone+
                                                                '&street='+ userdata.street+
                                                                '&zipcode='+ userdata.zipcode+
                                                                '&location_name='+ userdata.location_name+
                                                                '&door='+ userdata.door+
                                                                '&floor='+ userdata.floor+'&json=true')
        .pipe(map((data) => data));
    }

    GetOperationalHours(mtid, type){
        return this.apiService.get('GetOperationalHours/mtid/'+ mtid +"/deliverytype/"+type+ '?json=true')
        .pipe(map((data) => data));
    }
    
    applyVoucher(code, mtid) {
        return this.apiService.get('ApplyVoucher?voucher_code='+ code +"&merchant_id="+mtid+ '&json=true')
        .pipe(map((data) => data));
    }

    removeVoucher() {
        return this.apiService.get('RemoveVoucher?json=true')
        .pipe(map((data) => data));
    }

    
    
    orderHistory(type) {
        var url = ''
        if(type == 'work') {
            url = 'workOrderHistory';
        } else {
            url = 'OrderHistory';
        }
        return this.apiService.get(url+'?json=true')
        .pipe(map((data) => data));
    }

    checkoutKlarna() {
        return this.apiService.checkoutKlarna('checkoutKlarnaAngular')
        .pipe(map((data) => data));
    }

    getOrderId() {
        return this.apiService.get('GetOrderId?json=true')
        .pipe(map((data) => data));
    }
    checkoutKlarnaConfirmation() {
        return this.apiService.checkoutKlarna('confirmationangular')
        .pipe(map((data) => data));
    }

    merchantPostCodes(mtid) {
            return this.apiService.get('MerchantPostCodes?merchant_id='+mtid+"&json=true")
            .pipe(map((data) => data));
    }

    setZipcode(zipcode) {
        return this.apiService.get('SetZipcode/zipcode/'+zipcode+"?json=true")
        .pipe(map((data) => data));
    }
        
    //Work order API

    getWorkMenu(city) {
        return this.apiService.get('getWorkMenu?city='+city+"&json=true")
        .pipe(map((data) => data));
    }

    getCompany(city) {
        return this.apiService.get('getCompany?city='+ city +'&json=true')
        .pipe(map((data) => data));
    }

    getWorkCity() {
        return this.apiService.get('getWorkCity?json=true')
        .pipe(map((data) => data));
    }
    logout() {
        return this.apiService.get('ClientLogout?json=true')
        .pipe(map((data) => data));
    }

    setWorkCompanyid(id) {
        return this.apiService.get('setWorkCompanyid?id='+ id +'&json=true')
        .pipe(map((data) => data));
    }

    getWorkCompany() {
        return this.apiService.get('getWorkCompany?json=true')
        .pipe(map((data) => data));
    }
    
    clearWorkCompanyid() {
        return this.apiService.get('clearWorkCompanyid?json=true')
        .pipe(map((data) => data));
    }
    
}
