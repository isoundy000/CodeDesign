
let downloadLink = document.createElement("a");
downloadLink.download = "log.txt";
downloadLink.innerHTML = "Download File";

XMQ.downloadLink = downloadLink;
XMQ.log = function(){
	cc.log.apply(cc.log,arguments);
    let str = "";
    for (const key in arguments) {
        if (arguments.hasOwnProperty(key)) {
            var element = arguments[key];
            if(typeof element == "object"){
                element = JSON.stringify(element);
            }
            str += element + "\n";
        }
    }
    if(!CC_JSB){
        cc.log("11111")
            let textFileAsBlob = new Blob([str], {type:'application/text'});
            if (window.webkitURL != null)
            {
                XMQ.downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            }
            else
            {
                XMQ.downloadLink.href = window.URL.createObjectURL( );
                XMQ.downloadLink.onclick = destroyClickedElement;
                XMQ.downloadLink.style.display = "none";
                document.body.appendChild(XMQ.downloadLink);
            }
            // downloadLink.click();
	}else{
        cc.log("44444")
		let storagePath = jsb.fileUtils.getWritablePath();
        let path = storagePath + "log.txt";
        if (jsb.fileUtils.isFileExist(path)){
            cc.log("555555")
            
        }else{
            cc.log("6666666")
            jsb.fileUtils.createDirectory(path);
        }
        if( jsb.fileUtils.writeDataToFile( new Uint8Array(str) , path) ){
            cc.log('Remote write file succeed.');
        }else{
            cc.log('Remote write file failed.');
        }
	}
    cc.log(str)
}
let t= {}
t.ddd = "dddddaaa"
let tt = [1,2,3,44]
XMQ.log("ddddd",t,"parse",tt)

	<div class="orientationswipe" id = "btn2" onclick = "goF11">
      <label class = "fullscreenbtn" id = "label2">点击屏幕变全屏</label>
    </div>
	<script charset="utf-8">
		function launchFullScreen(element) {
			if(element.requestFullScreen) { //webkit/edge
				element.requestFullScreen();
			} else if(element.mozRequestFullScreen) { //firefox
				element.mozRequestFullScreen(); 
			} else if(element.webkitRequestFullScreen) {
				element.webkitRequestFullScreen();
			} else if(element.msRequestFullscreen) { //IE
				element.msRequestFullscreen(); 
			} else {
				return true;
			}
		}

		function goF11(){
			if(launchFullScreen(document.documentElement)){
				btn2.style.display = "none";
			}else{
				btn2.style.display = "none";
			}
		}
	</script>


	function launchFullScreen(element) {
            if(element.requestFullScreen) { //webkit/edge
                element.requestFullScreen();
            } else if(element.mozRequestFullScreen) { //firefox
                element.mozRequestFullScreen(); 
            } else if(element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            } else if(element.msRequestFullscreen) { //IE
                element.msRequestFullscreen(); 
            } else {
                return true;
            }
        }
        function exitFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
        function goF11(){
            if(launchFullScreen(document.documentElement)){
                cc.log("full screen success... ");
            }else{
                cc.log("not run full screnn")
            }
        }
        goF11();




var str = "game<game>"
var reg = /(.*)\<(.*)\>/;
cc.log(str.replace(reg,'$1') + "==")
cc.log(str.replace(reg,'$2') + "--")


var reg = /([^\[]*)\[(.*)\]([^\]]*)/;
var str = "1111[222]33";
cc.log(str.replace(reg,'$1') )
cc.log(str.replace(reg,'$2') )
cc.log(str.replace(reg,'$3') )


var reg = /(\d)\s(\d)/;  
var str = "1234 5678";  
cc.log(str.replace(reg,"21") )