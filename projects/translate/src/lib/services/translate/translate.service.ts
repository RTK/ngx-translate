import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable, of} from 'rxjs';
import {filter, map, switchMap, take} from 'rxjs/operators';

import * as sprintfJs from 'sprintf-js';

import type {TranslationSetFactory} from '../../types/translation-set-factory.type';
import type {
    TranslationSet,
    TranslationSetItem
} from '../../types/translation-set.type';

const initialSymbol: symbol = Symbol('initial');

/**
 * The translate service is the central service of this module.
 *
 * The service provides the selected application language, provides a method to change it.
 * Furthermore, translations from translation sets can be resolved by this service.
 */
@Injectable({
    providedIn: 'platform'
})
export class TranslateService {
    /**
     * Returns an observable from the current language behavior subject.
     */
    public languageChange$: Observable<unknown>;

    /**
     * Currently selected language for the application. Initially provides an initial symbol as value.
     */
    private readonly currentLanguage$: BehaviorSubject<
        unknown | symbol
    > = new BehaviorSubject<unknown | symbol>(initialSymbol);

    public constructor() {
        this.languageChange$ = this.currentLanguage$.pipe(
            filter<unknown>((language: unknown | symbol): boolean => {
                return language !== initialSymbol;
            })
        );
    }

    /**
     * Returns the translation for provided translation set and provided key.
     *
     * Normalizes the provided key as it supports the dot notation (key.subkey.test...).
     *
     * As long as the current language is not set, no value will be provided. The rx-stream will be halted. When a language is provided
     * the translation set will be resolved.
     *
     * The translation set is a factory, it can either be a static value or a factory function returning a translation set as value,
     * as promise or as observable.
     *
     * Then the translation will be resolved via key from the translation set. Ifat one point the translation set does not contain
     * provided sub-key an error is thrown.
     *
     * Finally, if no error occurred, the extracted string will be formatted via sprintf with provided args as formatting options.
     */
    public getTranslation(
        translationSetFactory: TranslationSetFactory,
        key: string | string[],
        ...args: unknown[]
    ): Observable<string> {
        return this.currentLanguage$.pipe(
            filter<unknown>((language: unknown | symbol): boolean => {
                return language !== initialSymbol;
            }),
            take<unknown>(1),
            this.extractTranslationSet(translationSetFactory),
            this.extractTranslationString(key, args)
        );
    }

    /**
     * Sets the application language.
     */
    public setLanguage(language: unknown): void {
        this.currentLanguage$.next(language);
    }

    private extractTranslationSet(
        translationSetFactory: TranslationSetFactory
    ): (source$: Observable<unknown>) => Observable<TranslationSet> {
        return (source$: Observable<unknown>): Observable<TranslationSet> => {
            return source$.pipe(
                switchMap((language: unknown):
                    | Observable<TranslationSet>
                    | Promise<TranslationSet> => {
                    if (typeof translationSetFactory === 'function') {
                        const set:
                            | Promise<TranslationSet>
                            | Observable<TranslationSet>
                            | TranslationSet = translationSetFactory(language);

                        if (
                            set instanceof Observable ||
                            set instanceof Promise
                        ) {
                            return set;
                        }

                        return of(set);
                    }

                    if (
                        translationSetFactory instanceof Observable ||
                        translationSetFactory instanceof Promise
                    ) {
                        return translationSetFactory;
                    }

                    return of(translationSetFactory as TranslationSet);
                })
            );
        };
    }

    private extractTranslationString(
        key: string | readonly string[],
        args: readonly unknown[]
    ): (source$: Observable<TranslationSet>) => Observable<string> {
        const normalizedKey: readonly string[] = this.normalizeKey(key);

        return (source$: Observable<TranslationSet>): Observable<string> => {
            return source$.pipe(
                map((translationSet: TranslationSet): string => {
                    let currentItem:
                        | TranslationSet
                        | TranslationSetItem = translationSet;
                    let keyIndex = 0;
                    let setKey: string;

                    while (
                        typeof currentItem !== 'string' &&
                        typeof currentItem !== 'boolean' &&
                        typeof currentItem !== 'number'
                    ) {
                        setKey = normalizedKey[keyIndex];

                        if (!setKey || !currentItem[setKey]) {
                            throw new Error(
                                `Could not resolve key ${normalizedKey.join(
                                    '.'
                                )} in provided translation set`
                            );
                        }

                        currentItem = currentItem[setKey];
                        keyIndex++;
                    }

                    if (keyIndex < normalizedKey.length) {
                        throw new Error(
                            `Could not resolve key ${normalizedKey.join(
                                '.'
                            )} in provided translation set`
                        );
                    }

                    return sprintfJs.sprintf(currentItem.toString(), ...args);
                })
            );
        };
    }

    private normalizeKey(key: string | readonly string[]): readonly string[] {
        let normalizedKey: string[];

        if (!Array.isArray(key)) {
            normalizedKey = (key as string).split('.');
        } else {
            normalizedKey = key;
        }

        return normalizedKey;
    }
}
