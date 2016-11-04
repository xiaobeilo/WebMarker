/**
 * Created by cMing on 2016/11/3.
 */
var nav = document.getElementById('nav');
var search = document.getElementById('search');
var navWidth = parseFloat(getComputedStyle(nav).width);
var startX = 0,startY=0;
window.document.addEventListener('touchstart',function(e){
    startX = e.targetTouches[0].pageX;
    startY = e.targetTouches[0].pageY;
});
var originX = getOffset(nav);
window.document.addEventListener('touchmove',function(e){
    var sx = startX;
    var ex = e.targetTouches[0].pageX;
    nav.style.transform = 'matrix(1,0,0,1,'+ (originX-(sx-ex)) +',0)';
});
window.document.addEventListener('touchend',function(e){
    if(getOffset(nav) > -100){
        nav.style.transform = 'matrix(1,0,0,1,0,0)';
        nav.className = 'sliderEnd';
        nav.addEventListener('transitionend',function(){
            nav.className='';
            originX = getOffset(nav);
        })
    }else{
        nav.style.transform = 'matrix(1,0,0,1,'+-Math.ceil(navWidth)+',0)';
        nav.className = 'sliderEnd';
        nav.addEventListener('transitionend',function(){
            nav.className='';
            originX = getOffset(nav);
        })
    }
});
window.document.addEventListener('keyup',function(e){
    var input = search.getElementsByTagName('input')[0];
    if(e.code ==='Slash'){
        search.style.transform = 'translateY(0)';
        search.className = 'sliderEnd';
        input.focus();
        nav.addEventListener('transitionend',function(){
            nav.className='';
        })
    }
    if(e.code ==='Escape'){
        search.style.transform = 'translateY(-100%)';
        search.className = 'sliderEnd';
        input.value = '';input.blur();
        nav.addEventListener('transitionend',function(){
            nav.className='';
        })
    }
});
//vue:
var ipt = new Vue({
    el:'#search input',
    data:{
        msg:'test'
    },
    create:function(){
      console.log(1)
    },
    methods:{
        test:function(){
            alert('succ!');
        }
    }

});


function getOffset(ele){
    var reg = /matrix\(\s?1,\s?0,\s?0,\s?1,([^,]+),\s?0\)/;
    return parseFloat(getComputedStyle(nav).transform.match(reg)[1]);
}
function transform(ele,prop){
    var arr = ['transform','WebKitTransform','MozTransform','OTransform','MsTransform'];
    for(var i=0;i<4;i++){
        ele.style[arr[i]] = prop;
    }
}