	//var paramName=getUrlParam();
	
	var path= "";
	var pathName = "" ;
	// 容器 控制器
	var container,	controls;
	// 镜头 场景 渲染
	var camera, scene, renderer;
	
	var i=0;
	
	
	function loadModel(value){
		// 加载mtl
		var mtlLoader = new THREE.MTLLoader()
			.setPath( path )
			.load( pathName + '.mtl', function ( materials ) {
				materials.preload();
				// 加载obj
				new THREE.OBJLoader()
					.setMaterials( materials )
					.setPath( path )
					.load( pathName + '.obj', function ( object ) {
						// 设置旋转中心点
						object.children[0].geometry.computeBoundingBox();
						object.children[0].geometry.center()
						object.position.y = value;
						// 将模型加入到场景
						scene.add( object );

					}, onProgress, onError );
			});
	}
	
	function loadBin(){
			var binLoader = new THREE.BinaryLoader();
			binLoader.load(path+"/"+pathName+".js", createScene, onProgress, onError );

			var wrapp=THREE.RepeatWrapping;
			function createScene( geometry, materials ) {
				for(var i=0;i<materials.length;i++){
					var map=materials[i].map;
					if(map!=null){
						materials[i].map.wrapS=wrapp;
						materials[i].map.wrapT=wrapp;
						materials[i].side=THREE.DoubleSide;
					}
				}
				var mesh = new THREE.Mesh( geometry, new THREE.MultiMaterial( materials ) );
				mesh.geometry.center();
				scene.add( mesh );
			}
				
	}
	
	// 这是一个进度条函数进度条函数
	function play(a){
		if(a < 100 ){
			document.getElementById("progress").style.display = "block";
		}else{
			var parent=document.getElementById("progress");
			var child=document.getElementById("loadings");
			if(child!=""&&child!=null){
					//parent.removeChild(child);
			}
		}
	}
	
	// 时刻渲染
	function animate() {
		var clock = new THREE.Clock();
		let delta = clock.getDelta();
		controls.update(delta);
		//controls.update();
		if(i%2!=1){
			renderer.render( scene, camera );
		}
		if(i==40){
			var parent=document.getElementById("progress");
			var child=document.getElementById("loadings");
			if(child!=""&&child!=null){
					parent.removeChild(child);
			}
		}
	
		requestAnimationFrame( animate );
		i++;
	}
	
	//进度通知
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			//console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
			play(Math.round( percentComplete, 2 ))
		}
	};
	
	//报错通知
	var onError = function ( xhr ) { alert("解析失败");};

	// 监听窗口自适应
	function resize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	
	
	document.onmousedown = function(){
		if(event.button == 3){
			return false;
		}
	}