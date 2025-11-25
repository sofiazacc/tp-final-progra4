import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, NgZone, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedService } from '../../services/feedService';
import { AuthService } from '../../services/authService';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-pop-up-subir-posteo',
  imports: [ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './pop-up-subir-posteo.html',
  styleUrl: './pop-up-subir-posteo.css',
})
export class PopUpSubirPosteo {

  private zone = inject(NgZone);

  @Output() close = new EventEmitter<void>();
  @Output() postCreado = new EventEmitter<void>();

  postFormulario: FormGroup;
  fotoSubida: File | null = null;
  urlImagen: string | null = null;
  subiendoFoto: boolean = false;
  mensajeEstado: string = '';

  mostrandoMapa: boolean = false;
  ubicacionSeleccionada: {lat: number, lng: number} | null = null;
  posicionMarcador: google.maps.LatLngLiteral | undefined;

  opcionesMaps: google.maps.MapOptions = {
    center: { lat: -34.6037, lng: -58.3816 },
    zoom: 4,
    streetViewControl: false,
    mapTypeControl: false,
    restriction: {
      latLngBounds: {
        north: -21.0, 
        south: -56.0, 
        west: -76.0, 
        east: -53.0, 
      },
      strictBounds: false,
      },
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private feedService: FeedService,
    private authService: AuthService

  ) {
    this.postFormulario = this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(150)]],
      lugarNombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
  }   

  imagenSeleccionada(evento: any){
    const archivo = evento.target.files[0];

    if(archivo){
      this.fotoSubida = archivo;
      const reader = new FileReader();
      reader.onload = () => {
        this.urlImagen = reader.result as string;
      }
      reader.readAsDataURL(archivo);
    }
  }

  abrirSelectorMapa() {
    this.mostrandoMapa = true;
  }

  cerrarSelectorMapa() {
    this.mostrandoMapa = false;
  }

 mapaSeeleccionado(evento: google.maps.MapMouseEvent) {
    if (evento.latLng) {
      const lat = evento.latLng.lat();
      const lng = evento.latLng.lng();

      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        this.zone.run(() => {
          if (status === 'OK' && results && results[0]) {
            
            const esArgentina = results.some(resultado => 
              resultado.address_components.some(componente => 
                componente.types.includes('country') && 
                (componente.short_name === 'AR' || componente.long_name === 'Argentina')
              )
            );

            if (esArgentina) {

              this.ubicacionSeleccionada = { lat, lng };
              
              this.posicionMarcador = {
                lat: this.ubicacionSeleccionada.lat,
                lng: this.ubicacionSeleccionada.lng
              };


              const ciudad = results[0].address_components.find(c => c.types.includes('locality'))?.long_name;
              const provincia = results[0].address_components.find(c => c.types.includes('administrative_area_level_1'))?.long_name;
              
              if (ciudad || provincia) {
                 this.postFormulario.patchValue({
                    lugarNombre: ciudad ? `${ciudad}, ${provincia}` : provincia
                 });
              }

              setTimeout(() => {
                this.cerrarSelectorMapa();
              }, 500); 

            } else {
              alert("Solo puedes seleccionar ubicaciones dentro de Argentina.");
              this.posicionMarcador = undefined; 
              this.ubicacionSeleccionada = null;
            }

          } else {
            console.error("Geocoding falló o clic en el océano profundo");
          }
        });
      });
    }
  }

  async onSubmit() {
    if (this.postFormulario.invalid && !this.fotoSubida) return;

    this.subiendoFoto = true;
    this.mensajeEstado = 'Subiendo imagen...';

    try{
      const imgurURl = await this.subirViaBackend(this.fotoSubida!);
      this.mensajeEstado = "Guardando posteo...";

      const fotografoActual = this.authService.getUsuarioLogueado();

      const nuevoPost = {
        url: imgurURl,
        descripcion: this.postFormulario.value.descripcion,
        ubicacion: this.postFormulario.value.lugarNombre,
        coordenadas: this.ubicacionSeleccionada,
        fotografo: fotografoActual,
        fecha: new Date(),
        likes: 0,
        eliminado: false
      };

      this.feedService.postPost(nuevoPost as any).subscribe({
        next: (data) => {
          this.postCreado.emit();
          this.cerrarPopUp()
          this.postFormulario.reset();
          this.urlImagen = null
          this.subiendoFoto = false;
          this.mensajeEstado = '';
        },
        error: (e) => {
          console.log('Error al crear el post:', e);
          this.mensajeEstado = 'Error al crear el post';
          this.subiendoFoto = false;
        }
      });

  }catch(error){
    console.log('Error al subir la imagen:', error);
    this.mensajeEstado = 'Error al subir la imagen';
    this.subiendoFoto = false;
  }
  }
 private subirViaBackend(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', archivo);

      console.log('Subiendo vía backend...');

      this.http.post<any>('http://localhost:3000/api/subir-imagen', formData).subscribe({
        next: (response) => {
          if (response.success && response.url) {
            console.log('Imagen subida vía backend:', response.url);
            resolve(response.url);
          } else {
            console.error('Backend respondió sin URL:', response);
            reject('Backend: URL no recibida');
          }
        },
        error: (error) => {
          console.error('Error vía backend:', error);
        }
      });
    });
  }


  cerrarPopUp() {
    this.close.emit();
  }

}
