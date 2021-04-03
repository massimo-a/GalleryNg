export class ColorStop {
    red: number
    green: number
    blue: number
    stop: number

    constructor(r: number, g: number, b: number, s: number) {
        this.red = r
        this.green = g
        this.blue = b
        this.stop = s
    }

    static fromHex(hexStr: string, s: number) {
        if(hexStr.charAt(0) == "#") {
			hexStr = hexStr.replace("#", "")
		}
		if(hexStr.length == 3) {
			hexStr = hexStr.charAt(0).repeat(2) + hexStr.charAt(1).repeat(2) + hexStr.charAt(2).repeat(2)
		}
		let hex = parseInt(hexStr, 16)
		let r = (hex & 0xFF0000) >> 16
		let g = (hex & 0x00FF00) >> 8
		let b = (hex & 0x0000FF)
        
        return new ColorStop(r, g, b, s)
    }
	
	static getColor(stops: ColorStop[], percent: number) {
		let i = 0
		while(i < stops.length - 1 && !(stops[i].stop < percent && stops[i+1].stop > percent)) {
			i++
		}
		let p = (percent - stops[i].stop)/(stops[i+1].stop - stops[i].stop)
		let r = Math.abs(Math.floor(stops[i].red*(1-p) + stops[i+1].red*p))
		let g = Math.abs(Math.floor(stops[i].green*(1-p) + stops[i+1].green*p))
		let b = Math.abs(Math.floor(stops[i].blue*(1-p) + stops[i+1].blue*p))
		return new ColorStop(r, g, b, p)
	}
	
	rgbToHex(): string {
		let hex1 = this.red.toString(16).toUpperCase()
		let r = hex1.length == 1 ? "0" + hex1 : hex1
		hex1 = this.green.toString(16).toUpperCase()
		let g = hex1.length == 1 ? "0" + hex1 : hex1
		hex1 = this.blue.toString(16).toUpperCase()
		let b = hex1.length == 1 ? "0" + hex1 : hex1
		return "#" + r + g + b;
	}
	
	toString(): string {
		return "<span>" + this.rgbToHex() + "</span>" +
		"<span>" + (this.stop*100).toFixed(0) + "%</span>"
	}
}