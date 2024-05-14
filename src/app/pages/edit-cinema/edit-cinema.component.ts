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
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ActivatedRoute, Params, Router, RouterModule } from "@angular/router";
import { CinemasResult, StatusResult } from "@interfaces/interfaces";
import Cinema from "@model/cinema.model";
import ApiService from "@services/api.service";
import ClassMapperService from "@services/class-mapper.service";
import DialogService from "@services/dialog.service";
import NavigationService from "@services/navigation.service";

@Component({
  standalone: true,
  selector: "app-edit-cinema",
  templateUrl: "./edit-cinema.component.html",
  imports: [
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export default class EditCinemaComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private dialog: DialogService = inject(DialogService);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private ns: NavigationService = inject(NavigationService);

  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);
  selectedCinema: WritableSignal<Cinema> = signal<Cinema>(new Cinema());
  editSending: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.cinemas.set(this.ns.getCinemas());
    if (this.cinemas().length == 0) {
      this.router.navigate(["/cinemas"]);
    }
    this.activatedRoute.params.subscribe((params: Params): void => {
      const id: number = params["id"];
      const cinema: Cinema | null = this.ns.getCinema(id);
      if (cinema !== null) {
        this.selectedCinema.set(cinema);
      }
    });
  }

  doEdit(ev: MouseEvent): void {
    ev.preventDefault();
    if (this.selectedCinema()?.name == "") {
      this.dialog.alert({
        title: "Error",
        content: "¡No puedes dejar el nombre en blanco!",
        ok: "Continuar",
      });
      return;
    }

    this.editSending.set(true);
    const cinema: Cinema | null = this.selectedCinema();
    if (cinema !== null) {
      this.as
        .editCinema(cinema.toInterface())
        .subscribe((result: StatusResult): void => {
          this.editSending.set(false);
          if (result.status == "ok") {
            this.ns.updateCinema(cinema);
            this.dialog.alert({
              title: "Cine actualizado",
              content: "El nombre del cine ha sido actualizado.",
              ok: "Continuar",
            });
          }
        });
    }
  }

  deleteCinema(ev: MouseEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.dialog
      .confirm({
        title: "Borrar cine",
        content:
          "¿Estás seguro de querer borrar este cine? También se borrarán todas sus entradas.",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result: boolean): void => {
        if (result) {
          this.deleteCinemaConfirm();
        }
      });
  }

  deleteCinemaConfirm(): void {
    const id: number | null | undefined = this.selectedCinema()?.id;
    if (id !== null && id !== undefined) {
      this.as.deleteCinema(id).subscribe((result: StatusResult): void => {
        if (result.status == "ok") {
          this.dialog
            .alert({
              title: "Cine borrado",
              content: "El cine y todas sus entradas han sido borradas.",
              ok: "Continuar",
            })
            .subscribe((): void => {
              this.ns.setCinemas([]);
              this.getCinemas();
            });
        }
      });
    }
  }

  getCinemas(): void {
    this.as.getCinemas().subscribe((result: CinemasResult): void => {
      this.cinemas.set(this.cms.getCinemas(result.list));
      this.ns.setCinemas(this.cinemas());
      this.router.navigate(["/cinemas"]);
    });
  }
}
