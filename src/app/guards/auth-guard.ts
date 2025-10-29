import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Aquí deberías verificar si el usuario está autenticado
  // Por ejemplo, verificando un token en localStorage
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    // Si no está autenticado, redirige al login
    router.navigate(['/login']);
    return false;
  }
  
  return true;
};
