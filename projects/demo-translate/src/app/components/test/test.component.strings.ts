import {TranslationSetFactory} from '@rtk/ngx-translate';
import {Language} from '../../enums/language.enum';

export default {
    [Language.English]: {
        title: 'Hello',
        sub: {
            title: 'World'
        }
    },
    [Language.German]: {
        title: 'Hallo',
        sub: {
            title: 'Welt'
        }
    },
    [Language.Spanish]: {
        title: 'Hola',
        sub: {
            title: 'Mundo'
        }
    }
} as Record<Language, TranslationSetFactory>;
