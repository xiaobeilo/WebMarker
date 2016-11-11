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
    str  = dealSim(str);
    if(checkBrowser(str)==='mozilla'){
        str = cutMozilla(str);
    }
    recDl(bookmarks,cutHeadFoot(str));

    function recDl(arr,str){//找出兄弟元素并且整理
        var obj = {};
        obj.h3 = str.match(/<H3>([^<]+)<\/H3>/i)[1];
        obj.dt = getDt(removeH3Dl(cutHeadFoot(str)));
        str = cutHeadFoot(str);
        var dlList =  str.match(/<H3>[^<]+<\/H3><DL>[\s|\S]*?<\/DL>/g);
        if(dlList){
            obj.dl = [];
            for(var i=0;i<dlList.length;i++){
                if(pickH3Dl(dlList[i])){
                    obj.dl.push(findDl(pickH3Dl(dlList[i])));
                    if(!isOver(dlList[i])){
                        recDl(obj.dl,dlList[i]);
                    }
                }else{
                    obj.dl.push({h3:dlList[i].match(/<H3>([^<]+)<\/H3>/i)[1]})
                }
            }
        }
        console.log(arr)
        arr.push(obj);
    }
    function cutHeadFoot(str){
        // return str.replace(/^<DL>|<\/DL>$/g,'');
        str = str.replace(/^[\S|\s]*?<DL>/,'');
        str = str.slice(0,str.lastIndexOf('<\/DL>'));
        return str;
    }
    function pickH3Dl(str){
        var reg = /<H3>([^<]*)<\/H3>(<DL>[\s|\S]+?<\/DL>)/i;//提取h3和后面的dl
        var result = str.match(reg);
        return result;
    }
    function findDl(arr){//将dl内的数据写成对象
        return {
            h3:arr[1],
            dt:getDt(arr[2])
            // dl:checkDl(arr[2])?recDl(arr[2]):undefined
        };
    }
    function trim(str){
        return str.replace(/^\s*<DL>\s*<p>|<\/DL>$/i,'');//去掉前尾dl标签
    }
    function removeDl(str){
        return str.replace(/<DL>[\s|\S]+<\/DL>/ig,'');//去除dl只剩下dt
    }
    function removeH3Dl(str){
        return str.replace(/<H3>[^<]*<\/H3><DL>[\s|\S]+?<\/DL>/ig,'');//删除h3和dl的兄弟元素
    }
    function getDt(str){
        var dtList = [];
        var dtListStr = str.match(/<A\sHREF="([^"]+)">([^<]*)<\/A>/g);
        for(var i=0;i<dtListStr.length;i++){
            var result = dtListStr[i].match(/<A\sHREF="([^"]+)">([^<]*)<\/A>/);
            dtList[dtList.length] = {
                href:result[1],
                name:result[2]
            };
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
    function isOver(str){//是否到最深度?否就递归删除直到最深部
        if(str.match(/<H3>/g).length>1){
            return false;
        }else{
            return true;
        }
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
