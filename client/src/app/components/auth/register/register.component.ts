import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  registerForm!: FormGroup;

  // Handlers
  isLoading = false;
  isError = false;
  errorMsg!: string;
  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  handleSubmit() {
    this.isLoading = true;
    // Subscribe to the result of logging in
    this.authService.registerUser(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.registerForm.reset();
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
        this.errorMsg = error.error.message;
        this.registerForm.reset();
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
