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
	}]
}