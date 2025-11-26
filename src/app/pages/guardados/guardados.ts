import { Component } from '@angular/core';
import { FondoGalaxia } from '../../animaciones/fondo-galaxia/fondo-galaxia';
import { PostModelo } from '../../models/post';
import { FeedService } from '../../services/feedService';
import { AuthService } from '../../services/authService';
import { PostComponent } from '../../components/post-component/post-component';

@Component({
  selector: 'app-guardados',
  imports: [FondoGalaxia, PostComponent],
  templateUrl: './guardados.html',
  styleUrl: './guardados.css',
})
export class Guardados {
  posteosActivos: PostModelo [] = [];
  posteosGuardados: PostModelo [] = [];
  cargoDatos: boolean = false;
  
  constructor(private FeedService: FeedService, private authService: AuthService) {}

  ngOnInit(): void {
    console.log("Feed iniciado");
    this.obtenerPosts();
  }
  
  obtenerPosts() {
  
    const usuario = this.authService.getfotografoActual();
    const favoritosIds = usuario?.posteosFavoritosID || [];


    if (!usuario) {
      console.warn('Usuario no autenticado.');
      this.posteosGuardados = [];
      this.cargoDatos = true;
      return;
    }

    if (favoritosIds.length === 0) {
      console.warn('El usuario no ha guardado ningún posteo.');
      this.posteosGuardados = []; 
      this.cargoDatos = true;
      return;
    }
    
    this.FeedService.getPosts().subscribe({
      next: (todosLosPosts) => { 
        console.log("Datos recibidos:", todosLosPosts.length);
        
        this.posteosGuardados = todosLosPosts.filter(post => {
            const estaGuardado = favoritosIds.includes(post.id);
            const estaActivo = !post.eliminado; 
            
            return estaGuardado && estaActivo; 
        });

        this.cargoDatos = true;
        console.log(`Posts guardados y activos encontrados: ${this.posteosGuardados.length}`);
      },
      error: (error) => {
        console.error('Error al obtener posts:', error);
        this.cargoDatos = true;
      }
    });
  }
}