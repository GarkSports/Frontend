import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const isManagerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  return inject(AuthService).checkIfManager().pipe(map((isManager) => {
    if (isManager) {
      return true;
    } else {
      router.navigate(['/authentication/side-login']);
      return false;
    }
  }));
};
