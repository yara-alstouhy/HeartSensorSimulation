import { Component } from '@angular/core';
// import {ActivatedRoute,Router,NavigationEnd} from "@angular/router";
import { filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BigHero6';
  activePath: string = '';
  activeClassName: string = '';
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activePath = event.url.split('/')[1] || 'default';
        this.activeClassName = this.activePath + 'PageClass';
        console.log(this.activeClassName);
      }
    });
  }


}
