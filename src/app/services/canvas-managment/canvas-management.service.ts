import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanvasManagementService {

  constructor() {
  }

  public getCoords(canvas: HTMLCanvasElement, eventX: number, eventY: number) {
    const {width, height, offsetWidth, offsetHeight} = canvas;
    const coord = canvas.getBoundingClientRect() as any;
    const x = Math.round((eventX - coord.x) / offsetWidth * width);
    const y = Math.round((eventY - coord.y) / offsetHeight * height);

    return {x, y};
  }
}
