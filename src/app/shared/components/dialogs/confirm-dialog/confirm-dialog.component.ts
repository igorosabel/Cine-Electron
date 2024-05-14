import { Component, WritableSignal, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";

@Component({
  standalone: true,
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  imports: [MatDialogModule, MatButtonModule],
})
export default class ConfirmDialogComponent {
  public dialogRef: MatDialogRef<ConfirmDialogComponent> = inject(
    MatDialogRef<ConfirmDialogComponent>
  );

  public title: WritableSignal<string> = signal<string>("");
  public content: WritableSignal<string> = signal<string>("");
  public ok: WritableSignal<string> = signal<string>("Continuar");
  public cancel: WritableSignal<string> = signal<string>("Cancelar");
}
