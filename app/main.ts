import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {AppModule} from "./app.module";
import {enableProdMode} from '@angular/core';

const platform = platformBrowserDynamic();

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

platform.bootstrapModule(AppModule);
