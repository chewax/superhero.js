/// <reference path="../../lib/phaser.d.ts"/>

module Superhero {

    interface IPhysicsConfig {

        global: {
            gravity: {x:number; y:number}
        };

        player: {
            gravity: {x:number; y:number}
            drag: number
        };

        npc: {
            gravity: {x:number; y:number}
            drag: number
        }

    }

    interface IWorldConfig {
        width: number;
        height: number;
        sprite_scaling: number
    }

    export class Config {

        world: IWorldConfig;
        physics: IPhysicsConfig;
        playerDieOutofBounds: boolean;

        constructor () {

            this.world = {

                width: 1200,
                height: 550,
                sprite_scaling: 0.3
            };

            this.physics = {

                global: {
                    gravity: {x: 0, y: 0}
                },

                player: {
                    gravity: {x: 0, y: 0},
                    drag: 700
                },

                npc: {
                    gravity: {x: 0, y: 1500},
                    drag: 1500
                }
            }

            this.playerDieOutofBounds = false;

        }
    }
}
