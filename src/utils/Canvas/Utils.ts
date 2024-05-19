import { Canvas, SKRSContext2D } from '@napi-rs/canvas';

const FONT_FAMILY = 'Segoe UI';

export class CanvasUtils {
  public static clipCircle(context: SKRSContext2D, x: number, y: number, radius: number, reverse?: boolean) {
    context.beginPath();

    if (reverse) {
      context.rect(0, 0, context.canvas.width, context.canvas.height);
    }

    context.arc(x, y, radius, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();
  }

  public static drawCircle(
    context: SKRSContext2D,
    x: number,
    y: number,
    radius: number,
    color: string,
    type: 'fill' | 'stroke' = 'fill',
    stokeWidth: number = 1,
  ) {
    if (type === 'stroke' && stokeWidth > 1) {
      context.lineWidth = stokeWidth;
    }
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, true);
    if (type === 'fill') {
      context.fillStyle = color;
      context.fill();
    } else if (type === 'stroke') {
      context.strokeStyle = color;
      context.stroke();
    }
    context.closePath();
  }

  public static drawLine({
    context,
    width,
    height,
    x,
    y,
    color,
    style,
  }: {
    context: SKRSContext2D;
    width: number;
    height: number;
    x: number;
    y: number;
    color: string;
    style?: CanvasLineCap;
  }) {
    context.beginPath();
    context.lineWidth = height;
    context.strokeStyle = color;
    context.moveTo(x, y);
    context.lineTo(x + width, y);

    if (style) {
      context.lineCap = style;
    }

    context.stroke();
  }

  public static adjustFont(canvas: Canvas, text: string, fontWeight = 300, defaultFontSize = 35, maxWidth = 400) {
    const context = canvas.getContext('2d');
    let fontSize = defaultFontSize;

    do {
      context.font = `${fontWeight} ${fontSize--}px ${FONT_FAMILY}`;
    } while (context.measureText(text).width > maxWidth);

    return context.font;
  }

  public static drawText({
    context,
    text,
    x,
    y,
    fontSize,
    color,
    align,
    fontWeight = 400,
    adjust,
    adjustMaxWidth,
  }: {
    context: SKRSContext2D;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontWeight?: number;
    letterSpacing?: number;
    color: string;
    align?: CanvasTextAlign;
    adjust?: boolean;
    adjustMaxWidth?: number;
  }) {
    context.font = adjust
      ? CanvasUtils.adjustFont(context.canvas, text, fontWeight, fontSize, adjustMaxWidth)
      : `${fontWeight} ${fontSize} ${FONT_FAMILY}`;
    context.fillStyle = color;
    context.textAlign = align || 'start';
    context.letterSpacing = '2px';
    context.fillText(text, x, y);
    context.letterSpacing = '0px';
  }
}
