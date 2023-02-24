import { getSVGRootElement } from 'src/helpers/utils';

class SaturationService {
  /**
   * Apply the given opacity to the passed svg string
   * @param {string} svg
   * @param {number} saturation
   * @returns {string}
   */
  public applySaturation(svg: string, saturation: number): string {
    const svgRootElement = getSVGRootElement(svg);
    if (!svgRootElement) return svg;

    let updatedRootElement: string;

    // Add filter attribute
    if (saturation !== undefined && saturation < 1) {
      updatedRootElement = this.addFilterAttribute(svgRootElement);
    }
    else {
      updatedRootElement = this.removeFilterAttribute(svgRootElement);
    }

    // Add filter element
    let updatedSVG = svg.replace(/<svg[^>]*>/, updatedRootElement);
    if (saturation !== undefined && saturation < 1) {
      updatedSVG = this.addFilterElement(updatedSVG, saturation);
    }
    else {
      updatedSVG = this.removeFilterElement(updatedSVG);
    }

    return updatedSVG;
  }

  private addFilterAttribute(svgRoot: string): string {
    const pattern = new RegExp(/\sfilter="[^"]+?"/);
    // if the filter attribute already exists
    if (pattern.test(svgRoot)) {
      return svgRoot.replace(pattern, ' filter="url(#saturation)"');
    }
    else {
      return svgRoot.replace(/^<svg/, '<svg filter="url(#saturation)"');
    }
  }

  private removeFilterAttribute(svgRoot: string): string {
    const pattern = new RegExp(/\sfilter="[^"]+?"/);
    return svgRoot.replace(pattern, '');
  }

  private addFilterElement(svg: string, value: number) {
    const pattern = new RegExp(/<filter id="saturation".+<\/filter>(.*<\/svg>)/);
    const filterElement = `<filter id='saturation'><feColorMatrix type='saturate' values='${value}'/></filter>`;
    if (pattern.test(svg)) {
      return svg.replace(pattern, `${filterElement}$1`);
    }
    else {
      return svg.replace(/<\/svg>/, `${filterElement}</svg>`);
    }
  }

  private removeFilterElement(svg: string) {
    const pattern = new RegExp(/<filter id="saturation".+<\/filter>(.*<\/svg>)/);
    return svg.replace(pattern, '$1');
  }
}

export const saturationService = new SaturationService();
