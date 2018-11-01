import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-cron-job',
  templateUrl: './cron-job.component.html',
  styleUrls: ['./cron-job.component.css']
})
export class CronJobComponent implements OnInit {
  @Input() form: FormGroup;

  constructor() { }

  concurrencyPolicyOptions = [
    { name: 'Allow', value: 'Allow'},
    { name: 'Forbid', value: 'Forbid'},
    { name: 'Replace', value: 'Replace'}
  ];

  restartOptions = [
    { name: 'On Failure', value: 'unless-stopped'},
    { name: 'Never', value: 'no' }
  ];

  ngOnInit() {
  }

}
