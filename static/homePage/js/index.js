
//存储方法
class IndexObj {
    //点击菜单栏的时候滚动

    checkLink(){
        let $liList = $("#navbar").find('li')
        $liList.on({
            click(){
                //清空
                $liList.removeClass('active');
                //获取
                $(this).addClass('active');
                let $targer = $(`[data-name="${$(this).data('target')}"]`);
                $("html, body").animate({
                scrollTop: $targer.offset().top }, {duration: 500,easing: "swing"});
            }
        })
    };
    //滚动条的时候 切换顶部
    linkTargerVisible(beforeScrollTop, afterScrollTop){
        //nav 菜单栏 的 tagrert对象
        let $targer = $('[data-name]');
        let visibleObj = [];
        $targer.each(function(){
            if($.mlazyload({lazyDom: $(this)})) {
                visibleObj.push($(this));
            }
        })
        let $liList = $("#navbar").find('li');
        $liList.removeClass('active');
        let activeObj;
        if(beforeScrollTop < afterScrollTop) {  //向下
            //获取当前在视图的最后一个对象
            activeObj = visibleObj[visibleObj.length - 1].data('name');
        } else { // 向上
            // 获取当前在视图的第一个对象
            activeObj = visibleObj[0].data('name');
        }
        console.log(activeObj);
        $(`[data-target='${activeObj}']`).addClass('active');
    };
    //简介进度条
    briefAnimation(){ 
        //判断节点是否在容器中
        var $lazyDom = $('.skill-bars').eq(0);
        //如果存在那么就添加百分比
        if($.mlazyload({lazyDom:$lazyDom})) {
            $('[data-percent]').each(function(){
                $(this).css({
                    'width': `${$(this).data('percent')}%`,
                    'opacity': 1
                })
                //标签赋值
                $(this).parents('li').find('.bar-text').html(`${$(this).data('percent')}%`) 
            })
        }
    };
    //滚动条位置
    mousePosition(ev) {   
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
    };
}

$(function () {
    let indexObj = new IndexObj();
    let bannerX = null;
    let bannerY = null;
    let beforeScrollTop = 0; //滚动前滚动条位置
    let afterScrollTop = 0; //滚动后滚动条位置
    let scrollFlage;
    //背景图
    let $layer = $('.banner-image-layer');
    //文字
    let $caption = $('.banner-caption');
    //简介动画
    indexObj.checkLink();
    indexObj.briefAnimation();
    // 滚动
    $(document)
        .on({
            scroll() {
                afterScrollTop = $(document).scrollTop();
                if (afterScrollTop > 50) {
                    $('.head-nav')
                        .addClass('small');
                } else {
                   $('.head-nav')
                    .removeClass('small'); 
                }

                //不重复执行
                if(scrollFlage){ 
                    clearTimeout(scrollFlage)
                }
                scrollFlage = setTimeout(initScroll, 100);
                
            }
        })
    //banner图片
    $('.banner')
        .on({
            mousemove(e) {
                ev = e || window.event; 
                //获取鼠标位置
                var mousePos = indexObj.mousePosition(ev);   
                if (bannerX == null && bannerY == null) {
                    bannerX = mousePos.x;
                    bannerY = mousePos.y;
                }
                //背景图
                $layer.css({
                    'webkitTransform': `translate3d(${(mousePos.x - bannerX)/50}px, ${(mousePos.y - bannerY)/50}px, 0px)`,
                    'transform': `translate3d(${(mousePos.x - bannerX)/50}px, ${(mousePos.y - bannerY)/50}px, 0px)`
                })
                //文字
                $caption.css({
                    'webkitTransform': `translate3d(${(mousePos.x - bannerX)/200}px, ${(mousePos.y - bannerY)/200}px, 5pxpx)`,
                    'transform': `translate3d(${(mousePos.x - bannerX)/200}px, ${(mousePos.y - bannerY)/200}px, 5px)`
                })
            }
        });
    //页面滚动条事件
    function initScroll(){
        afterScrollTop = $(document).scrollTop();
        //简介动画
        indexObj.briefAnimation();
        //菜单栏选择
        indexObj.linkTargerVisible(beforeScrollTop, afterScrollTop);
        //记录当前的滚动位置
        beforeScrollTop = afterScrollTop;
    }
});
