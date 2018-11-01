import { TestBed } from '@angular/core/testing';
import { CronJobData } from './CronJobData';

describe('CronJobData', () => {

  const flat1 = {
    'id': 'foo-bar-id',
    'type': 'cronjob-data',
    'job-spec': {
      'activeDeadlineSeconds': 30
    },
    'cgroup': '81f8b8e1-7ae4-4071-8049-425ace0faae5',
    'cronjob-spec': {
      'schedule': '1 2-14 * * 0-1,5-6'
    }
  };

  it('should handle round trip', () => {
    const a1 = CronJobData.construct(CronJobData.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

});
