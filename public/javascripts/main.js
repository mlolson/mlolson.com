$(function(){
	(new Headroom(document.getElementById('main-header'),{offset:50})).init();

    var $container = $('#tiles-container');

    $container.imagesLoaded(function() {
        $container.masonry({
            columnWidth: 280,
            itemSelector: '.tile-item'
        });
    });

});