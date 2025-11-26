import { Component, OnInit } from '@angular/core';
import { FeedService } from '../../services/feedService';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../../components/post-component/post-component';
import { EditPost } from '../../components/edit-post/edit-post';
import { PostModelo } from '../../models/post';

@Component({
  selector: 'app-posts-admin',
  standalone: true,
  imports: [CommonModule, PostComponent, EditPost],
  templateUrl: './posts-admin.html',
  styleUrl: './posts-admin.css',
})
export class PostsAdmin implements OnInit {
  
  listaPosts: PostModelo[] = [];
  postParaEditar: PostModelo | null = null; // Estado para el modal
  mostrarModal: boolean = false;

  constructor(private feedService: FeedService) {}

  ngOnInit(): void {
    this.obtenerPosts();
  }

  obtenerPosts() {
    this.feedService.getPosts().subscribe({
      next: (data) => {
        this.listaPosts = data;
      },
      error: (e) => console.error(e)
    });
  }

  abrirModalEdicion(id: string) {
    const postEncontrado = this.listaPosts.find(p => p.id === id);
    if (postEncontrado) {
      this.postParaEditar = postEncontrado;
      this.mostrarModal = true;
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.postParaEditar = null;
  }

  postActualizado(post: PostModelo) {
    const index = this.listaPosts.findIndex(p => p.id === post.id);
    if (index !== -1) {
      this.listaPosts[index] = post;
    }
    this.cerrarModal();
    alert("Post modificado exitosamente");
  }

  borrarPost(id: string) {
    if(confirm("¿Estás seguro de eliminar este post?")) { 
       this.feedService.deletePost(id).subscribe({
           next: () => {
               this.listaPosts = this.listaPosts.filter(post => post.id !== id);
           },
           error: (e) => console.error("Error al eliminar", e)
       });
    }
  }
}