import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { NgDebounce } from '../shared/decorators/debounce.decorator';
const cloneDeep = require('clone-deep');
const Cube = require('cubejs');
let CubeControlService = class CubeControlService {
    constructor() {
        this.hideInvisibleFaces = false;
        this.useLockedControls = false;
        this.currentCube = new ReplaySubject(1);
        this.COLORLESS = window.COLORLESS;
        //                  0            1           2           3            4            5
        this.FACES_CSS = ['.faceFront', '.faceUp', '.faceRight', '.faceDown', '.faceLeft', '.faceBack'];
        //            0            1           2        3         4       5           6           7
        this.COLORS = [window.GRAY, window.G, window.Y, window.B, window.R, window.O, window.W, window.COLORLESS, 'stickerLogo'];
        this.COLOR_LETTER = ['H', 'G', 'Y', 'B', 'R', 'O', 'W', 'X'];
        this.defaultMap = [
            //  Front slice
            [6, 5, ,], [6, 5, ,], [6, 5, 3,],
            [6, , , , 1], [6, , ,], [6, , 3,],
            [6, , , 4, 1], [6, , , 4], [6, , 3, 4],
            //  Standing slice
            [, 5, , , 1], [, 5, ,], [, 5, 3,],
            [, , , , 1], [, , ,], [, , 3,],
            [, , , 4, 1], [, , , 4], [, , 3, 4],
            //  Back slice
            [, 5, , , 1, 2], [, 5, , , , 2], [, 5, 3, , , 2],
            [, , , , 1, 2], [, , , , , 2], [, , 3, , , 2],
            [, , , 4, 1, 2], [, , , 4, , 2], [, , 3, 4, , 2] //  24, 25, 26
        ];
        this.colorMap = [
            //  Front slice
            ['W', 'O', 'X', 'X', 'G', 'X'], ['W', 'O', 'X', 'X', 'X', 'X'], ['W', 'O', 'B', 'X', 'X', 'X'],
            ['W', 'X', 'X', 'X', 'G', 'X'], ['W', 'X', 'X', 'X', 'X', 'X'], ['W', 'X', 'B', 'X', 'X', 'X'],
            ['W', 'X', 'X', 'R', 'G', 'X'], ['W', 'X', 'X', 'R', 'X', 'X'], ['W', 'X', 'B', 'R', 'X', 'X'],
            //  Standing slice
            ['X', 'O', 'X', 'X', 'G', 'X'], ['X', 'O', 'X', 'X', 'X', 'X'], ['X', 'O', 'B', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'X', 'G', 'X'], ['X', 'X', 'X', 'X', 'X', 'X'], ['X', 'X', 'B', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'R', 'G', 'X'], ['X', 'X', 'X', 'R', 'X', 'X'], ['X', 'X', 'B', 'R', 'X', 'X'],
            //  Back slice
            ['X', 'O', 'X', 'X', 'G', 'Y'], ['X', 'O', 'X', 'X', 'X', 'Y'], ['X', 'O', 'B', 'X', 'X', 'Y'],
            ['X', 'X', 'X', 'X', 'G', 'Y'], ['X', 'X', 'X', 'X', 'X', 'Y'], ['X', 'X', 'B', 'X', 'X', 'Y'],
            ['X', 'X', 'X', 'R', 'G', 'Y'], ['X', 'X', 'X', 'R', 'X', 'Y'], ['X', 'X', 'B', 'R', 'X', 'Y'] //  24, 25, 26
        ];
        // cubelet locations on face
        this.FACES_IDS = {
            up: [18, 19, 20, 9, 10, 11, 0, 1, 2],
            right: [2, 11, 20, 5, 14, 23, 8, 17, 26],
            front: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            down: [6, 7, 8, 15, 16, 17, 24, 25, 26],
            left: [18, 9, 0, 21, 12, 3, 24, 15, 6],
            back: [20, 19, 18, 23, 22, 21, 26, 25, 24]
        };
        this.originalColorFace = {
            'orange': 'U',
            'white': 'F',
            'blue': 'R',
            'yellow': 'B',
            'green': 'L',
            'red': 'D'
        };
        // Subs
        this.isSolved = new BehaviorSubject(true);
        this.isHidden = new BehaviorSubject(true);
        this.userOnTab = new BehaviorSubject(0);
        // This takes 4-5 seconds on a modern computer
        Cube.initSolver();
    }
    /**
     * Supply cubeletId, faceId, colorID
     */
    paintFace(cubeletId, faceId, colorId) {
        setTimeout(() => {
            const cubelet = this.cube.cubelets[cubeletId];
            this.quickExplodeImplode(cubelet);
            const direction = window.ERNO.Direction.getDirectionById(cubelet.faces[faceId].id);
            console.log(cubelet);
            // Also change convenience accessors
            if (direction.name == 'right') {
                cubelet.right.color = this.COLORS[colorId];
            }
            else if (direction.name == 'left') {
                cubelet.left.color = this.COLORS[colorId];
            }
            else if (direction.name == 'up') {
                cubelet.up.color = this.COLORS[colorId];
            }
            else if (direction.name == 'down') {
                cubelet.down.color = this.COLORS[colorId];
            }
            else if (direction.name == 'front') {
                cubelet.front.color = this.COLORS[colorId];
            }
            else if (direction.name == 'back') {
                cubelet.back.color = this.COLORS[colorId];
            }
            // Because cube can twist and rotate we need to get it's current direction relative to original face
            const currentFaceId = direction.id;
            // Change the css
            cubelet.changeFaceColor(this.FACES_CSS[currentFaceId], colorId);
            // But also update cubelet colors
            let colorsStringArray = cubelet.colors.split('');
            colorsStringArray[currentFaceId] = this.COLOR_LETTER[colorId];
            cubelet.colors = colorsStringArray.join('');
            console.log(cubelet.faces[currentFaceId]);
            cubelet.faces[currentFaceId].color = this.COLORS[colorId];
            console.log(cubelet.faces[currentFaceId]);
            console.log(cubelet);
        }, Math.floor(Math.random() * 1000));
    }
    quickExplodeImplode(cubelet) {
        if (cubelet.isTweening)
            return;
        var distance = 150;
        let startX = cubelet.position.x;
        let startY = cubelet.position.y;
        let startZ = cubelet.position.z;
        // Explode
        new TWEEN.Tween(cubelet.position)
            .to({
            x: cubelet.addressX * distance,
            y: cubelet.addressY * distance,
            z: cubelet.addressZ * distance
        }, 100)
            .easing(TWEEN.Easing.Quartic.Out)
            .onComplete(function () {
            // Implode
            new TWEEN.Tween(cubelet.position)
                .to({
                x: startX,
                y: startY,
                z: startZ
            }, 100)
                .easing(TWEEN.Easing.Quartic.Out)
                .onComplete(function () {
                cubelet.isTweening = false;
            })
                .start();
        })
            .start();
        cubelet.isTweening = true;
    }
    turnRegular() {
        this.cube.twistDuration = 50;
        setTimeout(() => {
            this.paintRegular();
        }, this.cube.twistDuration * (this.cube.twistQueue.history.length + 1));
        while (this.cube.twistQueue.history.length) {
            this.cube.undo();
        }
    }
    paintRegular() {
        for (let k = 0; k < this.cube.cubelets.length; k++) {
            for (let i = 0; i < this.defaultMap.length; i++) {
                for (let j = 0; j < this.defaultMap[i].length; j++) {
                    if (this.defaultMap[i][j]) {
                        // @ts-ignore
                        this.paintFace(k, j, this.defaultMap[i][j]);
                    }
                }
            }
        }
    }
    twistComplete() {
        console.log(this.cube.isSolved());
        this.isSolved.next(this.cube.isSolved());
        return true;
    }
    turnGray() {
        this.defaultMap.forEach((faces, i) => {
            faces.forEach((color, j) => {
                if (color === undefined)
                    return;
                this.paintFace(i, j, 0);
            });
        });
    }
    tweenToStart() {
        new window.TWEEN.Tween(this.cube.rotation)
            .to({
            x: 0.31,
            y: this.degreesToRadians(-45),
            z: 0
        }, 1000 * 2)
            .easing(window.TWEEN.Easing.Quartic.Out)
            .onComplete(() => {
            this.cube.isReady = true;
        })
            .start();
    }
    createNewCube() {
        if (this.cube)
            return;
        let container = document.getElementById('container');
        let useLockedControls = this.useLockedControls;
        let controls = useLockedControls ? window.ERNO.Locked : window.ERNO.Freeform;
        let ua = navigator.userAgent, isIe = ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1;
        window.cube = new window.ERNO.Cube({
            hideInvisibleFaces: this.hideInvisibleFaces,
            controls: controls,
            renderer: isIe ? window.ERNO.renderers.IeCSS3D : null
        });
        this.cube = window.cube;
        this.cube_copy = Object.assign({}, cloneDeep(window.cube));
        this.currentCube.next(this.cube);
        if (container) {
            container.appendChild(this.cube.domElement);
        }
        if (controls === window.ERNO.Locked) {
            const fixedOrientation = new window.THREE.Euler(Math.PI * 0.1, Math.PI * -0.25, 0);
            this.cube.object3D.lookAt(this.cube.camera.position);
            this.cube.rotation.x += fixedOrientation.x;
            this.cube.rotation.y += fixedOrientation.y;
            this.cube.rotation.z += fixedOrientation.z;
        }
        this.addEventListeners();
        this.cube.twistDuration = 100;
        this.presetBling();
        console.log(window);
        console.log(this.cube);
    }
    // Awesome
    presetBling() {
        this.cube.position.y = -2000;
        this.isHidden.next(false);
        new window.TWEEN.Tween(this.cube.position)
            .to({
            y: 0
        }, 1000 * 2)
            .easing(window.TWEEN.Easing.Quartic.Out)
            .start();
        this.cube.rotation.set(this.degreesToRadians(180), this.degreesToRadians(180), this.degreesToRadians(20));
        new window.TWEEN.Tween(this.cube.rotation)
            .to({
            x: this.degreesToRadians(25),
            y: this.degreesToRadians(-30),
            z: 0
        }, 1000 * 3)
            .easing(window.TWEEN.Easing.Quartic.Out)
            .onComplete(() => {
            this.cube.isReady = true;
        })
            .start();
        this.cube.isReady = false;
        //  And we want each Cubelet to begin in an exploded position and tween inward.
        this.cube.cubelets.forEach((cubelet) => {
            //  We want to start with each Cubelet exploded out away from the Cube center.
            //  We're reusing the x, y, and z we created far up above to handle Cubelet positions.
            const distance = 2000;
            let startX = cubelet.position.x;
            let startY = cubelet.position.y;
            let startZ = cubelet.position.z;
            cubelet.position.set(cubelet.addressX * distance, cubelet.addressY * distance, cubelet.addressZ * distance);
            //  Let's vary the arrival time of flying Cubelets based on their type.
            //  An nice extra little but of sauce!
            let delay = 0;
            if (cubelet.type === 'core')
                delay = this.getRandomIntInclusive(0, 200);
            if (cubelet.type === 'center')
                delay = this.getRandomIntInclusive(200, 400);
            if (cubelet.type === 'edge')
                delay = this.getRandomIntInclusive(400, 800);
            if (cubelet.type === 'corner')
                delay = this.getRandomIntInclusive(800, 1000);
            new window.TWEEN.Tween(cubelet.position)
                .to({
                x: startX,
                y: startY,
                z: startZ
            }, 2000)
                .delay(delay)
                .easing(window.TWEEN.Easing.Quartic.Out)
                .onComplete(() => {
                cubelet.isTweening = false;
            })
                .start();
            cubelet.isTweening = true;
        });
    }
    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    degreesToRadians(number) {
        return number * Math.PI / 180;
    }
    // Solved cube state is UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB
    // U means a facelet of the up face color, R means a facelet of the right face color, etc.
    // Lets use cube.js to solve our cuber for us
    getSolution(faceArray) {
        let solvedCube = Cube.fromString(faceArray).solve();
        let solutionArray = solvedCube.split(' ');
        let returnArray = [];
        for (let char of solutionArray) {
            if (char.includes('2')) {
                char = char.replace('2', '');
                returnArray.push(char);
            }
            if (char.includes('\'')) {
                char = char.replace('\'', '');
                char = char.toLowerCase();
                returnArray.push(char);
            }
            else {
                returnArray.push(char);
            }
        }
        console.log(returnArray);
        return returnArray.join('');
    }
    logCube() {
        console.log(window);
        console.log(window.cube);
    }
    getCubeCurrentState() {
        let up = [];
        let right = [];
        let front = [];
        let down = [];
        let left = [];
        let back = [];
        for (let [k1, v1] of Object.entries(this.FACES_IDS)) {
            for (let cubeletId of v1) {
                for (let [k2, v2] of Object.entries(this.originalColorFace)) {
                    if (k2 == this.cube.cubelets[cubeletId][k1].color.name) {
                        if (k1 == 'up') {
                            up.push(v2);
                        }
                        if (k1 == 'right') {
                            right.push(v2);
                        }
                        if (k1 == 'front') {
                            front.push(v2);
                        }
                        if (k1 == 'down') {
                            down.push(v2);
                        }
                        if (k1 == 'left') {
                            left.push(v2);
                        }
                        if (k1 == 'back') {
                            back.push(v2);
                        }
                    }
                }
            }
        }
        let currentState = up.join('') + right.join('') + front.join('') + down.join('') + left.join('') + back.join('');
        console.log(currentState);
        if (this.validateCubeState(currentState)) {
            let solution = this.getSolution(currentState);
            console.log(solution);
            this.cube.twist(solution);
        }
        else {
            console.warn('an invalid cube was passed, ignoring....');
            this.turnRegular();
        }
    }
    addEventListeners() {
        this.cube.addEventListener('onTwistComplete', () => this.twistComplete());
    }
    validateCubeState(currentState) {
        if (currentState.length != 54)
            return false;
        for (let value of Object.values(this.originalColorFace)) {
            if ([...currentState].filter(char => char == value).length != 9) {
                return false;
            }
        }
        return true; // so I guess it is valid
    }
};
__decorate([
    NgDebounce(100)
], CubeControlService.prototype, "paintRegular", null);
CubeControlService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CubeControlService);
export { CubeControlService };
//# sourceMappingURL=cube-control.service.js.map