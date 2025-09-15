
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';


import { AuthService } from '../../services/auth';


import { GlobalModalService } from '@shared/services/global-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzAlertModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private modal = inject(GlobalModalService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.loginError = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const creds = this.loginForm.value;

    this.authService.login({ username: creds.email, password: creds.password })
      .subscribe({
        next: (resp) => {
         
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login error', err);
          // mostramos mensaje de error          
          if (err.status === 401) {
            this.loginError = 'Credenciales inválidas';
            //this.modal.error('Credenciales inválidas')
          } else {
            this.loginError = 'Error al conectar con el servidor';
          }
        }
      });
  }
}
