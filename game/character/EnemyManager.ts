/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>


module Superhero {

    export interface IEnemy {
        assetsKey?: string;
        facing?: Superhero.Facing;
        bulletVelocity?: number;
        spawnLocation?: { x: number; y: number; };
        //fireType?: Superhero.FireType;
        firePower?: number;
        shootDelay?: number;
        defaultState?: EnemyState;
        patrolSpeed?: number;
        spawnPoint?: spawnEnemyPosition;
    }

    /**
     * Manage enemies inside level
     */
    export class EnemyManager {
        game: Phaser.Game;
        enemies: Superhero.EnemyBase[];
        enemiesTimer: Phaser.Timer;
        multiplier: number = 0;

        constructor (game:Phaser.Game) {
            this.game = game;
            this.startTimer();
            this.enemies =  [];
        }

        /**
        * Enemies Timer
        */
        private startTimer() {
            // 20 secs per update add multiplier 0.1
            this.enemiesTimer = this.game.time.create(false);
            this.enemiesTimer.start();
            this.enemiesTimer.loop((<Superhero.Game> this.game).conf.ENEMIES.respawnLapse, this.updateMultiplier, this);
        }

        /**
         * Update multiplier values
         */
        public updateMultiplier(): void {
            this.multiplier += (<Superhero.Game> this.game).conf.ENEMIES.multiplier;
            this.tryToSpawnEnemy();
        }

        /**
         * Spawn random enemy
         */
        public spawnRandomEnemy(): void {

            var enemySpawnPoint = this.getRandomEnemySpawnPosition();
            var enemyDefaultState = this.getRandomEnemyState();

            var newEnemy: IEnemy = {
                assetsKey: this.getRandomEnemyAsset(),
                facing: Superhero.Facing.LEFT,
                bulletVelocity: this.getBulletSpeed(),
                spawnLocation: this.getSpawnCoordinates(enemyDefaultState, enemySpawnPoint),
                firePower: this.getFirePower(),
                shootDelay: this.getShootDelay(),
                defaultState: enemyDefaultState,
                spawnPoint: enemySpawnPoint
            };

            // TODO: If there is some sprite already dead try to get it and reset
            var spawnEnemy = this.getFirstEnemyDead(newEnemy.assetsKey);

            if (spawnEnemy) {
                spawnEnemy.setCustomEnemyProperties(newEnemy);
                spawnEnemy.sprite.reset(newEnemy.spawnLocation.x, newEnemy.spawnLocation.y);
            }
        }

        private getFirstEnemyDead(key:string): Superhero.EnemyBase {
            for (var i = 0; i < this.enemies.length; i++) {
                if (this.enemies[i].sprite.frameName === key && !this.enemies[i].sprite.alive ) return this.enemies[i];
            }
            return null
        }

        private getShootDelay(): number {
            return (<Superhero.Game> this.game).conf.ENEMIES.shootDelay / (1 + this.multiplier);
        }

        private getBulletSpeed(): number {
            var bulletSpeed = (<Superhero.Game> this.game).conf.ENEMIES.bulletSpeed * (1 + this.multiplier);

            if(bulletSpeed > (<Superhero.Game> this.game).conf.ENEMIES.maxBulletSpeed) {
                bulletSpeed = (<Superhero.Game> this.game).conf.ENEMIES.maxBulletSpeed;
            }

            return bulletSpeed;
        }

        private getRandomEnemyAsset(): string {
            var newEnemyAsset = this.game.rnd.integerInRange(0, (<Superhero.Game> this.game).conf.ENEMIES.enemiesAvailableAssets.length - 1);
            return (<Superhero.Game> this.game).conf.ENEMIES.enemiesAvailableAssets[newEnemyAsset];
        }

        private getFirePower(): number {
            // TODO: implement different firePower or different weapon type
            return 1;
        }

        private getSpawnCoordinates(enemyDefaultState: EnemyState, enemySpawnPoint: spawnEnemyPosition): any {

            var spawnCoordinates;

            if(enemyDefaultState === EnemyState.PATROL) {
                if (enemySpawnPoint === spawnEnemyPosition.TOP) {
                    spawnCoordinates = {x: (<Superhero.Game> this.game).conf.ENEMIES.spawnCoordinates.patrol.top.x, y: 20};
                } else {
                    // TODO: implement sprite height instead of hardcoded
                    spawnCoordinates = {x: (<Superhero.Game> this.game).conf.ENEMIES.spawnCoordinates.patrol.down.x, y: this.game.height - 70};
                }
            } else {
                if (enemySpawnPoint === spawnEnemyPosition.TOP) {
                    spawnCoordinates = {x: (<Superhero.Game> this.game).conf.ENEMIES.spawnCoordinates.steady.top.x, y: this.game.height / 3};
                } else {
                    // TODO: implement sprite height instead of hardcoded
                    spawnCoordinates = {x: (<Superhero.Game> this.game).conf.ENEMIES.spawnCoordinates.steady.down.x, y: (this.game.height / 3) * 2/*this.game.world.height - 270*/};
                }
            }

            return spawnCoordinates;
        }

