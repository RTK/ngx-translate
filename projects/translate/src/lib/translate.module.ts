import {NgModule} from '@angular/core';

import {TranslateDirective} from './directives/translate/translate.directive';
import {TranslatePipe} from './pipes/translate/translate.pipe';

/**
 * Translation module exporting the directive and pipe.
 */
@NgModule({
    declarations: [TranslateDirective, TranslatePipe],
    exports: [TranslateDirective, TranslatePipe]
})
export class TranslateModule {}
