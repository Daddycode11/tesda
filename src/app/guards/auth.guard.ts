import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, of, switchMap } from 'rxjs';
import { UserType } from '../models/Users';
import { VisitorLogService } from '../services/visitor-log.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const visitorLog = inject(VisitorLogService);

  return authService.getCurrentUser().pipe(
    switchMap((user) => {
      if (user) {
        return visitorLog.saveLog(user.id).then(() => {
          console.log('Save');
          return user.type === UserType.USER;
        });
      } else {
        return of(
          router.createUrlTree([''], {
            queryParams: { returnUrl: state.url },
          })
        );
      }
    })
  );
};
