/**
 * Created by cMing on 2016/11/3.
 */
var nav = document.getElementById('nav');
var search = document.getElementById('search');
var navWidth = parseFloat(getComputedStyle(nav).width);
var startX = 0,startY=0;
var timer = null;
var mask = document.getElementById('mask');
window.document.addEventListener('touchstart',function(e){
    startX = e.targetTouches[0].pageX;
    startY = e.targetTouches[0].pageY;
    timer = setTimeout(function(){showSearch();},800)
});
var originX = getOffset(nav);
window.document.addEventListener('touchmove',function(e){
   if(getComputedStyle(mask).zIndex<0){
       var sx = startX;
       var ex = e.targetTouches[0].pageX;
       nav.style.transform = 'matrix(1,0,0,1,'+ (originX-(sx-ex)) +',0)';
   }
},false);
window.document.addEventListener('touchend',function(e){
    timer && clearTimeout(timer);
    nav.className = 'sliderEnd';
    if(getOffset(nav) > -100){
        nav.style.transform = 'matrix(1,0,0,1,0,0)';
    }else{
        nav.style.transform = 'matrix(1,0,0,1,'+-Math.ceil(navWidth)+',0)';
    }
    nav.addEventListener('transitionend',function(){
        nav.className='';
        originX = getOffset(nav);
    });
},false);
window.document.addEventListener('keyup',function(e){
    if(e.code ==='Slash'){
        showSearch();
    }
    if(e.code ==='Escape' && getComputedStyle(mask).zIndex>0){
        hideSearch();
    }
},false);
mask.addEventListener('click',function(e){
    var target  = e.target || e.srcElement;
    if(target.id==='mask'){hideSearch()}
},false);
function showSearch(){
    var input = search.getElementsByTagName('input')[0];
    mask.style.zIndex = 1000;
    Velocity(mask,'finish');
    Velocity(mask,{
        backgroundColor:'#000',
        backgroundColorAlpha:0.3
    },300);
    search.style.transform = 'translateY(0)';
    input.focus();
}
function hideSearch(){
    var input = search.getElementsByTagName('input')[0];
    search.style.transform = 'translateY(-100%)';
    Velocity(mask,'finish');
    Velocity(mask,'reverse',function(){
        mask.style.zIndex = -1;
        input.value = '';input.blur();
    });
}
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
/*滚动条*/
var scroll = document.getElementsByClassName('scroll');
for(var i=0;i<scroll.length;i++){
    !function(){
        var offset = 0;
        var parentEle = scroll[i].parentNode;
        var container = parentEle.getElementsByClassName('container')[0]
        parentEle.addEventListener('mousewheel',function(e){
            console.log(getComputedStyle(this).height);
            /*计算滚动范围*/
            offset += e.deltaY;
            container.style.transform = 'translateY('+-offset+'px)';
            Velocity(container,'finish');
            Velocity(container,{
                translateY:-offset+'px'
            },300);

        })
    }();
}
