import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-component.html',
  styleUrls: ['./post-component.css']
})
export class PostComponent {
  @Input() postData: any;
  liked: boolean = false;
  
  @Input() esAdmin: boolean = false;
  @Output() onDelete = new EventEmitter<string>();

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

  eliminar() {
    this.onDelete.emit(this.postData.id);
  }
}