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
    recDl(bookmarks,cutHead(str));
    console.log(bookmarks);

    function findDl(arr){//递归查找dl下面是否还有dl元素
        return {
            h3:arr[1],
            dt:getDt(arr[2])
            // dl:checkDl(arr[2])?recDl(arr[2]):undefined
        };
    }
    function recDl(obj,str){//递归查找dl兄弟元素
        var dlList =  str.match(/<DT><H3[^>]+>[^<]+<\/H3>\s*<DL>[\s|\S]+?(\s*)<\/DL>/ig);
        if(dlList){
            obj.dl = [];
            for(var i=0;i<dlList.length;i++){
                if(checkDl(dlList[i])){
                    obj.dl.push(findDl(checkDl(dlList[i])));
                }
            }
        }
        console.log(str)
        obj.h3 = str.match(/<DT><H3[^>]+>([^<]+)<\/H3>/i)[1];
        obj.dt = getDt(removeH3Dl(cutFoot(cutHead(str))));
    }
    function cutHead(str){
        return str.replace(/[\s|\S]+?<DT>/i,'');
    }
    function cutFoot(str){
        return str.replace(/<\/DL>[\S\s]{0,10}$/ig,'');
    }
    function checkDl(str){
        var reg = /<H3[^>]+>([^<]*)<\/H3>\s*(<DL>[\s|\S]+?<\/DL>)/i;//检测h3和后面所有dl
        var result = str.match(reg);
        return result;
    }
    function getDlList(str){
        str = removeDl(str);
    }
    function hasDl(str){
        return /<DL>/.test(str);
    }
    function trim(str){
        return str.replace(/^\s*<DL>\s*<p>|<\/DL>$/i,'');//去掉前尾dl标签
    }
    function removeDl(str){
        return str.replace(/<DL>[\s|\S]+<\/DL>/ig,'');//去除dl只剩下dt
    }
    function removeH3Dl(str){
        return str.replace(/<H3[^>]+>([^<]*)<\/H3>\s*(<DL>[\s|\S]+?<\/DL>)/ig,'');
    }
    function getDt(str){
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
