<script>
  import { t, locale } from "../utils/i18n";
  import { i18n } from "meteor/universe:i18n";

  const setLanguage = (language) => {
    locale.set(language);
  };
</script>

<div class="container">
  <h1>Welcome to Meteor!</h1>
  <button on:click={() => setLanguage("en-US")}>EN</button>
  <button on:click={() => setLanguage("es-ES")}>ESP</button>
  <button
    on:click={() => {
      i18n.loadLocale("es", { fresh: true });
      console.log(i18n._translations);
    }}>Get Locale</button
  >

  <div>
    Locale: {$locale}
    <br />
    hi: {$t("hi")}
    <br />
    ok: {$t("ok")}
    <br />
    apple: {$t("apple")}
  </div>
  <br />
</div>
