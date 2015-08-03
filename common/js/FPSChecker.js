var FPSChecker = (function () {
    function FPSChecker() {
        this.fpsText = "";
        this.init();
    }
    FPSChecker.prototype.begin = function () {
        this.startTime = new Date().getTime();
        this.start = true;
    };
    FPSChecker.prototype.getFPSText = function () {
        return this.fpsText;
    };
    FPSChecker.prototype.finish = function () {
        if (!this.start) {
            return;
        }
        this.frameCount++;
        var current = new Date().getTime();
        this.totalTime += current - this.startTime;
        //１秒以上経過していれば
        if (this.totalTime >= this.checkTiming) {
            var framerate = (this.frameCount * 1000) / (this.totalTime);
            this.framerates.push(framerate);
            this.fps = framerate;
            this.totalTime = 0;
            this.frameCount = 0;
            this.fpsText = (Math.floor(framerate * 100) / 100) + "fps";
            if (this.framerates.length > this.recentCount) {
                this.framerates.shift();
            }
        }
    };
    //フレームレートを取得
    FPSChecker.prototype.getMostRecentFrameRate = function () {
        var total = 0;
        for (var i = 0; i < this.framerates.length; i++) {
            total += this.framerates[i];
        }
        return total / this.framerates.length;
    };
    FPSChecker.prototype.getMostRecentCount = function () {
        return this.framerates.length;
    };
    FPSChecker.prototype.calculated = function () {
        return this.framerates.length >= this.recentCount;
    };
    FPSChecker.prototype.init = function (checkTiming, recentCount) {
        if (checkTiming === void 0) { checkTiming = 500; }
        if (recentCount === void 0) { recentCount = 3; }
        this.start = false;
        this.framerates = [];
        this.checkTiming = checkTiming;
        this.recentCount = recentCount;
        this.totalTime = 0;
        this.frameCount = 0;
        this.totalTime = 0;
        this.fpsText = "";
    };
    return FPSChecker;
})();
//# sourceMappingURL=FPSChecker.js.map