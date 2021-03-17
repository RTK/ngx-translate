import {ChangeDetectorRef, Inject, Optional, Pipe} from '@angular/core';
import type {OnDestroy, PipeTransform} from '@angular/core';

import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {TranslationSetToken} from '../../injection-tokens/translation-set.token';
import {TranslateService} from '../../services/translate/translate.service';
import {TranslationSetFactory} from '../../types/translation-set-factory.type';

/**
 * Translation pipe to be used in template parts of applications.
 *
 * Is marked as impure since its return value will be retrieved dynamically.
 */
@Pipe({
    name: 'rweAppFactoryTranslate',
    pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
    private changeSubscription: Subscription | null = null;

    private inputArguments: readonly unknown[] = [];

    private inputKey: string | string[] | null = null;

    /**
     * The Lifecycle subject is used internally for subscriptions to end when the pipe is terminated.
     */
    private readonly lifecycleSubject$: Subject<void> = new Subject();

    private translationValue: string | null = null;

    /**
     * Pipe constructor.
     *
     * Throws an error when no translation set could be retrieved.
     */
    public constructor(
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly translateService: TranslateService,
        @Inject(TranslationSetToken)
        @Optional()
        private readonly translationSet: TranslationSetFactory
    ) {
        if (!translationSet) {
            throw new Error(
                `Could not localize translation set. Provide one via 'TranslationSetToken'.`
            );
        }

        this.translateService.languageChange$
            .pipe(takeUntil(this.lifecycleSubject$))
            .subscribe({
                next: (): void => {
                    this.refresh();
                }
            });
    }

    /**
     * Will be called when the pipe is terminated.
     *
     * Nexts and completes the lifecycle subject.
     */
    public ngOnDestroy(): void {
        this.lifecycleSubject$.next();
        this.lifecycleSubject$.complete();
    }

    /**
     * Transform method of translation pipe.
     *
     * Retrieves the translation for provided key and returns its value.
     */
    public transform(
        key: string | string[],
        ...args: readonly unknown[]
    ): string | null {
        if (
            key !== this.inputKey ||
            this.compareArgs(args, this.inputArguments)
        ) {
            this.inputKey = key;
            this.inputArguments = args;

            this.refresh();
        }

        return this.translationValue;
    }

    private compareArgs(
        args: readonly unknown[],
        oldArgs: readonly unknown[]
    ): boolean {
        if (args.length !== this.inputArguments.length) {
            return true;
        }

        for (let index = 0; index < args.length; index++) {
            if (args[index] !== oldArgs[index]) {
                return true;
            }
        }

        return false;
    }

    private refresh(): void {
        if (this.changeSubscription !== null) {
            this.changeSubscription.unsubscribe();
            this.changeSubscription = null;
        }

        if (this.translationSet && this.inputKey) {
            this.changeSubscription = this.translateService
                .getTranslation(
                    this.translationSet,
                    this.inputKey,
                    this.inputArguments
                )
                .pipe(takeUntil(this.lifecycleSubject$))
                .subscribe({
                    next: (translation: string): void => {
                        this.translationValue = translation;

                        this.changeDetectorRef.markForCheck();
                    }
                });
        }
    }
}
