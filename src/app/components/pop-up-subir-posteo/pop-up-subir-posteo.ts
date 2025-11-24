import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedService } from '../../services/feedService';
import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-pop-up-subir-posteo',
  imports: [],
  templateUrl: './pop-up-subir-posteo.html',
  styleUrl: './pop-up-subir-posteo.css',
})
export class PopUpSubirPosteo {

  @Output() cerrar = new EventEmitter<void>();
  @Output() postCreado = new EventEmitter<void>();

  postFormulario: FormGroup;
  fotoSubida: File | null = null;
  urlImagen: string | null = null;
  subiendoFoto: boolean = false;
  mensajeEstado: string = '';

  mostrandoMapa: boolean = false;
  ubicacionSeleccionada: {lat: number, lng: number} | null = null;
  posicionMarcador: google.maps.LatLngLiteral = {lat: 0, lng: 0};

  opcionesMaps: google.maps.MapOptions = {
    center: { lat: -34.6037, lng: -58.3816 },
    zoom: 4,
    streetViewControl: false,
    mapTypeControl: false
  };

  private readonly ImgurKey = 'Bearer 1f8a3d8f31d581c20fd33ba0cd0527de4cc28904'

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

  mapaSeeleccionado(evento: google.maps.MapMouseEvent){
    if(evento.latLng){
      this.ubicacionSeleccionada = {
        lat: evento.latLng.lat(),
        lng: evento.latLng.lng()   
    };

    this.posicionMarcador = {
      lat: this.ubicacionSeleccionada.lat,
      lng: this.ubicacionSeleccionada.lng
    }

    setTimeout(() => {
      this.cerrarSelectorMapa();
    }, 300);
    }
  }

  async onSubmit() {
    if (this.postFormulario.invalid && !this.fotoSubida) return;

    this.subiendoFoto = true;
    this.mensajeEstado = 'Subiendo imagen...';

    try{
      const imgurURl = await this.subirAImgur(this.fotoSubida!);
      this.mensajeEstado = "Guardando posteo...";

      const fotografoActual = this.authService.getUsuarioLogueado();

      const nuevoPost = {
        url: imgurURl,
        descripcion: this.postFormulario.value.descripcion,
        ubicacion: this.postFormulario.value.lugarNombre,
        fotografo: fotografoActual,
        fecha: new Date(),
        likes: 0,
        eliminado: false
      };

      this.feedService.postPost(nuevoPost).subscribe({
        next: (data) => {
          this.postCreado.emit();
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

  private subirAImgur(archivo: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', archivo);

    return new Promise((resolve, reject) => {
      this.http.post('https://api.imgur.com/3/image', formData, {
        headers: { Authorization: `Client-ID ${this.ImgurKey}` }
      }).subscribe({
        next: (response: any) => resolve(response.data.link),
        error: (error: any) => reject(error)
      });
    });
  }

  cerrarPopUp() {
    this.cerrar.emit();
  }

}
