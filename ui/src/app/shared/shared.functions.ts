import { EditorService } from '../editor/editor.service';
import { Router } from '@angular/router';

export function getOnClose (es: EditorService, route: Router, hc: any) {return (forceClose?: boolean) => {
    if (forceClose || (es.dirty === false)) {
      es.dirty = false;
      route.navigate(['/'], {});
    } else {
      hc['showWarningModal'] = true;
    }
  }; }
