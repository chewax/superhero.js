/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../utils/Utils.ts"/>

module Obstacles {
	
	export class Obstacle {
		game: Phaser.Game;
		group: Phaser.Group;
        gameSpeed: number = -80;
        timer: number;
        obstacleRespawnTime: number;
        baseRespawn: number;
		
		
		constructor (game:Phaser.Game){
			this.game = game;
			this.group = this.game.add.group();
			this.group.enableBody = true;
			this.group.physicsBodyType = Phaser.Physics.ARCADE;
			this.group.classType = ObstacleItem;
            this.obstacleRespawnTime = 800;
            this.baseRespawn = 800;
            this.timer = this.game.time.time;
		}

        resetAndRoll(n:number, multiplier:number, speed?:number):void{ }
		collidesWith(object:any):void{ }
        diesWith(object:any, callback?: Function, listenerContext?: any){}
        speedUp(baseSpeed:number, multiplier:number): void {}
        killAll():void {}
	}
	// TODO: maybe we can have an specific ts file for each obstacle type
	export class WallObstacle extends Obstacle {

        // TODO Make wall obstacle without reutilizing code. It will create up to 50 sprites less.
		upperObstacle: Obstacles.UpperObstacle;
		lowerObstacle: Obstacles.LowerObstacle;
		
		constructor(game:Phaser.Game){
			super(game);
			this.upperObstacle = new UpperObstacle(game);
			this.lowerObstacle = new LowerObstacle(game);
		}
		
		resetAndRoll(n:number, multiplier:number, speed?:number):void{

            var elapsedTime = this.game.time.elapsedSince(this.timer);
            if (elapsedTime < this.obstacleRespawnTime) return;
            this.timer = this.game.time.time;

			var itemHeight = this.game.cache.getFrameByName('meteors', 'brown5').height;
			var viewportHeight = this.game.height;
			
			var total = Math.floor(viewportHeight / itemHeight); 
			var center = this.game.rnd.integerInRange(2,total-2);
			
			var low = center - 1;
			var top = total - center - 1;

            var speed =  this.gameSpeed * (1 + multiplier);
			this.upperObstacle.resetAndRoll(top, multiplier, speed);
			this.lowerObstacle.resetAndRoll(low, multiplier, speed);
		}

        collidesWith(object:any):void{
            this.lowerObstacle.collidesWith(object);
            this.upperObstacle.collidesWith(object);
        }

        diesWith(object:any, callback?: Function, listenerContext?: any){
            this.lowerObstacle.diesWith(object, callback, listenerContext);
            this.upperObstacle.diesWith(object, callback, listenerContext);
        }

        speedUp(baseSpeed:number, multiplier:number):void{
            this.obstacleRespawnTime = this.baseRespawn / (1 + multiplier);
            this.upperObstacle.speedUp(baseSpeed, multiplier);
            this.lowerObstacle.speedUp(baseSpeed, multiplier);
        }

        killAll(){
            this.upperObstacle.killAll();
            this.lowerObstacle.killAll();
        }

	}
	
	
	export class UpperObstacle extends Obstacle {

        resetAndRoll(n:number, multiplier:number, speed?:number):void{
			var itemHeight = this.game.cache.getFrameByName('meteors', 'brown5').height;
			var viewportWidth = this.game.width;
			var positions = Superhero.Utils.orderdList(n);
            var sprites = ["brown5","grey5"];
            var key = sprites[this.game.rnd.integerInRange(0,1)];
			
			for (var i=0; i<n; i++) {
                //Try to use all the dead bricks first
				var item = this.group.getFirstDead();

                //The -1 is there to avoid phaser killing the sprite before reaching the world.
                var x = viewportWidth - 1;
                var y = positions[i] * itemHeight;

                //If none is dead, then create a new one
                //Else recycle the old one
				if (!item) item = this.group.create(x, y, 'meteors', key);
				else item.reset(x, y);

				item.body.velocity.x = speed;
				item.body.immovable = true;
            	item.outOfBoundsKill = true;
			}
		}

        collidesWith(object:any):void{
            this.game.physics.arcade.collide(object, this.group);
        }

        diesWith(object:any, callback?: Function, listenerContext?: any){
            this.game.physics.arcade.overlap(object, this.group, callback, null, listenerContext);
        }

        speedUp(baseSpeed:number, multiplier:number):void{
            this.group.forEach(function(o){
                if (o.alive) o.body.velocity.x = baseSpeed * (1 + multiplier);
            },this)
        }

        killAll(){
            this.group.forEach(function(s){
                s.kill();
            },this);
        }
	}
	
	export class LowerObstacle extends Obstacle {

