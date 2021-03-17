import {Observable} from 'rxjs';

import {TranslationSet} from './translation-set.type';

/**
 * A translation set factory is either a translation set or creates a translation set by using the app language.
 */
export type TranslationSetFactory<T = any> =
    | ((
          language: T
      ) =>
          | TranslationSet
          | Promise<TranslationSet>
          | Observable<TranslationSet>)
    | Observable<TranslationSet>
    | Promise<TranslationSet>
    | TranslationSet;
