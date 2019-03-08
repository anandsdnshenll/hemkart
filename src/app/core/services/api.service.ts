import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from './jwt.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  private formatErrors(error: any) {
    return  throwError(error.error);
  }
  
  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, {withCredentials: true})
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${environment.api_url}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.api_url}${path}`
    ).pipe(catchError(this.formatErrors));
  }
  
  // pcode(lat:any,long:any,params: HttpParams = new HttpParams()): Observable<any> {
  //   const api="https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB9Mobk70l1gEyIywzPG6qH-H-odB0C8xg&latlng="+lat+","+long;
  //   return this.http.get(api)
  //     .pipe(catchError(this.formatErrors));
  // }

  // getPostalcode(lat:any,long:any,params: HttpParams = new HttpParams()): Observable<any> {
  //   const api="https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB9Mobk70l1gEyIywzPG6qH-H-odB0C8xg&latlng="+lat+","+long;
  //   return this.http.get(api)
  //     .pipe(catchError(this.formatErrors));
  // }
  // https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB9Mobk70l1gEyIywzPG6qH-H-odB0C8xg&latlng=13.039347699999999,80.193075
}
