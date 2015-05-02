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

    }
}
