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
        BOMB = 7,
        LIVES = 8
    }

    export class CollectableManager {

        game: Phaser.Game;
        collectables: Phaser.Group;
        onCollect: Phaser.Signal;


        constructor(game:Phaser.Game){
            this.game = game;
            this.collectables = new Phaser.Group(this.game);
            this.onCollect = new Phaser.Signal;
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

                case CollectableType.LIVES:
                    var item = new Collectables.Lives(this.game);
                    this.collectables.add(item);
                    break;

            }
        }

        checkCollectedBy(character: Superhero.Character): void {
            //For every collectable.
            this.collectables.forEach(function(item, character){
                if (item.alive) if (item.overlapWithChar(character)) this.onCollect.dispatch();
            }, this, false, character)
        }

        /**
         * Spawns a collectable where an object was standing.
         * @param x - X Coordinate
         * @param y - Y Coordinate
         */
        spawnCollectable(x:number, y:number, index?:number){

            // Randomly respawn 1 out of 20 times unless a specific collectable was instructed
            //if (!index) if (this.game.rnd.integerInRange(0,12) != 10) return;


            // If there are no collectables created, return
            if (this.collectables.length < 1) return;

            // If there is already one spawned then return
            if (this.collectables.countLiving() >= 1) return;

            // Otherwise spawn a random collectable
            // For now the respawn is random
            if (index) {
                var coll = this.collectables.getAt(index);
            }
            else
            {
                var coll = this.collectables.getRandom();
            }

            if (!coll) return;
            if (coll.alive) return;

            coll.spawnAt(x, y);
        }

    }


}
