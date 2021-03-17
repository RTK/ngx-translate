import {ElementRef} from '@angular/core';

import {Observable, of, Subject} from 'rxjs';

import {TranslateDirective} from './translate.directive';

import {TranslateService} from '../../services/translate/translate.service';
import type {TranslationSetFactory} from '../../types/translation-set-factory.type';

describe('TranslateDirective', (): void => {
    let translateDirective: TranslateDirective;

    let elementRef: ElementRefStub;
    let translateService: TranslateServiceStub;
    const translationSetFactory: TranslationSetFactory = {
        title: 'hello'
    };

    beforeEach((): void => {
        elementRef = new ElementRefStub();
        translateService = new TranslateServiceStub();
    });

    beforeEach((): void => {
        translateDirective = new TranslateDirective(
            elementRef as ElementRef,
            translateService as unknown as TranslateService,
            translationSetFactory
        );
    });

    it('should create an instance', (): void => {
        expect(translateDirective).toBeTruthy();
    });

    it('should throw an error when no translation set is provided', (): void => {
        expect((): TranslateDirective | never => {
            return new TranslateDirective(
                elementRef as ElementRef,
                translateService as unknown as TranslateService,
                void 0 as any
            );
        }).toThrow();
    });

    describe('ngOnInit()', (): void => {
        it('should listen to language changes and change the translation each time the language has been changed', (): void => {
            const result = 'test';

            elementRef.nativeElement = {} as HTMLElement;

            const spy: jest.SpyInstance = jest
                .spyOn(translateService, 'getTranslation')
                .mockImplementation(
                    (): Observable<string> => {
                        return of(result);
                    }
                );

            translateDirective.key = 'title';
            translateDirective.ngOnInit();

            translateService.languageChange?.next();

            expect(spy).toHaveBeenCalled();
            expect(elementRef.nativeElement.innerHTML).toBe(result);
        });
    });

    describe('ngOnChanges()', (): void => {
        it('should change the translation', (): void => {
            const result = 'test2';

            elementRef.nativeElement = {} as HTMLElement;

            const spy: jest.SpyInstance = jest
                .spyOn(translateService, 'getTranslation')
                .mockImplementation(
                    (): Observable<string> => {
                        return of(result);
                    }
                );

            translateDirective.key = 'title';
            translateDirective.ngOnChanges({});

            expect(spy).toHaveBeenCalled();
            expect(elementRef.nativeElement.innerHTML).toBe(result);
        });
    });

    describe('ngOnDestroy()', (): void => {
        it('should complete the lifecycle subject', (): void => {
            const spy: jest.SpyInstance = jest.spyOn(
                translateService,
                'getTranslation'
            );

            translateDirective.key = 'title';
            translateDirective.ngOnInit();
            translateDirective.ngOnDestroy();

            translateService.languageChange?.next();

            expect(spy).not.toHaveBeenCalled();
        });
    });
});

class ElementRefStub {
    public nativeElement: HTMLElement | null = null;
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
