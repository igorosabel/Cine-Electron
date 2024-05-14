import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MatListItem,
  MatListItemIcon,
  MatListModule,
  MatNavList,
} from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import ResponsiveService from '@app/services/responsive.service';
import Cinema from '@model/cinema.model';
import NavigationService from '@services/navigation.service';
import UserService from '@services/user.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbar,
    MatToolbarRow,
    MatListModule,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatIcon,
    RouterLink,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export default class SidenavComponent implements OnInit {
  private user: UserService = inject(UserService);
  private router: Router = inject(Router);
  private ns: NavigationService = inject(NavigationService);
  private rs: ResponsiveService = inject(ResponsiveService);

  opened: WritableSignal<boolean> = signal<boolean>(false);
  backdrop: WritableSignal<boolean> = signal<boolean>(true);
  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);

  ngOnInit(): void {
    this.cinemas.set(this.ns.getCinemas());
    this.rs.screenWidth$.subscribe((value: number | null): void => {
      console.log(value);
      this.backdrop.set(false);
      this.opened.set(true);
      if (value !== null && value < ResponsiveService.SM) {
        this.backdrop.set(true);
        this.opened.set(false);
      }
    });
  }

  toggleSidenav(): void {
    this.opened.update((value: boolean): boolean => !value);
  }

  logout(ev: MouseEvent): void {
    ev.preventDefault();
    this.user.logout();
    this.router.navigate(['/']);
  }
}
