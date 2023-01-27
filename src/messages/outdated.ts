import { env, Uri, window } from 'vscode';
import i18next from 'i18next';

/** Show message that the editor version is outdated. */
export const showOutdatedMessage = () => {
  window
    .showWarningMessage(
      i18next.t('outdatedVersion'),
      i18next.t('updateVSCode'),
      i18next.t('howToActivate'),
    )
    .then(handleActivateActions);
};

/** Handle the actions from the outdatedMessage command message */
const handleActivateActions = (value: string | undefined) => {
  switch (value) {
    case i18next.t('howToActivate'):
      env.openExternal(
        Uri.parse(
          'https://code.visualstudio.com/blogs/2016/09/08/icon-themes#_file-icon-themes',
        ),
      );
      break;

    case i18next.t('updateVSCode'):
      open('https://code.visualstudio.com/download');
      break;

    default:
      break;
  }
};
