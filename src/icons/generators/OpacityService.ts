import { getSVGRootElement } from 'src/helpers/utils';

class OpacityService {
  /**
   * Apply the given opacity to the passed svg string
   * @param {string} svg
   * @param {number} opacity
   * @returns {string}
   */
  public applyOpacity(svg: string, opacity: number): string {
    const svgRootElement = getSVGRootElement(svg);
    if (!svgRootElement) return svg;

    let updatedRootElement: string;

    if (opacity !== undefined && opacity < 1) {
      updatedRootElement = this.addOpacityAttribute(svgRootElement, opacity);
    } else {
      updatedRootElement = this.removeOpacityAttribute(svgRootElement);
    }

    return svg.replace(/<svg[^>]*>/, updatedRootElement);
  }

  private addOpacityAttribute(svgRoot: string, opacity: number): string {
    const pattern = new RegExp(/\sopacity="[\d.]+"/);
    // if the opacity attribute already exists
    if (pattern.test(svgRoot)) {
      return svgRoot.replace(pattern, ` opacity="${opacity}"`);
    } else {
      return svgRoot.replace(/^<svg/, `<svg opacity="${opacity}"`);
    }
  }

  private removeOpacityAttribute(svgRoot: string): string {
    const pattern = new RegExp(/\sopacity="[\d.]+"/);
    return svgRoot.replace(pattern, '');
  }
}

export const opacityService = new OpacityService();
