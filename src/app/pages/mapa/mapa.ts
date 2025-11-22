import { AfterViewInit, Component, inject, NgZone, OnInit } from '@angular/core';
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
export class Mapa implements OnInit, AfterViewInit{
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
      const mapElement = document.getElementById("map");
    
    if (!mapElement) {
      console.error("El div con id='map' no se encontró en el HTML.");
      return;
    }

    this.map = new google.maps.Map(mapElement, {
      center: { lat: -34.6037, lng: -58.3816 },
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
      if(post.coordenadas){  
        const key = `${post.coordenadas.lat},${post.coordenadas.lng}`;
        if (!grupos[key]) grupos[key] = [];
        grupos[key].push(post);
      }
      });
    
      //Por cada grupo, se crea un marcador en el mapa

    for (const key in grupos) {
      const postsDelGrupo = grupos[key];
      const lat = postsDelGrupo[0].coordenadas!.lat;
      const lng = postsDelGrupo[0].coordenadas!.lng;

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
         this.marcadorSeleccionado = null;
        this.direccionActual = ''; 
      });

      // 2. Buscamos el nombre
      this.obtenerNombreDeGoogle(coordenadas.lat, coordenadas.lng, postsDelGrupo);
    });
  }

  //Pop-up

  obtenerNombreDeGoogle(lat: number, lng: number,  postsDelGrupo: PostModelo[]) {
  const latLng = { lat: lat, lng: lng };

  this.geocoder.geocode({ location: latLng }, (resultados: any, status: any) => {
    
    this.zone.run(() => {
      if (status === "OK" && resultados[0]) {
        const components = resultados[0].address_components;
        let nombreLugar = '';

         for (let component of components) {
          if (component.types.includes('locality')) {
            nombreLugar = component.long_name;
            break;
          } else if (component.types.includes('administrative_area_level_2')) {
            nombreLugar = component.long_name;
          }
        }
        
        this.direccionActual = nombreLugar || resultados[0].formatted_address;
      } 
        this.marcadorSeleccionado = postsDelGrupo; 
    });

  });
}

  cerrarPopup() {
    this.marcadorSeleccionado = null;
  }


}
