import { Component, OnInit } from '@angular/core';
import { FeedService } from '../../services/feedService';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../../components/post-component/post-component';
import { PostModelo } from '../../models/post';

@Component({
  selector: 'app-posts-admin',
  standalone: true,
  imports: [CommonModule, PostComponent],
  templateUrl: './posts-admin.html',
  styleUrl: './posts-admin.css',
})
export class PostsAdmin implements OnInit {
  

  listaPosts: PostModelo[] = []; 

  constructor(private feedService: FeedService) {}

  ngOnInit(): void {
    this.obtenerPosts();
  }

  obtenerPosts() {
    this.feedService.getPosts().subscribe({
      next: (data) => {
        console.log("Datos recibidos:", data);
        this.listaPosts = data;
      },
      error: (e) => console.error(e)
    });
  }
  borrarPost(id: string) {
    if(confirm("¿Estás seguro de eliminar este post?")) { // Validación básica
        
        this.feedService.deletePost(id).subscribe({
            next: () => {
                console.log(`Post ${id} eliminado`);
                // Actualizamos la lista local visualmente filtrando el eliminado
                this.listaPosts = this.listaPosts.filter(post => post.id !== id);
            },
            error: (e) => console.error("Error al eliminar", e)
        });
    }
  }
}