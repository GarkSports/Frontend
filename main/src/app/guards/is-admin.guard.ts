import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  return inject(AuthService).checkIfAdmin().pipe(map((isAdmin) => {
    if (isAdmin) {
      return true;
    } else {
      router.navigate(['/authentication/side-login']);
      return false;
    }
  }));
};
