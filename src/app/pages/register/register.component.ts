import { Component, WritableSignal, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import {
  CinemasResult,
  LoginResult,
  RegisterData,
} from "@interfaces/interfaces";
import Utils from "@model/utils.class";
import ApiService from "@services/api.service";
import ClassMapperService from "@services/class-mapper.service";
import NavigationService from "@services/navigation.service";
import UserService from "@services/user.service";

@Component({
  standalone: true,
  selector: "app-register",
  templateUrl: "./register.component.html",
  imports: [
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export default class RegisterComponent {
  private as: ApiService = inject(ApiService);
  private user: UserService = inject(UserService);
  private router: Router = inject(Router);
  private cms: ClassMapperService = inject(ClassMapperService);
  private ns: NavigationService = inject(NavigationService);

  registerData: RegisterData = {
    name: "",
    pass: "",
    conf: "",
  };
  registerNameError: WritableSignal<boolean> = signal<boolean>(false);
  registerPassError: WritableSignal<boolean> = signal<boolean>(false);
  registerSending: WritableSignal<boolean> = signal<boolean>(false);

  doRegister(ev: MouseEvent): void {
    ev.preventDefault();

    if (
      this.registerData.name === "" ||
      this.registerData.pass === "" ||
      this.registerData.conf === ""
    ) {
      return;
    }

    this.registerNameError.set(false);
    this.registerPassError.set(false);
    if (this.registerData.pass !== this.registerData.conf) {
      this.registerPassError.set(true);
      return;
    }

    this.registerSending.set(true);
    this.as
      .register(this.registerData)
      .subscribe((result: LoginResult): void => {
        this.registerSending.set(false);
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
          this.registerNameError.set(true);
        }
      });
  }
}
