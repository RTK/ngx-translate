import {InjectionToken} from '@angular/core';

import {TranslationSetFactory} from '../types/translation-set-factory.type';

/**
 * TranslationSet injection token.
 *
 * One instance must be provided in an application for this module to work.
 *
 * @example
 *
 * providers: [{
 *     provide: TranslationSetToken,
 *     useValue: {
 *         string: 'value'
 *     }
 * }]
 */
export const TranslationSetToken: InjectionToken<TranslationSetFactory> = new InjectionToken(
    'Translation set to be used for translations'
);
