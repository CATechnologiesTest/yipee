import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NameStringValue } from '../../../../../models/common/Generic';

import { EditorService } from '../../../../editor.service';
import { EditorEventService } from '../../../../editor-event.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-stateful-set',
  templateUrl: './stateful-set.component.html',
  styleUrls: ['./stateful-set.component.css']
})
export class StatefulSetComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() serviceNameOptions: NameStringValue[];

  constructor(
    private editorService: EditorService,
    private editorEventService: EditorEventService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  updateStrategyOptions = [
    { name: 'Rolling Update', value: 'RollingUpdate' },
    { name: 'On Delete', value: 'OnDelete' }
  ];

  podManagementOptions = [
    { name: 'Ordered Ready', value: 'OrderedReady' },
    { name: 'Parallel', value: 'Parallel'}
  ];

  restartOptions = [
    { name: 'Always', value: 'always' },
    { name: 'On Failure', value: 'unless-stopped'},
    { name: 'Never', value: 'no' }
  ];

  ngOnInit() {
    this.editorEventService.onServiceModelOnRefresh.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

}
