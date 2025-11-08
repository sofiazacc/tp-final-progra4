import { Component, OnInit } from '@angular/core';
import { FeedService } from '../../services/feed-service';
import { PostComponent } from '../../components/post-component/post-component';
@Component({
  selector: 'app-feed',
  standalone: true,  
  imports: [PostComponent],
  templateUrl: './feed.html',
  styleUrls: ['./feed.css']
})

export class Feed implements OnInit {

  constructor(public feedService: FeedService) {}

  ngOnInit(): void {
    console.log("Feed iniciado");
    this.obtenerPosts();
  }
  
  obtenerPosts() {
    console.log("Ejecutando obtenerPosts()"); 
    this.feedService.getPosts().subscribe({
      next: (data) => { 
        console.log("Datos recibidos:", data);
        this.feedService.posts = data },
      error: (e) => console.log(e)
    });
  }
}