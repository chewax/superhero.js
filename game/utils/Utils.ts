/// <reference path="../../lib/phaser.d.ts"/>

module Superhero {

    export class Utils {

        /**
         * Interpolates a value yn defined by coordinates (x1,y1) (x2,y2) and reference value xn
         * @param x1 X Coordinate of first point of the line
         * @param y1 Y Coordinate of first point of the line
         * @param x2 X Coordinate of second point of the line
         * @param y2 Y Coordinate of second point of the line
         * @param xn X Value of the Y value that is looked for
         * @returns {number}
         */
        static intepolate(x1:number, y1:number, x2:number, y2:number, xn:number): number {
            return ((xn - x1)*(y2-y1) / (x2-x1)) + y1
        }
        
        /**
         *Returns an unorderd list between 0 and size
         *  
         */
        static semiRandomList(size: number): number[]{
            var list = this.orderdList(size);
            return this.shuffleArray(list);
        }
        
        
         /**
         *Returns a list of a given length containing random integers within a given range
         *  
         */
        static randomList(game:Phaser.Game, listLength: number, rangeMin: number, rangeMax:number, allowDuplicates:boolean = false): number[]{
            var list = [];
//            while (list.length < listLength) {
//                var newItem = game.rnd.integerInRange(rangeMin, rangeMax);
//                if (newItem in list) {    
//                    if (allowDuplicates) {  
//                        list.push(newItem);
//                    }
//                    continue;
//                }
//                list.push(newItem);
//            }
            return list
        }
        
        /**
         * Randomize array element order in-place.
         * Using Fisher-Yates shuffle algorithm.
         */
        static shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }
        
        /**
         * Returns an ordered list from 0 to size
         */
        static orderdList( size:number ): number[] {
            return Array.apply(null, {length: size}).map(Number.call, Number);
        }


        static groupConcat(group1:Phaser.Group, group2:Phaser.Group): Phaser.Group{
            group1.children = group1.children.concat(group2.children);
            return group1;
        }



        static interval(func, wait, times){
            var interv = function(w, t){
                return function(){
                    if(typeof t === "undefined" || t-- > 0){
                        setTimeout(interv, w);
                        try{
                            func.call(null);
                        }
                        catch(e){
                            t = 0;
                            throw e.toString();
                        }
                    }
                };
            }(wait, times);

            setTimeout(interv, wait);
        }

    }

    export class PieMask extends Phaser.Graphics{

        public game: Phaser.Game;
        public radius:number;
        public rotation:number;
        public sides:number;
        public atRest:boolean = false;

        constructor(game:Phaser.Game, radius:number = 50, x:number = 0, y:number = 0, rotation:number = 0, sides:number = 6){

            super(game,x/2,y/2);
            this.game = game;
            this.radius = radius;
            this.rotation = rotation;

            this.moveTo(this.x, this.y);

            if (sides < 3) this.sides = 3; // 3 sides minimum
            else this.sides = sides;

            this.game.add.existing(this);
        }

        public drawCircleAtSelf(){
            this.drawCircle(this.x, this.y, this.radius * 2);
        }

        public drawWithFill( pj:number, color:number=0, alpha:number=1){
            this.clear();
            this.beginFill(color, alpha);
            this.draw(pj);
            this.endFill();
        }

        private lineToRadians(rads, radius) {
            this.lineTo(Math.cos(rads) * radius + this.x, Math.sin(rads) * radius + this.y);
        }

        public draw(pj:number){
            // graphics should have its beginFill function already called by now
            this.moveTo(this.x, this.y);

            var radius = this.radius;

            // Increase the length of the radius to cover the whole target
            radius /= Math.cos(1 / this.sides * Math.PI);

            // Find how many sides we have to draw
            var sidesToDraw = Math.floor(pj * this.sides);
            for (var i = 0; i <= sidesToDraw; i++)
                this.lineToRadians((i / this.sides) * (Math.PI * 2) + this.rotation, radius);

            // Draw the last fractioned side
            if (pj * this.sides != sidesToDraw)
                this.lineToRadians(pj * (Math.PI * 2) + this.rotation, radius);
        }

    }
}
