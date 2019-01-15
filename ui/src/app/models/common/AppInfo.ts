import { ParsedObject } from '../parse/ParsedObject';
import { FinderUtilities } from './FinderUtilities';
import { K8sFile } from '../k8s/K8sFile';
import { Namespace } from '../k8s/Namespace';

/** Yipee flat file app-info entry. */

export class AppInfo extends ParsedObject {

  public static OBJECT_NAME = 'app-info';

  description: string;
  name: string;
  helmSettingsAll: boolean;
  helmSettingsEnv: boolean;
  helmSettingsLabels: boolean;
  helmSettingsPorts: boolean;
  readme: string;
  model_id: string;
  createNs = false;

  public static construct(type: string): ParsedObject {
    return new AppInfo();
  }

  constructor() {
    super(AppInfo.OBJECT_NAME);
  }

  /** is the object empty */
  isEmpty(): boolean {
    return false;
  }

  /** remove the container and all references to this container */
  remove(): void {
    super.remove();
    FinderUtilities.removeObjectAnnotations(this.finder, this.id);
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.description = flat['description'];
    this.name = flat['name'];
    this.readme = flat['readme'];

    if (flat['helm-settings']) {
      this.helmSettingsAll = false;
      this.helmSettingsEnv = flat['helm-settings'].env;
      this.helmSettingsLabels = flat['helm-settings'].labels;
      this.helmSettingsPorts = flat['helm-settings'].ports;
    } else {
      this.helmSettingsAll = true;
    }

  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['description'] = this.description;
    flat['name'] = this.name;
    flat['readme'] = this.readme;

    if (this.helmSettingsAll === false) {
      flat['helm-settings'] = {
        env: this.helmSettingsEnv,
        labels: this.helmSettingsLabels,
        ports: this.helmSettingsPorts
      };
    }

    return flat;
  }

  get ui(): any {
    return FinderUtilities.getUi(this.finder, this.id).value;
  }

  // get show_progress_bar(): boolean {
  //   if (this.ui.show_progress_bar === undefined) {
  //     return false;
  //   }
  //   return this.ui.show_progress_bar;
  // }

  // set show_progress_bar(value: boolean) {
  //   this.ui.show_progress_bar = value;
  // }

  get namespace(): string {
    return FinderUtilities.getNamespace(this.finder, this.id).name;
  }

  set namespace(value: string) {
    FinderUtilities.getNamespace(this.finder, this.id).name = value;
  }

}
