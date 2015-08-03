class FPSChecker {

	fps: number;

    framerates: number[];
    checkTiming: number;
    recentCount: number;
    totalTime: number;
    frameCount: number;
    fpsText: string;

     startTime: number;
     start: Boolean;


    constructor() {
        this.fpsText = "";
        this.init();
    }

    begin(): void {
        this.startTime = new Date().getTime();
        this.start = true;
    }

    getFPSText(): string {
        return this.fpsText;
    }

    finish(): void {
        if (!this.start) {
            return;
        }

        this.frameCount++;
        var current: number = new Date().getTime();
        this.totalTime += current - this.startTime;

        //１秒以上経過していれば
        if (this.totalTime >= this.checkTiming) {
            var framerate: number = (this.frameCount * 1000) / (this.totalTime);

            this.framerates.push(framerate);

            this.fps = framerate;

            this.totalTime = 0;
            this.frameCount = 0;
            this.fpsText = (Math.floor(framerate * 100) / 100) + "fps";

            if (this.framerates.length > this.recentCount) {
                this.framerates.shift();
            }
        }
    }

    //フレームレートを取得
    getMostRecentFrameRate(): number {
        var total: number = 0;
        for (var i = 0; i < this.framerates.length; i++) {
            total += this.framerates[i];
        }
        return total / this.framerates.length;
    }

    getMostRecentCount(): number {
        return this.framerates.length;
    }

    calculated(): Boolean {
        return this.framerates.length >= this.recentCount;
    }

    init(checkTiming: number = 500, recentCount: number = 3): void {
       this. start = false;
        this.framerates = [];
        this.checkTiming = checkTiming;
        this.recentCount = recentCount;
        this.totalTime = 0;
        this.frameCount = 0;
        this.totalTime = 0;

        this.fpsText = "";
    }
}

