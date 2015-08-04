/// <reference path="../../dts/easeljs/easeljs.d.ts" />
/// <reference path="../../dts/preloadjs/preloadjs.d.ts" />
/// <reference path="../../common/js/FPSChecker.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var demo;
(function (demo) {
    var Canvas2DBunny = (function () {
        function Canvas2DBunny() {
            var _this = this;
            /** 重力 */
            this.gravity = 0.5;
            /** bunnyの最小位置X */
            this.minX = 0;
            /** bunnyの最小位置Y */
            this.minY = 0;
            /** bunnyの最大位置X */
            this.maxX = 960;
            /** bunnyの最大位置Y */
            this.maxY = 540;
            /** bunnyの配列 */
            this.bunnySet = [];
            this.canvas = document.getElementById("myCanvas");
            this.stage = new createjs.Stage(this.canvas);
            this.fps = new FPSChecker();
            this.counter = document.getElementById("counter");
            this.startButton = document.getElementById("startButton");
            this.startButton.addEventListener("click", function () { return _this.startTicker(); });
            this.preloadImage();
        }
        /**
         * 画像のプリロード
         * */
        Canvas2DBunny.prototype.preloadImage = function () {
            var _this = this;
            this.loadQueue = new createjs.LoadQueue(false);
            this.loadQueue.addEventListener("complete", function (event) { return _this.loadCompleteHandler(event); });
            this.loadQueue.loadManifest([
                { src: "../common/images/bunny.png", id: "bunny" },
            ], false);
            this.loadQueue.load();
        };
        /**
         * プリロード完了
         * */
        Canvas2DBunny.prototype.loadCompleteHandler = function (event) {
            var bunnyImage = this.loadQueue.getResult("bunny");
            this.spriteSheet = new createjs.SpriteSheet({
                images: [bunnyImage],
                frames: { width: 26, height: 37, regX: +13, regY: +14 }
            });
            this.startButton.className = "on";
        };
        Canvas2DBunny.prototype.startTicker = function () {
            var _this = this;
            this.startButton.className = "";
            createjs.Ticker.setFPS(60);
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", function (event) { return _this.tick(event); });
        };
        Canvas2DBunny.prototype.tick = function (event) {
            this.fps.finish();
            this.counter.innerHTML = this.bunnySet.length + " BUNNYS, " + this.fps.getFPSText();
            if (this.fps.calculated() && this.fps.getMostRecentFrameRate() <= 30) {
                alert(this.bunnySet.length + " BUNNY!");
                createjs.Ticker.removeAllEventListeners("tick");
                return;
            }
            var amount = this.fps.fps >= 40 ? 5 : 1;
            for (var i = 0; i < amount; i++) {
                var bunny = new Bunny(this.spriteSheet);
                bunny.speedX = Math.random() * 10;
                bunny.speedY = (Math.random() * 10) - 5;
                bunny.alpha = 0.3 + Math.random() * 0.7;
                this.bunnySet.push(bunny);
                bunny.scaleX = bunny.scaleY = 0.5 + Math.random() * 0.5;
                bunny.rotation = (Math.random() - 0.5);
                this.stage.addChild(bunny);
            }
            this.fps.begin();
            for (var i = 0; i < this.bunnySet.length; i++) {
                var bunny = this.bunnySet[i];
                bunny.rotation += 0.1;
                bunny.speedY += this.gravity;
                bunny.positionX += bunny.speedX;
                bunny.positionY += bunny.speedY;
                if (bunny.positionX > this.maxX) {
                    bunny.speedX *= -1;
                    bunny.positionX = this.maxX;
                }
                else if (bunny.positionX < this.minX) {
                    bunny.speedX *= -1;
                    bunny.positionX = this.minX;
                }
                if (bunny.positionY > this.maxY) {
                    bunny.speedY *= -0.85;
                    bunny.positionY = this.maxY;
                    if (Math.random() > 0.5) {
                        bunny.speedY -= Math.random() * 6;
                    }
                }
                else if (bunny.positionY < this.minY) {
                    bunny.speedY = 0;
                    bunny.positionY = this.minY;
                }
                bunny.updatePosition();
            }
            this.stage.update();
        };
        return Canvas2DBunny;
    })();
    demo.Canvas2DBunny = Canvas2DBunny;
    var Bunny = (function (_super) {
        __extends(Bunny, _super);
        function Bunny() {
            _super.apply(this, arguments);
            this.positionX = 0;
            this.positionY = 0;
            this.speedX = 0;
            this.speedY = 0;
        }
        Bunny.prototype.updatePosition = function () {
            this.x = this.positionX;
            this.y = this.positionY;
        };
        return Bunny;
    })(createjs.Sprite);
})(demo || (demo = {}));
window.addEventListener("load", function (event) {
    new demo.Canvas2DBunny();
});
//# sourceMappingURL=context2d.js.map