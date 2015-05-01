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
			
	}
}