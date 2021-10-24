import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-reload',
  templateUrl: './page-reload.component.html',
  styleUrls: ['./page-reload.component.scss'],
})
export class PageReloadComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PageReloadComponent>,
    public router: Router
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {}

  pageRedirect() {
    this.router.navigate(['/']);
  }
}
