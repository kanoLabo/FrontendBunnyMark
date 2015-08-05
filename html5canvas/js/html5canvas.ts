/// <reference path="../../dts/easeljs/easeljs.d.ts" />
/// <reference path="../../dts/preloadjs/preloadjs.d.ts" />
/// <reference path="../../common/js/FPSChecker.ts" />

module demo {

    /**
     * HTML5 Canvasを使ってBunnyMarkを行うクラスです。
     */
    export class Canvas2DBunny {
        private canvas:HTMLCanvasElement;
        private stage:createjs.Stage;
        private fps:FPSChecker;
        private loadQueue:createjs.LoadQueue;
        private spriteSheet:createjs.SpriteSheet;
        private gravity:number = 0.5;
        /** bunnyの配置X座標の最小値です。*/
        private minX:number = 0;
        /** bunnyの配置Y座標の最小値です。*/
        private minY:number = 0;
        /** bunnyの配置X座標の最大値です。*/
        private maxX:number = 960;
        /** bunnyの配置Y座標の最大値です。*/
        private maxY:number = 540;
        /** Bunnyクラスのインスタンスを格納する配列です */
        private bunnySet:Bunny[] = [];
        /** FPS表示DOM要素です。*/
        private counter:HTMLDivElement;
        /** モーション開始ボタンのDOM要素です。 */
        private startButton:HTMLDivElement;

        public constructor() {
            this.canvas = <HTMLCanvasElement> document.getElementById("myCanvas");
            this.stage = new createjs.Stage(this.canvas);
            this.fps = new FPSChecker();
            this.counter = <HTMLDivElement> document.getElementById("counter");

            this.startButton = <HTMLDivElement> document.getElementById("startButton");
            this.startButton.addEventListener("click", () => this.startTicker());

            this.preloadImage();
        }

        /**
         * 画像のプリロードを開始します。
         */
        private preloadImage():void {
            this.loadQueue = new createjs.LoadQueue(false);
            this.loadQueue.addEventListener("complete", (event) => this.loadCompleteHandler(event));
            this.loadQueue.loadManifest([
                {src: "../common/images/bunny.png", id: "bunny"},
            ], false);

            this.loadQueue.load();
        }

        /**
         * 画像のプリロードが完了した時に実行される処理です。
         */
        private loadCompleteHandler(event) {
            var bunnyImage:HTMLImageElement = <HTMLImageElement> this.loadQueue.getResult("bunny");

            this.spriteSheet = new createjs.SpriteSheet({
                images: [bunnyImage],
                frames: {width: 26, height: 37, regX: +13, regY: +14}
            });
            this.startButton.className = "on";
        }

        private startTicker():void {
            this.startButton.className = "";
            createjs.Ticker.setFPS(60);
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", (event) => this.tick(event));
        }

        private tick(event) {
            this.fps.finish();
            this.counter.innerHTML = this.bunnySet.length + " BUNNYS, " + this.fps.getFPSText();
            if (this.fps.calculated() && this.fps.getMostRecentFrameRate() <= 30) {
                alert(this.bunnySet.length + " BUNNY!");
                createjs.Ticker.removeAllEventListeners("tick");
                return;
            }

            var amount:number = this.fps.fps >= 40 ? 5 : 1;

            for (var i = 0; i < amount; i++) {
                var bunny:Bunny = new Bunny(this.spriteSheet);
                bunny.speedX = Math.random() * 10;
                bunny.speedY = (Math.random() * 10) - 5;
                bunny.alpha = 0.3 + Math.random() * 0.7;
                this.bunnySet.push(bunny);
                bunny.scaleX = bunny.scaleY = 0.5 + Math.random() * 0.5;
                bunny.rotation = (Math.random() - 0.5) * 50;
                this.stage.addChild(bunny);
            }

            this.fps.begin();

            for (var i = 0; i < this.bunnySet.length; i++) {
                var bunny = this.bunnySet[i];

                bunny.speedY += this.gravity;
                bunny.positionX += bunny.speedX;
                bunny.positionY += bunny.speedY;

                if (bunny.positionX > this.maxX) {
                    bunny.speedX *= -1;
                    bunny.positionX = this.maxX;
                } else if (bunny.positionX < this.minX) {
                    bunny.speedX *= -1;
                    bunny.positionX = this.minX;
                }

                if (bunny.positionY > this.maxY) {
                    bunny.speedY *= -0.85;
                    bunny.positionY = this.maxY;
                    if (Math.random() > 0.5) {
                        bunny.speedY -= Math.random() * 6;
                    }
                } else if (bunny.positionY < this.minY) {
                    bunny.speedY = 0;
                    bunny.positionY = this.minY;
                }

                bunny.updatePosition();
            }
            this.stage.update();
        }
    }

    /**
     * 画面上に表示されるバニーのクラスです。
     */
    class Bunny extends createjs.Sprite {
        public positionX:number = 0;
        public positionY:number = 0;
        public speedX:number = 0;
        public speedY:number = 0;

        /**
         * バニーの位置を更新します。
         */
        public updatePosition():void {
            this.x = this.positionX;
            this.y = this.positionY;
        }
    }
}

window.addEventListener("load", (event)=> {
    new demo.Canvas2DBunny();
});

