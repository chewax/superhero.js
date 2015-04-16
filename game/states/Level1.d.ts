/// <reference path="../../lib/phaser.d.ts" />
/// <reference path="../Hero.d.ts" />
/// <reference path="../Badie.d.ts" />
declare module Superhero {
    class Level1 extends Phaser.State {
        leftKey: Phaser.Key;
        rightKey: Phaser.Key;
        upKey: Phaser.Key;
        downKey: Phaser.Key;
        spaceKey: Phaser.Key;
        hero: Superhero.Hero;
        badie: Superhero.Badie;
        background: Phaser.TileSprite;
        foregroundItems: Phaser.Group;
        preload(): void;
        create(): void;
        update(): void;
        configureInput(): void;
        configurePhysics(): void;
        setBaseStage(): void;
    }
}
