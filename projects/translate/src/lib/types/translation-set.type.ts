/**
 * Translation set item, can either be another translation set, a string, a number or a boolean.
 */
export type TranslationSetItem = TranslationSet | string | number | boolean;

/**
 * A translation set contains translation items. Translation items are referenced via string.
 */
export interface TranslationSet {
    readonly [key: string]: TranslationSetItem;
}
