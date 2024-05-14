import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { CinemasResult, LoginData, LoginResult } from "@interfaces/interfaces";
import Utils from "@model/utils.class";
import ApiService from "@services/api.service";
import AuthService from "@services/auth.service";
import ClassMapperService from "@services/class-mapper.service";
import NavigationService from "@services/navigation.service";
import UserService from "@services/user.service";

@Component({
  standalone: true,
  selector: "app-login",
  templateUrl: "./login.component.html",
  imports: [
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export default class LoginComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private user: UserService = inject(UserService);
  private router: Router = inject(Router);
  private auth: AuthService = inject(AuthService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private ns: NavigationService = inject(NavigationService);

  loginData: LoginData = {
    name: "",
    pass: "",
  };
  loginError: WritableSignal<boolean> = signal<boolean>(false);
  loginSending: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(["/home"]);
    }
  }

  doLogin(ev: MouseEvent): void {
    ev.preventDefault();

    if (this.loginData.name === "" || this.loginData.pass === "") {
      return;
    }

    this.loginSending.set(true);
    this.as.login(this.loginData).subscribe((result: LoginResult): void => {
      this.loginSending.set(false);
      if (result.status === "ok") {
        this.user.logged = true;
        this.user.id = result.id;
        this.user.name = Utils.urldecode(result.name);
        this.user.token = Utils.urldecode(result.token);
        this.user.saveLogin();

        this.as.getCinemas().subscribe((result: CinemasResult): void => {
          this.ns.setCinemas(this.cms.getCinemas(result.list));
        });

        this.router.navigate(["/home"]);
      } else {
        this.loginError.set(true);
      }
    });
  }
}
