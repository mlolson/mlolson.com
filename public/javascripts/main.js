$(function(){
	(new Headroom(document.getElementById('main-header'),{offset:50})).init();

    var $container = $('#tiles-container');

    $container.imagesLoaded(function() {
        $container.masonry({
            itemSelector: '.tile-item'
        });


        $(window).resize(function () {
            $container.masonry('reloadItems');
        }.bind(this));
    });



});