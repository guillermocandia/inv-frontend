import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-invalidate-dialog',
  templateUrl: 'invalidate-dialog.component.html',
})
export class InvalidateDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<InvalidateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
}
