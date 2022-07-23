import { Meteor } from "meteor/meteor";
import { Translations } from "../imports/api/TranslationsCollection";
import { i18n } from "meteor/universe:i18n";
import "../imports/locales/en.i18n.yml";
import "../imports/locales/es.i18n.yml";

const en = {
  en: {
    apple: "apple",
    dog: "dog",
  },
};

const es = {
  es: {
    apple: "manzana",
    dog: "perro",
  },
};

const insertTranslation = (translations) => {
  Translations.insert({
    _id: Object.keys(translations)[0],
    translations: Object.values(translations)[0],
    updatedAt: new Date(),
  });
};

Meteor.startup(() => {
  // code to run on server at startup
  if (Translations.find().count() === 0) {
    [en, es].forEach(insertTranslation);
  }
});
