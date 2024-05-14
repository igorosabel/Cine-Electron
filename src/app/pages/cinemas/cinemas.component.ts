import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";
import {
  CinemasResult,
  DialogOptions,
  StatusResult,
} from "@interfaces/interfaces";
import Cinema from "@model/cinema.model";
import ApiService from "@services/api.service";
import ClassMapperService from "@services/class-mapper.service";
import DialogService from "@services/dialog.service";
import NavigationService from "@services/navigation.service";

@Component({
  standalone: true,
  selector: "app-cinemas",
  templateUrl: "./cinemas.component.html",
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
})
export default class CinemasComponent implements OnInit {
  private dialog: DialogService = inject(DialogService);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private ns: NavigationService = inject(NavigationService);

  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);

  ngOnInit(): void {
    this.cinemas.set(this.ns.getCinemas());
  }

  addCinema(): void {
    this.dialog
      .form({
        title: "Añadir cine",
        content: "Introduce el nombre del nuevo cine",
        fields: [
          {
            title: "Nombre",
            type: "text",
            value: "",
          },
        ],
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result: DialogOptions): void => {
        if (result && result.fields !== undefined) {
          this.newCinema(result.fields[0].value);
        }
      });
  }

  newCinema(name: string): void {
    this.as.addCinema(name).subscribe((result: StatusResult): void => {
      if (result.status == "ok") {
        this.cinemas.set([]);
        this.ns.setCinemas([]);

        this.getCinemas();
      } else {
        this.dialog.alert({
          title: "Error",
          content: "Ocurrió un error al guardar el nuevo cine.",
          ok: "Continuar",
        });
      }
    });
  }

  getCinemas(): void {
    this.as.getCinemas().subscribe((result: CinemasResult): void => {
      this.cinemas.set(this.cms.getCinemas(result.list));
      this.ns.setCinemas(this.cinemas());
    });
  }
}
