import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {TranslateModule, TranslationSetFactory, TranslationSetToken} from '@rtk/ngx-translate';

import { AppComponent } from './app.component';

import { TestComponent } from './components/test/test.component';
import {ChildModule} from './modules/child/child.module';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
      ChildModule,
    TranslateModule
  ],
  providers: [{
    provide: TranslationSetToken,
    useValue: {
        title: 'Hello',
        sub: {
            title: 'World'
        }
    } as TranslationSetFactory
}],
  bootstrap: [AppComponent]
})
export class AppModule { }
