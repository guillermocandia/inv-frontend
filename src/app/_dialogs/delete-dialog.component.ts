import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-delete-dialog',
  templateUrl: 'delete-dialog.component.html',
})
export class DeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

}
