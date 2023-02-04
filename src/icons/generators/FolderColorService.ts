import { validateHEXColorCode } from 'src/icons/generator';

class FolderColorService {
  /**
   * Apply the given opacity to the passed svg string
   * @param {string} svg
   * @param {string} folderColor
   * @returns {string}
   */
  public applyFolderColor(svg: string, folderColor: string): string {
    let updatedRootElement: string = svg;

    if (folderColor !== undefined && validateHEXColorCode(folderColor)) {
      updatedRootElement = this.replaceFill(updatedRootElement, folderColor);
    }

    return updatedRootElement;
  }

  private replaceFill(svg: string, folderColor: string): string {
    const pattern = new RegExp(/fill="#[a-fA-F0-9]{6}"/g);
    const themedPattern = new RegExp(/themed="true"/g);

    if (pattern.test(svg) && themedPattern.test(svg)) {
      return svg.replace(pattern, ` fill="${folderColor}"`);
    }
    return svg;
  }
}

export const folderColorService = new FolderColorService();
