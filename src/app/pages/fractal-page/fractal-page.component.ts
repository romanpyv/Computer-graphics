import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CanvasManagementService} from '../../services/canvas-managment/canvas-management.service';

// @ts-ignore
const Complex = require('complex.js');

@Component({
  selector: 'app-fractal-page',
  templateUrl: './fractal-page.component.html',
  styleUrls: ['./fractal-page.component.css']
})
export class FractalPageComponent implements OnInit, AfterViewInit {
  public form: FormGroup;

  private iterations = 80;
  private readonly escapeRadius = 20;
  private renderIdMax = 0;
  private pickColor;
  private funcToUse;
  private x1: number;
  private x2: number;
  private y1: number;
  private y2: number;
  private box: number[] = null;

  @ViewChild('fractalCanvas', {static: false})
  private canvas: ElementRef;
  @ViewChild('scopingCanvas', {static: false})
  private scope: ElementRef;
  private ctx: CanvasRenderingContext2D;
  private scopeCtx: CanvasRenderingContext2D;
  private img;

  public functions = [
    {
      label: 'z * ln(z)',
      value: {
        func: z => z.mul(z.log()),
        args: () => {
          this.x1 = -0.5;
          this.x2 = 4;
          this.y1 = -0.75;
          this.y2 = 1.5;
        }
      }
    },
    {
      label: 'z^z',
      value: {
        func: z => z.exp(z),
        args: () => {
          this.x1 = -15;
          this.x2 = 30;
          this.y1 = -10;
          this.y2 = 20;
        }
      }
    },
    {
      label: 'cos(z) * sin(z)',
      value: {
        func: z => z.cos().mul(z.sin()),
        args: () => {
          this.x1 = -1;
          this.x2 = 5;
          this.y1 = -1.5;
          this.y2 = 3;
        }
      }
    },
    {
      label: 'cos(z) / z',
      value: {
        func: z => z.cos().div(z),
        args: () => {
          this.x1 = -7.5;
          this.x2 = 15;
          this.y1 = -5;
          this.y2 = 10;
        }
      }
    },
  ];

  public colorSchemes = [
    {
      label: 'yellowish',
      func: (iterationsMade) => {
        if (iterationsMade === this.iterations) {
          return [0, 0, 0];
        }

        const x = Math.floor(512 * iterationsMade / this.iterations);
        return [x, x, 0];
      }
    },
    {
      label: 'greyscale',
      func: (iterationsMade) => {
        if (iterationsMade === this.iterations) { // converged?
          return [0, 0, 0];
        }

        let v = Math.floor(512.0 * iterationsMade / this.iterations);
        if (v > 255) {
          v = 255;
        }
        return [v, v, v];
      }
    },
    {
      label: 'reddish',
      func: (iterationsMade) => {
        if (this.iterations === iterationsMade) {
          return [0, 0, 0];
        }

        return this.hsvToRgb(360.0 * iterationsMade / this.iterations, 1.0, 1.0);
      }
    }
  ];

