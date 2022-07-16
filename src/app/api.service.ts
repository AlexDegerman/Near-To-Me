import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://neartome-api.herokuapp.com';

  constructor(private http: HttpClient) {}

  getAllPlaces(): Observable<any> {
    return this.http.get(this.apiUrl + '/v1/places');
  }

  public getPlace(id: any): Observable<any> {
    return this.http.get(this.apiUrl + '/v1/place/' + id);
  }

  PlaceMarker() {
    return this.http.get(this.apiUrl + '/v1/places');
  }
  getAllActivities(): Observable<any> {
    return this.http.get(this.apiUrl + '/v1/activities');
  }

  public getActivite(id: any): Observable<any> {
    return this.http.get(this.apiUrl + '/v1/activity/' + id);
  }
  getAllEvents(): Observable<any> {
    return this.http.get(this.apiUrl + '/v1/events');
  }

  public getEvent(id: any): Observable<any> {
    return this.http.get(this.apiUrl + '/v1/event/' + id);
  }
}
