/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../utils/Utils.ts"/>

module Obstacles {
	
	export class Obstacle {
		game: Phaser.Game;
		group: Phaser.Group;
		
		
		constructor (game:Phaser.Game){
			this.game = game;
			this.group = this.game.add.group();
			this.group.enableBody = true;
			this.group.physicsBodyType = Phaser.Physics.ARCADE;
			this.group.classType = ObstacleItem;
		}
		
		resetAndRoll(n:number, speed:number):void{ }
		collidesWith(object:any):void{ }
        diesWith(object:any, callback?: Function, listenerContext?: any){}
	}
	
	export class WallObstacle extends Obstacle {
		
		upperObstacle: Obstacles.UpperObstacle;
		lowerObstacle: Obstacles.LowerObstacle;
		
		constructor(game:Phaser.Game){
			super(game);
			this.upperObstacle = new UpperObstacle(game);
			this.lowerObstacle = new LowerObstacle(game);
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

            //Concat add the group items to wall group
            this.group = this.upperObstacle.group.children.concat(this.lowerObstacle.group.children);
		}

        collidesWith(object:any):void{
            this.lowerObstacle.collidesWith(object);
            this.upperObstacle.collidesWith(object);
        }

        diesWith(object:any, callback?: Function, listenerContext?: any){
            this.lowerObstacle.diesWith(object, callback, listenerContext);
            this.upperObstacle.diesWith(object, callback, listenerContext);
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
				item.checkWorldBounds = true;
            	item.outOfBoundsKill = true;
			}
		}

        collidesWith(object:any):void{
            this.game.physics.arcade.collide(object, this.group);
        }

        diesWith(object:any, callback?: Function, listenerContext?: any){
            this.game.physics.arcade.overlap(object, this.group, callback, null, listenerContext);
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
                item.checkWorldBounds = true;
                item.outOfBoundsKill = true;
            }
        }

        collidesWith(object:any):void{
            this.game.physics.arcade.collide(object, this.group);
        }

        diesWith(object:any, callback?: Function, listenerContext?: any){
            this.game.physics.arcade.overlap(object, this.group, callback, null, listenerContext);
        }
	}

    //export class MassiveBlock extends Obstacle {
    //    resetAndRoll(n:number, speed:number):void {
    //
    //        var itemHeight = this.game.cache.getFrameByName('meteors', 'brown5').height;
    //        var itemWidth = this.game.cache.getFrameByName('meteors', 'brown5').width;
    //        var viewportHeight = this.game.height;
    //        var viewportWidth = this.game.width;
    //        var sprites = ["brown5", "grey5"];
    //        var key = sprites[this.game.rnd.integerInRange(0, 1)];
    //        var randY = (10 * this.game.rnd.integerInRange(20 , 30));
    //
    //        for (var i = 0; i < n; i++) {
    //            for (var j = 0; j < n; j++){
    //                ////Try to use all the dead bricks first
    //                var item = this.group.getFirstDead();
    //
    //                //The -1 is there to avoid phaser killing the sprite before reaching the world.
    //                var x = viewportWidth - 1 + (i * itemWidth);
    //                var y =  randY + (j * itemHeight);
    //
    //                //If none is dead, then create a new one
    //                //Else recycle the old one
    //                if (!item) item = this.group.create(x, y, 'meteors', key);
    //                else item.reset(x, y);
    //
    //                item.body.velocity.x = speed;
    //                item.body.immovable = true;
    //                item.checkWorldBounds = true;
    //                item.outOfBoundsKill = true;
    //            }
    //        }
    //
    //    }
    //}




	export class ObstacleItem extends Phaser.Sprite{

		//constructor(game:Phaser.Game, x:number, y:number, key?:any, frame?:any) {
		//	super(game, x, y, key, frame);
		//}

			
	}
}