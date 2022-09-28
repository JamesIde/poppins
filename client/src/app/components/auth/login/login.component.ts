import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  loginForm!: FormGroup;

  // Handlers
  isLoading = false;
  isError = false;
  errorMsg!: string;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  handleSubmit() {
    this.isLoading = true;
    // Subscribe to the result of logging in
    this.authService.loginUser(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.loginForm.reset();
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
        this.errorMsg = error.error.message;
        this.loginForm.reset();
        this.setErrorTimeout();
      },
    });
  }
  setErrorTimeout() {
    setTimeout(() => {
      this.isError = false;
    }, 5000);
  }
}
