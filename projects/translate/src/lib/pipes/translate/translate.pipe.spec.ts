import {ChangeDetectorRef} from '@angular/core';
import {NEVER, Observable, of, Subject} from 'rxjs';

import {TranslatePipe} from './translate.pipe';

import {TranslateService} from '../../services/translate/translate.service';
import {TranslationSetFactory} from '../../types/translation-set-factory.type';

describe('TranslatePipe', (): void => {
    let translatePipe: TranslatePipe;

    let changeDetectorRef: ChangeDetectorRefStub;
    let translateService: TranslateServiceStub;

    const translateSet: TranslationSetFactory<'es' | 'en'> = {};

    beforeEach((): void => {
        changeDetectorRef = new ChangeDetectorRefStub();
        translateService = new TranslateServiceStub();
    });

    beforeEach((): void => {
        translatePipe = new TranslatePipe(
            changeDetectorRef as ChangeDetectorRef,
            (translateService as unknown) as TranslateService,
            translateSet
        );
    });

    afterEach((): void => {
        translatePipe.ngOnDestroy();
    });

    it('should create', (): void => {
        expect(translatePipe).toBeTruthy();
    });

    it('should throw an error when there is no translation set provided', (): void => {
        expect((): TranslatePipe | never => {
            return new TranslatePipe(
                changeDetectorRef as ChangeDetectorRef,
                (translateService as unknown) as TranslateService,
                void 0 as any
            );
        }).toThrow();
    });

    describe('constructor()', (): void => {
        it('should listen for language changes and refresh the translation on each language change', (): void => {
            let counter = 0;

            translateService.getTranslation = (): Observable<string> => {
                const str = counter.toString(10);
                counter++;

                return of(str);
            };

            expect(translatePipe.transform('title')).toBe('0');

            translateService.languageChange.next();
            expect(translatePipe.transform('title')).toBe('1');

            translateService.languageChange.next();
            expect(translatePipe.transform('title')).toBe('2');
        });
    });

    describe('ngOnDestroy()', (): void => {
        it('should remove all listeners', (): void => {
            let counter = 0;

            translateService.getTranslation = (): Observable<string> => {
                const str = counter.toString(10);
                counter++;

                return of(str);
            };

            expect(translatePipe.transform('title')).toBe('0');

            translateService.languageChange.next();
            expect(translatePipe.transform('title')).toBe('1');

            translatePipe.ngOnDestroy();
            translateService.languageChange.next();
            expect(translatePipe.transform('title')).toBe('1');
        });
    });

    describe('transform()', (): void => {
        it('should return null when no translation has been retrieved yet', (): void => {
            translateService.getTranslation = (): Observable<never> => {
                return NEVER;
            };

            expect(translatePipe.transform('title')).toBe(null);
        });

        it('should return the value returned from the translation service', (): void => {
            const translation: Subject<string> = new Subject();
            const translation$: Observable<string> = translation.asObservable();

            changeDetectorRef.markForCheck = jest.fn();

            translateService.getTranslation = (): Observable<string> => {
                return translation$;
            };

            expect(translatePipe.transform('title')).toBe(null);

            translation.next('test');
            expect(translatePipe.transform('title')).toBe('test');

            translation.next('123');
            expect(translatePipe.transform('title')).toBe('123');

            expect(changeDetectorRef.markForCheck).toHaveBeenCalledTimes(2);

            translation.complete();
        });

        it('should refresh the translation when the arguments have changed', (): void => {
            changeDetectorRef.markForCheck = (): void => {};

            const translateSpy: jest.SpyInstance = jest
                .spyOn(translateService, 'getTranslation')
                .mockImplementation(
                    (): Observable<string> => {
                        return of('');
                    }
                );

            translatePipe.transform('123');
            expect(translateSpy).toHaveBeenCalledWith(translateSet, '123', []);

            translatePipe.transform('123', '123');
            expect(translateSpy).toHaveBeenCalledTimes(2);
            expect(translateSpy).toHaveBeenCalledWith(translateSet, '123', [
                '123'
            ]);

            translatePipe.transform('123', '123');
            expect(translateSpy).toHaveBeenCalledTimes(2);

            translatePipe.transform('123', '321');
            expect(translateSpy).toHaveBeenCalledTimes(3);
            expect(translateSpy).toHaveBeenCalledWith(translateSet, '123', [
                '123'
            ]);

            const objA: {
                test?: boolean;
            } = {};

            translatePipe.transform('123', objA);
            expect(translateSpy).toHaveBeenCalledWith(translateSet, '123', [
                objA
            ]);
            expect(translateSpy).toHaveBeenCalledTimes(4);

            objA.test = true;
            translatePipe.transform('123', objA);
            expect(translateSpy).toHaveBeenCalledTimes(4);

            const objB: {
                test?: boolean;
            } = {
                ...objA
            };
            translatePipe.transform('123', objB);
            expect(translateSpy).toHaveBeenCalledTimes(5);
        });
    });
});

class ChangeDetectorRefStub {
    public markForCheck(): void | never {
        throw void 0;
    }
}

class TranslateServiceStub {
    public readonly languageChange: Subject<unknown> = new Subject();

    public readonly languageChange$: Observable<unknown> = this.languageChange.asObservable();

    public getTranslation(
        translationSet: TranslationSetFactory,
        key: string | string[],
        ...args: unknown[]
    ): Observable<string> | never {
        throw void 0;
    }
}
