![GitHub](https://img.shields.io/github/license/RTK/ngx-translate?style=flat-square)
![Travis (.com) branch](https://img.shields.io/travis/com/RTK/ngx-translate/master?style=flat-square)
![Codecov](https://img.shields.io/codecov/c/gh/RTK/ngx-translate?style=flat-square)

# Translate
-   [About](#about)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Usage](#usage)

## <a id="about"></a> About

This library aims to provide a translation library for angular. Event though there are already solutions
in place like [Angular's i18n](https://angular.io/guide/i18n) or community driven projects like
[ngx-translate](https://github.com/ngx-translate/core) those solutions lack in flexibility.

With this library you can overwrite your translations on each level. For example you can provide one huge
translation set for your whole application, one translation set per module you work with or even per component.

There is no limitation on how detailed your translation handling is restricted with this library.

Furthermore this library supports any kind of translation distribution. You can provide your translation sets statically or
dynamically.

## <a id="prerequisites"></a> Prerequisites

-   Angular >= 11.2.5
-   RXJs >= 6.6.0
-   TSLib >= 2.0.0

## <a id="installation"></a> Installation

```shell
$ npm install @rtk/ngx-translate -S
```

## <a id="usage"></a> Usage

### Importing the module (optional!)

Importing the module is only necessary when you want to use the `TranslateDirective` or the `TranslatePipe`.

```typescript
@NgModule({
    imports: [
        TranslateModule
    ]
})
```

### Bootstrapping

As long as you do not choose a language the module will not work. To get going call:

```typescript
// e.g. with en as language
translateService.setLanguage('en');
```

### Languages

As there are no restrictions coming with this library concerning the provision of translation sets,
there are also no restrictions regarding your language data type. Use a string, use objects, use anything you like.

```typescript
// this is valid as well, e.g. if you do not wish to support multiple
// languages and use a default one only
translationService.setLanguage(null);
```

### Providing translation sets

Whenever you provide a translation set it will be provided via the Angular dependency injection. Each time you
overwrite the translation set in any way, e.g. component wise, all pipes and directives in the component will access
the component's translation set.

```typescript
@NgModule({
    providers: [
        {
            provide: TranslationSetToken,
            useValue: {
                title: 'Hello'
            }
        }
    ],
    declarations: [Component1, Component2]
})
class MyModule {}
```

```typescript
/**
 * Component 1
 *
 * Will output "Hello"
 */
@Component({
    template: `<rtk-translate key="title"></rtk-translate>`
})
class Component1 {}
```

```typescript
/**
 * Component 2
 *
 * Will output "Hola"
 */
@Component({
    template: `<rtk-translate key="title"></rtk-translate>`,
    viewProviders: [
        {
            provide: TranslationSetToken,
            useValue: {
                title: 'Hola'
            }
        }
    ]
})
class Component2 {}
```

#### TranslationSetFactory

The `TranslationSetFactory` type is a union type referring to either static translation sets,
a promise returning a translation set, an observable returning a translation set or a factory function
returning either of the previous types.

```typescript
// static
const factoryA: TranslationSetFactory = {
    title: 'Test'
};

const factoryB: TranslationSetFactory = Promise.resolve({
    title: 'Test'
});

const factoryC: TranslationSetFactory = of({
    title: 'Test'
});

// dynamic
const factoryD: TranslationSetFactory = (language: string): TranslationSet => {
    return {
        title: 'Test'
    };
};

const factoryE: TranslationSetFactory = async (
    language: string
): Promise<TranslationSet> => {
    return {
        title: 'Test'
    };
};

const factoryF: TranslationSetFactory = (
    language: string
): Observable<TranslationSet> => {
    return of({
        title: 'Test'
    });
};
```

As demonstrated, a factory provider function receives the current language as argument.

### String formatting

This library relies on [sprintf-js](https://github.com/alexei/sprintf.js) to do the dirty work of formatting your strings.
When providing a translation key you also get the opportunity to provide arguments which will be
formatted using the sprintf-js library.

```
translateService.getTranslation({
    test: 'My string %d %s'
}, 'test', [1337, 'is nice'])

// --> My string 10 is nice
```

### Contents

#### Directive

The `TranslateDirective` can be used either via element-syntax- or attribute-syntax. Either of those
forms are valid:

```html
<rtk-translate key="title"></rtk-translate>

<div rtkTranslate key="title"></div>
```

Required Inputs: `key` (string or Array of strings)

Optional Inputs: `arguments` (any value or Array of values of any type)

#### Pipe

The `TranslatePipe` is a non pure pipe which will update its contents at runtime each time either the
selected language has been changed or any argument has been changed.

```html
<input placeholder="'placeholder' | rtkTranslate: 'argument1' : true : 123" />
```

### Service

The `TranslateService` grants access to an observable which emits each time there has been a change of the
language. The service provides a way to extract a (optionally formatted) string from a translation set.

Also you set the application language via the `TranslateService`.

```typescript
// set language
translateService.setLanguage('es');

// get language from TranslationSetFactory
// returns an observable with the string "test 10"
translateService.getTranslation(
    {
        title: 'test %d'
    },
    'title',
    [10]
);
```
