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
    var target = e.target || e.srcElement;
    startX = e.targetTouches[0].pageX;
    startY = e.targetTouches[0].pageY;
    if(target.id==='main'){timer = setTimeout(function(){showSearch();},800)}
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
Scrollbar.init(document.getElementsByClassName('scl_container')[0],{
    overscrollEffect:'bounce'
});
//书签整理:
var bookmarks = {};
var bookmarksOrigin = '';
window.document.addEventListener('dragover',function(e){
    e.preventDefault();
    // e.dataTransfer.dropEffect = 'copy';
},false);
window.document.addEventListener('drop',function(e){
    e.preventDefault();
    var reader = new FileReader();
    reader.readAsText(e.dataTransfer.files[0]);
    reader.onload = function(){
        bookmarksOrigin = this.result;
        dealStr(bookmarksOrigin);
        /*这里最后使用webworker*/
    }
},false);
function dealStr(str){
    var dlChace = '';
    var f1 = /<H1>([\s\S]+)<\/H1>\s*(<DL>[\s|\S]+<\/DL>)/i;
    var f1Result  = str.match(f1);
    // console.log(f1Result[2]);
    bookmarks.h1 = f1Result[1];
    findDl(bookmarks,f1Result[2]);
    console.log(bookmarks);
    function findDl(obj,str){
        str = trim(str);
        // document.getElementById('main').innerText = str;
        var reg = /<H3[^>]+>([^<]*)<\/H3>\s*(<DL>[\s|\S]+<\/DL>)/i;
        var result = str.match(reg);
        siblingsDl(result[2]);
        if(result){
            obj.dl ={
                h3:result[1],
                dt:getDt(str)
            };
            findDl(obj.dl,result[2]);
        }else{
            obj.dt = getDt(str);
        }
    }
    function getDlList(str){
        str = removeDl(str);
    }
    function hasDl(str){
        return /<DL>/.test(str);
    }
    function trim(str){
        return str.replace(/^\s*<DL>\s*<p>|<\/DL>$/ig,'');//去掉前尾dl标签
    }
    function removeDl(str){
        return str.replace(/<DL>[\s|\S]+<\/DL>/ig,'');//去除dl只剩下dt
    }
    function getDt(str){
        str = removeDl(str);
        var dtList = [];
        var dtListStr = str.match(/<DT><A\s*HREF="([^"]+)"[^>]+>([^<]*)<\/A>/ig);
        for(var i=0;i<dtListStr.length;i++){
            var result = dtListStr[i].match(/<DT><A\s*HREF="([^"]+)"[^>]+>([^<]*)<\/A>/i);
            dtList[dtList.length] = {
                href:result[1],
                name:result[2]
            };
        }
        return dtList;
    }
    function siblingsDl(str){
        str = trim(str);
        var reg = /<DL>[\s|\S]+?(\s*)<\/DL>/ig;
        var result = str.match(reg);
    }
}
