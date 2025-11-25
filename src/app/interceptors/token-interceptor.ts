import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/authService';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

   const authService = inject(AuthService);
  
  // URLs que NO deben llevar token
  const urlsSinToken = [
    '/api/subir-imagen',      // Upload a ImgBB vía backend
    '/login',                  // Login
    '/register',               // Registro
    'api.imgbb.com',          // ImgBB directo (si aplica)
  ];

  // Verificar si la URL actual está en la lista de exclusión
  const debeExcluirse = urlsSinToken.some(url => req.url.includes(url));

  if (debeExcluirse) {
    console.log('Excluyendo token para:', req.url);
    return next(req);
  }

  const token = authService.getToken();
  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log('Token agregado a:', req.url);
  return next(authReq);
};