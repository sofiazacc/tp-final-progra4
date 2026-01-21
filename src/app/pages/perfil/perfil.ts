import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authService';
import { Fotografo } from '../../models/usuario';
import { ModalEditarPerfil } from '../../components/modal-editar-perfil/modal-editar-perfil';
import { FeedService } from '../../services/feedService';
import { PostModelo } from '../../models/post';
import { PostComponent } from '../../components/post-component/post-component';


@Component({
  selector: 'app-perfil',
  imports: [ModalEditarPerfil, PostComponent],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit{

  fotografo: Fotografo | null
  estadoModal: boolean = false
  idFotografo: string | undefined
  posts: PostModelo[] = []

  constructor(
    public authService: AuthService,
    public feedService: FeedService
  ){
    this.fotografo = this.authService.getfotografoActual()
    console.log("Datos en LocalStorage:", localStorage.getItem('usuario_logueado'));
    console.log("Fotógrafo parseado:", this.fotografo);
  }

  ngOnInit(): void {
    this.obtenerUsuario();
  }

  modificarPerfil(){
    this.estadoModal = true
  }

  cerrarModal(){
    this.estadoModal = false
    this.fotografo = this.authService.getfotografoActual();
  }

  obtenerUsuario(){
    const usuarioLogueado = this.authService.getfotografoActual();

    if (usuarioLogueado) {
      this.fotografo = usuarioLogueado;
      
      this.idFotografo = usuarioLogueado.id.toString();

      console.log("Fotógrafo activo:", this.fotografo);

      this.feedService.getPostsByFotografoId(this.idFotografo).subscribe({
        next: (data) => {
          this.posts = data;
          console.log("Posts cargados:", this.posts);
        },
        error: (e) => console.error("Error cargando posts:", e)
      });

    } else {
      console.error("No hay un usuario logueado");
    }
  }

}