import { Component, inject, NgZone, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { PopUpMapa } from "../../components/pop-up-mapa/pop-up-mapa";
import { FeedService } from '../../services/feed-service';
import { PostModelo } from '../../models/post';
@Component({
  selector: 'app-mapa',
  imports: [GoogleMapsModule, PopUpMapa],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class Mapa implements OnInit{
   //Elementos necesarios para detectar el nombre del lugar seleccionado y mandarlo al pop-up
  private zone = inject(NgZone);
  private feedService = inject(FeedService);

  geocoder = new google.maps.Geocoder();

  direccionActual: string = '';

  //Elementos necesarios para el mapa y los marcadores
  map:any;
  posts: PostModelo[] = [];

  marcadorSeleccionado: PostModelo | null = null;

  ngOnInit(): void {
    //Obtenemos los posts para mostrarlos en el mapa
    this.feedService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (e) => console.log(e)
    });
  }

  //Pop-up

  obtenerNombreDeGoogle(lat: number, lng: number) {
  const latLng = { lat: lat, lng: lng };

  this.geocoder.geocode({ location: latLng }, (resultados: any, status: any) => {
    
    this.zone.run(() => {
      if (status === "OK" && resultados[0]) {
        // Guardamos la dirección que nos dio Google
        this.direccionActual = resultados[0].formatted_address;
      } else {
        this.direccionActual = "Ubicación desconocida";
      }
    });

  });
}

  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 4;


}
