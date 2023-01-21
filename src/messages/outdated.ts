import { env, Uri, window } from 'vscode';
import { translate } from '../i18n';

/** Show message that the editor version is outdated. */
export const showOutdatedMessage = () => {
  window
    .showWarningMessage(
      translate('outdatedVersion'),
      translate('updateVSCode'),
      translate('howToActivate')
    )
    .then(handleActivateActions);
};

/** Handle the actions from the outdatedMessage command message */
const handleActivateActions = (value: string | undefined) => {
  switch (value) {
    case translate('howToActivate'):
      env.openExternal(
        Uri.parse(
          'https://code.visualstudio.com/blogs/2016/09/08/icon-themes#_file-icon-themes'
        )
      );
      break;

    case translate('updateVSCode'):
      open('https://code.visualstudio.com/download');
      break;

    default:
      break;
  }
};
