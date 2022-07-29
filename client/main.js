import { Meteor } from "meteor/meteor";
import App from "../imports/ui/App.svelte";
import { Tracker } from "meteor/tracker";
import { Timestamp } from "../imports/api/TimestampCollection";
import { Translations } from "../imports/api/TranslationsCollection";
import { i18n } from "meteor/universe:i18n";
import { reactiveLocale, locale as storeLocale } from "../imports/utils/i18n";

Meteor.startup(() => {
  new App({
    target: document.getElementById("app"),
  });
});

let wasLocaleLoaded = [];
Tracker.autorun(async () => {
  Meteor.subscribe("timestamp");
  let locale = reactiveLocale.get();

  const cacheTimestamp = Timestamp.find({ _id: locale }).fetch()[0]?.updatedAt;
  const translationTimestamp = Translations.find({ _id: locale }).fetch()[0]
    ?.updatedAt;

  if (
    translationTimestamp !== undefined &&
    cacheTimestamp !== undefined &&
    translationTimestamp.toJSON() !== cacheTimestamp.toJSON()
  ) {
    if (locale) {
      await i18n.loadLocale(locale, { fresh: true });
      Timestamp.update(
        { _id: locale },
        { $set: { updatedAt: translationTimestamp } }
      );
    }
  }
  if (!wasLocaleLoaded.includes(locale)) {
    await i18n.loadLocale(locale, { fresh: true });
    wasLocaleLoaded.push(locale);
  }
  storeLocale.set(locale);
});
