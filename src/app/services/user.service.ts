import { Injectable } from "@angular/core";
import { LoginResult } from "@interfaces/interfaces";

@Injectable()
export default class UserService {
  logged: boolean = false;
  id: number | null = null;
  name: string | null = null;
  token: string | null = null;

  loadLogin(): void {
    const loginObjStr: string | null = localStorage.getItem("login");
    if (loginObjStr === null) {
      this.logout();
      return;
    }
    const loginObj: LoginResult = JSON.parse(loginObjStr);
    if (loginObj === null) {
      this.logout();
      return;
    }
    this.logged = true;
    this.id = loginObj.id;
    this.name = loginObj.name;
    this.token = loginObj.token;
  }

  saveLogin(): void {
    const loginObj: LoginResult = {
      status: "ok",
      id: this.id,
      name: this.name,
      token: this.token,
    };
    localStorage.setItem("login", JSON.stringify(loginObj));
  }

  logout(): void {
    this.logged = false;
    this.id = null;
    this.name = null;
    this.token = null;
    localStorage.removeItem("login");
  }
}
