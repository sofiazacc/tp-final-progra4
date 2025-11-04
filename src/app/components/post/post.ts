import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.html',
  styleUrls: ['./post.css']
})
export class PostComponent {
  @Input() postData: any;
  liked: boolean = false;
  
  getLikesCount(): number {
    if (!this.postData) return 0;
    return this.liked ? this.postData.likes + 1 : this.postData.likes;
  }
  
  toggleLike() {
    this.liked = !this.liked;
  }
  
  guardar() {
    console.log('Guardar post:', this.postData.id);
  }
}