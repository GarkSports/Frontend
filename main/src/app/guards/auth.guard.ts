import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  return inject(AuthService).checkAuthenticated().pipe(tap((isAuthenticated) => {
    if (isAuthenticated) {
      return true;
    } else {
      router.navigate(['/authentication/side-login']);
      return false;
    }
  }));
};
