import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/authService';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

   const authService = inject(AuthService);
  const router = inject(Router)
 let authReq  = req;
  
  // URLs que NO deben llevar token
  const urlsSinToken = [
    '/api/subir-imagen',      // Upload a ImgBB vía backend
    '/auth',
    'api.imgbb.com',          // ImgBB directo (si aplica)
    'api.sunrise-sunset.org'
  ];

  // Verificar si la URL actual está en la lista de exclusión
  const debeExcluirse = urlsSinToken.some(url => req.url.includes(url));
 

  const token = authService.getToken();
  if (debeExcluirse && token) {
    console.log('Excluyendo token para:', req.url);
    authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
    });
    console.log('Token agregado a:', req.url);
    return next(req);
  }else if(debeExcluirse){
    console.log('Excluyendo token para:', req.url);
  }else if(token){
    authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Token agregado a URL protegida:', req.url);
  }


  console.log('Token agregado a:', req.url);
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if(error.status === 401){
        console.error('ERROR 401: Token inválido o expirado. Cerrando sesión.');
        authService.cerrarSesion();
        router.navigate(['/login']);
        return throwError(() => error); 
      }

      return throwError(() => error);
    })
  );
};