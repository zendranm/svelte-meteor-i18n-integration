import { i18n } from "meteor/universe:i18n";
import "../locales/en.i18n.yml";
import "../locales/es.i18n.yml";
import { derived, writable } from "svelte/store";

function createLocale() {
  const { subscribe, set } = writable(i18n.getLocale());
  return {
    subscribe,
    set: (lng) => {
      i18n.setLocale(lng);
      return set(lng);
    },
  };
}
export const locale = createLocale();

const getTranslation = (key, ...args) => i18n.getTranslation(key, ...args);
export const t = derived(locale, ($locale) => (args) => getTranslation(args));
