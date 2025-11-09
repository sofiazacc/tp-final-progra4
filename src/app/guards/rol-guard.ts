import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService';


export const rolGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);


  const usuario = authService.getUsuarioLogueado();

  if (!usuario || usuario.rol !== 'admin') {
    console.warn('AuthGuard: Acceso denegado. El usuario no posee permisos para acceder a este endpoint. Redirigiendo a /feed');
    router.navigate(['/feed']);
    return false
  }
  
  return true;
};
