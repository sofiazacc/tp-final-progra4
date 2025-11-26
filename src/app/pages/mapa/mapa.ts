import { AfterViewInit, Component, inject, NgZone, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { PopUpMapa } from "../../components/pop-up-mapa/pop-up-mapa";
import { FeedService } from '../../services/feedService';
import { PostModelo } from '../../models/post';
import { MarcadorService } from '../../services/marcadorService';

import { FavoritosService } from '../../services/marcadoresFavoritosService';
import { Marcador } from '../../models/marcador';

import mapStyles from './mapStyles.json'
@Component({
  selector: 'app-mapa',
  imports: [GoogleMapsModule, PopUpMapa],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class Mapa implements OnInit, AfterViewInit{
   //Elementos necesarios para detectar el nombre del lugar seleccionado y mandarlo al pop-up

  constructor(private feedService: FeedService, private zone: NgZone, private marcadorService: MarcadorService, private favoritosService: FavoritosService){}

  geocoder: any;

  direccionActual: string = '';

  //Elementos necesarios para el mapa y los marcadores
  map:any;
  posts: PostModelo[] = [];

  marcadorSeleccionado: PostModelo[] | null = null;
  marcadorSeleccionadoId: string | null = null;
  marcadorCoordenadas: { top: string, left: string } | null = null; 

  ngOnInit(): void {
    window.addEventListener('favoritoActualizado', () => {
    if(this.mostrandoFavoritos) {
      this.cargarMarcadoresFavoritos();
    }
  });
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
       mapTypeControl: false,    
       styles: mapStyles as google.maps.MapTypeStyle[],
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT
      },
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
         if(marcador.postID.length === 0){
          this.marcadorService.deleteMarcador(marcador.id);
          return;
         }
          const postsDelGrupo = this.posts.filter(post => marcador.postID.includes(post.id));
          this.crearMarcador(marcador, postsDelGrupo);
        });
      },
      error: (e) => console.log(e)
    });
  }

  crearMarcador(marcador: any, postsDelGrupo: PostModelo[]) {

    const pinNegro = {
      path: "M480-388q54-50 84-80t47-50q16-20 22.5-37t6.5-37q0-36-26-62t-62-26q-21 0-40.5 8.5T480-648q-12-15-31-23.5t-41-8.5q-36 0-62 26t-26 62q0 21 6 37t22 36q17 20 46 50t86 81Zm0 202q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z", 
      fillColor: "#000000",  
      fillOpacity: 1,
      scale: 0.04           
    };
        const marcadorNuevo = new google.maps.Marker({
      position: { lat: marcador.lat, lng: marcador.lng },
      map: this.map,
      icon:pinNegro,
      title:'Marcador'
    });

    marcadorNuevo.addListener("click", (e:any) => {
      
      // Abrimos el popup
      this.zone.run(() => {
         this.marcadorSeleccionado = null;
        this.direccionActual = ''; 
        this.marcadorSeleccionadoId = marcador.id;

        this.marcadorCoordenadas = {
            top: (e.domEvent.clientY - 20) + 'px', // Un poco arriba del mouse
            left: e.domEvent.clientX + 'px'
        };
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

  mostrandoFavoritos: boolean = false;
  marcadoresFavoritos: Marcador[] = [];


  desplegarFavoritos() {
    this.mostrandoFavoritos = !this.mostrandoFavoritos;
    if (this.mostrandoFavoritos) {
      this.cargarMarcadoresFavoritos();
    }
  }

  cargarMarcadoresFavoritos() {
    //Obtenemos el usuario y sus lugares
    this.favoritosService.obtenerMarcadoresFavoritos().subscribe(marcadores =>{
      this.marcadoresFavoritos = marcadores;
    }); 
  }

  quitarFavorito(marcadorID: string) {
    this.favoritosService.marcarDesmarcarComoFavorito(marcadorID).subscribe(() => {
      // Actualizamos la lista de favoritos
      this.cargarMarcadoresFavoritos();
      window.dispatchEvent(new CustomEvent('favoritoActualizado'));
    });
  }

  verMarcadorEnMapa(marcador: Marcador) {
    const postsDelGrupo = this.posts.filter(post => marcador.postID.includes(post.id));

    this.zone.run(() => {
      this.marcadorSeleccionado = null;
      this.marcadorSeleccionadoId = marcador.id;
      this.marcadorCoordenadas = {
        top: '50vh', // Centrado verticalmente
        left: '50vw' // Centrado horizontalmente
      };
    });

    this.obtenerNombreDeGoogle(marcador.lat, marcador.lng, postsDelGrupo);  

    this.mostrandoFavoritos = false;
  }

}
