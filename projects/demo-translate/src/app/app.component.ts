import { Component } from '@angular/core';

import {TranslateService} from '@rtk/ngx-translate';

import {Language} from './enums/language.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    public constructor(translateService: TranslateService) {
        translateService.setLanguage(Language.Spanish);
    }
}
