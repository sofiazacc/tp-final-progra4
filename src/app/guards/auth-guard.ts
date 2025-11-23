import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService';


export const authGuard: CanActivateFn = (route, state) => {

  
  const authService = inject(AuthService);
  const router = inject(Router);
const rolEsperado = route.data['rol'];
  const usuario = authService.getUsuarioLogueado();
  const rolUsuario = usuario?.rol;
console.log(`RolGuard: Esperado: '${rolEsperado}', Usuario tiene: '${rolUsuario}'`);

console.log('AuthGuard ejecutado. Token:', authService.getToken());


  if (!authService.estaLogueado()) {
    console.warn('AuthGuard: Acceso denegado. Usuario no logueado. Redirigiendo a /auth');
    router.navigate(['/auth']);
    return false;
  }

  return true;
};
