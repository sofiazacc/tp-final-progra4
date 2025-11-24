import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PostModelo } from '../models/post';
@Injectable({
  providedIn: 'root'
})
export class FeedService {

  url = "http://localhost:3000/posts"

  constructor(private http:HttpClient){
  }

  getPosts(): Observable<PostModelo[]>{
    return this.http.get<PostModelo[]>(this.url);
  }
  
  getPost(id: string ): Observable<PostModelo>{
    return this.http.get<PostModelo>(`${this.url}/${id}`)
  }

  postPost(post: any): Observable<PostModelo>{
    return this.http.post<PostModelo>(this.url, post)
  }

  putPost(id: string, post: PostModelo): Observable<PostModelo>{
    return this.http.put<PostModelo>(`${this.url}/${id}`, post)
  }

  deletePost(id: string): void{
    let post = this.getPost(id);

    post.subscribe(
      data => {
        data.eliminado = true;
        this.http.put(`${this.url}/${id}`, data).subscribe();
      });
  }
}