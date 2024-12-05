import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatListItem, MatNavList} from "@angular/material/list";
import {RouterLink} from "@angular/router";
import {MediaMatcher} from "@angular/cdk/layout";
import {MatDivider} from "@angular/material/divider";

export interface Nav {
  label: string;
  route: string;
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    MatSidenav, MatSidenavContainer, MatSidenavContent, MatToolbar, MatIcon, MatIconButton, MatNavList, MatListItem, RouterLink, MatDivider
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  @Input() routes!: Nav[];
  @Input() title!: string;

/*
  @ViewChild("snav") snav!: MatDrawer;
*/

  mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly media: MediaMatcher,
  ) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
