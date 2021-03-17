import {
    Directive,
    ElementRef,
    Inject,
    Input,
    Optional,
    Self
} from '@angular/core';
import type {OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {TranslationSetToken} from '../../injection-tokens/translation-set.token';
import {TranslateService} from '../../services/translate/translate.service';
import {TranslationSetFactory} from '../../types/translation-set-factory.type';

/**
 * Translation directive for in-template usage of translations.
 *
 * Can be created either as attribute or as selector.
 *
 * Takes property key as required input. Can be input either as string (in dot notation) or as string array.
 * Optionally takes property arguments input for formatting.
 *
 * @example
 *   <div rtk-translate key="test"></div>
 *   <rtk-translate key="test"></div>
 */
@Directive({
    selector: 'rtk-translate, [rtkTranslate]'
})
export class TranslateDirective implements OnInit, OnChanges, OnDestroy {
    /**
     * Arguments for formatting the extracted string.
     */
    @Input()
    public arguments: unknown | unknown[] | null = null;

    /**
     * The key of the string to be extracted from current translation set.
     */
    @Input()
    public key: string | string[] | null = null;

    /**
     * The licecycle subject will be nexted and completed when the component is destroyed. Used internally to end
     * subscriptions.
     */
    private readonly lifecycleSubject$: Subject<void> = new Subject();

    /**
     * Creates an component instance.
     *
     * Throws an error when the translation set could not be found.
     */
    public constructor(
        @Self() private readonly elementRef: ElementRef,
        private readonly translationService: TranslateService,
        @Inject(TranslationSetToken)
        @Optional()
        private readonly translationSet: TranslationSetFactory
    ) {
        if (!translationSet) {
            throw new Error(
                `Could not localize translation set. Provide one via 'TranslationSetToken'!`
            );
        }
    }

    /**
     * Listens for language changes and triggers the new insertion of the string.
     */
    public ngOnInit(): void {
        this.translationService.languageChange$
            .pipe(takeUntil(this.lifecycleSubject$))
            .subscribe({
                next: (): void => {
                    this.insertTranslation();
                }
            });
    }

    /**
     * Triggers a new string insertion.
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.insertTranslation();
    }

    /**
     * Nexts and completes the lifecycle subject for internal subscriptions to terminate.
     */
    public ngOnDestroy(): void {
        this.lifecycleSubject$.next();
        this.lifecycleSubject$.complete();
    }

    /**
     * Retrieves the translation for input key and inserts it into the host element.
     */
    private insertTranslation(): void {
        if (this.key) {
            this.translationService
                .getTranslation(this.translationSet, this.key, this.arguments)
                .subscribe((translation: string): void => {
                    this.elementRef.nativeElement.innerHTML = translation;
                });
        }
    }
}
