$(function(){

    //if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var container;

    var camera, controls, scene, renderer, particles;

    var cross;

    init();
    animate();
    collide();

    function Particle() {
        this.pos = {x:0,y:0,z:0};
        this.vel = {x:0,y:0,z:0};
        this.acc = {x:0,y:0,z:0};
        this.charge = 0;
    }

    function init() {

        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 500;

        controls = new THREE.TrackballControls( camera );

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.keys = [ 65, 83, 68 ];

        controls.addEventListener( 'change', render );

        // world

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

        //Axes

        var xmaterial = new THREE.LineBasicMaterial({
            color: 0xff0000,
            linewidth:2
        });

        var ymaterial = new THREE.LineBasicMaterial({
            color: 0x0000ff,
            linewidth:2
        });

        function addAxes() {

            for(var i=0; i<3; i++)
            {
                var color, geometry = new THREE.Geometry();

                if(i === 0) {
                    color = 0x00ff00;
                    geometry.vertices.push(new THREE.Vector3(-1000, 0, 0));
                    geometry.vertices.push(new THREE.Vector3(1000, 0, 0));
                } else if(i === 1) {
                    color = 0xff0000;
                    geometry.vertices.push(new THREE.Vector3(0, -1000, 0));
                    geometry.vertices.push(new THREE.Vector3(0, 1000, 0));
                } else {
                    color = 0x0000ff;
                    geometry.vertices.push(new THREE.Vector3(0, 0, -1000));
                    geometry.vertices.push(new THREE.Vector3(0, 0, 1000));
                }

                var material = new THREE.LineBasicMaterial({
                    color: color,
                    linewidth: 2
                });

                var line = new THREE.Line(geometry, material);
                scene.add(line);
            }
        };

        addAxes();


        for(var i=0; i<300;i++){
            particles.push(new Particle());
        }

        // lights

        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( -1, -1, -1 );
        scene.add( light );

        light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );


        // renderer

        renderer = new THREE.WebGLRenderer( { antialias: false } );
        renderer.setClearColor( scene.fog.color, 1 );
        renderer.setSize( window.innerWidth, window.innerHeight );

        container = document.getElementById( 'graph-container' );
        container.appendChild( renderer.domElement );

        //

        window.addEventListener( 'resize', onWindowResize, false );

        //

        render();

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        controls.handleResize();

        render();

    }

    function animate() {
        requestAnimationFrame( animate );
        controls.update();
    }

    function render() {
        renderer.render( scene, camera );
    }

    function collide() {


    }


});