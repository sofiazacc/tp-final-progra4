import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService';


export const rolGuard: CanActivateFn = (route, state) => { 

  const authService = inject(AuthService);
  const router = inject(Router);
console.log('AuthGuard ejecutado. Token:', authService.getToken());

  const rolEsperado = route.data['rol'];

  const usuario = authService.getUsuarioLogueado();
  const rolUsuario = usuario?.rol;

  console.log(`RolGuard: Esperado: '${rolEsperado}', Usuario tiene: '${rolUsuario}'`);

  if(rolUsuario!== rolEsperado){
    console.warn('AuthGuard: Acceso denegado. El usuario no posee permisos para acceder a este endpoint');

    if(rolUsuario === 'admin'){
      router.navigate(['/usuarios-admin']);
    }else if(rolUsuario === 'fotografo'){
      router.navigate(['/feed']);
    }else{
      router.navigate(['/auth']);
    }
    return false
  }

  return true;
};
