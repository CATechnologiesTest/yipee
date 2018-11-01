import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { EditorEventService } from '../../../../editor-event.service';

@Component({
  selector: 'k8s-annotations',
  templateUrl: './k8s-annotations.component.html',
  styleUrls: ['./k8s-annotations.component.css']
})
export class AnnotationsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Output() addAnnotation: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeAnnotation: EventEmitter<number> = new EventEmitter<number>();
  @Output() toggleSortKey: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() toggleSortValue: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() toggleBulkEdit: EventEmitter<boolean> = new EventEmitter<boolean>();

  isComponentExpanded: boolean;
  isKeySortedAscending: boolean;
  isValueSortedAscending: boolean;

  constructor(
    private editorEventService: EditorEventService,
  ) {

  }

  get annotations() {
    return (this.form.get('annotations') as FormArray).controls;
  }

  handleOpenBulkEdit(): void {
    this.toggleBulkEdit.emit(true);
  }

  handleAddAnnotation() {
    this.addAnnotation.emit(true);
  }

  handleRemoveAnnotation(index) {
    this.removeAnnotation.emit(index);
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
  }
}
