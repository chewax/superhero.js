/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Character.ts"/>
/// <reference path="Collectables.ts"/>

module Collectables {

    export enum CollectableType {
        IMPROVE_FIRE = 0,
        IMPROVE_SHIELD = 1,
        NUKE_BOMB = 2,
        TIME_WARP = 3,
        COIN = 4,
        DIAMOND = 5,
        IMMUNITY = 6,
        BOMB = 7
    }

    export class CollectableManager {

        game: Phaser.Game;
        collectables: Phaser.Group;


        constructor(game:Phaser.Game){
            this.game = game;
            this.collectables = new Phaser.Group(this.game);
        }

        addCollectable(ctype:CollectableType){

            switch (ctype) {
                case CollectableType.IMPROVE_FIRE:
                    var item = new Collectables.ImproveFirePower(this.game);
                    this.collectables.add(item);
                    break;

                case CollectableType.IMPROVE_SHIELD:
                    var item = new Collectables.ImprovedShield(this.game);
                    this.collectables.add(item);
                    break;

                case CollectableType.NUKE_BOMB:
                    var item = new Collectables.NukeBomb(this.game);
                    this.collectables.add(item);
                    break;

                case CollectableType.TIME_WARP:
                    var item = new Collectables.TimeWarp(this.game);
                    this.collectables.add(item);
                    break;

                case CollectableType.DIAMOND:
                    var item = new Collectables.Diamond(this.game);
                    this.collectables.add(item);
                    break;

                case CollectableType.IMMUNITY:
                    var item = new Collectables.Immunity(this.game);
                    this.collectables.add(item);
                    break;

                case CollectableType.BOMB:
                    var item = new Collectables.Bomb(this.game);
                    this.collectables.add(item);
                    break;

            }
        }

        checkCollectedBy(character: Superhero.Character): void {
            //For every collectable.
            this.collectables.forEach(function(item, character){

                if (item.alive) {
                    item.overlapWithChar(character);
                }

            }, this, false, character)
        }

        /**
         * Spawns a collectable where an object was standing.
         * @param x - X Coordinate
         * @param y - Y Coordinate
         */
        spawnCollectable(x:number, y:number){

            // Randomly respawn 1 out of 20 times
            // if (this.game.rnd.integerInRange(0,12) != 10) return;

            // If there are no collectables created, return
            if (this.collectables.length < 1) return;

            // If there is already one spawned then return
            if (this.collectables.countLiving() >= 1) return;

            // Otherwise spawn a random collectable
            // For now the respawn is random
            var coll = this.collectables.getRandom();
            if (!coll) return;
            if (coll.alive) return;

            coll.spawnAt(x, y);
        }

    }


}
