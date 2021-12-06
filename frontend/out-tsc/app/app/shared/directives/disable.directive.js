import { __decorate } from "tslib";
import { Directive, Input } from '@angular/core';
const DISABLED = 'disabled';
const APP_DISABLED = 'app-disabled';
const TAB_INDEX = 'tabindex';
const TAG_ANCHOR = 'a';
/**
 * Disables element and all it's child elements and turns it slightly opaque.
 * Usage: <div [appDisable]="true"></div>
 * Or use conditional disable [appDisable]="someCheck : true ? false"
 */
let DisableDirective = class DisableDirective {
    constructor(eleRef, renderer) {
        this.eleRef = eleRef;
        this.renderer = renderer;
        this.appDisable = true;
    }
    ngOnChanges() {
        this.disableElement(this.eleRef.nativeElement);
    }
    ngAfterViewInit() {
        this.disableElement(this.eleRef.nativeElement);
    }
    disableElement(element) {
        if (this.appDisable) {
            if (!element.hasAttribute(DISABLED)) {
                this.renderer.setAttribute(element, APP_DISABLED, '');
                this.renderer.setAttribute(element, DISABLED, 'true');
                // disabling anchor tab keyboard event
                if (element.tagName.toLowerCase() === TAG_ANCHOR) {
                    this.renderer.setAttribute(element, TAB_INDEX, '-1');
                }
            }
        }
        else {
            if (element.hasAttribute(APP_DISABLED)) {
                if (element.getAttribute('disabled') !== '') {
                    element.removeAttribute(DISABLED);
                }
                element.removeAttribute(APP_DISABLED);
                if (element.tagName.toLowerCase() === TAG_ANCHOR) {
                    element.removeAttribute(TAB_INDEX);
                }
            }
        }
        if (element.children) {
            for (let ele of element.children) {
                this.disableElement(ele);
            }
        }
    }
};
__decorate([
    Input()
], DisableDirective.prototype, "appDisable", void 0);
DisableDirective = __decorate([
    Directive({
        selector: '[appDisable]'
    })
], DisableDirective);
export { DisableDirective };
//# sourceMappingURL=disable.directive.js.map