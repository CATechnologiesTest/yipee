import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { EditorEventService } from '../../../../editor-event.service';
import { TooltipService } from '../../../../../shared/services/tooltip.service';

import { NameValuePairRaw } from '../../../../../models/YipeeFileRaw';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-container-host-paths',
  templateUrl: './container-host-paths.component.html',
  styleUrls: ['./container-host-paths.component.css']
})
export class ContainerHostPathsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Input() volumeRefs;

  isComponentExpanded: boolean;

  constructor(
    private editorEventService: EditorEventService,
    private changeDetectorRef: ChangeDetectorRef,
    public tooltipService: TooltipService
  ) {}

  get host_path_ref() {
    return (this.form.get('host_path_ref') as FormArray).controls;
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;

    this.editorEventService.onContainerHostPathChange.subscribe((event) => {
      this.changeDetectorRef.markForCheck();
    });
  }
}
