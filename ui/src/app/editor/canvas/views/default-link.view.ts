import * as joint from 'jointjs';

export class DefaultLinkView extends joint.dia.LinkView {
  can(feature: string): boolean {
    // don't allow them to add a vertex for now
    if (feature === 'vertexAdd') {
      return false;
    }
    return super.can(feature);
  }
}
