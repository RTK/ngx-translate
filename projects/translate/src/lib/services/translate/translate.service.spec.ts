import {TestBed} from '@angular/core/testing';

import {Observable, of} from 'rxjs';
import {take} from 'rxjs/operators';

import {TranslateService} from './translate.service';

import type {TranslationSetFactory} from '../../types/translation-set-factory.type';
import type {TranslationSet} from '../../types/translation-set.type';

describe('TranslateService', (): void => {
    let translateService: TranslateService;

    beforeEach((): void => {
        TestBed.configureTestingModule({
            providers: [TranslateService]
        });
    });

    beforeEach((): void => {
        translateService = TestBed.inject(TranslateService);
    });

    it('should be created', (): void => {
        expect(translateService).toBeTruthy();
    });

    describe('get languageChange$()', (): void => {
        it('it should propagate values not equally null', async (): Promise<void> => {
            translateService.setLanguage('de');

            await expect(
                translateService.languageChange$.pipe(take(1)).toPromise()
            ).resolves.toBe('de');
        });
    });

    describe('getTranslation()', (): void => {
        it('should return the correct language string when providing a translation set directly', async (): Promise<void> => {
            const translateSet: TranslationSetFactory = {
                test: 'test'
            };

            translateService.setLanguage('de');

            await expect(
                translateService
                    .getTranslation(translateSet, 'test')
                    .toPromise()
            ).resolves.toBeTruthy();
        });

        it('should return the correct language string when providing a translation set function', async (): Promise<void> => {
            const translateSet: TranslationSetFactory = (): TranslationSet => {
                return {
                    test: 'test'
                };
            };

            translateService.setLanguage('de');

            await expect(
                translateService
                    .getTranslation(translateSet, 'test')
                    .toPromise()
            ).resolves.toBeTruthy();
        });

        it('should return the correct language string when providing a promise with a set', async (): Promise<void> => {
            const translateSet: TranslationSetFactory = Promise.resolve({
                test: 'test'
            });

            translateService.setLanguage('de');

            await expect(
                translateService
                    .getTranslation(translateSet, 'test')
                    .toPromise()
            ).resolves.toBe('test');
        });

        it('should return the correct language string when providing a factory function returning a promise with a set', async (): Promise<void> => {
            const translateSet: TranslationSetFactory = async (): Promise<TranslationSet> => {
                return {
                    test: 'test'
                };
            };

            translateService.setLanguage('de');

            await expect(
                translateService
                    .getTranslation(translateSet, 'test')
                    .toPromise()
            ).resolves.toBe('test');
        });

        it('should return the correct language string when providing an observable with a set', async (): Promise<void> => {
            const translateSet: TranslationSetFactory = of({
                test: 'test'
            });

            translateService.setLanguage('de');

            await expect(
                translateService
                    .getTranslation(translateSet, 'test')
                    .toPromise()
            ).resolves.toBe('test');
        });

        it('should return the correct language string when providing a factory function returning an observable with a set', async (): Promise<void> => {
            const translateSet: TranslationSetFactory = (): Observable<TranslationSet> => {
                return of({
                    test: 'test'
                });
            };

            translateService.setLanguage('de');

            await expect(
                translateService
                    .getTranslation(translateSet, 'test')
                    .toPromise()
            ).resolves.toBe('test');
        });

        it('should return the correct language string when a deep key is provided', async (): Promise<void> => {
            const translateSet: TranslationSet = {
                test: {
                    value: {
                        here: {
                            it: {
                                is: 'hi'
                            }
                        }
                    }
                }
            };

            translateService.setLanguage('de');

            await expect(
                translateService
                    .getTranslation(translateSet, 'test.value.here.it.is')
                    .toPromise()
            ).resolves.toBe('hi');
            await expect(
                translateService
                    .getTranslation(translateSet, [
                        'test',
                        'value',
                        'here',
                        'it',
                        'is'
                    ])
                    .toPromise()
            ).resolves.toBe('hi');
        });

        it('should throw an error when the key cannot be extracted', async (): Promise<void> => {
            const translateSet: TranslationSet = {
                test: {
                    value: {
                        here: {
                            it: {
                                is: 'hi'
                            }
                        }
                    }
                }
            };

            translateService.setLanguage('de');

            await expect(
                translateService
                    .getTranslation(translateSet, 'test.value.here.it.is.not')
                    .toPromise()
            ).rejects.toBeTruthy();
            await expect(
                translateService
                    .getTranslation(translateSet, [
                        'test',
                        'value',
                        'here',
                        'it',
                        'is',
                        'not'
                    ])
                    .toPromise()
            ).rejects.toBeTruthy();

            await expect(
                translateService
                    .getTranslation(translateSet, 'test.value.here.it.is.not')
                    .toPromise()
            ).rejects.toBeTruthy();
            await expect(
                translateService
                    .getTranslation(translateSet, ['test', 'value', 'here'])
                    .toPromise()
            ).rejects.toBeTruthy();
        });
    });
});
