$(function(){

    var proteins = {
        '1NN0': 'Human Oxyhemoglobin',
        '4LDD': 'Ebola Glycoprotein',
        '7HVP': 'HIV Protease'
    };

    var selectedProtein = '1NN0';
    var camera, scene, renderer, controls, $container, $progressBar = $('.progress-bar'), rotate = true;

    $('#protein-viewer-modal').on('shown.bs.modal', function (e) {
        load(selectedProtein);
        animate();
    }.bind(this));

    $('a.protein-select').click(function(e) {
        e.preventDefault();
        selectedProtein = $(e.target).data('val');
        $('.protein-select-label').html(proteins[selectedProtein]);
        load(selectedProtein);
        animate();
    }.bind(this));

    $('.rotate').click(function() {
        rotate = !rotate;
    });

    $('.zoom-in').click(function() {
        controls.incrementZoomEnd(-0.05);
    });

    $('.zoom-out').click(function() {
        controls.incrementZoomEnd(0.05);
    });

    function setProgressBar(percent) {
        $progressBar.css('width', percent + '%').attr('aria-valuenow', ''+percent);
    }

    function load(protein) {

        rotate = true;
        $container = $('#protein-container');
        $container.html('');
        $container.on('mousedown', function() { rotate = false; });

        camera = new THREE.PerspectiveCamera(60, $container.innerWidth() / $container.innerHeight(), 1, 2000 );
        camera.position.z = 80;
        camera.position.x = 20;

        if(protein === '4LDD') {
            camera.position.z = 230;
        }

        scene = new THREE.Scene();

        var ambient = new THREE.AmbientLight( 0x101030 );
        scene.add( ambient );

        var directionalLight = new THREE.DirectionalLight( 0x114433 );
        directionalLight.position.set( 0, 1, 1 );
        scene.add( directionalLight );

        controls = new THREE.TrackballControls( camera, $container.get(0) );
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys = [ 65, 83, 68 ];
        controls.addEventListener( 'change', render );

        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );
        };
        var loader = new THREE.ColladaLoader(manager);
        loader.options.convertUpAxis = true;

        setProgressBar(15);

        loader.load( '/assets/data/'+protein+'.dae', function ( collada ) {
            var dae = collada.scene;
            dae.position.set(0,0,0);
            dae.scale.set(1,1,1);

            $container.html( renderer.domElement );
            scene.add(dae);
            setProgressBar(100);
            render();
        }, function(progress) {
            setProgressBar(Math.min(90,Math.floor(100*progress.loaded/parseInt(progress.total, 10))));
        });

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( $container.innerWidth(), $container.innerHeight() );

    }

    function init() {



    }

    function animate() {
        requestAnimationFrame( animate );

        if(rotate) {
            controls.incrementRotationEnd(0.01,0,0);
        }
        controls.update();
    }

    function render() {
        renderer.render( scene, camera );
    }

});