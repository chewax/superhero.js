/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Character.ts"/>
/// <reference path="Collectables.ts"/>

module Collectables {

    export enum CollectableType {
        IMPROVE_FIRE = 0,
        IMPROVE_SHIELD = 1
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
         * @param object - The object that will be superseeded
         */
        spawnCollectable(object:any){

            //Randomly respawn 1 out of 20 times
            //if (this.game.rnd.integerInRange(0,12) != 10) return;

            //If there are no collectables created, return
            if (this.collectables.length < 1) return;

            //For now the respawn is random
            var coll = this.collectables.getRandom();


            if (!coll) return;
            if (coll.alive) return;

            coll.spawnAt(object.x, object.y);
        }

    }


}
