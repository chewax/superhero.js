/// <reference path="../lib/phaser.d.ts"/>

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

    }
}
