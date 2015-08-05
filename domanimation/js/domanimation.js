/// <reference path="../../common/js/FPSChecker.ts" />
var demo;
(function (demo) {
    /**
     * imgタグにスタイルを設定するときのプロパティです。
     * ブラウザによって異なるプロパティ名になります。
     */
    var transformStyleName;
    /**
     * Domを使ってBunnyMarkを行うクラスです。
     */
    var Translate2DBunny = (function () {
        function Translate2DBunny() {
            var _this = this;
            this.gravity = 0.5;
            /** bunnyの配置X座標の最小値です。*/
            this.minX = 0;
            /** bunnyの配置Y座標の最小値です。*/
            this.minY = 0;
            /** bunnyの配置X座標の最大値です。*/
            this.maxX = 960 - 26;
            /** bunnyの配置Y座標の最大値です。*/
            this.maxY = 540 - 37;
            /** Bunnyクラスのインスタンスを格納する配列です。 */
            this.bunnySet = [];
            if (navigator.userAgent.indexOf("Edge") > 0)
                transformStyleName = "transform";
            else {
                var vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' : (/firefox/i).test(navigator.userAgent) ? 'Moz' : 'opera' in window ? 'O' : '';
                if (vendor != "")
                    transformStyleName = vendor + "Transform";
                else
                    transformStyleName = "transform";
            }
            this.myDiv = document.getElementById("myDiv");
            this.fps = new FPSChecker();
            this.counter = document.getElementById("counter");
            this.startButton = document.getElementById("startButton");
            this.startButton.addEventListener("click", function () { return _this.startTicker(); });
            this.startButton.className = "on";
        }
        Translate2DBunny.prototype.startTicker = function () {
            this.startButton.className = "";
            this.tick();
        };
        Translate2DBunny.prototype.tick = function () {
            var _this = this;
            this.fps.finish();
            this.counter.innerHTML = this.bunnySet.length + " BUNNYS, " + this.fps.getFPSText();
            if (this.fps.calculated() && this.fps.getMostRecentFrameRate() <= 30) {
                alert(this.bunnySet.length + " BUNNY!");
                return;
            }
            var amount = this.fps.fps >= 40 ? 2 : 1;
            for (var i = 0; i < amount; i++) {
                var bunny = new Bunny();
                bunny.speedX = Math.random() * 10;
                bunny.speedY = (Math.random() * 10) - 5;
                bunny.alpha = 0.3 + Math.random() * 0.7;
                this.bunnySet.push(bunny);
                bunny.scale = 0.5 + Math.random() * 0.5;
                bunny.rotation = (Math.random() - 0.5) * 50;
                this.myDiv.appendChild(bunny.image);
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
            window.requestAnimationFrame(function () { return _this.tick(); });
        };
        return Translate2DBunny;
    })();
    demo.Translate2DBunny = Translate2DBunny;
    /**
     * バニーのクラスです。
     * 実際に表示されるのはimageプロパティに格納されたHTMLImageElementです。
     */
    var Bunny = (function () {
        function Bunny() {
            this.positionX = 0;
            this.positionY = 0;
            this.speedX = 0;
            this.speedY = 0;
            this.rotation = 0;
            this.alpha = 0;
            this.scale = 0;
            this.image = document.createElement("img");
            this.image.src = "../common/images/bunny.png";
        }
        /**
         * バニーの位置を更新します。
         */
        Bunny.prototype.updatePosition = function () {
            this.image.style[transformStyleName] = "translate(" + this.positionX + "px, " + this.positionY + "px)" + " rotate(" + this.rotation + "deg) scale(" + this.scale + ")";
            this.image.style.opacity = this.alpha.toString();
        };
        return Bunny;
    })();
})(demo || (demo = {}));
window.addEventListener("load", function (event) {
    new demo.Translate2DBunny();
});
//# sourceMappingURL=domanimation.js.map