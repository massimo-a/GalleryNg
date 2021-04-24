export interface GameSettings {
    refreshRate: number,
    width: number,
    height: number,
    cellSize: number
}

export abstract class Game {
    settings: GameSettings = {
        refreshRate: 25,
        width: 1024,
        height: 512,
        cellSize: 8
    }

    isPaused = false
    ms = 25
    numRows = parseInt((this.settings.height/this.settings.cellSize).toFixed(0))
    numColumns = parseInt((this.settings.width/this.settings.cellSize).toFixed(0))
    measuringFps = false

    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    
    abstract update(): void
    
    abstract draw(): void

    init(): void {
        this.canvas = document.getElementsByTagName('canvas')[0]
        this.ctx = this.canvas.getContext('2d')
    }

    run() {
        this.canvas = document.getElementsByTagName('canvas')[0]
        this.ctx = this.canvas.getContext('2d')
        this.canvas.width = this.settings.width
        this.canvas.height = this.settings.height
        let t = new Date().getTime()
        setInterval(() => {
            if(!this.isPaused) {
                this.update()
                this.draw()
                this.ms = new Date().getTime() - t
                t = new Date().getTime()
            }
        }, this.settings.refreshRate)
    }

    getFPS(): number {
        return parseInt((1000 / this.ms).toFixed(0))
    }

    togglePause(): boolean {
        this.isPaused = !this.isPaused
        return this.isPaused
    }

    set(newSetting: Object) {
        this.settings = Object.assign({}, this.settings, newSetting)
    }

    download(name: string) {
        var xhr = new XMLHttpRequest();
        var c = document.createElement('canvas')
        c.width = this.canvas.width*4
        c.height = this.canvas.height*4
        c.getContext('2d').drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.canvas.width*4, this.canvas.height*4)
        xhr.open('GET', c.toDataURL('image/png'), true);
        xhr.responseType = 'blob';
        xhr.onload = function() {
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(this.response);
            var tag = document.createElement('a');
            tag.href = imageUrl;
            tag.download = name;
            tag.click();
        }
        xhr.send();
    }
}