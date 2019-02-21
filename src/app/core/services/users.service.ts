import { Injectable } from '@angular/core';
import { Area } from '../models';
import { ApiService } from './api.service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable ,  BehaviorSubject ,  ReplaySubject } from 'rxjs';
import { map ,  distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class UsersService {
    constructor(
        private apiService: ApiService,
        private http:HttpClient,
    ) { }

    getArea(username: string): Observable<Area> {
        return this.apiService.get('SearchArea/s/' + username + '/15?json=true')
            .pipe(map((data) => data));
    }

    getpcode(latitude:any,longitude:any): Observable<Area> {
    //     const httpHeaders = new HttpHeaders();
    //     const api="https://xn--hemkrtochklart-ypb.se/get_pincode.php?lat="+latitude+"&long="+longitude;
    //   //.set('Content-Type'https://xn--hemkrtochklart-ypb.se/get_pincode.php?lat=9.939093&long=78.121719
    //   httpHeaders.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8');
    //    return this.http.get(api,{responseType: 'text'}).pipe(this.extractData);//.pipe(map((res:any) =>res));
    return this.apiService.pcode(latitude,longitude )
    .pipe(map((data) => data));
    }

    private extractData(res) {
        let body = res;
        return body || { };
    }
    // https://xn--hemkrtochklart-ypb.se/api/ClientSignup/email_address/ganeshkumar2@inspirepro.eu/password/hazardous/first_name/ganesh/last_name/karthik/contact_phone/9898989898
    clientRegister(credential: any): Observable<any> {
        console.log("credential", credential);
        return this.apiService.get('ClientSignup/email_address/' + credential.email + 
                                    '/password/' + credential.password + 
                                    '/first_name/'+ credential.password +
                                    '/last_name/'+ credential.lastName +
                                    '/contact_phone/'+ credential.mobileNumber+
                                    '?json=true')
        .pipe(map((data) => data));

    }

    clientLogin(credential: any): Observable<any> {
        console.log("credential", credential);
        return this.apiService.get('ClientLogin/email/' + credential.email + '/password/' + credential.password + '?json=true')
        .pipe(map((data) => data));
    }

}
