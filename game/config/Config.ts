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
            // Parse JSON values from game config file path
            this.world = JSON.parse(this.getRemote()).world;
            this.physics = JSON.parse(this.getRemote()).physics;
            this.playerDieOutofBounds = JSON.parse(this.getRemote()).playerDieOutofBounds;
        }

        getRemote(): string {
            return $.ajax({
                type: "GET",
                url: "game/config/config.json",
                async: false
            }).responseText;
        }
    }
}
