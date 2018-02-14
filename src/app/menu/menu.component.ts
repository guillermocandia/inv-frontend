import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import 'rxjs/add/operator/takeWhile';

import { User } from '../_model/index';

import { AuthService } from '../_services/index';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  showMenu = false;

  user = null;

  constructor(
    private _authService: AuthService
  ) {}

  ngOnInit() {
    this._authService.logged$
    .takeWhile(() => !this.showMenu)
    .subscribe(
      (data) => {
        this.showMenu = data;
        if (this.showMenu) {
          this._authService.checkToken()
          .subscribe(
            (user) => {
              this.user = user;
            }
          );
        }
      }
    );
  }

  logout() {
    this._authService.logout();
  }

}