  constructor(private canvasMngmnt: CanvasManagementService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      func: new FormControl('', {
        validators: Validators.required
      }),
      color: new FormControl('', {
        validators: Validators.required
      })
    });

    this.pickColor = this.colorSchemes[0].func;
  }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.scopeCtx = this.scope.nativeElement.getContext('2d');
    this.img = this.ctx.createImageData(this.canvas.nativeElement.width, 1);
  }


  public changeFunc(e) {
    this.funcToUse = e.value.func;
    e.value.args();
  }

  public changeColor(e) {
    this.pickColor = e.value;
  }

  public submit(): void {
    if (!this.form.invalid) {
      this.render();
    }
  }

  private hsvToRgb(h, s, v): any[] {
    if (v > 1.0) {
      v = 1.0;
    }
    const hp = h / 60.0;
    const c = v * s;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let rgb = [0, 0, 0];

    if (0 <= hp && hp < 1) {
      rgb = [c, x, 0];
    }
    if (1 <= hp && hp < 2) {
      rgb = [x, c, 0];
    }
    if (2 <= hp && hp < 3) {
      rgb = [0, c, x];
    }
    if (3 <= hp && hp < 4) {
      rgb = [0, x, c];
    }
    if (4 <= hp && hp < 5) {
      rgb = [x, 0, c];
    }
    if (5 <= hp && hp < 6) {
      rgb = [c, 0, x];
    }

    const m = v - c;
    rgb[0] += m;
    rgb[1] += m;
    rgb[2] += m;

    rgb[0] *= 255;
    rgb[1] *= 255;
    rgb[2] *= 255;
    return rgb;
  }

  private drawLine(line) {
    // here we draw line by line in order to show the progress
    // without recursion changes are not shown
    if (line >= this.canvas.nativeElement.height) {
      return;
    }
    let off = 0;

    for (let j = 0; j < this.img.width; j++) {
      const iterationsMade = this.getResultOfIteration(Complex(this.x1 + j / this.canvas.nativeElement.width * this.x2,
        this.y1 + line / this.canvas.nativeElement.height * this.y2));
      const color = this.pickColor(iterationsMade);
      this.img.data[off++] = color[0];
      this.img.data[off++] = color[1];
      this.img.data[off++] = color[2];
      this.img.data[off++] = 255;
    }
  }

  private getResultOfIteration(C) {
    let Z = C;
    let i = 0;

    for (; i < this.iterations && Z.abs(0) < this.escapeRadius; i++) {
      Z = this.funcToUse(Z).add(C);
    }
    return i;
  }

  public render(): void {
    let lastUpdate = new Date().getTime();
    let sy = 0;
    const renderId = ++this.renderIdMax;
    let line = 0;

    this.iterations = 80;

    const scanLine = () => {
      if (renderId < this.renderIdMax) {
        return;
      }
      this.drawLine(line);
      this.ctx.putImageData(this.img, 0, sy);
      ++line;

      const now = new Date().getTime();

      if (sy++ < this.canvas.nativeElement.height) {
        if ((now - lastUpdate) >= 400) {
          // yield control back to browser, so that canvas is updated
          lastUpdate = now;
          setTimeout(scanLine, 0);
        } else {
          scanLine();
        }
      }
    };
    // Disallow redrawing while rendering
    scanLine();
  }

  public mouseup() {
    this.scopeCtx.clearRect(0, 0, this.scope.nativeElement.width, this.scope.nativeElement.height);

    // sort the box
    if (this.box[0] > this.box[2]) {
      const x = this.box[0];
      this.box[0] = this.box[2];
      this.box[2] = x;
    }
    if (this.box[1] > this.box[3]) {
      const y = this.box[1];
      this.box[1] = this.box[3];
      this.box[3] = y;
    }


    this.x1 += (this.box[0] / this.scope.nativeElement.width) * this.x2;
    this.y1 += (this.box[1] / this.scope.nativeElement.height) * this.y2;
    const zoomedWidth = Math.abs(this.box[0] - this.box[2]);
    const zoomedHeight = Math.abs(this.box[1] - this.box[3]);
    this.x2 *= (zoomedWidth / this.scope.nativeElement.width);
    this.y2 *= (zoomedHeight / this.scope.nativeElement.height);

    if (this.x2 > this.y2) {
      this.y2 = this.x2 / 2;
    } else {
      this.x2 = this.y2 * 2;
    }

    this.iterations *= 2;
    this.render();
    this.box = null;
  }

  public mousemove(e) {
    if (this.box !== null) {
      this.scopeCtx.lineWidth = 1;

      // clear out old box first
      this.scopeCtx.clearRect(0, 0, this.scope.nativeElement.width, this.scope.nativeElement.height);

      // draw new box
      this.scopeCtx.strokeStyle = '#FF3B03';

      this.box[2] = this.canvasMngmnt.getCoords(this.scope.nativeElement, e.clientX, e.clientY).x;
      this.box[3] = this.canvasMngmnt.getCoords(this.scope.nativeElement, e.clientX, e.clientY).y;
      this.scopeCtx.strokeRect(this.box[0], this.box[1], this.box[2] - this.box[0], this.box[3] - this.box[1]);
    }
  }

  public mousedown(e) {
    if (this.box === null) {
      const {x, y} = this.canvasMngmnt.getCoords(this.scope.nativeElement, e.clientX, e.clientY);

      this.box = [x, y, 0, 0];
    }
  }
}
