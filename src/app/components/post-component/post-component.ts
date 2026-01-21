import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/authService';
import { FeedService } from '../../services/feedService';
import { UsuariosService } from '../../services/usuarios-service';
import { Fotografo } from '../../models/usuario';
import { PostModelo } from '../../models/post';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-component.html',
  styleUrls: ['./post-component.css']
})
export class PostComponent implements OnInit{

  constructor(private authService: AuthService, private router: Router, private feedService: FeedService, private usuariosService: UsuariosService) {}

  @Input() postData!: PostModelo;
  liked: boolean = false;
  guardado: boolean = false;
  

  @Output() onDelete = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<string>()

  sePuedeEditar: boolean = false;
  
  rutasDondeSeEditanPosteos: string[] = ['/perfil', '/posts-admin'];

  ngOnInit(): void {
    if(this.postData){
      const usuario = this.authService.getfotografoActual();
      const meGustas = this.postData.idUsuariosQueDieronLike;
      
      if(meGustas && usuario){
        this.liked = meGustas.includes(usuario.id);
      }

      const guardados = usuario.marcadoresGuardadosID;

      if(usuario && guardados){
        this.guardado = guardados.includes(this.postData.id)
      }
    }

  
    this.verificarRuta(this.router.url);

    this.router.events.pipe(
      filter(evento => evento instanceof NavigationEnd)
    ).subscribe((evento: any) => {
      const urlActual = evento.urlAfterRedirects || evento.url;
      this.verificarRuta(urlActual);
    });
  }

  private verificarRuta(url: string): void {
    console.log('URL actual:', url);
    this.sePuedeEditar = this.rutasDondeSeEditanPosteos.includes(url);
    console.log('sePuedeEditar:', this.sePuedeEditar); 
  }

 cantidadDeMeGustas(): number {
  if (!this.postData) return 0;
  
  const meGusta = this.postData.idUsuariosQueDieronLike;

  if (!meGusta) {
    return 0;
  }
  
  return meGusta.length;
}
  
  toggleMegusta() {
    this.liked = !this.liked;
    const usuario = this.authService.getfotografoActual();
    const idPost = this.postData.id
    const idUsuario = usuario.id

    if (!this.postData.idUsuariosQueDieronLike ) {
       this.postData.idUsuariosQueDieronLike = [];
    }

    if (!usuario.posteosLikeadosID ) {
    usuario.posteosLikeadosID = [];
    }

    if(this.liked){
      
      if(!this.postData.idUsuariosQueDieronLike.includes(idUsuario)){
        this.postData.idUsuariosQueDieronLike = [... this.postData.idUsuariosQueDieronLike,idUsuario];
      }

      this.feedService.putPost(idPost, this.postData).subscribe(
        response => {
            console.log('Post actualizado correctamente en DB', response);
      
        },
        error => {
            console.error('Error al actualizar el post:', error);
        });

      if(!usuario.posteosLikeadosID.includes(idPost)){
        usuario.posteosLikeadosID = [... usuario.posteosLikeadosID,idPost];
      }

      this.usuariosService.modificarUsuario(usuario).subscribe(
        response => {
            console.log('Usuario actualizado correctamente en DB', response);
        });
    }else{
      this.postData.idUsuariosQueDieronLike = this.postData.idUsuariosQueDieronLike.filter(id => id != idUsuario);
      this.feedService.putPost(idPost, this.postData).subscribe(
        response => {
            console.log('Post actualizado correctamente en DB', response);
      
        },
        error => {
            console.error('Error al actualizar el post:', error);
        });

      usuario.posteosLikeadosID = usuario.posteosLikeadosID.filter(id => id != idPost);
      this.usuariosService.modificarUsuario(usuario).subscribe(
        response => {
            console.log('Usuario actualizado correctamente en DB', response);
        });
       } 
  }
  
  guardar() {
    this.guardado = !this.guardado

    const usuario = this.authService.getfotografoActual();
    const idPost = this.postData.id
    const idUsuario = usuario.id

    if(!usuario.posteosFavoritosID){
      usuario.posteosFavoritosID = [];
    }

    if(this.guardado){
      
      if(!usuario.posteosFavoritosID.includes(idPost)){
        usuario.posteosFavoritosID = [... usuario.posteosFavoritosID,idPost];
      }

      this.usuariosService.modificarUsuario(usuario).subscribe(
        response => {
            console.log('Post actualizado correctamente en DB', response);
      
        },
        error => {
            console.error('Error al actualizar el post:', error);
        });
    }else{
      usuario.posteosFavoritosID.filter(id => id != this.postData.id)
      
      this.usuariosService.modificarUsuario(usuario).subscribe(
        response => {
            console.log('Post actualizado correctamente en DB', response);
      
        },
        error => {
            console.error('Error al actualizar el post:', error);
        });
    }

  }

  eliminar() {
    this.onDelete.emit(this.postData.id);
  }

  modificar() {
    this.onEdit.emit(this.postData.id);
  }
}