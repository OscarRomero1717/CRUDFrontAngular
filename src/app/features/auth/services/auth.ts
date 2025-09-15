import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenKey = 'jwt_token';

login(credentials: { username: string, password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('https://localhost:7285/api/Auth/login', credentials)
      .pipe(
        tap(response => {
          this.setToken(response); // <-- Guardar token con expiración
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

 getToken(): string | null {
  const data = localStorage.getItem(this.tokenKey);
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);
    const now = new Date().getTime();
    if (parsed.expiration > now) {
      return parsed.token;
    } else {
      localStorage.removeItem(this.tokenKey);
      return null;
    }
  } catch {
    // Si data no es JSON válido, eliminarlo y retornar null
    localStorage.removeItem(this.tokenKey);
    return null;
  }
}


 setToken(response: any) {
    const now = new Date().getTime(); // timestamp actual en ms
  const expiration = now + response.expiresIn * 60 * 1000;
  const token= response.token
  const data = { token, expiration};
  localStorage.setItem(this.tokenKey, JSON.stringify(data))
  

  setTimeout(() => {
    localStorage.removeItem(this.tokenKey);
  }, expiration);
}


}
