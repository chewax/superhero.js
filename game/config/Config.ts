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

    interface IEnemiesConfig {
        multiplier: number;
        respawnLapse: number;
        shootDelay: number;
        bulletSpeed: number;
        maxBulletSpeed: number;
        levels: any;
        spawnCoordinates: {
            patrol: {
                top: {
                    x: number;
                    y: number;
                }
                down: {
                    x: number;
                }
            }
            steady: {
                top: {
                    x: number;
                }
                down: {
                    x: number;
                }
            }
        }
        patrolTweenSpeed: number;
    }

    export class Config {

        WORLD: IWorldConfig;
        PHYISICS: IPhysicsConfig;
        PLAYERDIEOUTOFBOUNDS: boolean;
        PLAYERISIMMORTAL: boolean;
        ENEMIES: IEnemiesConfig;

        constructor () {
            // Parse JSON values from game config file path
            var remoteValues = this.getRemote();
            this.WORLD = JSON.parse(remoteValues).world;
            this.PHYISICS = JSON.parse(remoteValues).physics;
            this.PLAYERDIEOUTOFBOUNDS = JSON.parse(remoteValues).playerDieOutofBounds;
            this.ENEMIES = JSON.parse(remoteValues).enemies;
            this.PLAYERISIMMORTAL = JSON.parse(remoteValues).playerIsImmortal;
        }

        private getRemote(): string {
            return $.ajax({
                type: "GET",
                url: "game/config/config.json",
                async: false
            }).responseText;
        }
    }
}
