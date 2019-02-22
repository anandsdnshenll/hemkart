import { Injectable } from '@angular/core';
import { Area } from '../models';
import { ApiService } from './api.service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable ,  BehaviorSubject ,  ReplaySubject } from 'rxjs';
import { map ,  distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class CommonService {
    constructor(
        private apiService: ApiService,
        private http:HttpClient,
    ) { }

    getRestaurent(merchantId): Observable<Area> {
        return this.apiService.get('GetMerchantMenu/mtid/' + merchantId + '?json=true')
            .pipe(map((data) => data));
    }


}
