import { Component, OnInit, Output, HostListener } from '@angular/core';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { IdleTimeComponent } from './idle-time/idle-time.component';
import { MatDialog } from '@angular/material/dialog';
import { PageReloadComponent } from './page-reload/page-reload.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayContent: Subscription;
  title = 'bob-personalloan';
  loginID: number;
  loginDetails: any;
  displayApplication: boolean = false;
  showContents1 = false;
  showContents2 = false;
  showContents3 = false;
  contentDisplay: any = '';
  constructor(
    private service: ComponentInteractionService,
    private bnIdle: BnNgIdleService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.displayContent = this.service.loaderText.subscribe(data => {
      if (data) {
        this.showContent();
      }
    })

    //Disable and enable Application Id in headers

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/') {
          this.displayApplication = false;
        }
        else if (event.urlAfterRedirects.indexOf('/login') !== -1) {
          this.displayApplication = false;
        }
        else if (event.urlAfterRedirects.indexOf('/borrower-details') !== -1) {
          this.displayApplication = false;
        }
        else if (event.urlAfterRedirects.indexOf('/revisit-loan-journey') !== -1) {
          this.displayApplication = false;
        }
        else if (event.urlAfterRedirects.indexOf('/offer-reject') !== -1) {
          this.displayApplication = false;
        }
        else {
          if (localStorage.getItem('applicationId') === null) {
            this.displayApplication = false;
          } else {
            this.loginDetails = localStorage.getItem('applicationId');
            this.displayApplication = true;
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.idleTime();
    this.pathChange();


  }

  /**
   *  @author Ramana K
   *  Avoid copy and paste in application 
   **/
  
  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }
  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }
  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }



  idleTime() {
    this.bnIdle.startWatching(600).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        if (this.dialog.openDialogs.length == 0) {
          const dialogRef = this.dialog.open(IdleTimeComponent, {
            // width: '400px',
            // height: ' 300px',
            closeOnNavigation: false
          });
        }
      }
    });
  }

  pathChange() {
    // if (window.location.pathname !== '/') {
    //   this.dialog.open(PageReloadComponent, {
    //     width: '400px',
    //     height: ' 300px',
    //   });
    // }
  }


  showContent() {
    setTimeout(() => {
      this.showContents1 = true;
      this.showContents2 = false;
      this.showContents3 = false;
      this.showContent2();

    }, 15000);
  }
  showContent2() {
    setTimeout(() => {
      this.showContents1 = false;
      this.showContents2 = true;
      this.showContents3 = false;
      this.showContent3();

    }, 15000);
  }
  showContent3() {
    setTimeout(() => {
      this.showContents1 = false;
      this.showContents2 = false;
      this.showContents3 = true;
      this.displayContent.unsubscribe();
    }, 15000);
  }

}
