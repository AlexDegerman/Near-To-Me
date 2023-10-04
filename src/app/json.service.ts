import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Places } from './places';
import { Activities } from '../app/activities';
import { Events } from '../app/events';

@Injectable({
  providedIn: 'root',
})
export class jsonService {
  place: string = './assets/places.json';
  activity: string = './assets/activities.json';
  event: string = './assets/events.json';
  constructor(private http: HttpClient) {}

  getData(filter: any): Observable<any> {
    if (filter === 'places') {
      console.log('list set to places');
      return this.http.get<Places>(this.place);
    } else if (filter === 'activities') {
      console.log('list set to activities');
      return this.http.get<Activities>(this.activity);
    } else if (filter === 'events') {
      console.log('list set to events');
      return this.http.get<Events>(this.event);
    }
    console.log('you should not see this');
    return this.http.get<Places>(this.place);
  }

  getPlaces(): Observable<Places> {
    return this.http.get<Places>(this.place);
  }
  getActivities(): Observable<Activities> {
    return this.http.get<Activities>(this.activity);
  }
  getEvents(): Observable<Events> {
    return this.http.get<Events>(this.event);
  }
}

// Ohje Servicen käyttöön:
// Lisää neljä importtia(polku saattaa olla eri)
// import { Activities } from "../../app/activities"
// import { Places } from "./places";
// import {jsonService} from '../json.service';
// import { Events } from "../../app/events";
// lisää property activities: Activities[] = [];
// lisää property places: Places[] = [];
// lisää property events: Events[] = [];
// lisää constructoriin json service:  constructor(private jsonService: JsonService) {}
// lisää metodi #1
// getPlaces(): void {
//   this.jsonService.getPlaces().subscribe((res: Places) => {
//     this.places.push(res);
//     for (let place of this.places[0].data) {
//       place.distance = this.getDistanceV1(this.userCoordinates, [
//         place.location.lat,
//         place.location.lon,
//       ]);
//     }
//     this.places[0].data.sort((a, b) => a.distance - b.distance);
//   });
// }
// lisää metodi #2
//getActivities(): void {
//   this.jsonService.getActivities().subscribe((res: Activities) => {
//     this.activities.push(res);
//     for (let activity of this.activities[0].data) {
//       activity.distance = this.getDistanceV1(this.userCoordinates, [
//         activity.location.lat,
//         activity.location.lon,
//       ]);
//     }
//     this.places[0].data.sort((a, b) => a.distance - b.distance);
//   });
// }
// lisää metodi #3
// getEvents(): void {
//   this.jsonService.getEvents().subscribe((res: Events) => {
//     this.events.push(res);
//     for (let event of this.events[0].data) {
//       event.distance = this.getDistanceV1(this.userCoordinates, [
//         event.location.lat,
//         event.location.lon,
//       ]);
//     }
//     this.events[0].data.sort((a, b) => a.distance - b.distance);
//   });
// }
// lisää metodin kutsu ngOnInit(): sisälle this.getPlaces();
// lisää metodin kutsu ngOnInit(): sisälle this.getActivities();
// lisää metodin kutsu ngOnInit(): sisälle this.getEvents();
