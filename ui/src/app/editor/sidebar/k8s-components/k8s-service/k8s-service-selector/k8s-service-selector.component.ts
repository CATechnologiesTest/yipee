import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { EditorEventService } from '../../../../editor-event.service';

@Component({
  selector: 'k8s-service-selector',
  templateUrl: './k8s-service-selector.component.html',
  styleUrls: ['./k8s-service-selector.component.css']
})
export class ServiceSelectorComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Output() addSelector: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeSelector: EventEmitter<number> = new EventEmitter<number>();
  @Output() toggleSortKey: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() toggleSortValue: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() toggleBulkEdit: EventEmitter<boolean> = new EventEmitter<boolean>();

  isComponentExpanded: boolean;
  isKeySortedAscending: boolean;
  isValueSortedAscending: boolean;

  constructor(
    private editorEventService: EditorEventService,
    private changeDetectorRef: ChangeDetectorRef
  ) {

  }

  get selector() {
    return (this.form.get('selector') as FormArray).controls;
  }

  handleOpenBulkEdit(): void {
    this.toggleBulkEdit.emit(true);
  }

  handleAddSelector() {
    this.addSelector.emit(true);
  }

  handleRemoveSelector(index) {
    this.removeSelector.emit(index);
  }

  handleToggleSortKey(): void {
    this.isKeySortedAscending ? this.isKeySortedAscending = !this.isKeySortedAscending : this.isKeySortedAscending = true;
    this.toggleSortKey.emit(this.isKeySortedAscending);
  }

  handleToggleSortValue(): void {
    this.isValueSortedAscending ? this.isValueSortedAscending = !this.isValueSortedAscending : this.isValueSortedAscending = true;
    this.toggleSortValue.emit(this.isValueSortedAscending);
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;

    this.editorEventService.onServiceSelectorChange.subscribe((event) => {
      this.changeDetectorRef.markForCheck();
    });
  }
}
