// ==UserScript==
// @name BC Notify Plus
// @namespace https://www.bondageprojects.com/
// @version 1.0
// @description Improved BC notification.
// @author Saki Saotome
// @include /^https:\/\/(www\.)?bondage(?:projects\.elementfx|-europe)\.com\/R\d+\/(BondageClub|\d+)(\/)?(((index|\d+)\.html)?)?$/
// @icon  https://dynilath.gitlab.io/SaotomeToyStore/favicon.ico
// @homepage https://dynilath.gitlab.io/SaotomeToyStore/PluginDocuments/NotifyPlus/
// @grant none
// @run-at document-end
// ==/UserScript==

(function () {
    "use strict";
    if (typeof BCMoanerReloaded_Loaded === "undefined") {
        const script = document.createElement("script");
        script.src = `https://dynilath.gitlab.io/SaotomeToyStoreVendor/NotifyPlus/main.js?v=${Date.now()}`;
        document.head.appendChild(script);
    }
})();