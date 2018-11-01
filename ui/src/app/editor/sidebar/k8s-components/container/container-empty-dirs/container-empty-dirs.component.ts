import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { EditorEventService } from '../../../../editor-event.service';


import { NameValuePairRaw } from '../../../../../models/YipeeFileRaw';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-container-empty-dirs',
  templateUrl: './container-empty-dirs.component.html',
  styleUrls: ['./container-empty-dirs.component.css']
})
export class ContainerEmptyDirsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  // importing the whole form but you use ONLY development_config and external_config in this component
  @Input() form: FormGroup;
  @Input() volumeRefs;

  isComponentExpanded: boolean;

  constructor(
    private editorEventService: EditorEventService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  get empty_dir_ref() {
    return (this.form.get('empty_dir_ref') as FormArray).controls;
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;

    this.editorEventService.onContainerEmptyDirChange.subscribe((event) => {
      this.changeDetectorRef.markForCheck();
    });
  }
}
