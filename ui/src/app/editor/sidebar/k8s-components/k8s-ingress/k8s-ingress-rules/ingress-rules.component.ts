import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { NameStringValue } from '../../../../../models/common/Generic';
import { Ingress } from '../../../../../models/k8s/Ingress';

@Component({
  selector: 'k8s-ingress-rule',
  templateUrl: './ingress-rules.component.html',
  styleUrls: ['./ingress-rules.component.css']
})
export class IngressRuleComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Input() serviceOptions: NameStringValue[];
  @Input() ingress: Ingress;
  @Output() addRule: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeRule: EventEmitter<number> = new EventEmitter<number>();
  @Output() addPath: EventEmitter<number> = new EventEmitter<number>();
  @Output() removePath: EventEmitter<object> = new EventEmitter<object>();

  isComponentExpanded: boolean;

  constructor() {
  }

  get rule() {
    return (this.form.get('rule') as FormArray).controls;
  }

  handleAddRule() {
    this.addRule.emit(true);
  }

  handleRemoveRule(index) {
    this.removeRule.emit(index);
  }

  handleAddPath(index) {
    this.addPath.emit(index);
  }

  handleRemovePath(ruleIndex: number, pathIndex: number) {
    const rulePathObject = {
      ruleIndex: ruleIndex,
      pathIndex: pathIndex
    };
    this.removePath.emit(rulePathObject);
  }

  trackPath(index, path) {
    return path ? path.id : undefined;
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;

    this.ingress.onServiceMapChange.subscribe(() => {
      (this.form.get('rule') as FormArray).controls.forEach((ruleFormGroup: FormControl) => {
        const ruleId = ruleFormGroup.value.id;
        (ruleFormGroup.get('paths') as FormArray).controls.forEach((pathFormGroup: FormControl) => {
          const pathId = pathFormGroup.value.id;
          const ruleItem = this.ingress.rules.find((rule) => {
            return rule.id === ruleId;
          });
          const nullPathItems = ruleItem.paths.filter((path) => {
            return path.service_id === null;
          });
          nullPathItems.forEach((item) => {
            if (item.id === pathFormGroup.get('id').value) {
              pathFormGroup.get('service').setValue('-- Select a service --');
            }
          });
        });
      });
    });
  }
}
