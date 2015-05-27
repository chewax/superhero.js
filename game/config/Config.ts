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

        "enemiesCollection": any
    }

    interface IPowerUps {
        nukes: number;
        timeWarps: number;
        rockets: number;
    }

    export class Config {

        WORLD: IWorldConfig;
        PHYSICS: IPhysicsConfig;
        PLAYERDIEOUTOFBOUNDS: boolean;
        ISMUSICENABLED: boolean;
        PLAYERISIMMORTAL: boolean;
        ENEMIES: IEnemiesConfig;
        CHARACTERSCOLLECTION: any;
        POWERUPS: IPowerUps;

        constructor () {
            // Parse JSON values from game config file path
            var remoteValues = this.getRemote();

            this.WORLD = JSON.parse(remoteValues).WORLD;
            this.PHYSICS = JSON.parse(remoteValues).PHYSICS;
            this.PLAYERDIEOUTOFBOUNDS = JSON.parse(remoteValues).PLAYERDIEOUTOFBOUNDS;
            this.ENEMIES = JSON.parse(remoteValues).ENEMIES;
            this.PLAYERISIMMORTAL = JSON.parse(remoteValues).PLAYERISIMMORTAL;
            this.ISMUSICENABLED = JSON.parse(remoteValues).ISMUSICENABLED;
            this.CHARACTERSCOLLECTION =JSON.parse(remoteValues).CHARACTERSCOLLECTION;
            this.POWERUPS = JSON.parse(remoteValues).POWERUPS;
        }

        save(){
            this.POWERUPS.nukes = sh.game.state.states.Level1.hero.nukes;
            this.POWERUPS.rockets = sh.game.state.states.Level1.hero.bombs;
            this.POWERUPS.timeWarps = sh.game.state.states.Level1.hero.timeWarps;

            localStorage.setItem('superhero.conf', JSON.stringify(this));
        }

        private getRemote(): string {

            var conf = localStorage.getItem('superhero.conf');
            if (conf) {
                return conf;
            }

            return $.ajax({
                type: "GET",
                url: "game/config/config.json",
                async: false
            }).responseText;
        }
    }
}
