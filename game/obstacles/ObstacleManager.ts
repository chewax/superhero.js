/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../utils/Utils.ts"/>
/// <reference path="Obstacles"/>

module Obstacles {

    export enum ObstacleType {
        WALL = 0,
        UPPERWALL = 1,
        LOWERWALL = 2,
    }
    /**
     * On every updatee must handle if it is time to spawn a new obstacle, and which obstacle to spawn.
     */
    export class ObstacleManager {

        game: Phaser.Game;
        obstacleRespawnTime: number;
        obstacleTimer: number;
        obstacleEmitter: Phaser.Particles.Arcade.Emitter;
        obstacles: Obstacles.Obstacle[];


        //Use this array to specify which of the obstacles we want to spawn.
        //Add all the types to be considering when spawing to this array.
        enabledObstacles: number[];

        constructor (game:Phaser.Game, respawn:number=800){
            this.game = game;
            this.obstacleRespawnTime = respawn;
            this.obstacleTimer = this.game.time.time;
            this.obstacles = [];
            this.enabledObstacles = [];
            this.setObstaclesEmitter();
        }

        update (): void {
            var elapsedTime = this.game.time.elapsedSince(this.obstacleTimer);

            if (elapsedTime > this.obstacleRespawnTime && this.obstacles.length > 0) {
                var index = this.game.rnd.integerInRange(0,this.obstacles.length-1);
                var obstacle = this.obstacles[index];
                (<Obstacles.Obstacle> obstacle).resetAndRoll(10, -150);
                this.obstacleTimer = this.game.time.time;
            }
        }

        collidesWith(object:any): void{
            for (var j=0; j < this.obstacles.length; j++) {
                (<Obstacles.Obstacle> this.obstacles[j]).collidesWith(object);
            }
        }

        diesWith(object:any, callback?: Function, listenerContext?: any): void{
            for (var j=0; j < this.obstacles.length; j++) {
                (<Obstacles.Obstacle> this.obstacles[j]).diesWith(object, callback, listenerContext);
            }
        }

        addObstacleToPool(otype: ObstacleType){
            switch (otype) {
                case ObstacleType.WALL:
                    this.obstacles.push(new Obstacles.WallObstacle(this.game));
                    this.enabledObstacles.push(ObstacleType.WALL);
                    break;

                case ObstacleType.UPPERWALL:
                    this.obstacles.push(new Obstacles.UpperObstacle(this.game));
                    this.enabledObstacles.push(ObstacleType.UPPERWALL);
                    break;

                case ObstacleType.LOWERWALL:
                    this.obstacles.push(new Obstacles.LowerObstacle(this.game));
                    this.enabledObstacles.push(ObstacleType.LOWERWALL);
                    break;

            }
        }

        setObstaclesEmitter(): void {
            this.obstacleEmitter = this.game.add.emitter();
            this.obstacleEmitter.makeParticles('meteors', 'brown10');
            this.obstacleEmitter.gravity = 0;
        }

        particleBurst(pointer) {
            //  Position the emitter where the mouse/touch event was
            this.obstacleEmitter.x = pointer.x;
            this.obstacleEmitter.y = pointer.y;

            //  The first parameter sets the effect to "explode" which means all particles are emitted at once
            //  The second gives each particle a lifespan
            //  The third is ignored when using burst/explode mode
            //  The final parameter  is how many particles will be emitted in this single burst
            this.obstacleEmitter.start(true, 2000, null, 4);
        }
    }
}