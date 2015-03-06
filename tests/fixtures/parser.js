{
	"extractDefinitions": [{
		"input": "/** sprite: some-sprite0; sprite-image: url('/res/dir/image0.png'); */\r\n /** sprite: some-sprite1; sprite-image: url(\"/res/dir/image1.png\"); */",
		"expected": {
			"some-sprite0": {
				"files": [],
				"images": {},
				"sprite": "some-sprite0",
				"spriteImage": "/res/dir/image0.png"
			},
			"some-sprite1": {
				"files": [],
				"images": {},
				"sprite": "some-sprite1",
				"spriteImage": "/res/dir/image1.png"
			}  
		}
	}, {
		"input": "/** sprite:some-sprite2;sprite-image:url(\"/res/dir/image2.png\");*/",
		"expected": {
			"some-sprite2": {
				"files": [],
				"images": {},
				"sprite": "some-sprite2",
				"spriteImage": "/res/dir/image2.png"
			} 
		}
	}, {
		"input": "/** sprite:some-sprite3;sprite-image:url(/res/dir/image3.png);*/",
		"expected": {
			"some-sprite3": {
				"files": [],
				"images": {},
				"sprite": "some-sprite3",
				"spriteImage": "/res/dir/image3.png"
			} 
		}
	}, {
		"input": "/** sprite: some-sprite4@2x; sprite-scale: 2; sprite-image: url('/res/dir/image4@2x.png'); */",
		"expected": {
			"some-sprite4@2x": {
				"files": [],
				"images": {},
				"sprite": "some-sprite4@2x",
				"spriteImage": "/res/dir/image4@2x.png",
				"spriteScale": "2"
			} 
		}
	}, {
		"input": "/** sprite:some-sprite5@2x;*/",
		"expected": {
			"some-sprite5@2x": {
				"files": [],
				"images": {},
				"sprite": "some-sprite5@2x"
			} 
		}
	}, {
		"input": "/** sprite      :      some-sprite6@2x ;   sprite-image    :     url('/res/dir/image6@2x.png') ;         */",
		"expected": {
			"some-sprite6@2x": {
				"files": [],
				"images": {},
				"sprite": "some-sprite6@2x",
				"spriteImage": "/res/dir/image6@2x.png"
			} 
		}
	}, {
		"input": "/**   sprite   :   some-sprite7@2x   ;   sprite-image   :   url(   '/res/dir/image7@2x.png'   )   ;   */",
		"expected": {
			"some-sprite7@2x": {
				"files": [],
				"images": {},
				"sprite": "some-sprite7@2x",
				"spriteImage": "/res/dir/image7@2x.png"
			} 
		}
	}, {
		"input": "/** sprite: some-sprite8@2x; sprite-image: url('/res/dir/image8@2x.png'); sprite-algorithm: binary-tree; sprite-alignment: center; */",
		"expected": {
			"some-sprite8@2x": {
				"files": [],
				"images": {},
				"sprite": "some-sprite8@2x",
				"spriteImage": "/res/dir/image8@2x.png",
				"spriteAlgorithm": "binary-tree",
				"spriteAlignment": "center"
			}
		}
	}],
	"extractReferenses": [{
		"input": {
			"path": "path/to/fake.css",
			"data": "/** sprite-ref: someSprite9@2x */\r\n/** sprite-ref: someSprite10@2x */"
		},
		"expected": {}
	}, {
		"input": {
			"path": "path/to/fake.css",
			"data": "background-image: url(\"/some/fake/path.png\"); /** sprite-ref: someSprite11@2x */\r\n   background-image: url(/some/other/stub.png); /** sprite-ref: someSprite11@2x */"
		},
		"defs": {
			"someSprite11@2x": {
				"files": [],
				"images": {},
				"sprite": "some-sprite11@2x",
				"spriteImage": "/res/dir/image11@2x.png",
				"spriteScale": "2"
			}
		},
		"expected": {
			"someSprite11@2x": {
				"files": [ "path/to/fake.css", "path/to/fake.css" ],
				"images": { "/some/fake/path.png": [], "/some/other/stub.png": [] },
				"sprite": "some-sprite11@2x",
				"spriteImage": "/res/dir/image11@2x.png",
				"spriteScale": "2"
			}
		}
	}],
	"extractURL": [{
		"input": "background-image: url('fake/path/to/image.png');",
		"expected": "fake/path/to/image.png",
		"isUrl": true
	}, {
		"input": "background-image: url( ' fake/path/to/image2.png ' ); /* some comment */",
		"expected": "fake/path/to/image2.png",
		"isUrl": true
	}, {
		"input": "background-image: url(fake/path/to/image3.png);",
		"expected": "fake/path/to/image3.png",
		"isUrl": true
	}, {
		"input": "background-image: url(   fake/path/to/image4.png );",
		"expected": "fake/path/to/image4.png",
		"isUrl": true
	}, {
		"input": "background-image: url(  \"fake/path/to/image5.png\"  );",
		"expected": "fake/path/to/image5.png",
		"isUrl": true
	}]
}