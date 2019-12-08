import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public previews = [
    {
      title: 'Fractals',
      ref: '/fractal',
      imageUrl: '../../assets/fractal.png',
      gifUrl: '../../assets/fractal.gif',
      state: 'closed',
      content: 'Here you have a possibility to explore algebraic fractals\n' +
        'and generate different pictures based on them. Moreover you can choose different' +
        'formulas and colors.',
      mainContent: 'In mathematics, more specifically in fractal geometry, a fractal dimension is a ratio providing a statistical index of' +
        ' complexity comparing how detail in a pattern (strictly speaking, a fractal pattern) changes with the scale at which it is measured.' +
        ' It has also been characterized as a measure of the space-filling capacity of a pattern that tells how a fractal scales differently' +
        ' from the space it is embedded in; a fractal dimension does not have to be an integer.\n\n The essential idea of "fractured"' +
        ' dimensions has a long history in mathematics, but the term itself was brought to the fore by Benoit Mandelbrot based on his 1967 ' +
        'paper on self-similarity in which he discussed fractional dimensions. In that paper, Mandelbrot cited previous work by Lewis' +
        ' Fry Richardson describing the counter-intuitive notion that a coastline\'s measured length changes with the length of the' +
        ' measuring stick used. In terms of that notion, the fractal dimension of a coastline quantifies how the number' +
        ' of scaled measuring sticks required to measure the coastline changes with the scale applied to the stick. There are several' +
        ' formal mathematical definitions of fractal dimension that build on this basic concept of change in detail with change in scale.\n' +
        '\nUltimately, the term fractal dimension became the phrase with which Mandelbrot himself became most comfortable with respect to ' +
        'encapsulating the meaning of the word fractal, a term he created.'
    },
    {
      title: 'Color Models',
      ref: '/color-models',
      imageUrl: '../../assets/color-models.jpg',
      gifUrl: '../../assets/color-models.gif',
      state: 'closed',
      content: 'You can choose this module if you want to experiment with conversions\n' +
        'between RGB and HSV color models. Also you can reddish your photos and check the difference ' +
        'between initial and redded images.',
      mainContent: 'A color model is an abstract mathematical model describing the way colors can be represented as tuples of numbers,' +
        ' typically as three or four values or color components. When this model is associated with a precise description of how the' +
        ' components are to be interpreted (viewing conditions, etc.), the resulting set of colors is called "color space." This section ' +
        'describes ways in which human color vision can be modeled.\n Media that transmit light (such as television) use additive color' +
        ' mixing with primary colors of red, green, and blue, each of which stimulates one of the three types of the eye\'s color ' +
        'receptors with as little stimulation as possible of the other two. This is called "RGB" color space. Mixtures of light ' +
        'of these primary colors cover a large part of the human color space and thus produce a large part of human color experiences.' +
        ' This is why color television sets or color computer monitors need only produce mixtures of red, green and blue light. See' +
        ' Additive color.\n\n Other primary colors could in principle be used, but with red, green and blue the largest portion of' +
        ' the human color space can be captured. Unfortunately there is no exact consensus as to what loci in the chromaticity' +
        ' diagram the red, green, and blue colors should have, so the same RGB values can give rise to slightly different colors on different screens.'
    },
    {
      title: 'Shape Motion',
      imageUrl: '../../assets/shape-motion.jpg',
      gifUrl: 'https://media.giphy.com/media/Rx6RFpTVqjqH6/source.gif',
      state: 'closed',
      content: 'Want to see how your triangle can be easily moved,\n' +
        'scaled and mirrored at the same time? Click here!',
      mainContent: 'In geometry, an affine transformation, affine map[1] or an affinity (from the Latin, affinis, "connected with") is a ' +
        'function between affine spaces which preserves points, straight lines and planes. Also, sets of parallel lines remain parallel ' +
        'after an affine transformation. An affine transformation does not necessarily preserve angles between lines or distances between ' +
        'points, though it does preserve ratios of distances between points lying on a straight line.\n\n Examples of affine ' +
        'transformations include translation, scaling, homothety, similarity transformation, reflection, rotation, shear mapping,' +
        ' and compositions of them in any combination and sequence.\n\n If {\\displaystyle X}X and {\\displaystyle Y}Y are affine spaces,' +
        ' then every affine transformation {\\displaystyle f\\colon X\\to Y}f\\colon X\\to Y is of the form ' +
        '{\\displaystyle x\\mapsto Mx+b}x\\mapsto Mx+b, where {\\displaystyle M}M is a linear transformation on the ' +
        'space {\\displaystyle X}X, {\\displaystyle x}x is a vector in {\\displaystyle X}X, and {\\displaystyle b}b is a' +
        ' vector in {\\displaystyle Y}Y. Unlike a purely linear transformation, an affine map need not preserve the zero point in a' +
        ' linear space. Thus, every linear transformation is affine, but not every affine transformation is linear.\n\n All Euclidean ' +
        'spaces are affine, but there are affine spaces that are non-Euclidean. In affine coordinates, which include Cartesian ' +
        'coordinates in Euclidean spaces, each output coordinate of an affine map is a linear function (in the sense of calculus) ' +
        'of all input coordinates. Another way to deal with affine transformations systematically is to select a point as the origin;' +
        ' then, any affine transformation is equivalent to a linear transformation (of position vectors) followed by a translation.'
    },
  ];

  constructor() {
  }

  ngOnInit() {
  }

  closeOther(preview: any) {
    if (preview.state === 'closed') {
      preview.state = 'opened';
      this.previews.forEach(i => {
        if (i !== preview) {
          i.state = 'hidden';
        }
      });
    } else {
      preview.state = 'closed';

      setTimeout(() => this.previews.forEach(i => i.state = 'closed'), 300);
    }
  }

}
