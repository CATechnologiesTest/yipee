import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NamespaceService } from '../../services/namespace.service';
import { NamespaceRaw } from '../../../models/YipeeFileRaw';

@Component({
    selector: 'app-namespace-diff-modal',
    templateUrl: './namespace-diff-modal.component.html',
    styleUrls: ['./namespace-diff-modal.component.css']
})
export class NamespaceDiffModalComponent {
    @Input() show: boolean;
    @Input() parentNamespace: string;
    @Output() onClose = new EventEmitter<string>();

    showDiffResults: boolean;
    diffResults: string;
    childNamespace: string;
    diffForm: FormGroup;
    namespaces: NamespaceRaw[];

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private namespaceService: NamespaceService
    ) {

        // create the diff form for the child namespace value
        this.diffForm = this.formBuilder.group({
            childNamespace: [this.childNamespace, [/** Validators here */]]
        });

        this.diffForm.get('childNamespace').valueChanges.subscribe(value => {
            this.childNamespace = value;
        });

        this.namespaces = this.namespaceService.currentNamespaces;
        console.log(this.namespaces);
    }


    close() {
        this.showDiffResults = false;
        this.diffResults = '';
        this.onClose.emit('closeNamespaceDiff');
    }

    compare() {

        this.apiService.getNamespaceDiff(this.parentNamespace, this.childNamespace)
            .subscribe((response: any) => {
                if (response.success) {
                    this.diffResults = response.data[0];
                } else {
                    this.diffResults = 'Diff call failed - ' + response.data[0];
                }
            }, (err) => {
                this.diffResults = 'Diff call failed - ' + err._body;
            });
        this.showDiffResults = true;
    }

}
