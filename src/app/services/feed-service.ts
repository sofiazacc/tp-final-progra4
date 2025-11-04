import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PostModelo } from '../models/postModelo';
@Injectable({
  providedIn: 'root'
})
export class FeedService {
  
  
  url = "http://localhost:3000/posts"

  posts: PostModelo[];

  constructor(private http:HttpClient){
    this.posts = []
  }

  getPosts(){
    return this.http.get<PostModelo[]>(this.url);
  }
  
  getPost(id: string ){
    return this.http.get<PostModelo>(`${this.url}/${id}`)
  }
  
}
