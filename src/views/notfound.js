import l10n from '../l10n';

export default function () {
  return {
    textContent: () => l10n.t('notfound.message')
  };
}
