import { Component, OnInit } from '@angular/core';
import { FeedService } from '../../services/feedService';
import { PostComponent } from '../../components/post-component/post-component';
import { FondoGalaxia } from '../../components/fondo-galaxia/fondo-galaxia';
import { PostModelo } from '../../models/post';
@Component({
  selector: 'app-feed',
  standalone: true,  
  imports: [PostComponent, FondoGalaxia],
  templateUrl: './feed.html',
  styleUrls: ['./feed.css']
})

export class Feed implements OnInit {

  posteosActivos: PostModelo [] = [];
  subiendoPost: boolean = false;

  constructor(public FeedService: FeedService) {}

  ngOnInit(): void {
    console.log("Feed iniciado");
    this.obtenerPosts();
  }
  
  obtenerPosts() {
    console.log("Ejecutando obtenerPosts()"); 
    
    this.FeedService.getPosts().subscribe({
      next: (data) => { 
        console.log("Datos recibidos:", data);
        this.posteosActivos = data.filter(a => a.eliminado === false) },
      error: (e) => console.log(e)
    })

  }

}