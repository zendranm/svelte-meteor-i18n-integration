import { Meteor } from "meteor/meteor";
import App from "../imports/ui/App.svelte";
import { Tracker } from "meteor/tracker";
import { Timestamp } from "../imports/api/TimestampCollection";
import { i18n } from "meteor/universe:i18n";
import { reactiveLocale, locale as storeLocale } from "../imports/utils/i18n";

Meteor.startup(() => {
  new App({
    target: document.getElementById("app"),
  });
});

let timestamp;
Tracker.autorun(async () => {
  Meteor.subscribe("timestamp");
  let locale = reactiveLocale.get();

  const newTimestamp = Timestamp.find({}).fetch()[0]?.updatedAt;

  if (timestamp !== undefined && timestamp !== newTimestamp) {
    if (locale) {
      await i18n.loadLocale(locale, { fresh: true });
      storeLocale.set(locale);
    }
  }
  timestamp = newTimestamp;
});
