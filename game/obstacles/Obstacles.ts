/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../utils/Utils.ts"/>

module Obstacles {
	
	export class Obstacle {
		game: Phaser.Game;
		group: Phaser.Group;
		
		
		constructor (game:Phaser.Game, n:number){
			this.game = game;
			this.group = this.game.add.group();
			this.group.enableBody = true;
			this.group.physicsBodyType = Phaser.Physics.ARCADE;
			this.group.classType = ObstacleItem;
		}
		
		resetAndRoll(n:number, speed:number):void{ }
	}
	
	export class WallObstacle extends Obstacle {
		
		upperObstacle: Obstacles.UpperObstacle;
		lowerObstacle: Obstacles.LowerObstacle;
		
		constructor(game:Phaser.Game){
			super(game, 30);
			this.upperObstacle = new UpperObstacle(game, 15);
			this.lowerObstacle = new LowerObstacle(game, 15); 
		}
		
		resetAndRoll(n:number, speed:number):void{
			var itemHeight = this.game.cache.getFrameByName('meteors', 'brown5').height;
			var viewportHeight = this.game.height;
			
			var total = Math.floor(viewportHeight / itemHeight); 
			var center = this.game.rnd.integerInRange(2,total-2);
			
			var low = center - 1;
			var top = total - center - 1;
			
			this.upperObstacle.resetAndRoll(top, speed);
			this.lowerObstacle.resetAndRoll(low, speed);
		}
		
	}
	
	
	export class UpperObstacle extends Obstacle {
		
		resetAndRoll(n:number, speed:number):void{
			var itemHeight = this.game.cache.getFrameByName('meteors', 'brown5').height;
			var viewportWidth = this.game.width;
			var positions = Superhero.Utils.orderdList(n);
            var sprites = ["brown5","grey5"];
            var key = sprites[this.game.rnd.integerInRange(0,1)];
			
			for (var i=0; i<n; i++) {
				
				var item = this.group.getFirstDead();
				
				if (!item) {
					item = this.group.create(viewportWidth - 1, (positions[i]) * itemHeight, 'meteors', key);
				} else {
					item.reset(viewportWidth - 1, (positions[i]) * itemHeight);	
				}


				item.body.velocity.x = speed;
				item.body.immovable = true;
				item.checkWorldBounds = true;
            	item.outOfBoundsKill = true;
			}


		}
		
	}
	
	export class LowerObstacle extends Obstacle {
				
		resetAndRoll(n:number, speed:number):void{
			var itemHeight = this.game.cache.getFrameByName('meteors', 'brown5').height;
			var viewportHeight = this.game.height;
			var viewportWidth = this.game.width;
			var positions = Superhero.Utils.orderdList(n);
            var sprites = ["brown5","grey5"];
            var key = sprites[this.game.rnd.integerInRange(0,1)];
		

			for (var i=0; i<n; i++) {
				var item = this.group.getFirstDead();
				
				if (!item) {
					item = this.group.create(viewportWidth - 1, viewportHeight - itemHeight - (positions[i] * itemHeight), 'meteors', key)
				} else {
					item.reset(viewportWidth - 1, viewportHeight - itemHeight - (positions[i] * itemHeight));
				}

				item.body.velocity.x = speed;
				item.body.immovable = true;
				item.checkWorldBounds = true;
            	item.outOfBoundsKill = true;
			}
		}
	}
	
	export class ObstacleItem extends Phaser.Sprite{

		obstacleEmitter: Phaser.Particles.Arcade.Emitter;

		constructor(game:Phaser.Game, x:number, y:number, key?:any, frame?:any) {
			super(game, x, y, key, frame);
			this.setObstaclesEmitter();
			this.events.onKilled.add(this.particleBurst, this);
		}

		setObstaclesEmitter(): void {
			this.obstacleEmitter = this.game.add.emitter();
			this.obstacleEmitter.makeParticles('meteors', 'brown10');
			this.obstacleEmitter.gravity = 200;
		}

		particleBurst() {
            //Do not emit if the kill was made by outOfBounds event.
            if (!this.inWorld) return;

			//  Position the emitter where the mouse/touch event was
			this.obstacleEmitter.x = this.x;
			this.obstacleEmitter.y = this.y;

			//  The first parameter sets the effect to "explode" which means all particles are emitted at once
			//  The second gives each particle a lifespan
			//  The third is ignored when using burst/explode mode
			//  The final parameter  is how many particles will be emitted in this single burst
			this.obstacleEmitter.start(true, 2000, null, 4);

		}
			
	}
}