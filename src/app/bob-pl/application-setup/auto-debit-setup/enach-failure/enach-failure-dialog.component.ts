import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-enach-failure-dialog',
    templateUrl: './enach-failure-dialog.component.html'
})

export class EnachFailureDialogComponent implements OnInit {

    constructor(private dialogRef: MatDialogRef<EnachFailureDialogComponent>) {
        dialogRef.disableClose = true;
    }

    ngOnInit() {

    }

    yes() {
        this.dialogRef.close('yes');
    }

}
