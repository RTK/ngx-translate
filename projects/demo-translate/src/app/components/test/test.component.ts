import { Component } from '@angular/core';

import {TranslateService, TranslationSetFactory, TranslationSetToken} from '@rtk/ngx-translate';

import {Language} from '../../enums/language.enum';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
    viewProviders: [{
      provide: TranslationSetToken,
        useValue: async (language: Language): Promise<TranslationSetFactory> => {
            const strings: Record<Language, TranslationSetFactory> = (await import('./test.component.strings')).default;

            return strings[language];
        }
    }]
})
export class TestComponent{

  public constructor(private readonly translateService: TranslateService) { }


  public onChangeLang(lang: 'de' | 'en' | 'es'): void {
      this.translateService.setLanguage(lang);
  }
}
