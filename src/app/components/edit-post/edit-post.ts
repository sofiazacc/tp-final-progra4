import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeedService } from '../../services/feedService';
import { PostModelo } from '../../models/post';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-post.html',
  styleUrl: './edit-post.css',
})
export class EditPost implements OnChanges {

  @Input() post: PostModelo | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<PostModelo>();

  editForm: FormGroup;

  constructor(private fb: FormBuilder, private feedService: FeedService) {
    this.editForm = this.fb.group({
      url: ['', Validators.required],
      ubicacion: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  // A diferencia de ngOnInit, este realiza un monitoreo constante en lugar de ejecutarse una única vez.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post'] && this.post) {
      this.editForm.patchValue({
        url: this.post.url,
        ubicacion: this.post.ubicacion,
        descripcion: this.post.descripcion
      });
    }
  }

  guardar(): void {
    if (this.editForm.valid && this.post) {
      const postActualizado: PostModelo = {
        ...this.post,
        ...this.editForm.value
      };

      this.feedService.patchPost(postActualizado).subscribe({
        next: (data) => {
          this.onSave.emit(data);
        },
        error: (e) => console.error(e)
      });
    }
  }

  cancelar() {
    this.onCancel.emit();
  }
}