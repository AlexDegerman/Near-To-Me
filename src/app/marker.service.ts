import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  places: string = './assets/test.json';

  constructor(private http: HttpClient, private popupService: PopupService) {}

  makePlacesMarkers(map: L.Map): void {
    this.http.get(this.places).subscribe((res: any) => {
      for (const c of res) {
        const lon = c.location.lon;
        const lat = c.location.lat;
        const marker = L.marker([lat, lon]);
         marker.bindPopup(this.popupService.makePlacesPopup(c));
        marker.addTo(map);
      }
    });
  }
  makeMyLocationMarker(map: L.Map): void {
    navigator.geolocation.getCurrentPosition((position) => {
      const currentLat = position.coords.latitude;

      const currentLon = position.coords.longitude;

      const marker = L.circleMarker([currentLat, currentLon]);

      marker.setStyle({ color: 'blue' });

      marker.bindPopup(this.popupService.makeCurrentLocationPopup());

      marker.addTo(map);
    });
  }
}
