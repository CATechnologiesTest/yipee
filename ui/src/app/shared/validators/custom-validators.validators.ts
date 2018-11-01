import { AbstractControl, ValidatorFn } from '@angular/forms';
import { EditorService } from '../../editor/editor.service';
import { Container } from '../../models/common/Container';

export class CustomValidators {

  static minLengthArray(min: number) {
    return (c: AbstractControl): { [key: string]: any } => {
      if (c.value.length >= min) {
        return null;
      }

      return { minLengthArray: true };
    };
  }

  static alphaNumericUnderscoreDashForwardSlashPeriodDollarCurlyBrackets(control: AbstractControl) {
    const regexp = /^[a-z\d\-_./${}]+$/i;
    const valid = regexp.test(control.value);
    return valid ? null : { alphaNumericUnderscoreDashForwardSlashPeriodDollarCurlyBrackets: true };
  }

  static alphaNumericUnderscoreDashForwardSlashPeriodColon(control: AbstractControl) {
    const regexp = /^[a-z\d\-_./:]+$/i;
    const valid = regexp.test(control.value);
    return valid ? null : { alphaNumericUnderscoreDashForwardSlashPeriodColon: true };
  }

  static alphaNumericUnderscoreDashForwardSlashPeriod(control: AbstractControl) {
    if (control.value === '') {
      return null;
    }
    const regexp = /^[a-z\d\-_./]+$/i;
    const valid = regexp.test(control.value);
    return valid ? null : { alphaNumericUnderscoreDashForwardSlashPeriod: true };
  }

  // sample must only contain letters, number, spaces, dashes, and underscores
  static alphaNumericUnderscoreDashSpace(control: AbstractControl) {
    const regexp = /^[a-z\d\-_\s]+$/i;
    const valid = regexp.test(control.value);
    return valid ? null : { alphaNumericUnderscoreDashSpace: true };
  }

  static alphaNumericUnderscoreDashPeriod(control: AbstractControl) {
    if (control.value === '') {
      return null;
    }
    const regexp = /^[a-z\d\-_.]+$/i;
    const valid = regexp.test(control.value);
    return valid ? null : { alphaNumericUnderscoreDashPeriod: true };
  }

  static alphaNumericDashPeriod(control: AbstractControl) {
    const regexp = /^[a-z\d\-.]+$/i;
    const valid = regexp.test(control.value);
    return valid ? null : { alphaNumericDashPeriod: true };
  }

  static alphaNumericUnderscorePeriod(control: AbstractControl) {
    const regexp = /^[a-z\d\._]+$/i;
    const valid = regexp.test(control.value);
    return valid ? null : { alphaNumericUnderscorePeriod: true };
  }

  static alphaNumericUnderscorePeriodColon(control: AbstractControl) {
    const regexp = /^[a-z\d\.:_]+$/i;
    const valid = regexp.test(control.value);
    return valid ? null : { alphaNumericUnderscorePeriodColon: true };
  }

  static alphaNumericUnderscoreDash(control: AbstractControl) {
    if (control.value === '') {
      return null;
    }
    const regexp = /^[a-z\d\-_]+$/i;
    const valid = regexp.test(control.value);
    return valid ? null : { alphaNumericUnderscoreDash: true };
  }

  static alphaNumericUnderscore(control: AbstractControl) {
    const regexp = /^[a-z\d\_]+$/i;
    const valid = regexp.test(control.value);
    return valid ? null : { alphaNumericUnderscore: true };
  }

  static alphaNumericDash(control: AbstractControl) {
    const regexp = /^[a-z\d\-]+$/i;
    const valid = regexp.test(control.value);
    return valid ? null : { alphaNumericDash: true };
  }

  static alphaNumericForwardSlashDashPeriod(control: AbstractControl) {
    if (control.value === '') {
      return null;
    }
    const regexp = /^[a-z\d\/\-.]+$/i;
    const valid = regexp.test(control.value);
    return valid ? null : { alphaNumericForwardSlashDashPeriod: true };
  }

  static alphaNumericForwardSlashDash(control: AbstractControl) {
    if (control.value === '') {
      return null;
    }
    const regexp = /^[a-z\d\/\-]+$/i;
    const valid = regexp.test(control.value);
    return valid ? null : { alphaNumericForwardSlashDash: true };
  }