        resetAndRoll(n:number, multiplier:number, speed?:number):void{
            var itemHeight = this.game.cache.getFrameByName('meteors', 'brown5').height;
            var viewportHeight = this.game.height;
            var viewportWidth = this.game.width;
            var positions = Superhero.Utils.orderdList(n);
            var sprites = ["brown5","grey5"];
            var key = sprites[this.game.rnd.integerInRange(0,1)];


            for (var i=0; i<n; i++) {
                //Try to use all the dead bricks first
                var item = this.group.getFirstDead();

                //The -1 is there to avoid phaser killing the sprite before reaching the world.
                var x = viewportWidth - 1;
                var y = viewportHeight - itemHeight - (positions[i] * itemHeight);

                //If none is dead, then create a new one
                //Else recycle the old one
                if (!item) item = this.group.create(x, y, 'meteors', key);
                else item.reset(x, y);

                item.body.velocity.x = speed;
                item.body.immovable = true;
                item.outOfBoundsKill = true;
            }
        }

        collidesWith(object:any):void{
            this.game.physics.arcade.collide(object, this.group);
        }

        diesWith(object:any, callback?: Function, listenerContext?: any){
            this.game.physics.arcade.overlap(object, this.group, callback, null, listenerContext);
        }

        speedUp(baseSpeed:number, multiplier:number):void{
            this.group.forEach(function(o){
                if (o.alive) o.body.velocity.x = baseSpeed * (1 + multiplier);
            },this)
        }

        killAll(){
            this.group.forEach(function(s){
                s.kill();
            },this);
        }
	}

    interface IMeteors {
        key: string;
        mass: number;
    };


    export class MeteoriteShower extends Obstacle {

        resetAndRoll(n:number, multiplier:number, speed?:number):void{

            var elapsedTime = this.game.time.elapsedSince(this.timer);
            if (elapsedTime < this.obstacleRespawnTime) return;
            this.timer = this.game.time.time;

            if (this.group.countLiving() > 30)
                return;

            n = 1;
            speed = this.gameSpeed * Math.sqrt(1 + multiplier);

            var meteorites: IMeteors[] = [];
            var randKey: IMeteors[] = [];

            meteorites = [
                {key:'brown1',mass:45},
                {key:'brown2',mass:40},
                {key:'brown3',mass:35},
                {key:'brown4',mass:35},
                {key:'brown5',mass:17},
                {key:'brown6',mass:15},
                {key:'brown7',mass:10},
                {key:'brown8',mass:9},
                {key:'brown9',mass:3},
                {key:'brown10',mass:2},
                {key:'grey1',mass:45},
                {key:'grey2',mass:40},
                {key:'grey3',mass:35},
                {key:'grey4',mass:35},
                {key:'grey5',mass:17},
                {key:'grey6',mass:15},
                {key:'grey7',mass:10},
                {key:'grey8',mass:9},
                {key:'grey9',mass:3},
                {key:'grey10',mass:2}
            ];

            // Get the keys that are going to be spawned
            for (var i = 0; i < n; i++){
                randKey[i] = meteorites[this.game.rnd.integerInRange(0,meteorites.length-1)];
            }

            var viewportHeight = this.game.height;
            var viewportWidth = this.game.width;
            var sector = viewportHeight / n;

            var randY = [];

            for (var i = 0; i < n; i++){
                randY[i] = (this.game.rnd.integerInRange(i * sector, (i+1) * sector));
            }

            var randX = (viewportWidth + (30 * this.game.rnd.realInRange(0,3))) | 0;

            for (var i = 0; i < n; i++){

                var stone = this.group.getFirstDead();

                if (!stone)
                {
                    stone = this.group.create(randX, randY[i], 'meteors', randKey[i].key);
                    stone.body.immovable = randKey[i].mass > 10;

                    // This is to prevent the stones from dying before entering the world
                    // ==================================================================

                    stone.events.onEnterBounds.add(function(s){
                        s.outOfBoundsKill = true;
                    },this);

                    stone.events.onKilled.add(function(s){
                        s.outOfBoundsKill = false;
                    },this);

                }
                else
                {

                    stone.reset(randX,randY[i]);
                }
                stone.body.velocity.x = speed * this.game.rnd.realInRange(1,3);
            }

        }


        collidesWith(object:any):void{
            this.game.physics.arcade.collide(object, this.group);
        }

        diesWith(object:any, callback?: Function, listenerContext?: any){
            this.game.physics.arcade.overlap(object, this.group, callback, null, listenerContext);
        }

        speedUp(baseSpeed:number, multiplier:number):void{
            if (this.obstacleRespawnTime <= 200) return;
            this.obstacleRespawnTime = this.baseRespawn / (1 + multiplier);
            //console.log(this.obstacleRespawnTime);
        }

        killAll(){
            this.group.forEach(function(s){
                s.kill();
            },this);
        }

    }


	export class ObstacleItem extends Phaser.Sprite{

		constructor(game:Phaser.Game, x:number, y:number, key?:any, frame?:any) {
			super(game, x, y, key, frame);
            this.checkWorldBounds = true;
		}

			
	}
}