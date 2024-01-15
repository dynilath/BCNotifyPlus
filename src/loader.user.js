// ==UserScript==
// @name BC Notify Plus
// @namespace https://www.bondageprojects.com/
// @version 1.0
// @description Improved BC notification.
// @author Saki Saotome
// @match bondageprojects.elementfx.com/*
// @match www.bondageprojects.elementfx.com/*
// @match bondage-europe.com/*
// @match www.bondage-europe.com/*
// @icon  https://dynilath.gitlab.io/SaotomeToyStore/favicon.ico
// @grant none
// @run-at document-end
// ==/UserScript==

(function () {
    "use strict";
    const src = `https://dynilath.gitlab.io/SaotomeToyStoreVendor/NotifyPlus/main.js?v=${Date.now()}`;
    const loadScript = (url, okay, failed) => fetch(url).then(r => {if(r.ok) return r.text();
        else throw new Error("Failed to load script")} ).then(okay).catch(() => { setTimeout(() => {failed(url, okay, failed)}, 5000); });
    loadScript(src, text => {if (typeof BCNotifyPlus_Loaded === "undefined") eval(text);}, loadScript);
})();
