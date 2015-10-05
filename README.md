> CSS sprites generator v 0.1.5 (beta)

Tiny css sprites generator based on inline sprites definition and references. Images processing is based on [spritesmith](https://github.com/Ensighten/spritesmith).

## Getting Started
This plugin requires Grunt `>=0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install css-sprites-generator --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('css-sprites-generator');
```

**Issues with the output should be reported on the clean-css [issue tracker](https://github.com/cheshirsky/css-sprites/issues).**


## CSSSprites task
> Run this task with the `grunt cssSprites` command.

### Options

#### styleSrc

- Type: `string`
- Description: it is used to get css files for getting sprite definitions and references from css-files.
- Default: `'<your-project-dir>/css'`

#### stylesDest

- Type: `string`
- Description: it is used to put updated css-files.
- Default: `'<your-project-dir>/sprites-css'`

#### imagesSrc

- Type: `string`
- Description: it is used to get images.
- Default: `'<your-project-dir>/img'`

#### imagesDest

- Type: `string`
- Description: it is used like a base path for generated sprite images.
- Default: `'<your-project-dir>/sprites'`

#### algorithm

- Type: `string`
- Description: it defines sprite images layout mode.
- Choices: `left-right`, `top-down`, `diagonal`, `alt-diagonal`, `binary-tree` 
- Default: `'top-down'`


There are several options also inherited from spritesmith graphics engine wrapper. Please visit [this link](https://github.com/Ensighten/spritesmith) to get more information.


### Usage

#### Grunt-task example.

```js
cssSprites: {
    files: ['css/**/*.css'],
    options: {
        imagesSrc: './images/',
        imagesDest: './build/images/sprites',
        stylesSrc: './build/css',
        stylesDest: 'build/css-sprites'
    }
}
```

The sprite generator might be used if you have to define several complicated sprites in your project. E.g. you have two sprites for your main page (both non-scaled and high resolution sprite for retina devices) and the same ones for others.

The usage scenario is divided into two parts: sprites definition and sprite referring. Also you can use some inline options for each sprite. They are described below the examples of definition and referring.

#### Sprites definition and referring.

To define sprites you should add the corresponding comment line in your css-files. Feel free to add definition in any of processed css files. You dont have to add it into each file, in which you referred to it. Please take into account that in case of several sprite definitions with the same name the last one is going to be used.

Here is the example.

Input style files content:

```css

/** sprite: main-sprt; sprite-image: url('/img/sprites/main-sprt.png'); */
/** sprite: main-sprt@2x; sprite-scale: 2; sprite-image: url('/img/sprites/main-sprt@2x.png'); */

.my-main-page-icon {
	background-image: url('path/to/image.png'); /** sprite-ref: main-sprt; */
}

...

@media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 160dpi) {
	.my-main-page-icon {
		background-image: url('path/to/image@2x.png'); /** sprite-ref: main-sprt@2x; */
	}
}
...

```

Output style files content:

```css

.my-main-page-icon {
	background-image: url('/img/sprites/main-sprt.png');
	background-position: -0px -200px;
	background-size: 200px 1060px;
}

...

@media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 160dpi) {
	.my-main-page-icon {
		background-image: url('/img/sprites/main-sprt@2x.png');
		background-position: -0px -200px;
		background-size: 200px 1060px;
	}
}
...

```

#### Inline options.

As it was mentioned above, there are a couple of inline options for sprite definition and referring. Here they are:

##### sprite-scale

- Type: `number`
- Used in: `sprite definition`
- Description: it defines sprite images scale, which is used to calculate background image position and size in sprite layout. 
- Default: `1`
- Example: `"/** sprite: some-sprite@3x; sprite-scale: 3; sprite-image: url('/res/dir/some-sprite@3x.png'); */"`

##### image name hashing

- Used in: `sprite definition`
- Description: it is usable to uncache some images. If `{md5}` inliner is going to be replaced by the image path hash.
- Example: `"/** sprite: some-sprite@3x; sprite-scale: 3; sprite-image: url('/res/dir/some-sprite{md5}@3x.png'); */"`

##### sprite-algorithm

- Type: `string`
- Used in: `sprite definition`
- Description: this option allows to override sprite layout mode for current image.
- Default: `'top-down' | defined in options one`
- Choices: `left-right`, `top-down`, `diagonal`, `alt-diagonal`, `binary-tree`
- Example: `"/** sprite: some-sprite@3x; sprite-scale: 3; sprite-image: url('/res/dir/some-sprite@3x.png'); sprite-algorithm: binary-tree;*/"`


##### sprite-alignment

- Type: `string`
- Used in: `sprite definition / referring`
- Description: this option defines the image alignment with its wrapper. Alignment option works only for vertical or horisontal sprite layouts. Due to that, for the `top-down` layout mode it affects x-axis, and in case of the 'left-right' mode it acts for y-axis.
- Default: `none`
- Choices: `left`, `center`, `right`
- Example: `"/** sprite: some-sprite@3x; sprite-scale: 3; sprite-image: url('/res/dir/some-sprite@3x.png'); sprite-alignment: center; */"`

