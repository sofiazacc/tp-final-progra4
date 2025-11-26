import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para @for y pipes
import { Usuario } from '../../models/usuario';
import { UsuariosService } from '../../services/usuarios-service';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-admin.html',
  styleUrl: './usuarios-admin.css',
})
export class UsuariosAdmin implements OnInit {
  
  listaFotografos: Usuario[] = [];
  cargando: boolean = true;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuariosService.obtenerTodos().subscribe({
      next: (data) => {
        console.log("Usuarios cargados:", data);
        this.listaFotografos = data;
        this.cargando = false;
      },
      error: (e) => {
        console.error("Error al cargar usuarios", e);
        this.cargando = false;
      }
    });
  }

  eliminar(id: string){
    this.usuariosService.eliminarUsuario(id).subscribe({
      next: (data) => {
        console.log(data);
        this.cargarUsuarios();
        alert("Fotógrafo eliminado exitosamente");
      },
      error: (e) => {
        console.error(e);
      }
    })
  }
}