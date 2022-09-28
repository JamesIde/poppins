import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/types/user-interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private router: Router) {}
  user!: Subscription;
  loggedUser!: User;
  isAuth: boolean;
  ngOnInit(): void {
    this.isAuth = false;
    this.user = this.authService.loggedUser.subscribe((user) => {
      this.loggedUser = user ? user : null;
      this.isAuth = true;
    });
  }

  ngOnDestroy(): void {
    this.user.unsubscribe();
  }

  handleLogout() {
    this.authService.handleLogout();
    this.router.navigate(['/']);
  }
}
