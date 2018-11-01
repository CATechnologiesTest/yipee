import { ParsedObject } from '../parse/ParsedObject';

/** common cronjob-data entry */

export class CronJobData extends ParsedObject {

  public static OBJECT_NAME = 'cronjob-data';

  public cgroup: string;

  // cronjob spec fields

  /** Allow (default), Forbid, Replace */
  public concurrencyPolicy: string;
  public failedJobsHistoryLimit: number;
  /** schedule in cron format */
  public schedule: string;
  public startingDeadlineSeconds: number;
  public successfulJobsHistoryLimit: number;
  public suspend: boolean;

  // job spec fields

  public activeDeadlineSeconds: number;
  /** defaults to 6 */
  public backoffLimit: number;
  public completions: number;
  public parallelism: number;

  public static construct(type: string): ParsedObject {
    return new CronJobData();
  }

  constructor() {
    super(CronJobData.OBJECT_NAME);
    this.parallelism = 0;
    this.completions = 0;
  }

  /** is the object empty */
  isEmpty(): boolean {
    return super.isEmpty();
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.cgroup = flat['cgroup'];
    if (flat['cronjob-spec'] !== undefined) {
      this.concurrencyPolicy = flat['cronjob-spec'].concurrencyPolicy;
      this.failedJobsHistoryLimit = flat['cronjob-spec'].failedJobsHistoryLimit;
      this.schedule = flat['cronjob-spec'].schedule;
      this.startingDeadlineSeconds = flat['cronjob-spec'].startingDeadlineSeconds;
      this.successfulJobsHistoryLimit = flat['cronjob-spec'].successfulJobsHistoryLimit;
      this.suspend = flat['cronjob-spec'].suspend;
    }
    if (flat['job-spec'] !== undefined) {
      this.activeDeadlineSeconds = flat['job-spec'].activeDeadlineSeconds;
      this.backoffLimit = flat['job-spec'].backoffLimit;
      this.completions = flat['job-spec'].completions;
      this.parallelism = flat['job-spec'].parallelism;
    }
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['cgroup'] = this.cgroup;
    flat['cronjob-spec'] = {};
    if (this.concurrencyPolicy) { flat['cronjob-spec'].concurrencyPolicy = this.concurrencyPolicy; }
    if (this.failedJobsHistoryLimit) { flat['cronjob-spec'].failedJobsHistoryLimit = this.failedJobsHistoryLimit; }
    if (this.schedule) { flat['cronjob-spec'].schedule = this.schedule; }
    if (this.startingDeadlineSeconds) { flat['cronjob-spec'].startingDeadlineSeconds = this.startingDeadlineSeconds; }
    if (this.successfulJobsHistoryLimit) { flat['cronjob-spec'].successfulJobsHistoryLimit = this.successfulJobsHistoryLimit; }
    if (this.suspend) { flat['cronjob-spec'].suspend = this.suspend; }
    flat['job-spec'] = {};
    if (this.activeDeadlineSeconds) { flat['job-spec'].activeDeadlineSeconds = this.activeDeadlineSeconds; }
    if (this.backoffLimit) { flat['job-spec'].backoffLimit = this.backoffLimit; }
    if (this.completions) { flat['job-spec'].completions = this.completions; }
    if (this.parallelism) { flat['job-spec'].parallelism = this.parallelism; }
    return flat;
  }

}
