
//加载footer内容
$('#footerWrap').load('../tpl/footer.tpl');
//存储方法
class IndexObj {
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
}
$(function () {
	 let indexObj = new IndexObj();
	  indexObj.checkLink();
});
