// modules
export {TranslateModule} from './lib/translate.module';

// directives
export {TranslateDirective} from './lib/directives/translate/translate.directive';

// injection tokens
export {TranslationSetToken} from './lib/injection-tokens/translation-set.token';

// pipes
export {TranslatePipe} from './lib/pipes/translate/translate.pipe';

// services
export {TranslateService} from './lib/services/translate/translate.service';

// types
export {
    TranslationSet,
    TranslationSetItem
} from './lib/types/translation-set.type';
export {TranslationSetFactory} from './lib/types/translation-set-factory.type';
