import { Meteor } from "meteor/meteor";
import { Promise as MeteorPromise } from "meteor/promise";
import { Translations } from "../imports/api/TranslationsCollection";
import { Timestamp } from "../imports/api/TimestampCollection";
import { i18n } from "meteor/universe:i18n";
import { isEqual } from "lodash-es";
import "../imports/locales/en.i18n.yml";
import "../imports/locales/es.i18n.yml";

const en = {
  en: {
    apple: "Apple",
    dog: "Dog",
  },
};

const es = {
  es: {
    apple: "Manzana",
    dog: "Perro",
  },
};

const insertTranslation = (translations) => {
  Translations.insert({
    _id: Object.keys(translations)[0],
    translations: Object.values(translations)[0],
    updatedAt: new Date(),
  });
};

const insertTimestamp = (translations) => {
  Timestamp.insert({
    _id: Object.keys(translations)[0],
    updatedAt: new Date(),
  });
};

Meteor.startup(() => {
  // code to run on server at startup
  if (Translations.find().count() === 0) {
    [en, es].forEach(insertTranslation);
  }

  if (Timestamp.find().count() === 0) {
    [en, es].forEach(insertTimestamp);
  }
});

function syncify(fn) {
  return function syncified() {
    const result = fn();
    if (result) {
      MeteorPromise.await(result);
    }
  };
}

function onStartupAsync(fn) {
  Meteor.startup(() => {
    Meteor.defer(syncify(fn));
  });
}

function refresh(locale, { translations = {}, updatedAt = new Date() }) {
  locale = i18n.normalize(locale);
  if (Object.keys(translations).length === 0) return;
  i18n._translations[locale] = translations;

  const cache = i18n.getCache(locale);
  cache.updatedAt = updatedAt.toUTCString();
  delete cache._json;
  delete cache._yml;
  i18n._emitChange(locale);
  Translations.update({ _id: locale }, { $set: { updatedAt: updatedAt } });
}

const mergeTranslations = (baseTranslations, translation) => {
  return Object.assign(translation, baseTranslations);
};

onStartupAsync(() => {
  const updatedAt = new Date();

  for (const [_id, translations] of Object.entries(i18n._translations)) {
    const inDB = Translations.findOne({ _id: _id });
    const merged = mergeTranslations(inDB.translations, translations);

    if (!isEqual(merged, inDB)) {
      Translations.update(inDB._id, {
        $set: {
          translations: merged,
          updatedAt,
        },
      });
    }
  }
  Translations.find().observeChanges({ added: refresh, changed: refresh });
});
