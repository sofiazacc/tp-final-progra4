import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { Home } from './pages/home/home';
import { Feed } from './pages/feed/feed'; 
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full' },
    {path: 'auth', component: Auth },
    {path: 'home', component: Home },
    {path: 'feed', component: Feed, canActivate: [authGuard] }
];
