import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { EditorEventService } from '../../../../editor-event.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-deployment',
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.css']
})
export class DeploymentComponent implements OnInit {
  @Input() form: FormGroup;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private editorEventService: EditorEventService
  ) { }

  updateStrategyOptions = [
    { name: 'Rolling Update', value: 'RollingUpdate' },
    { name: 'Recreate', value: 'Recreate' }
  ];

  ngOnInit() {

    this.editorEventService.onServiceModelOnRefresh.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });

  }

}
