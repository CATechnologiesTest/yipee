import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { YipeeFileMetadata } from '../models/YipeeFileMetadata';


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showNewApplicationDialog = false;
  showImportApplicationDialog = false;

  constructor(
    private router: Router
  ) { }

  handleCreateNewApplicationCreated(metadata: YipeeFileMetadata): void {
    this.showNewApplicationDialog = false;
    this.router.navigate(['/editor']);
  }

  importApplication(metadata: YipeeFileMetadata): void {
    this.showImportApplicationDialog = false;
    this.router.navigate(['/editor']);
  }

  ngOnInit() {
  }
}