        private getRandomEnemyState(): EnemyState {
            return this.game.rnd.integerInRange(0, 1);
        }

        private getRandomEnemySpawnPosition(): spawnEnemyPosition {
            if(this.getEnemiesOnStage() == 0) {
                return this.game.rnd.integerInRange(0, 1);
            } else {
                 if(this.enemies[0].spawnPoint == spawnEnemyPosition.TOP) {
                     return spawnEnemyPosition.DOWN;
                 } else {
                     return spawnEnemyPosition.TOP;
                 }
            }
        }

        /**
         * Call enemies update
         */
        public update(): void {
            this.enemies.forEach((enmy) =>
                    enmy.update()
            );
        }

        /**
         * Check if the new enemy can be spawned
         */
        private tryToSpawnEnemy() {
            if(this.getEnemiesOnStage() < 2) {
                this.spawnRandomEnemy();
            }
        }

        enemyDied(): void {
            // call powerUpManager drop and send the corresponding property (like drop weapon.B)
        }

        /**
         * Gets the number of enemies on the current stage
         */
        public getEnemiesOnStage(): number {
            return this.enemies.length;
        }


        /*
         * Spawns new enemy on the given coordinates of the given type
         * If there are not any properties random+json default values are loaded
         *
         */
        /*public spawnCustomEnemy(enemy?: IEnemy, qty: number = 1): void {

             // The new enemy instance
             var newEnemy;
             // The type of the enemy to be spawned
             var newEnemyType;
             // Assets key
             var assetsKey;
             // Quantity of enemies to spawn
             var spawnQty = qty;
             // total enemies already spawned
             var enemiesSpawned = 0;

             //newEnemy = new Superhero.EnemyBase(this.game, enemy);

             if(enemy.spawnQuantity) {
             spawnQty = enemy.spawnQuantity;
             }

             while(enemiesSpawned < qty) {

             if(!enemy) {
             newEnemyType = this.game.rnd.integerInRange(0, 2);
             }

             // If everything is null create all random
             if (!enemy.enemyType) {

             newEnemyType = GerRandomEnemyType;
             } else {
             newEnemyType = enemy.enemyType;
             }
             if (!enemy.assetsKey) {
             var assetKey = this.GetDefaultAssetForEnemyFromJSON(enemy.enemyType, "assetKey");
             }

             // Check for enemies already on the stage
             // TODO: create a greater method to check all of these rules to validate if it can spawn the new enemy passing the new enemy type
             if (this.enemyCanBeSpawned(newEnemyType)) {
             // TODO: check if it's better to have a single class per enemy type or just get the values from the json, etc

             //spawn any
             if (enemy.enemyType == EnemyType.EASY) {
             newEnemy = this.easyEnemiesOnStage.getFirstDead();
             if(newEnemy) {
             newEnemy.reset(enemy.spawnLocation);
             newEnemy.revive();
             }
             } else if (enemy.enemyType == EnemyType.MEDIUM) {

             } else if (enemy.enemyType == EnemyType.HARD){

             }

             // TODO: check for properties that may need to be get before creating the new instance (beign called on the constructor e.g. facing amd bulletvelocity
             if (enemy.bulletVelocity) {
             newEnemy.bulletVelocity = enemy.bulletVelocity;
             } else {
             //newEnemy.bulletVelocity = this.GetDefaultValueFromEnemyJson(enemy.enemyType, "bulletVelocity")
             }

             // TODO: implement fire type
             if (enemy.fireType) {
             newEnemy.fireType = enemy.fireType;
             } else {
             //newEnemy.fireType = this.GetDefaultValueFromEnemyJson(enemy.enemyType, "fireType")
             }
             if(enemy.firePower) {
             newEnemy.firePower = enemy.firePower;
             } else {
             newEnemy.firePower = this.GetDefaultValueFromEnemyJson(
             }

             if (enemy.facing) {
             newEnemy.facing = enemy.facing;
             } else {
             //newEnemy.facing = this.GetDefaultValueFromEnemyJson(enemy.enemyType, "facing")
             }

             if (enemy.spawnLocation) {
             // TODO: check for x and y instead to the whole object
             newEnemy.spawnLocation = enemy.spawnLocation;
             } else {
             //newEnemy.spawnLocation = this.GetDefaultValueFromEnemyJson(enemy.enemyType, "spawnLocation")
             }
             enemiesSpawned++;
             }
             }
         }*/
    }
}