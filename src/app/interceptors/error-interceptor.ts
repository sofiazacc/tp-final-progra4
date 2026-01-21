import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/authService';
import { inject } from '@angular/core';
import { Router} from '@angular/router';
import { catchError, throwError } from 'rxjs';



export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.endsWith('/login')) {
        console.warn('ErrorInterceptor: Acceso denegado. Redirigiendo a /auth');
        alert('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
        authService.cerrarSesion();
        router.navigate(['/auth']);
      }else if (error.status >= 500) {
        console.error('ErrorInterceptor: Error 500+ detectado. Falla del servidor.');
        alert('El servidor tuvo un problema. Por favor, intenta de nuevo más tarde.');
      }else if (error.status === 0) {
          console.error('ErrorInterceptor: Error 0 detectado. Falla de red.');
          alert('No se pudo conectar con el servidor. Revisa tu conexión.');
      }else if (error.status === 403) {
          console.error('ErrorInterceptor: Error 403 detectado. Permiso denegado.');
          alert('No tienes permiso para realizar esta acción.');
      }


      return throwError(() => error);
    })
  );
  

};
