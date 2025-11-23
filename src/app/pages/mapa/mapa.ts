import { AfterViewInit, Component, inject, NgZone, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { PopUpMapa } from "../../components/pop-up-mapa/pop-up-mapa";
import { FeedService } from '../../services/feedService';
import { PostModelo } from '../../models/post';
import { MarcadorService } from '../../services/marcador-service';
@Component({
  selector: 'app-mapa',
  imports: [GoogleMapsModule, PopUpMapa],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class Mapa implements OnInit, AfterViewInit{
   //Elementos necesarios para detectar el nombre del lugar seleccionado y mandarlo al pop-up

  constructor(private feedService: FeedService, private zone: NgZone, private marcadorService: MarcadorService){}

  geocoder: any;

  direccionActual: string = '';

  //Elementos necesarios para el mapa y los marcadores
  map:any;
  posts: PostModelo[] = [];

  marcadorSeleccionado: PostModelo[] | null = null;
  marcadorSeleccionadoId: string | null = null;

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
    this.marcadorService.sincronizarMarcadores(this.posts).subscribe({
      next: (marcadores) => {
         //Por cada marcador obtenido, se ve reflejado en el mapa
        marcadores.forEach((marcador) => {
         //Obtenemos los post que corresponden
          const postsDelGrupo = this.posts.filter(post => marcador.postID.includes(post.id));
          this.crearMarcador(marcador, postsDelGrupo);
        });
      },
      error: (e) => console.log(e)
    });
  }

  crearMarcador(marcador: any, postsDelGrupo: PostModelo[]) {
    const marcadorNuevo = new google.maps.Marker({
      position: { lat: marcador.lat, lng: marcador.lng },
      map: this.map,
    });

    marcador.addListener("click", () => {
      
      // Abrimos el popup
      this.zone.run(() => {
         this.marcadorSeleccionado = null;
        this.direccionActual = ''; 
        this.marcadorSeleccionadoId = marcador.id;
      });

      // 2. Buscamos el nombre
      this.obtenerNombreDeGoogle(marcador.lat, marcador.lng, postsDelGrupo);
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
    this.marcadorSeleccionadoId = null;
  }


}
