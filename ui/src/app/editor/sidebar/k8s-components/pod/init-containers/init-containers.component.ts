import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { Container } from '../../../../../models/common/Container';
import { ContainerGroup } from '../../../../../models/common/ContainerGroup';
import { ValueChangeEvent } from '../../../../../models/Events';

@Component({
  selector: 'k8s-init-containers',
  templateUrl: './init-containers.component.html',
  styleUrls: ['./init-containers.component.css']
})
export class InitContainersComponent implements OnInit {

  @Input() expandedByDefault: boolean;
  @Input() containerGroup: ContainerGroup;
  @Output() changeInitOrder: EventEmitter<string[]> = new EventEmitter<string[]>();

  differ: any;
  isComponentExpanded: boolean;
  initArray: string[];

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.initArray = [];
  }

  handleChangeInitOrder() {
    this.changeInitOrder.emit(this.initArray);
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
    if (this.containerGroup !== undefined) {
      this.containerGroup.onContainerCountChange.subscribe((event: ValueChangeEvent) => {
        this.updateInitArray();
      });
      this.updateInitArray();
    }
  }

  updateInitArray() {
    this.initArray.length = 0;
    this.containerGroup.init_containers.forEach(element => {
      this.initArray.push(element.name);
    });
    this.changeDetectorRef.markForCheck();
  }

}
