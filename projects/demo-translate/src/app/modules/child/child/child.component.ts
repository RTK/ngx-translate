import {Component} from '@angular/core';

import {TranslationSetFactory, TranslationSetToken} from '@rtk/ngx-translate';

import {Language} from '../../../enums/language.enum';

@Component({
    selector: 'app-child',
    templateUrl: './child.component.html',
    styleUrls: ['./child.component.css'],
    providers: [
        {
            provide: TranslationSetToken,
            useValue: (language: Language): TranslationSetFactory => {
                switch (language) {
                    case Language.Spanish:
                        return {
                            count: 'Tengo %d amigos'
                        };

                    case Language.German:
                        return {
                            count: 'Ich habe %d Freunde'
                        };
                }

                return {
                    count: 'I have %d friends'
                };
            }
        }
    ]
})
export class ChildComponent {
    public get counter(): number {
        return this.counterA;
    }

    private counterA = 0;

    public onIncrease(): void {
        this.counterA++;
    }
}
