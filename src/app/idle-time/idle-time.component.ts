import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-idle-time',
  templateUrl: './idle-time.component.html',
  styleUrls: ['./idle-time.component.scss'],
})
export class IdleTimeComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<IdleTimeComponent>,
    public router: Router
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {}

  onNoClick(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/']);
    this.dialogRef.close();
  }
}
