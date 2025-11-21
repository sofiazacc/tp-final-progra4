import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
@Component({
  selector: 'app-mapa',
  imports: [GoogleMapsModule],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class Mapa {
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 4;
}