  static alphaNumeric(control: AbstractControl) {
    if (control.value === '') {
      return null;
    }
    const regexp = /^[a-z\d]+$/i;
    const valid = regexp.test(control.value);
    return valid ? null : { alphaNumeric: true };
  }

  static numericOnly(control: AbstractControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      const regexp = /^\d+$/;
      const valid = regexp.test(control.value);
      return valid ? null : { numericOnly: true };
    }
  }

  static numericAndPercentOnly(control: AbstractControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      const regexp = /^(\d+(?:[\.\,]\d{0,})?)%?$/;
      const valid = regexp.test(control.value);
      return valid ? null : { numericAndPercentOnly: true };
    }
  }

  static numericOneOrGreater(control: AbstractControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      if (control.value >= 1) {
        return null;
      } else {
        return { numericOneOrGreater: true };
      }
    }
  }

  static numericZeroOrGreater(control: AbstractControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      if (control.value >= 0) {
        return null;
      } else {
        return { numericZeroOrGreater: true };
      }
    }
  }

  static defaultModeValidator(control: AbstractControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      if (control.value >= 0 && control.value <= 777) {
        return null;
      } else {
        return { defaultModeValidator: true };
      }
    }
  }

  static numericOnlyOrAsterisk(control: AbstractControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      let valid = false;
      if (control.value === '*') {
        valid = true;
      } else {
        const regexp = /^\d+$/;
        valid = regexp.test(control.value);
      }
      return valid ? null : { numericOnlyOrAsterisk: true };
    }
  }

  static numericPortRange(control: AbstractControl) {
    if (control.value === '' || control.value === null) {
      return null;
    } else {
      let valid = true;
      if (Number(control.value) < 1 || Number(control.value) > 65535) {
        valid = false;
      }
      return valid ? null : { numericPortRange: true };
    }
  }

  static numericPortRangeIncludesZero(control: AbstractControl) {
    if (control.value === '' || control.value === null) {
      return null;
    } else {
      let valid = true;
      if (Number(control.value) < 0 || Number(control.value) > 65535) {
        valid = false;
      }
      return valid ? null : { numericPortRangeIncludesZero: true };
    }
  }

  static registryPortNumericOnly(control: AbstractControl) {
    if (control.value === null || control.value === undefined) {
      return null;
    }
    const regexp = /^\d+$/;
    const valid = regexp.test(control.value);
    return valid ? null : { registryPortNumericOnly: true };
  }

  static registryPortNumericPortRange(control: AbstractControl) {
    if (control.value === null || control.value === undefined) {
      return null;
    }
    let valid = true;
    if (Number(control.value) < 1 || Number(control.value) > 65535) {
      valid = false;
    }
    return valid ? null : { registryPortNumericPortRange: true };
  }

  static clusterIpAddressField(control: AbstractControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      const regexp = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|\bNone\b)$/;
      const valid = regexp.test(control.value);
      return valid ? null : { clusterIpAddressField: true };
    }
  }

  static ipDnsValidator(control: AbstractControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      const regexp = /^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])|(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9]))$/;
      const valid = regexp.test(control.value);
      return valid ? null : { ipDnsValidator: true };
    }
  }

  static dnsValidator(control: AbstractControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      const regexp = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
      const valid = regexp.test(control.value);
      return valid ? null : { dnsValidator: true };
    }
  }

  static externalPortOrAsterisk(control: AbstractControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      let valid = true;
      if (control.value === '*') {
        valid = true;
      } else {
        if (Number(control.value) < 1 || Number(control.value) > 65535) {
          valid = false;
        }
      }
      return valid ? null : { externalPortOrAsterisk: true };
    }
  }

  static maxLengthDNSLabel(control: AbstractControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      if (control.value.length > 63) {
        return { maxLengthDNSLabel: true };
      }
      return null;
    }
  }

  static maxLength64(control: AbstractControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      let valid = true;
      if (control.value.length > 64) {
        valid = false;
      }
      return valid ? null : { maxLength64: true };
    }
  }

  static maxLength128(control: AbstractControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      let valid = true;
      if (control.value.length > 128) {
        valid = false;
      }
      return valid ? null : { maxLength128: true };
    }
  }

  static maxLength253(control: AbstractControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      let valid = true;
      if (control.value.length > 253) {
        valid = false;
      }
      return valid ? null : { maxLength253: true };
    }
  }

  static maxLength4096(control: AbstractControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      let valid = true;
      if (control.value.length > 4096) {
        valid = false;
      }
      return valid ? null : { maxLength4096: true };
    }
  }

  static lowercaseAlphaNumericDashPeriodSlash(control: AbstractControl) {
    if (control.value === '' || control.value === null) {
      return null;
    }
    const regexp = /^[a-z\/\d\-.]+$/;
    const valid = regexp.test(control.value);
    return valid ? null : { lowercaseAlphaNumericDashPeriodSlash: true };
  }

  static lowercaseAlphaNumericDashPeriod(control: AbstractControl) {
    if (control.value === '' || control.value === null) {
      return null;
    }
    const regexp = /^[a-z\d\-.]+$/;
    const valid = regexp.test(control.value);
    return valid ? null : { lowercaseAlphaNumericDashPeriod: true };
  }

  static containsDoublePeriod(control: AbstractControl) {
    const regexp = /\.{2}/; // matches at least 2 period characters.
    const valid = regexp.test(control.value);
    return !valid ? null : { containsDoublePeriod: true };
  }

  static containsDoubleDash(control: AbstractControl) {
    const regexp = /\-{2}/; // matches at least 2 dash characters.
    const valid = regexp.test(control.value);
    return !valid ? null : { containsDoubleDash: true };
  }

  static containsDoubleUnderscore(control: AbstractControl) {
    const regexp = /\_{2}/; // matches at least 2 underscore characters.
    const valid = regexp.test(control.value);
    return !valid ? null : { containsDoubleUnderscore: true };
  }

  static containsSpace(control: AbstractControl) {
    const regexp = /\s/;
    const valid = regexp.test(control.value);
    return !valid ? null : { containsSpace: true };
  }

  static containsColon(control: AbstractControl) {
    const regexp = /\:/;
    const valid = regexp.test(control.value);
    return !valid ? null : { containsColon: true };
  }

  static containsMoneySymbol(control: AbstractControl) {
    const regexp = /\$/;
    const valid = regexp.test(control.value);
    return valid ? { containsMoneySymbol: true } : null;
  }

  static containsSelectAService(control: AbstractControl) {
    if (control.value === '-- Select a service --') {
      return { containsSelectAService: true };
    } else {
      return null;
    }
  }

  static containsSelectAPath(control: AbstractControl) {
    if (control.value === '-- Select a path --') {
      return { containsSelectAPath: true };
    } else {
      return null;
    }
  }

  static containsSelectAResource(control: AbstractControl) {
    if (control.value === '-- Select a resource --') {
      return { containsSelectAResource: true };
    } else {
      return null;
    }
  }

  static startsWithDash(control: AbstractControl) {
    if (control.value[0] === '-') {
      return { startsWithDash: true };
    } else {
      return null;
    }
  }

  static startsWithPeriod(control: AbstractControl) {
    if (control.value[0] === '.') {
      return { startsWithPeriod: true };
    } else {
      return null;
    }
  }

  static startsWithUnderscore(control: AbstractControl) {
    if (control.value[0] === '_') {
      return { startsWithUnderscore: true };
    } else {
      return null;
    }
  }

  static endsWithDash(control: AbstractControl) {
    const length = control.value.length;
    if (control.value[length - 1] === '-') {
      return { endsWithDash: true };
    } else {
      return null;
    }
  }

  static endsWithPeriod(control: AbstractControl) {
    const length = control.value.length;
    if (control.value[length - 1] === '.') {
      return { endsWithPeriod: true };
    } else {
      return null;
    }
  }

  static endsWithUnderscore(control: AbstractControl) {
    const length = control.value.length;
    if (control.value[length - 1] === '_') {
      return { endsWithUnderscore: true };
    } else {
      return null;
    }
  }

  static doesNotStartWithForwardSlash(control: AbstractControl) {
    if (control.value[0] !== '/') {
      return { doesNotStartWithForwardSlash: true };
    } else {
      return null;
    }
  }

  static doesNotStartWithForwardSlashOrDollar(control: AbstractControl) {
    if (control.value[0] === '/' || control.value[0] === '$') {
      return null;
    } else {
      return { doesNotStartWithForwardSlashOrDollar: true };
    }
  }

  static tlsHostsDnsValidator(control: AbstractControl) {
    let valid = true;
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    }
    const regexp = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
    let originalString: string;
    originalString = control.value;
    const subStrings = originalString.toString().split(',');
    subStrings.forEach((subString) => {
      if (!regexp.test(subString)) {
        valid = false;
      }
    });

    return valid ? null : { tlsHostsDnsValidator: true };
  }

  static volumeStorageValidator(control: AbstractControl) {
    const regexp = /^\d+([EPTGMK]|[EPTGMK][i])$/;
    const valid = regexp.test(control.value);
    return valid ? null : { volumeStorageValidator: true };
  }

  static fieldRefVersionValidator(control: AbstractControl) {
    const regexp = /^([v])\d+$/;
    const valid = regexp.test(control.value);
    return valid ? null : { fieldRefVersionValidator: true };
  }

  static hostHeaderExistsValidator(control: AbstractControl) {

    const hostHeader = control.value.httpHeaders.find(header => {
      return header.key === 'Host';
    });

    if (hostHeader === undefined) {
      if (control.value.host === undefined || control.value.host === '') {
        return { hostHeaderExistsValidator: true };
      }
    }

    return null;
  }

  static cronTimeValidator(control: AbstractControl) {
    const regexp = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;
    const valid = regexp.test(control.value);
    return valid ? null : { cronTimeValidator: true };
  }

  static duplicateK8sEnvVarNameValidator(container: Container, list: Array<string>): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let forbidden;
      list.forEach((name) => {
        if (container[name]) {
          for (const object of container[name]) {
            if ((object.key === control.value) && (control.dirty === true)) {
              forbidden = true;
            }
          }
        }
      });
      if (forbidden === true) {
        return { duplicateK8sEnvVarNameValidator: true };
      } else {
        return null;
      }
    };
  }

  static duplicateNameOfKindValidator(editorService: EditorService): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const k8sKind = control.value.kind;
      let forbidden = false;
      const map = {};
      map['Service'] = editorService.k8sFile.services;
      map['StatefulSet'] = editorService.k8sFile.containerGroups;
      map['Deployment'] = editorService.k8sFile.containerGroups;
      map['DaemonSet'] = editorService.k8sFile.containerGroups;
      map['CronJob'] = editorService.k8sFile.containerGroups;
      map['Ingress'] = editorService.k8sFile.ingress;
      map['PersistentVolumeClaim'] = editorService.k8sFile.volumes;
      map['UnknownKind'] = editorService.k8sFile.unknownKinds;

      // filter for unknown kinds taht qualify for comparison, ie have the same kind
      let compareGroup = map['UnknownKind'].filter((unknownKind) => {
        return control.value.kind === unknownKind.kind && control.value.id !== unknownKind.id;
      });

      // if the kind is of any known type other than unknown kind, add those kinds
      if (map[k8sKind] !== undefined) {
        compareGroup = compareGroup.concat(map[k8sKind]);
      }

      // iterate through all the object and validate the name doesnt match
      const isInvalid = compareGroup.find((sample) => {
        return sample.name === control.value.name;
      });

      if (isInvalid !== undefined) {
        forbidden = true;
      } else {
        forbidden = false;
      }

      return { duplicateNameOfKindValidator: forbidden };

    };
  }

  static duplicateK8sNameValidator(editorService: EditorService, name: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let forbidden;
      if (editorService.k8sFile[name]) {
        for (const object of editorService.k8sFile[name]) {
          if ((object.name === control.value) && (control.dirty === true)) {
            forbidden = true;
          }
        }
      }
      if (forbidden === true) {
        return { duplicateNameValidator: true };
      } else {
        return null;
      }
    };
  }

  static serviceTypePortMappingValidator(control) {
    if (control.value.service_port_mapping.length > 0) {
      return null;
    }

    if (control.value.service_type === 'ExternalName') {
      return null;
    }

    return { 'serviceTypePortMappingValidator': true };
  }

  // add more validators here...
}
