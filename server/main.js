import { Meteor } from "meteor/meteor";
import { Translations } from "../imports/api/TranslationsCollection";
import { i18n } from "meteor/universe:i18n";
import { isEqual } from "lodash-es";
import "../imports/locales/en.i18n.yml";
import "../imports/locales/es.i18n.yml";

function refresh(locale, { translations = {}, updatedAt = new Date() }) {
  locale = i18n.normalize(locale);
  i18n._translations[locale] = translations;

  const cache = i18n.getCache(locale);
  cache.updatedAt = updatedAt.toUTCString();
  delete cache._json;
  delete cache._yml;
  i18n._emitChange(locale);
}

const mergeTranslations = (baseTranslations, translation) => {
  return Object.assign({}, translation, baseTranslations);
};

Meteor.startup(() => {
  const updatedAt = new Date();

  for (const [_id, translations] of Object.entries(i18n._translations)) {
    const inDB = Translations.findOne({ _id: _id });
    const merged = mergeTranslations(inDB?.translations, translations);

    if (!isEqual(merged, inDB)) {
      Translations.upsert(_id, {
        $set: {
          translations: merged,
          updatedAt,
        },
      });
    }
  }
  Translations.find().observeChanges({ added: refresh, changed: refresh });
});

// This is just an example, this method should check user's permissions.
Meteor.methods({
  "translations.updateTranslation"({ translationId, newTranslation }) {
    const inDB = Translations.findOne({ _id: translationId });

    if (!inDB) {
      throw new Meteor.Error("This locale doesn't exist");
    }

    const merged = mergeTranslations(newTranslation, inDB.translations);

    Translations.update(translationId, {
      $set: { translations: merged, updatedAt: new Date() },
    });
  },
});
