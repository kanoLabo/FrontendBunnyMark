/// <reference path="../../common/js/FPSChecker.ts" />
module demo {

    /**
     * imgタグにスタイルを設定するときのプロパティです。
     * ブラウザによって異なるプロパティ名になります。
     */
    var transformStyleName:string;

    /**
     * Domを使ってBunnyMarkを行うクラスです。
     */
    export class Translate2DBunny {
        private myDiv:HTMLDivElement;
        private fps:FPSChecker;
        private gravity:number = 0.5;
        /** bunnyの配置X座標の最小値です。*/
        private minX:number = 0;
        /** bunnyの配置Y座標の最小値です。*/
        private minY:number = 0;
        /** bunnyの配置X座標の最大値です。*/
        private maxX:number = 960 - 26;
        /** bunnyの配置Y座標の最大値です。*/
        private maxY:number = 540 - 37;
        /** Bunnyクラスのインスタンスを格納する配列です。 */
        private bunnySet:Bunny[] = [];
        /** FPS表示DOM要素です。*/
        private counter:HTMLDivElement;
        /** モーション開始ボタンのDOM要素です。 */
        private startButton:HTMLDivElement;

        public constructor() {

            if (navigator.userAgent.indexOf("Edge") > 0)
                transformStyleName = "transform";
            else {
                var vendor:string = (/webkit/i).test(navigator.appVersion) ? 'webkit' : (/firefox/i).test(navigator.userAgent) ? 'Moz' : 'opera' in window ? 'O' : '';
                if (vendor != "")
                    transformStyleName = vendor + "Transform";
                else
                    transformStyleName = "transform";
            }

            this.myDiv = <HTMLDivElement> document.getElementById("myDiv");
            this.fps = new FPSChecker();
            this.counter = <HTMLDivElement> document.getElementById("counter");

            this.startButton = <HTMLDivElement> document.getElementById("startButton");
            this.startButton.addEventListener("click", () => this.startTicker());
            this.startButton.className = "on";
        }

        private startTicker():void {
            this.startButton.className = "";
            this.tick();
        }

        private tick() {
            this.fps.finish();

            this.counter.innerHTML = this.bunnySet.length + " BUNNYS, " + this.fps.getFPSText();

            if (this.fps.calculated() && this.fps.getMostRecentFrameRate() <= 30) {
                alert(this.bunnySet.length + " BUNNY!");
                return;
            }

            var amount:number = this.fps.fps >= 40 ? 2 : 1;

            for (var i = 0; i < amount; i++) {
                var bunny:Bunny = new Bunny();
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
            window.requestAnimationFrame(() => this.tick());
        }
    }

    /**
     * バニーのクラスです。
     * 実際に表示されるのはimageプロパティに格納されたHTMLImageElementです。
     */
    class Bunny {
        public image:HTMLImageElement;
        public positionX:number = 0;
        public positionY:number = 0;
        public speedX:number = 0;
        public speedY:number = 0;
        public rotation:number = 0;
        public alpha:number = 0;
        public scale:number = 0;

        public constructor() {
            this.image = <HTMLImageElement> document.createElement("img");
            this.image.src = "../common/images/bunny.png";
        }

        /**
         * バニーの位置を更新します。
         */
        public updatePosition():void {
            this.image.style[transformStyleName] = "translate(" + this.positionX + "px, " + this.positionY + "px)"
                + " rotate(" + this.rotation + "deg) scale(" + this.scale + ")";
            this.image.style.opacity = this.alpha.toString();
        }
    }
}

window.addEventListener("load", (event)=> {
    new demo.Translate2DBunny();
});

