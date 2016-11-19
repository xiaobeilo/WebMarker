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
var bookmarks = [];
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
        var ul = new Vue({
            el:'#dl',
            data:{
                bookmarks:bookmarks[0].dl
            }
        })
    }
},false);
function dealStr(str){
    str  = dealSim(str);
    if(checkBrowser(str)==='mozilla'){
        str = cutMozilla(str);
    }
    divDL(bookmarks,cutHeadFoot(str));
    function divDL(arr,str){
        var obj = {};
        obj.h3 = (str.match(/^<H3>([\s|\S]+?)<\/H3>/))[0].slice(4,-5);
        str = cutHeadFoot(str);
        var result = findAllG(str);
        if(result.length>0){
            obj.dl = [];
            for(var i=0;i<result.length;i++){
                divDL(obj.dl,result[i]);
            }
            str = removeH3Dl(str);
        }
        obj.dt = getDt(str);
        arr.push(obj);
    }
    function findAllG(str){
        var arr = [];
        var len= str.length;
        var cache = '';
        while(cache = digDLFoot(str)){
            arr.push(cache);
            str = str.slice(cache.length);
        }
        function digDLFoot(str){
            var start = str.indexOf('<H3>');
            var end = str.indexOf('</DL>',start);
            var cache = str.slice(start,end+5);
            var result = cache.match(/<DL>/g);
            if(result){
                while(cache.match(/<DL>/g).length !== cache.match(/<\/DL>/g).length){
                    end = str.indexOf('</DL>',end+5);
                    cache = str.slice(start,end+5);
                }
                return cache;
            }else {
                return false;
            }
        }
        return arr;
    }
    function cutHeadFoot(str){
        str = str.replace(/^[\S|\s]*?<DL>/,'');
        str = str.slice(0,str.lastIndexOf('<\/DL>'));
        return str;
    }
    function removeH3Dl(str){
        return str.replace(/<H3>[^<]*<\/H3><DL>[\s|\S]+<\/DL>/ig,'');//删除h3和dl的兄弟元素
    }
    function getDt(str){
        var dtList = [];
        var dtListStr = str.match(/<A\sHREF="([^"]+)">([^<]*)<\/A>/g);
        if(dtListStr){
            for(var i=0;i<dtListStr.length;i++){
                var result = dtListStr[i].match(/<A\sHREF="([^"]+)">([^<]*)<\/A>/);
                dtList[dtList.length] = {
                    href:result[1],
                    name:result[2]
                };
            }
        }
        return dtList;

    }
    function checkBrowser(str){
        var mozilla = /<H3[^>]+>?\s*Mozilla/i;//第一个h3为mozila
        if(mozilla.test(str)){
            return 'mozilla';
        }
    }
    function cutMozilla(str){
        return str.replace(/<DT>[\s|\S]+?<\/DL>/i,'');
    }
    function dealSim(str){
        str = str.replace(/<DT>|<p>|ADD_DATE="\w+"|ICON="[^"]+"|LAST_MODIFIED="\w+"/g,'');//去掉垃圾信息
        str = str.replace(/[\s|\S]+<\/H1>/,'');//去掉h1前面所有
        str = str.replace(/>\s*</g,'><');//去掉><之间空格
        str = str.replace(/<H3[^>]+>/,'<H3>');//去掉h3之间的多余信息
        str = str.replace(/\s{2,}/g,' ');//压缩空格
        str = str.replace(/\s+>/g,'>');
        return str.trim();
    }
}
