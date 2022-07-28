import { Meteor } from "meteor/meteor";
import App from "../imports/ui/App.svelte";
import { Tracker } from "meteor/tracker";
import { Timestamp } from "../imports/api/TimestampCollection";
import { i18n } from "meteor/universe:i18n";

Meteor.startup(() => {
  new App({
    target: document.getElementById("app"),
  });
});

let timestamp;
Tracker.autorun(() => {
  Meteor.subscribe("timestamp");
  const newTimestamp = Timestamp.find({}).fetch()[0]?.updatedAt;

  if (timestamp !== undefined && timestamp !== newTimestamp) {
    let locale = i18n.getLocale();

    if (locale) {
      i18n.loadLocale(locale, { fresh: true });
    }
  }
  timestamp = newTimestamp;
});
