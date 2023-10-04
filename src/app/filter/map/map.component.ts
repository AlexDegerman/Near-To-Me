import {
  Component,
  AfterViewInit,
  OnInit,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  Input,
  SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
import { ApiService } from '../../api.service';
import { PlaceDetailComponent } from '../../place-detail/place-detail.component';
import 'leaflet.markercluster';
import { jsonService } from 'src/app/json.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnInit {
  @Input() mainFilter: any;

  map: any;

  placesMarkers = new L.LayerGroup();
  eventsMarkers = new L.LayerGroup();
  actsMarkers = new L.LayerGroup();

  constructor(
    private api: ApiService ,private json: jsonService
  ) {}

  private initMap(): void {
    this.map = L.map('map').locate({ setView: true, maxZoom: 9 });

    const tiles = L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWgtMjAiLCJhIjoiY2wxbTg0dWZyMGdlaTNqb2JhbXVqaG90aiJ9.P2rhaDNS3sVsqmeewBeQpQ',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token',
      }
    );

    tiles.addTo(this.map);
  }
  makePlacesPopup(data: any): string {
    return `` +
    `<h3>${ data.name.fi }</h3>
    <div> ${ data.location.address.street_address }
    ${ data.location.address.postal_code }
    ${ data.location.address.locality }</div>
    `
  }
  

  makeCurrentLocationPopup(): string {
    return `` + `<div>Olen tässä</div>`;
  }

  // this is now redundant code
  makePlacesMarkers(map: L.Map) {
    this.api.getAllPlaces().subscribe((res: any) => {
      const markerCluster = new L.MarkerClusterGroup();
      for (const c of res.data) {
        const lon = c.location.lon;
        const lat = c.location.lat;
        const marker = L.marker([lat, lon]);
        marker.bindPopup(this.makePlacesPopup(c));
        markerCluster.addLayer(marker);
      }
      map.addLayer(markerCluster);
    });
  }
  // this is now redundant code
  makeEventsMarkers(map: L.Map) {
    this.api.getAllEvents().subscribe((res: any) => {
      const markerCluster = new L.MarkerClusterGroup();

      for (const c of res.data) {
        const lon = c.location.lon;
        const lat = c.location.lat;
        const marker = L.marker([lat, lon]);
        marker.bindPopup(this.makePlacesPopup(c));
        markerCluster.addLayer(marker);
      }
      map.addLayer(markerCluster);
    });
  }
  // this is now redundant code
  makeActivitiesMarkers(map: L.Map) {
    this.api.getAllActivities().subscribe((res: any) => {
      const markerCluster = new L.MarkerClusterGroup();

      for (const c of res.data) {
        const lon = c.location.lon;
        const lat = c.location.lat;
        const marker = L.marker([lat, lon]);
        marker.bindPopup(this.makePlacesPopup(c));
        markerCluster.addLayer(marker);
      }
      map.addLayer(markerCluster);
    });
  }
  makeMyLocationMarker(map: L.Map): void {
    navigator.geolocation.getCurrentPosition((position) => {
      const currentLat = position.coords.latitude;
      const currentLon = position.coords.longitude;
      const currentLocationMarker = L.circleMarker([currentLat, currentLon]);
      currentLocationMarker.setStyle({ color: 'red' });
      currentLocationMarker.bindPopup(this.makeCurrentLocationPopup());
      currentLocationMarker.addTo(map);
    });
  }

  // API no longer available, switching to JSON
  makeMarkersBasedOnFilter(filter: string, map: L.Map): void {
    let clusters = new L.MarkerClusterGroup();
    if (filter === 'places') {
      this.json.getPlaces().subscribe((res: any) =>  {
     // this.api.getAllPlaces().subscribe((res: any) => {
        const markerCluster = new L.MarkerClusterGroup();
        for (const c of res.data) {
          const lon = c.location.lon;
          const lat = c.location.lat;
          const marker = L.marker([lat, lon]);
          marker.bindPopup(this.makePlacesPopup(c));
          markerCluster.addLayer(marker);

          markerCluster.addTo(this.placesMarkers);
        }
      });
    } else if (filter === 'activities') {
      this.json.getActivities().subscribe((res: any) =>  {
      // this.api.getAllActivities().subscribe((res: any) => {
        const markerCluster = new L.MarkerClusterGroup();

        for (const c of res.data) {
          const lon = c.location.lon;
          const lat = c.location.lat;
          const marker = L.marker([lat, lon]);
          marker.bindPopup(this.makePlacesPopup(c));
          markerCluster.addLayer(marker);

          markerCluster.addTo(this.actsMarkers);
        }
      });
    } else {
      this.json.getEvents().subscribe((res: any) =>  {
      //this.api.getAllEvents().subscribe((res: any) => {
        const markerCluster = new L.MarkerClusterGroup();

        for (const c of res.data) {
          const lon = c.location.lon;
          const lat = c.location.lat;
          const marker = L.marker([lat, lon]);
          marker.bindPopup(this.makePlacesPopup(c));
          markerCluster.addLayer(marker);

          markerCluster.addTo(this.eventsMarkers);
        }
      });
    }
  }

  showLayerBasedOnFilter(filter: string, map: L.Map) {
    if (filter === 'places') {
      map.removeLayer(this.eventsMarkers);
      map.removeLayer(this.actsMarkers);
      map.addLayer(this.placesMarkers);
    } else if (filter === 'activities') {
      map.removeLayer(this.placesMarkers);
      map.removeLayer(this.eventsMarkers);
      map.addLayer(this.actsMarkers);
    } else {
      map.removeLayer(this.placesMarkers);
      map.removeLayer(this.actsMarkers);
      map.addLayer(this.eventsMarkers);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.makeMarkersBasedOnFilter(this.mainFilter, this.map);
    this.showLayerBasedOnFilter(this.mainFilter, this.map);
  }
  ngOnInit(): void {
    this.initMap();
    this.makeMyLocationMarker(this.map);
    this.makeMarkersBasedOnFilter(this.mainFilter, this.map);
    this.showLayerBasedOnFilter(this.mainFilter, this.map);
  }

  ngAfterViewInit(): void {
    // this.initMap();
    // this.makeMyLocationMarker(this.map);
    // this.makeMarkersBasedOnFilter(this.mainFilter, this.map);
  }
}
