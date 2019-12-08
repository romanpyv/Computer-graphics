import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CanvasManagementService} from '../../services/canvas-managment/canvas-management.service';

@Component({
  selector: 'app-color-models-page',
  templateUrl: './color-models-page.component.html',
  styleUrls: ['./color-models-page.component.scss']
})
export class ColorModelsPageComponent implements OnInit, AfterViewInit {

  @ViewChild('red', {static: false})
  private red: ElementRef;
  @ViewChild('original', {static: false})
  private original: ElementRef;
  private redCtx: CanvasRenderingContext2D;
  private originalCtx: CanvasRenderingContext2D;

  public rgb: number[] = [0, 0, 0];
  public hsv: number[] = [0, 0, 0];


  constructor(private canvasMngmnt: CanvasManagementService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.redCtx = this.red.nativeElement.getContext('2d');
    this.originalCtx = this.original.nativeElement.getContext('2d');
  }

  public sliderChange(e) {
    this.changeRedness(e.value);
  }

  public showOriginal() {
    this.originalCtx.canvas.style.zIndex = '2';
  }

  public showRed() {
    this.originalCtx.canvas.style.zIndex = '0';
  }

  public loadImage(e) {
    let img;
    let file;
    let fr;

    file = e.target.files[0];
    fr = new FileReader();
    fr.onloadend = createImage;
    fr.readAsDataURL(file);

    const imageLoaded = () => {
      this.original.nativeElement.width = this.red.nativeElement.width = img.width;
      this.original.nativeElement.height = this.red.nativeElement.height = img.height;

      this.originalCtx.clearRect(0, 0, this.original.nativeElement.width, this.original.nativeElement.height);
      this.redCtx.clearRect(0, 0, this.original.nativeElement.width, this.original.nativeElement.height);

      this.originalCtx.drawImage(img, 0, 0);

      this.convertImage();
    };

    function createImage() {
      img = new Image();
      img.onload = imageLoaded;
      img.src = fr.result;
    }
  }

  public RGBtoHSV(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h;
    const s = (max === 0 ? 0 : d / max);
    const v = max / 255;

    switch (max) {
      case min:
        h = 0;
        break;
      case r:
        h = (g - b) + d * (g < b ? 6 : 0);
        h /= 6 * d;
        break;
      case g:
        h = (b - r) + d * 2;
        h /= 6 * d;
        break;
      case b:
        h = (r - g) + d * 4;
        h /= 6 * d;
        break;
    }

    return {h, s, v};
  }

  public HSVtoRGB(h, s, v) {
    let r;
    let g;
    let b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  public convertImage() {
    const imgData = this.originalCtx.getImageData(0, 0, this.original.nativeElement.width, this.original.nativeElement.height);
    const copy = [...imgData.data];
    let res;
    // convert from rgb to hsv
    for (let i = 0; i < copy.length; i = i + 4) {
      res = this.RGBtoHSV(copy[i], copy[i + 1], copy[i + 2]);
      copy[i] = res.h;
      copy[i + 1] = res.s;
      copy[i + 2] = res.v;
    }
    // convert back in order to draw it in canvas
    for (let i = 0; i < copy.length; i = i + 4) {
      res = this.HSVtoRGB(copy[i], copy[i + 1], copy[i + 2]);
      imgData.data[i] = copy[i] = res.r;
      imgData.data[i + 1] = copy[i + 1] = res.g;
      imgData.data[i + 2] = copy[i + 2] = res.b;
    }

    this.redCtx.putImageData(imgData, 0, 0);
  }

  public changeRedness(sliderVal: number) {
    if (this.originalCtx === null) {
      return;
    }
    const imgData = this.originalCtx.getImageData(0, 0, this.original.nativeElement.width, this.original.nativeElement.height);
    const copy = [...imgData.data];
    let res;
    // convert from rgb to hsv
    for (let i = 0; i < copy.length; i = i + 4) {
      res = this.RGBtoHSV(copy[i], copy[i + 1], copy[i + 2]);
      copy[i] = res.h;
      copy[i + 1] = res.s;
      copy[i + 2] = res.v;
      if (res.h * 360 < 15 || res.h * 360 > 345) {
        copy[i + 2] += sliderVal;
      }
    }
    // convert back in order to draw it in canvas
    for (let i = 0; i < copy.length; i = i + 4) {
      res = this.HSVtoRGB(copy[i], copy[i + 1], copy[i + 2]);
      imgData.data[i] = copy[i] = res.r;
      imgData.data[i + 1] = copy[i + 1] = res.g;
      imgData.data[i + 2] = copy[i + 2] = res.b;
    }
    this.redCtx.putImageData(imgData, 0, 0);
  }

  public showPixelData(e) {
    if (this.redCtx === null) {
      return;
    }

    const {x, y} = this.canvasMngmnt.getCoords(this.red.nativeElement, e.clientX, e.clientY);

    const pixel = this.redCtx.getImageData(x, y, 1, 1);
    const hsv = this.RGBtoHSV(pixel.data[0], pixel.data[1], pixel.data[2]);

    this.rgb = [pixel.data[0], pixel.data[1], pixel.data[2]];
    this.hsv = [Math.round(hsv.h * 360), +hsv.s.toFixed(2), +hsv.v.toFixed(2)];
  }

}
