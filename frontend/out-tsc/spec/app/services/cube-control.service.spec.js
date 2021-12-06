import { TestBed } from '@angular/core/testing';
import { CubeControlService } from './cube-control.service';
describe('CubeControlService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CubeControlService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=cube-control.service.spec.js.map