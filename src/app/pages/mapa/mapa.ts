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

  geocoder: any;

  direccionActual: string = '';

  //Elementos necesarios para el mapa y los marcadores
  map:any;
  posts: PostModelo[] = [];

  marcadorSeleccionado: PostModelo[] | null = null;

  ngOnInit(): void {
    //Obtenemos los posts para mostrarlos en el mapa
    this.feedService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;

        if(this.map){
          this.crearPines();
        }
      },
      error: (e) => console.log(e)
    });
  }

  ngAfterViewInit() {
    this.iniciarMapa();
  }

  iniciarMapa(){
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: { lat: -34.6037, lng: -58.3816 }, // Centro en Buenos Aires
      zoom: 5,
      streetViewControl: false,
    });

    this.geocoder = new google.maps.Geocoder();

    if(this.posts.length > 0){
      this.crearPines();
    }
  
  }

  crearPines() {
    //Se agrupan los posts por ubicación (latitud y longitud)
    const grupos : {[key: string]: PostModelo[]} = {};

    this.posts.forEach(post => {
      if(post.coordernadas){  
        const key = `${post.coordernadas.lat},${post.coordernadas.lng}`;
        if (!grupos[key]) grupos[key] = [];
        grupos[key].push(post);
      }
      });
    
      //Por cada grupo, se crea un marcador en el mapa

    for (const key in grupos) {
      const postsDelGrupo = grupos[key];
      const lat = postsDelGrupo[0].coordernadas!.lat;
      const lng = postsDelGrupo[0].coordernadas!.lng;

      this.crearMarcador({lat, lng}, postsDelGrupo);
  }
  }

  crearMarcador(coordenadas: {lat: number, lng: number}, postsDelGrupo: PostModelo[]) {
    const marcador = new google.maps.Marker({
      position: { lat: coordenadas.lat, lng: coordenadas.lng },
      map: this.map,
    });

    marcador.addListener("click", () => {
      
      // Abrimos el popup
      this.zone.run(() => {
        this.marcadorSeleccionado = postsDelGrupo;
        this.direccionActual = ''; 
      });

      // 2. Buscamos el nombre
      this.obtenerNombreDeGoogle(coordenadas.lat, coordenadas.lng);
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

  cerrarPopup() {
    this.marcadorSeleccionado = null;
  }


}
