import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree , Router} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ConstantService } from '../services/constant.service';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private apiService: ConstantService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.apiService.getRole().pipe(
      switchMap(response => {
        const roles = response.data;
        const userRole = this.getUserRole(); // Dapatkan peran dari localStorage

        if (userRole === 'superadmin') {
          return of(true); // Akses diizinkan untuk superadmin
        }

        if (userRole === 'supervisor') {
          // Redirect jika perlu
          this.router.navigate(['/'], { queryParams: { error: 'Access Denied' } });
          return of(false);
        }

        if (userRole === 'admin') {
          // Redirect jika perlu
          this.router.navigate(['/'], { queryParams: { error: 'Access Denied' } });
          return of(false);
        }

        // Redirect jika tidak ada peran yang dikenali
        this.router.navigate(['/login']);
        return of(false);
      }),
      catchError(() => {
        this.router.navigate(['/login']); // Navigasi ke login jika terjadi kesalahan
        return of(false);
      })
    );
  }

  private getUserRole(): string {
    const data = localStorage.getItem('user');
    const parsedData = JSON.parse(data || '{}');
    return parsedData.role_id;
  }
}
