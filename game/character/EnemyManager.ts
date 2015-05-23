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
        deadSince?: number;
        respawnDelay?: number;
        fireEnabled?: boolean;
        shields?: number;
        soundEnabled?: boolean;
        dropsSmoke?: boolean;
    }

    /**
     * Manage enemies inside level
     */
    export class EnemyManager {
        game: Phaser.Game;
        enemies: Superhero.EnemyBase[];
        enemiesTimer: Phaser.Timer;
        multiplier: number = 0;
        currentLevel: string;
        enemiesAlive: Superhero.EnemyBase[];
        enemiesForThisLevel: string[];
        enemiesAvailableToRespawn: string[];
        enemiesAvailableToRespawnTimer: Phaser.Timer;

        constructor (game:Phaser.Game, levelID: string) {
            this.game = game;
            this.currentLevel = levelID;
            this.startTimer();
            this.enemies =  [];
            this.enemiesAlive = [];
            this.createLevelEnemies();
        }

        killAll(){
            for (var i = 0; i < this.enemiesAlive.length; i++){
                this.enemiesAlive[i].shield = 0;
                this.enemiesAlive[i].die(this.enemiesAlive[i].sprite);
            }
        }

        /**
        * Enemies Timer
        */
        private startTimer() {
            // 20 secs per update add multiplier 0.1
            this.enemiesTimer = this.game.time.create(false);
            this.enemiesTimer.start();
            this.enemiesTimer.loop((<Superhero.Game>this.game).conf.ENEMIES.respawnLapse, this.updateMultiplier, this);
        }

        /**
         * Update multiplier values
         */
        public updateMultiplier(): void {
            this.multiplier += (<Superhero.Game>this.game).conf.ENEMIES.multiplier;
            this.tryToSpawnEnemy();
        }

        /**
         * Spawn random enemy
         */
        public spawnRandomEnemy(): void {

            var enemySpawnPoint = this.getRandomEnemySpawnPosition(true);
            var enemyDefaultState = this.getRandomEnemyState();
            var assetsKey = this.getRandomEnemyAsset();

            //TODO: implement
            if(assetsKey === "tentabot01") {
                enemyDefaultState = EnemyState.STEADY;
            } else if(assetsKey == "miniBoss") {
                enemyDefaultState = EnemyState.PATROL;
                enemySpawnPoint = spawnEnemyPosition.DOWN;
            } else if(assetsKey == "smallMissileEnemy") {
                enemyDefaultState = EnemyState.STEADY;
            }

            var newEnemy: IEnemy = {
                assetsKey: assetsKey,
                facing: Superhero.Facing.LEFT,
                bulletVelocity: this.getBulletSpeed(),
                spawnLocation: this.getSpawnCoordinates(enemyDefaultState, enemySpawnPoint),
                firePower: this.getFirePower(assetsKey),
                shootDelay: this.getShootDelay(assetsKey),
                defaultState: enemyDefaultState,
                spawnPoint: enemySpawnPoint,
                fireEnabled: true,
                shields : (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[assetsKey]["shields"],
                respawnDelay: 1000,
                soundEnabled: true,
                dropsSmoke: (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[assetsKey]["dropsSmoke"]
            };

            // TODO: implement
            if(assetsKey === "tentabot01") {
                if(newEnemy.spawnPoint == spawnEnemyPosition.TOP){
                    newEnemy.spawnLocation.y -= 100;
                } else {
                    newEnemy.spawnLocation.y -= 25;
                }
            }

            //this.enemies.push(new Superhero.EnemyBase(this.game, newEnemy));
            var spawnEnemy = this.getFirstEnemyDead(newEnemy.assetsKey);
            if (spawnEnemy) {
                // Fix x position
                newEnemy.spawnLocation.x = this.game.width - newEnemy.spawnLocation.x;
                (<Superhero.StateEnemyHostile>spawnEnemy._state).stopPatrol();
                if(!spawnEnemy.sprite.alive) {
                    spawnEnemy.sprite.reset(newEnemy.spawnLocation.x, newEnemy.spawnLocation.y);
                    spawnEnemy.setCustomEnemyProperties(newEnemy);
                    this.enemiesAlive.push(spawnEnemy);
                }
            }
        }

        private getFirstEnemyDead(key:string): Superhero.EnemyBase {
            for (var i = 0; i < this.enemies.length; i++) {
                if (this.enemies[i].sprite.key === key && !this.enemies[i].sprite.alive && this.enemies[i].canRespawn()) return this.enemies[i];
            }
            return null
        }

        private getShootDelay(enemyAssetKey: string): number {
            var shootDelay = (<Superhero.Game>this.game).conf.ENEMIES.shootDelay / (1 + this.multiplier);
            if((<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[enemyAssetKey]["minShootDelay"] > shootDelay) {
                shootDelay = (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[enemyAssetKey]["minShootDelay"];
            }
            return shootDelay

        }

        private getBulletSpeed(): number {
            var bulletSpeed = (<Superhero.Game>this.game).conf.ENEMIES.bulletSpeed * (1 + this.multiplier);

            if(bulletSpeed > (<Superhero.Game>this.game).conf.ENEMIES.maxBulletSpeed) {
                bulletSpeed = (<Superhero.Game>this.game).conf.ENEMIES.maxBulletSpeed;
            }

            return bulletSpeed;
        }

        private getRandomEnemyAsset(): string {
            //var newEnemyAsset = this.game.rnd.integerInRange(0, this.enemiesForThisLevel.length - 1);
            var newEnemyAsset = this.game.rnd.integerInRange(0, this.enemiesAvailableToRespawn.length - 1);

            return this.enemiesAvailableToRespawn[newEnemyAsset];
        }

        private getFirePower(assetKey: string): number {
            return (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[assetKey]["firePower"];
        }

        private getSpawnCoordinates(enemyDefaultState: EnemyState, enemySpawnPoint: spawnEnemyPosition): any {

            var spawnCoordinates;

            if(enemyDefaultState === EnemyState.PATROL) {
                if (enemySpawnPoint === spawnEnemyPosition.TOP) {
                    spawnCoordinates = {x: (<Superhero.Game>this.game).conf.ENEMIES.spawnCoordinates.patrol.top.x, y: 20};
                } else {
                    // TODO: implement sprite height instead of hardcoded
                    spawnCoordinates = {x: (<Superhero.Game>this.game).conf.ENEMIES.spawnCoordinates.patrol.down.x, y: this.game.height - 70};
                }
            } else {
                if (enemySpawnPoint === spawnEnemyPosition.TOP) {
                    spawnCoordinates = {x: (<Superhero.Game>this.game).conf.ENEMIES.spawnCoordinates.steady.top.x, y: this.game.height / 3};
                } else {
                    // TODO: implement sprite height instead of hardcoded
                    spawnCoordinates = {x: (<Superhero.Game>this.game).conf.ENEMIES.spawnCoordinates.steady.down.x, y: (this.game.height / 3) * 2/*this.game.world.height - 270*/};
                }
            }

            return spawnCoordinates;
        }

        private getRandomEnemyState(): EnemyState {
            return this.game.rnd.integerInRange(0, 1);
        }

        private getRandomEnemySpawnPosition(forEnemiesAlive: boolean): spawnEnemyPosition {

            var returnPosition;
            var enemiesValues;

            if(forEnemiesAlive) {
                enemiesValues = this.enemiesAlive;
            } else {
                enemiesValues = this.enemies;
            }

            if(enemiesValues.length == 0) {
                var rndInt = this.game.rnd.integerInRange(0, 1);
                if(rndInt == 0){
                    returnPosition = spawnEnemyPosition.TOP;
                } else {
                    returnPosition = spawnEnemyPosition.DOWN;
                }
            } else {
                if(enemiesValues[0].spawnPoint == spawnEnemyPosition.TOP) {
                    returnPosition = spawnEnemyPosition.DOWN;
                 } else {
                    returnPosition = spawnEnemyPosition.TOP;
                 }
            }

            return returnPosition;
        }

        /**
         * Initialize enemies for the current state
         * @param assetKey
         */
        public createLevelEnemies(): void {
            // TODO: improve performance or implement level preloader
            this.enemiesForThisLevel = (<Superhero.Game>this.game).conf.ENEMIES.levels[this.currentLevel];
            // Initialize first enemy available to respawn
            this.enemiesAvailableToRespawn = [];
            // Create enemies available to respawn timer
            this.enemiesAvailableToRespawnTimer = this.game.time.create(true);
            this.enemiesForThisLevel.forEach((enemyAssetKey) => {
                var newEnemy = this.getInitDefaultEnemyProperties(enemyAssetKey);
                // Timer for enemies to be available
                this.enemiesAvailableToRespawnTimer.add(
                    (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[enemyAssetKey]["availableSince"],
                    this.appendEnemyAvailalbeToRespawn,
                    this,
                    enemyAssetKey
                )
                // create the new enemy twice
                for (var i = 0; i < 2; i++){
                    var spawnedNewEnemy = this.spawnEnemy(newEnemy);
                    spawnedNewEnemy.sprite.kill();
                    spawnedNewEnemy.sprite.events.onKilled.add(function(s) {
                        this.enemiesTimer.stop();
                        this.enemiesTimer.start();
                        for (var i = 0; i < this.enemiesAlive.length; i++) {
                            if (this.enemiesAlive[i].sprite === s ){
                                var index = this.enemiesAlive.indexOf(this.enemiesAlive[i], 0);
                                if (index != undefined) {
                                    this.enemiesAlive.splice(index, 1);
                                }
                            }
                        }
                        this.enemiesTimer.loop((<Superhero.Game>this.game).conf.ENEMIES.respawnLapse, this.updateMultiplier, this);

                    }, this);
                    this.enemies.push(spawnedNewEnemy);
                }
            });
            this.enemiesAvailableToRespawnTimer.start();
        }

        appendEnemyAvailalbeToRespawn(assetKey: string): void {
            this.enemiesAvailableToRespawn.push(assetKey);
        }

        private spawnEnemy(newEnemy: IEnemy): any {

            // TODO: improve this...
            if(newEnemy.assetsKey === "tentabot01") {
                return new Superhero.TentacleBot(this.game, newEnemy);
            } else if (newEnemy.assetsKey === "twoHandedWeapon") {
                return new Superhero.TwoHandedEnemy(this.game, newEnemy);
            } else if(newEnemy.assetsKey === "miniBoss") {
                return new Superhero.MiniBoss(this.game, newEnemy);
            } else if(newEnemy.assetsKey === "smallMissileEnemy") {
                return new Superhero.SmallMissileEnemy(this.game, newEnemy);
            } else {
                return new Superhero.EnemyBase(this.game, newEnemy);
            }
        }

        /**
         * Get default values for initializing enemies
         * @param assetKey
         * @returns {IEnemy}
         */
        private getInitDefaultEnemyProperties(assetKey: string): IEnemy {

            var newEnemy: IEnemy = {
                assetsKey: assetKey,
                facing: Superhero.Facing.LEFT,
                bulletVelocity: (<Superhero.Game>this.game).conf.ENEMIES.bulletSpeed,
                // TODO: check if it's ok to spawn the enemy outside the world bounds this way
                spawnLocation: {x: this.game.width - 200, y: this.game.height - 200},
                firePower: this.getFirePower(assetKey),
                shootDelay: (<Superhero.Game>this.game).conf.ENEMIES.shootDelay,
                defaultState: EnemyState.STEADY,
                spawnPoint: this.getRandomEnemySpawnPosition(false),
                deadSince: this.game.time.time,
                soundEnabled: false,
                dropsSmoke: false
            };

            return newEnemy;
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
            if(this.currentLevel == "level1") {
                if(this.totalEnemiesAlive() < 2) {
                    this.spawnRandomEnemy();
                }
            } else {
                if(this.totalEnemiesAlive() < 2) {
                    if(this.totalEnemiesAlive() < 1) {
                        this.spawnCustomEnemy("miniBoss");
                    } else {
                        this.spawnCustomEnemy("twoHandedWeapon");
                    }
                }
            }
        }

        /**
         * Gets the number of enemies on the current stage
         */
        public totalEnemiesAlive(): number {
            return this.enemiesAlive.length;
        }


        /*
         * Spawns new enemy on the given coordinates of the given type
         * If there are not any properties random+json default values are loaded
         *
         */
        public spawnCustomEnemy(assetsKey: string): void {

            var enemyDefaultState = EnemyState.STEADY;
            var enemySpawnPoint = spawnEnemyPosition.TOP;

            var newEnemy: IEnemy = {
                assetsKey: assetsKey,
                facing: Superhero.Facing.LEFT,
                bulletVelocity: this.getBulletSpeed(),
                spawnLocation: this.getSpawnCoordinates(enemyDefaultState, enemySpawnPoint),
                firePower: this.getFirePower(assetsKey),
                shootDelay: this.getShootDelay(assetsKey),
                defaultState: enemyDefaultState,
                spawnPoint: enemySpawnPoint,
                fireEnabled: false,
                shields: (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[assetsKey]["shields"],
                respawnDelay: 1000,
                soundEnabled: true,
                dropsSmoke: (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[assetsKey]["dropsSmoke"]
            };


            var spawnEnemy = this.getFirstEnemyDead(newEnemy.assetsKey);
            if (spawnEnemy) {
                // Fix x position
                newEnemy.spawnLocation.x = this.game.width - newEnemy.spawnLocation.x;
                if(assetsKey == "twoHandedWeapon") {
                    newEnemy.spawnLocation.y = this.game.height - 250;
                }
                if(!spawnEnemy.sprite.alive) {
                    spawnEnemy.sprite.reset(newEnemy.spawnLocation.x, newEnemy.spawnLocation.y);
                    spawnEnemy.setCustomEnemyProperties(newEnemy);
                    this.enemiesAlive.push(spawnEnemy);
                }
            }
         }
    }
}