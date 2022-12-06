
export interface MapsIconI
{
  anchor?: any;
  /**
   * The origin of the label relative to the top-left corner of the icon
   * image, if a label is supplied by the marker. By default, the origin is
   * located in the center point of the image.
   */
  labelOrigin?: any;
  /**
   * The position of the image within a sprite, if any. By default, the origin
   * is located at the top left corner of the image <code>(0, 0)</code>.
   */
  origin?: any;
  /**
   * The size of the entire image after scaling, if any. Use this property to
   * stretch/shrink an image or a sprite.
   */
  scaledSize?: any;
  /**
   * The display size of the sprite or image. When using sprites, you must
   * specify the sprite size. If the size is not provided, it will be set when
   * the image loads.
   */
  size?: any;
  /**
   * The URL of the image or sprite sheet.
   */
  url: string;

  type: 'default' | 'selected' | 'selected-confirm';
}
