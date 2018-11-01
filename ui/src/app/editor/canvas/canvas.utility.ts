import * as joint from 'jointjs';

export class CanvasUtility {

  public static fontFamily = 'Metropolis,Avenir Next,Helvetica Neue,Arial,sans-serif';

  public static getWidthOfText(text: string, fontSize: string, fontFamily: string, fontWeight: string): number {
    const span = $('<span></span>');
    span.css({
      'font-family': fontFamily,
      'font-size': fontSize,
      'font-weight': fontWeight
    }).text(text);
    $('body').append(span);
    const w = span.width();
    span.remove();
    return w;
  }

  public static getStringForSize(text: string, desiredSize: number, fontSize: string, fontFamily: string, fontWeight: string): string {
    const curSize = CanvasUtility.getWidthOfText(text, fontSize, fontFamily, fontWeight);
    if (curSize > desiredSize) {
      const curText = text.substring(0, text.length - 5) + '...';
      return CanvasUtility.getStringForSize(curText, desiredSize, fontSize, fontFamily, fontWeight);
    }
    return text;
  }

}
