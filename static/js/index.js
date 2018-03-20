$(function () {
    let x = null;
    let y = null;
    let $layer = $('.banner-image-layer');
    $(document)
        .on({
            scroll() {
                if ($(document)
                    .scrollTop() > 50) {
                    $('.head-nav')
                        .addClass('on');
                    return;
                }
                $('.head-nav')
                    .removeClass('on');
            },
            mousemove(e) {
                ev = e || window.event; 
                var mousePos = mousePosition(ev);   
                if(x == null && y == null) {
                    x = mousePos.x;
                    y = mousePos.y; 
                }
                $layer.css({
                    'webkitTransform':`translate3d(${(mousePos.x - x)/35}px, ${(mousePos.y - y)/35}px, 0px)`,
                    transform: `translate3d(${(mousePos.x - x)/35}px, ${(mousePos.y - y)/35}px, 0px)`
                })
            }
        })

    function mousePosition(ev) {   
        if (ev.pageX || ev.pageY) {     
            return {
                x: ev.pageX,
                y: ev.pageY
            };   
        }   
        return {     
            x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                 y: ev.clientY + document.body.scrollTop - document.body.clientTop   
        };
    }
});