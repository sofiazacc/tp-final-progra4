import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],  
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('phost');

  ngOnInit(){
    AOS.init({
      duration: 800,
      easing: 'ease-in-out', 
      once: true,
      mirror: false, 
      offset: 120,
    });
  }
}


