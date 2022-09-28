import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}

  profileSubscription!: Subscription;

  ngOnInit(): void {
    this.profileSubscription = this.authService
      .getProfile()
      .subscribe((user) => {
        console.log(user);
      });
  }
  ngOnDestroy(): void {
    this.profileSubscription.unsubscribe();
  }
}
