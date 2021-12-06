import { __decorate } from "tslib";
import { Component } from '@angular/core';
let NavBarComponent = class NavBarComponent {
    constructor(cubeControlService) {
        this.cubeControlService = cubeControlService;
        this.isLiveSolving = true;
    }
    ngOnInit() {
    }
    onTabChange(event) {
        console.log(event);
        this.cubeControlService.userOnTab.next(event.index);
    }
};
NavBarComponent = __decorate([
    Component({
        selector: 'app-nav-bar',
        templateUrl: './nav-bar.component.html',
        styleUrls: ['./nav-bar.component.css']
    })
], NavBarComponent);
export { NavBarComponent };
//# sourceMappingURL=nav-bar.component.js.map