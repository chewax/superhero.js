/// <reference path="../lib/phaser.d.ts" />
declare module Superhero {
    class Character {
        game: Phaser.Game;
        sprite: Phaser.Sprite;
        bullets: Phaser.Group;
        shadow: Phaser.Sprite;
        bulletVelocity: number;
        floor: number;
        constructor(game: Phaser.Game, assetKey: string, x: number, y: number);
        moveLeft(): void;
        sprint(): void;
        descend(): void;
        climb(): void;
        flyStill(): void;
        stop(): void;
        fire(): void;
        addAnimations(): void;
        initBullets(): void;
        initShadow(): void;
        /**
         * Interpolates a value yn defined by coordinates (x1,y1) (x2,y2) and reference value xn
         * @param x1 X Coordinate of first point of the line
         * @param y1 Y Coordinate of first point of the line
         * @param x2 X Coordinate of second point of the line
         * @param y2 Y Coordinate of second point of the line
         * @param xn X Value of the Y value that is looked for
         * @returns {number}
         */
        intepolate(x1: number, y1: number, x2: number, y2: number, xn: number): number;
        update(): void;
        setBulletVelocity(n: number): void;
        collideWithGroup(group: Phaser.Group): void;
        collideWithObject(object: Phaser.Sprite): void;
        diesWithGroup(group: Phaser.Group): void;
        diesWithObject(object: Phaser.Sprite): void;
        die(char: Phaser.Sprite, object: any): void;
    }
}
