import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { NameValuePairRaw } from '../../../../../models/YipeeFileRaw';
import { Container } from '../../../../../models/common/Container';
import { EditorEventService } from '../../../../editor-event.service';
import { VolumeRef } from '../../../../../models/common/VolumeRef';
import { TooltipService } from '../../../../../shared/services/tooltip.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-container-volumes',
  templateUrl: './container-volumes.component.html',
  styleUrls: ['./container-volumes.component.css']
})
export class ContainerVolumesComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  // importing the whole form but you use ONLY development_config and external_config in this component
  @Input() form: FormGroup;
  @Input() volumeRefs: VolumeRef[];
  @Input() accessModeOptions: NameValuePairRaw[][];

  isComponentExpanded: boolean;

  constructor(
    private editorEventService: EditorEventService,
    public tooltipService: TooltipService
  ) {}

  get volume_ref() {
    return (this.form.get('volume_ref') as FormArray).controls;
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }
}
