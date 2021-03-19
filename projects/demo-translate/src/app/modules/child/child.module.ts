import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {
    TranslateModule,
} from '@rtk/ngx-translate';

import {ChildComponent} from './child/child.component';

@NgModule({
    imports: [CommonModule, TranslateModule],
    declarations: [ChildComponent],
    exports: [ChildComponent]
})
export class ChildModule {}
