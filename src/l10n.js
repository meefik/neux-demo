import { createL10n } from 'neux';
import en from './locales/en.json';
import ru from './locales/ru.json';

export default createL10n({
  locales: { en, ru },
  lang: navigator.language,
  fallback: 'en'
});
