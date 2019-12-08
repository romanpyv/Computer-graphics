import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as math from 'mathjs';

@Component({
  selector: 'app-affine-page',
  templateUrl: './affine-page.component.html',
  styleUrls: ['./affine-page.component.scss']
})
export class AffinePageComponent implements OnInit, AfterViewInit {
  private form: FormGroup;
  @ViewChild('canvas', {static: false})
  private canvas: ElementRef;
  private ctx: CanvasRenderingContext2D;
  private center: { x: number, y: number };
  private height: number;
  private width: number;
  private gridStep = 15;
  private scale: number;
  private move: number;
  private triangleToDraw;
  private triangleToDrawFirstPosition;
  private triangleInit;

  constructor() {
  }

  ngOnInit() {
    this.form = new FormGroup({
      Ax: new FormControl('', {
        validators: Validators.required
      }),
      Ay: new FormControl('', {
        validators: Validators.required
      }),
      Bx: new FormControl('', {
        validators: Validators.required
      }),
      By: new FormControl('', {
        validators: Validators.required
      }),
      Cx: new FormControl('', {
        validators: Validators.required
      }),
      Cy: new FormControl('', {
        validators: Validators.required
      }),
    });
  }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.height = this.canvas.nativeElement.height;
    this.width = this.canvas.nativeElement.width;
    this.center = {
      x: this.width / 2,
      y: this.height / 2,
    };

    this.drawAxes();
    this.drawGrid();
  }

  get Ax(): number {
    if (this.form.controls.Ax.value === '') {
      return null;
    }
    return +this.form.controls.Ax.value;
  }

  get Ay(): number {
    if (this.form.controls.Ay.value === '') {
      return null;
    }
    return +this.form.controls.Ay.value;
  }

  get Bx(): number {
    if (this.form.controls.Bx.value === '') {
      return null;
    }
    return +this.form.controls.Bx.value;
  }

  get By(): number {
    if (this.form.controls.By.value === '') {
      return null;
    }
    return +this.form.controls.By.value;
  }

  get Cx(): number {
    if (this.form.controls.Cx.value === '') {
      return null;
    }
    return +this.form.controls.Cx.value;
  }

  get Cy(): number {
    if (this.form.controls.Cy.value === '') {
      return null;
    }
    return +this.form.controls.Cy.value;
  }

  private scaleChange(e): void {
    this.scale = e;
  }

  private moveChange(e): void {
    this.move = e;
  }

  private drawAxes(): void {
    // draw x axis
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.center.y);
    this.ctx.lineTo(this.width, this.center.y);
    this.ctx.lineTo(this.width - 10, this.center.y - 5);
    this.ctx.lineTo(this.width, this.center.y);
    this.ctx.lineTo(this.width - 10, this.center.y + 5);
    this.ctx.stroke();

    // draw y axis
    this.ctx.beginPath();
    this.ctx.moveTo(this.center.x, this.height);
    this.ctx.lineTo(this.center.x, 0);
    this.ctx.lineTo(this.center.x - 5, 10);
    this.ctx.lineTo(this.center.x, 0);
    this.ctx.lineTo(this.center.x + 5, 10);
    this.ctx.stroke();

    // draw x = y
    this.ctx.setLineDash([10, 15]);
    this.ctx.lineWidth = 0.65;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height);
    this.ctx.lineTo(this.width, 0);
    this.ctx.stroke();
    this.ctx.setLineDash([0, 0]);
  }

  private drawGrid() {
    this.ctx.lineWidth = 0.5;
    for (let x = this.gridStep; this.center.x + x < this.width; x = x + this.gridStep) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.center.x + x, 0);
      this.ctx.lineTo(this.center.x + x, this.height);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(this.center.x - x, 0);
      this.ctx.lineTo(this.center.x - x, this.height);
      this.ctx.stroke();
    }
    for (let y = this.gridStep; this.center.y + y < this.height; y = y + this.gridStep) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.center.y + y);
      this.ctx.lineTo(this.width, this.center.y + y);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(0, this.center.y - y);
      this.ctx.lineTo(this.width, this.center.y - y);
      this.ctx.stroke();
    }

    // add axes names
    this.ctx.font = '20px Roboto';
    this.ctx.fillText('0', this.center.x - 15, this.center.y + 20);
    this.ctx.fillText('y', this.center.x - 15, 15);
    this.ctx.fillText('x', this.width - 15, this.center.y - 10);
  }

  private initVertexes(): void {
    if (this.validateInput() === false) {
      return;
    }

    this.triangleInit = [[this.Ax, this.Ay], [this.Bx, this.By], [this.Cx, this.Cy]];
    this.triangleToDraw = this.triangleToDrawFirstPosition = this.triangleInit;
    this.drawTriangle();
  }

  private initCanvas(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawAxes();
    this.drawGrid();
  }

  private drawTriangle(): void {
    this.initCanvas();

    this.ctx.lineWidth = 1;

    this.ctx.beginPath();
    const A = this.convertToCanvas(this.triangleToDraw[0]);
    const B = this.convertToCanvas(this.triangleToDraw[1]);
    const C = this.convertToCanvas(this.triangleToDraw[2]);

    this.ctx.moveTo(A.x, A.y);
    this.ctx.lineTo(B.x, B.y);
    this.ctx.lineTo(C.x, C.y);
    this.ctx.lineTo(A.x, A.y);
    this.ctx.stroke();
    this.ctx.fillText('A', A.x - 6, A.y - 6);
    this.ctx.fillText('B', B.x - 6, B.y - 6);
    this.ctx.fillText('C', C.x - 6, C.y - 6);
  }

  private scaleTriangle(): void {
    this.triangleToDraw = math.multiply(this.triangleInit, [[this.scale / 100, 0], [0, this.scale / 100]]);
    this.triangleToDrawFirstPosition = this.triangleToDraw;
    this.drawTriangle();
  }

  private reflectTriangle(): void {
    this.triangleToDraw = math.multiply(this.triangleToDraw, [[0, 1], [1, 0]]);
    this.triangleToDrawFirstPosition = this.triangleToDraw;
    this.drawTriangle();
  }

  private moveTriangle(): void {
    const adder = this.move / 100;
    this.triangleToDraw = math.add(this.triangleToDrawFirstPosition, [[adder, adder], [adder, adder], [adder, adder]]);
    this.drawTriangle();
  }

  private mainAction(e): void {
    if (this.validateInput() === false) {
      return;
    }

    if (e.key === 'w') {
      // document.getElementById('moveRange').value = +document.getElementById('moveRange').value + 20;
      this.moveTriangle();
      // let scale = document.getElementById('scaleRange').value;
      // document.getElementById('scaleRange').value = +document.getElementById('scaleRange').value + 5;
      // scale = document.getElementById('scaleRange').value;
      this.scaleTriangle();
    } else if (e.key === 's') {
      // document.getElementById('moveRange').value = document.getElementById('moveRange').value - 20;
      this.moveTriangle();
      // let scale = document.getElementById('scaleRange').value;
      // document.getElementById('scaleRange').value = document.getElementById('scaleRange').value - 5;
      // scale = document.getElementById('scaleRange').value;
      this.scaleTriangle();
    }
  }

  private convertToCanvas(point): { x: number, y: number } {
    return {x: this.width / 2 + this.gridStep * point[0], y: this.height / 2 - this.gridStep * point[1]};
  }

  private validateInput(): boolean {
    console.log(this.Bx);
    return !(this.Ax === null || this.Ay === null ||
      this.Bx === null || this.By === null ||
      this.Cx === null || this.Cy === null);
  }
}


