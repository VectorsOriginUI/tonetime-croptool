Event.prototype.propagationPath=function(){var t=function(){var t=this.target||null,e=[t];if(!t||!t.parentElement)return[];for(;t.parentElement;)t=t.parentElement,e.unshift(t);return e}.bind(this);return this.path||this.composedPath&&this.composedPath()||t()};class DragAndResizable{constructor(t,e,i=!0,s){this.innerContainer=t,this.outerContainer=e,this.allowResize=i,this.callback=s,this.state=null,this.isMouseDown=!1,this.lastScale=0,this.lastTouchY=0,this.lastTouchX=0,this.supportsTouch="ontouchstart"in window||navigator.msMaxTouchPoints>0,this.supportsTouch?(this.touchStartEvent=function(t){this.onTouchStart(t)}.bind(this),this.touchEndEvent=function(t){this.onTouchEnd(t)}.bind(this),this.touchCancelEvent=function(t){this.onTouchCancel(t)}.bind(this),this.touchMoveEvent=function(t){this.onTouchMove(t)}.bind(this),this.outerContainer.addEventListener("touchstart",this.touchStartEvent),this.outerContainer.addEventListener("touchend",this.touchEndEvent),this.outerContainer.addEventListener("touchcancel",this.touchCancelEvent),this.outerContainer.addEventListener("touchmove",this.touchMoveEvent),this.pinch=new PinchDetect(this.outerContainer),this.pinch.callbacks.scale=this.onPinch.bind(this)):(this.mousedownEvent=function(t){this.onMouseDown(t)}.bind(this),this.mousemoveEvent=function(t){this.onMouseMove(t)}.bind(this),this.mouseupEvent=function(t){this.onMouseUp(t)}.bind(this),this.mouseleaveEvent=function(t){this.onMouseLeave(t)}.bind(this),this.mousewheelEvent=function(t){this.mouseWheelHandler(t)}.bind(this),this.wheelEvent=function(t){this.mouseWheelHandler(t)}.bind(this),this.resizeEvent=function(t){this.resize(t)}.bind(this),window.addEventListener("resize",this.resizeEvent),window.addEventListener("mouseup",this.mouseupEvent),window.addEventListener("mousemove",this.mousemoveEvent),document.body.addEventListener("mousedown",this.mousedownEvent),document.body.addEventListener("mouseup",this.mouseleaveEvent),this.innerContainer.addEventListener("mousewheel",this.mousewheelEvent,!1),this.innerContainer.addEventListener("wheel",this.mousewheelEvent,!1))}disconnectEvents(){window.removeEventListener("onresize",this.resizeEvent),window.removeEventListener("mousemove",this.mousemoveEvent),window.removeEventListener("mouseup",this.mouseupEvent),document.body.removeEventListener("mousedown",this.mousedownEvent),document.body.removeEventListener("mouseleave",this.mouseleaveEvent),this.innerContainer.removeEventListener("mousewheel",this.mousewheelEvent),this.innerContainer.removeEventListener("wheel",this.mousewheelEvent),this.outerContainer.removeEventListener("touchstart",this.touchStartEvent),this.outerContainer.removeEventListener("touchend",this.touchEndEvent),this.outerContainer.removeEventListener("touchcancel",this.touchCancelEvent),this.outerContainer.removeEventListener("touchmove",this.touchMoveEvent)}mouseWheelHandler(t){return(t=window.event||t).preventDefault(),this.state="mouseWheel",this.callback&&this.callback(this.state,t),!1}resize(t){this.state="resizeWindow",this.callback&&this.callback(this.state,t)}setXandYForTouch(t){t.changedTouches.length>1?this.lastTouchY=this.lastTouchX=null:(t.path=t.propagationPath(),null!=this.lastTouchY?(t.movementX=t.changedTouches[0].clientX-this.lastTouchX,t.movementY=t.changedTouches[0].clientY-this.lastTouchY):t.movementX=t.movementY=0,t.clientX=t.changedTouches[0].clientX,t.clientY=t.changedTouches[0].clientY,this.lastTouchY=t.changedTouches[0].clientY,this.lastTouchX=t.changedTouches[0].clientX)}onTouchMove(t){t.preventDefault(),t.changedTouches.length>1||t.touches.length>1||t.targetTouches.length>1||(this.setXandYForTouch(t),this.onMouseMove(t))}onTouchStart(t){t.preventDefault(),t.changedTouches.length>1||t.touches.length>1||t.targetTouches.length>1||(this.lastTouchY=this.lastTouchX=null,this.setXandYForTouch(t),this.setCursor(t),this.onMouseDown(t))}onTouchEnd(t){t.preventDefault(),this.onMouseUp(t)}onTouchCancel(t){this.onMouseUp(t)}onPinch(t){this.isMouseDown=!1,this.state="pinchAndZoom",t.movement=t.scale,this.callback&&this.callback(this.state,t)}onMouseDown(t){var e=t.path||t.composedPath&&t.composedPath(),i=this.supportsTouch?this.outerContainer:this.innerContainer;if(e.indexOf(i)>0){this.isMouseDown=!0;var s=new CustomEvent("mousePressedInContainer",{detail:t});this.innerContainer.dispatchEvent(s),this.state="mousePressedInContainer"}else this.state="mousePressedOutsideContainer";this.callback&&this.callback(this.state,t)}onMouseUp(t){this.state=null,this.isMouseDown=!1}onMouseMove(t){null!=t.movementX&&null!=t.movementY&&(this.state=null,1==this.allowResize&&0==this.supportsTouch&&this.setCursor(t),0!=this.isMouseDown&&(null==this.currentDirection?(this.state="panningInContainer",this.callback&&this.callback(this.state,t)):null!=this.currentDirection&&1==this.allowResize&&(this.state="reszieContainer",this.callback&&this.callback(this.state,t,{currentDirection:this.currentDirection}))))}onMouseLeave(t){this.state=null,this.isMouseDown=!1}setCursor(t){if(!this.isMouseDown){var e=this.absoluteRect(this.innerContainer),i=this.supportsTouch?25:10,s=[Math.abs(e.bottom-t.clientY),Math.abs(e.top-t.clientY),Math.abs(e.left-t.clientX),Math.abs(e.right-t.clientX)];s[0]<i&&s[2]<i?(this.currentDirection="SW",this.innerContainer.style.cursor="nesw-resize"):s[0]<i&&s[3]<i?(this.currentDirection="SE",this.innerContainer.style.cursor="nwse-resize"):s[1]<i&&s[2]<i?(this.currentDirection="NW",this.innerContainer.style.cursor="nwse-resize"):s[1]<i&&s[3]<i?(this.currentDirection="NE",this.innerContainer.style.cursor="nesw-resize"):s[1]<i?(this.currentDirection="NS",this.innerContainer.style.cursor="ns-resize"):s[0]<i?(this.currentDirection="SN",this.innerContainer.style.cursor="ns-resize"):s[3]<i?(this.currentDirection="EW",this.innerContainer.style.cursor="ew-resize",this.hdir=1):s[2]<i?(this.currentDirection="WE",this.innerContainer.style.cursor="ew-resize",this.hdir=0):this.resetCursor()}}resetCursor(){this.currentDirection=null,this.innerContainer.style.cursor="move"}absoluteRect(t){return{top:t.offsetTop,bottom:t.offsetHeight+t.offsetTop,right:t.offsetLeft+t.offsetWidth,left:t.offsetLeft}}}function PinchDetect(t){t.addEventListener("touchstart",this.touchStartHandler.bind(this)),t.addEventListener("touchmove",this.touchMoveHandler.bind(this)),t.addEventListener("touchend",this.touchEndHandler.bind(this)),this.scaling=!1,this.lastDist=null,this.scaleLine=[],this.element=t,this.callbacks={rotate:null,scale:null}}CropComponents={},CropComponents.brightnessFilter=function(t,e){var i=document.createElement("canvas");i.width=t.width,i.height=t.height;var s=i.getContext("2d");s.drawImage(t,0,0);for(var n=s.getImageData(0,0,i.width,i.height),o=0;o<n.data.length;o+=4)n.data[o]=n.data[o]*e,n.data[o+1]=n.data[o+1]*e,n.data[o+2]=n.data[o+2]*e;s.putImageData(n,0,0);var r=i.toDataURL("image/jpeg");return i=null,r},PinchDetect.prototype.touchStartHandler=function(t){2===t.touches.length&&(this.lastDist=null,this.scaleLine=[],this.scaling=!0)},PinchDetect.prototype.touchMoveHandler=function(t){if(this.scaling){var e=Math.hypot(t.touches[0].pageX-t.touches[1].pageX,t.touches[0].pageY-t.touches[1].pageY);if(null==this.lastDist)this.lastDist=e;else{var i=e-this.lastDist;i=(i/=this.element.offsetHeight).toFixed(4),this.callbacks.scale({scale:i,x:0,y:0}),this.lastDist=e}}},PinchDetect.prototype.touchEndHandler=function(t){this.scaling=!1,this.lastDist=null},PinchDetect.prototype.onScale=function(t){this.callbacks.scale=t};class CropComponent extends HTMLElement{constructor(){super()}initAfterDOM(){this.img=null,this.backgroundImage=null,this.container=null,this.currentScale=1,this.maxScale=2,this.currentTx=0,this.currentTy=0,this.supportsTouch="ontouchstart"in window||navigator.msMaxTouchPoints>0,this.range=null,this.defaultRangeSupport=!1,this.cropboxHeight=0,this.cropboxWidth=0,this.resizable=!1,this.maxScale=parseFloat(this.getAttribute("maxscale"))||5,this.isFirefox=navigator.userAgent.toLowerCase().indexOf("firefox")>-1}clear(){this.dragAndResize&&this.dragAndResize.disconnectEvents(),this.dragAndResize=null,this.shadowRoot&&(this.shadowRoot.getElementById("crop-component-img").src="")}onResize(){this.cropboxHeight=0,this.cropboxWidth=0,this.setTransformationOrigin(),this.positionImage(),this.updateScale(this.currentScale),this.setupCropBox(),this.setBackgroundImage(),this.coverFitImage(),this.updateTransform(),this.range.parentElement.style.display="none"}get template(){return`\n\t\t  <div id ='crop-component-container' style='overflow:hidden;width:100%;height:100%;cursor: move; z-index:10; position:relative; ' >\n    \t\t<img  id ='crop-component-img' src='${this.src}'  ondragstart="return false" style='z-index:1;position:relative; transform:scale(1) translate(0px, 0px);'>\n      </div>\n      <div  ondragstart="return false"  style='z-index:0; position:absolute; overflow:hidden;display:none '>\n        \t<img src='' id='crop-component-bg-image'  style='transform:scale(1) translate(0px, 0px);'>\n      </div>\n      <canvas id="crop-component-canvas" style='display:none'></canvas>\n    \t<div id='tcrop-div'  style='display:none;background-color: lightgray; margin-top:5px; opacity:0.8; z-index:100; text-align:center; position: absolute;  border-radius: 2px;'>\n       \t\t<input id = 'crop-component-range' type="range" min=1 max=4  step=0.1  value="1" style='margin-top:5px;width:75%' />\n      </div>\n    `}connectedCallback(){this.attachShadow({mode:"open"}).innerHTML=this.template,this.insertImage(this.src)}insertImage(t){this.setAttribute("src",t),this.clear(),this.shadowRoot.getElementById("crop-component-img").onload=function(){this.initAfterDOM(),this.shadowDOMRenderedCallback(),this.imageLoadedCallback()}.bind(this),this.shadowRoot.getElementById("crop-component-img").src=this.src}setRangeSlider(){var t=this.getAttribute("range");t&&"true"===t.toLowerCase()&&!this.supportsTouch?(this.displayDefaultSlider(),this.defaultRangeSupport=!0):null!=t&&(this.range=document.getElementById(t))}setBackgroundImage(){if(this.useBgImage){this.backgroundImage=this.shadowRoot.getElementById("crop-component-bg-image");var t=CropComponents.brightnessFilter(this.shadowRoot.getElementById("crop-component-img"),.5);this.backgroundImage.src=t,this.backgroundImage.parentElement.style.top=this.offsetTop+"px",this.backgroundImage.parentElement.style.height=this.offsetHeight+"px",this.backgroundImage.parentElement.style.width=this.offsetWidth+"px",this.backgroundImage.parentElement.style.display="inline"}}positionBelowImage(t){t.style.display="inline";var e=this.offsetHeight+this.offsetTop,i=this.offsetWidth,s=this.offsetLeft;t.style.top=e+"px",t.style.width=i+"px",t.style.left=s+"px"}setupCropBox(){if(this.useBgImage){var t=this.getAttribute("cropbox-height"),e=this.getAttribute("cropbox-width");null==t&&null==e||(t.indexOf("%")>0&&(t=this.offsetHeight*(parseFloat(t)/100)),e.indexOf("%")>0&&(e=this.offsetWidth*(parseFloat(e)/100)),null==t&&(t=e),null==e&&(e=t),this.container.style.height=t+"px",this.container.style.width=e+"px",this.container.style.outline="1px solid white",this.cropboxHeight=this.offsetHeight/2-parseFloat(t)/2,this.cropboxWidth=this.offsetWidth/2-parseFloat(e)/2,this.container.style.top=this.cropboxHeight+"px",this.container.style.left=this.cropboxWidth+"px")}}shadowDOMRenderedCallback(){this.container=this.shadowRoot.getElementById("crop-component-container"),this.dragAndResize||(this.dragAndResize=new DragAndResizable(this.container,this,!0,this.moves.bind(this))),this.img=this.shadowRoot.getElementById("crop-component-img"),this.useBgImage&&(this.setupCropBox(),this.setBackgroundImage()),this.setRangeSlider(),this.range&&!this.supportsTouch&&this.setupSlider()}moves(t,e,i){if("resizeWindow"!=t){if("mousePressedInContainer"==t)this.defaultRangeSupport&&this.positionBelowImage(this.range.parentElement);else if("panningInContainer"==t){var s=this.currentTy+e.movementY*(1/this.currentScale),n=this.currentTx+e.movementX*(1/this.currentScale);this.currentTx=n,this.currentTy=s,this.coverFitImage(),this.updateTransform()}else if("pinchAndZoom"==t){var o=this.currentScale+e.movement*(4*this.minimumScale());this.updateScale(o)}else if("mousePressedOutsideContainer"==t)e.target!=this&&this.range&&(this.range.parentElement.style.display="none");else if("reszieContainer"==t){var r=this.absoluteRect(this),h=this.absoluteRect(this.container),a=(this.shadowRoot.getElementById("crop-component-bg-image"),this.bounds());if("EW"==i.currentDirection||"NE"==i.currentDirection||"SE"==i.currentDirection){(f=e.movementX)<0&&"pan"!=e.srcElement.id&&(f=0);var c=parseFloat(this.container.style.width)+f,l=this.boundsR(h.bottom,h.top,this.container.offsetLeft+c,h.left);if(h.left+c<r.right&&c>5&&this.currentTx>=a.right){var u=f/2,d=this.currentTx+(u-u*(1/this.currentScale));l.right<=d&&(this.container.style.width=c+"px",this.currentTx=d)}}if("WE"==i.currentDirection||"NW"==i.currentDirection||"SW"==i.currentDirection){(f=e.movementX)>0&&"pan"!=e.srcElement.id&&(f=0);c=parseFloat(this.container.style.width)-f;var p=parseFloat(this.container.style.left)+f;l=this.boundsR(h.bottom,h.top,p+c,p);if(p>0&&c>5&&this.currentTx<=a.left){u=f/2;(d=this.currentTx-(u+u*(1/this.currentScale)))<=l.left&&(this.currentTx=d,this.container.style.width=c+"px",this.container.style.left=p+"px",this.cropboxWidth=p)}}if("NS"==i.currentDirection||"NW"==i.currentDirection||"NE"==i.currentDirection){(f=e.movementY)>0&&"pan"!=e.srcElement.id&&(f=0);var m=parseFloat(this.container.style.height)-f,g=parseFloat(this.container.style.top)+f;l=this.boundsR(this.container.offsetTop+m,r.top+g,h.right,h.left);if(g>=0&&m>20&&this.currentTy<=a.top){u=f/2;(v=this.currentTy-(u+u*(1/this.currentScale)))<=a.top&&(this.currentTy=v,this.container.style.height=m+"px",this.container.style.top=g+"px",this.cropboxHeight=g)}}if("SN"==i.currentDirection||"SE"==i.currentDirection||"SW"==i.currentDirection){var f;(f=e.movementY)<0&&"pan"!=e.srcElement.id&&(f=0);m=parseFloat(this.container.style.height)+f,l=this.boundsR(this.container.offsetTop+m,h.top,h.right,h.left);if(m>30&&h.top+m<r.bottom&&this.currentTy>=a.bottom){var v;u=f/2;(v=this.currentTy+(u-u*(1/this.currentScale)))>=l.bottom&&(this.currentTy=v,this.container.style.height=m+"px")}}this.setTransformationOrigin(),this.updateTransform()}else if("mouseWheel"==t){var b=e.detail<0||e.wheelDelta>0||e.deltaY<0?1:-1,E=this.currentScale+b/5;this.updateScale(E)}}else this.onResize()}displayDefaultSlider(){this.range=this.shadowRoot.getElementById("crop-component-range"),this.setupSlider()}setupSlider(){this.range.min=parseFloat(this.minimumScale()).toFixed(2),this.range.max=this.maxScale,this.range.step=.1,this.range.value=this.currentScale,this.range.oninput=function(t){var e=parseFloat(this.range.value);this.updateScale(e)}.bind(this)}imageLoadedCallback(){this.currentScale=this.minimumScale(),this.setTransformationOrigin(),this.positionImage(),this.updateScale(this.currentScale)}disconnectedCallback(){this.dragAndResize&&this.dragAndResize.disconnectEvents()}coverFitImage(){var t=this.bounds();this.currentTy>t.top?this.currentTy=t.top:t.bottom>this.currentTy&&(this.currentTy=t.bottom),t.left<this.currentTx?this.currentTx=t.left:t.right>this.currentTx&&(this.currentTx=t.right)}minimumScale(){var t=this.offsetHeight/this.img.offsetHeight,e=this.offsetWidth/this.img.offsetWidth;return t>e?t:e}positionImage(t=.5,e=.5){var i=this.absoluteRect(this.container),s=this.absoluteRect(this.img);i.point=[(i.right-i.left)*t,(i.bottom-i.top)*e],s.point=[(s.right-s.left)*t,(s.bottom-s.top)*e];var n=i.point[0]-s.point[0],o=i.point[1]-s.point[1];this.currentTx=n,this.currentTy=o,this.updateTransform()}updateScale(t){this.currentScale=t,this.currentScale<=0&&(this.currentScale=1),this.currentScale>this.maxScale&&(this.currentScale=this.maxScale),this.currentScale=this.currentScale<this.minimumScale()?this.minimumScale():this.currentScale,this.range&&(this.range.value=this.currentScale),this.coverFitImage(),this.updateTransform()}loop(){this.updateTransform(),window.requestAnimationFrame(this.loop.bind(this))}updateTransform(){if(this.img.style.transform=`scale(${this.currentScale}) translate(${this.currentTx}px, ${this.currentTy}px)`,this.backgroundImage){var t=this.cropboxWidth+this.currentTx,e=this.cropboxHeight+this.currentTy;this.backgroundImage.style.transform=`scale(${this.currentScale}) translate(${t}px, ${e}px)`}}setTransformationOrigin(t=.5,e=.5){var i=this.absoluteRect(this.container),s=this.absoluteRect(this),n=(i.bottom-i.top)*t,o=(i.right-i.left)*e;if(this.img.style.transformOrigin=`${o}px ${n}px`,this.backgroundImage){var r=i.left+(i.right-i.left)*t-s.left,h=i.top+(i.bottom-i.top)*e-s.top;this.backgroundImage&&(this.backgroundImage.style.transformOrigin=`${r}px ${h}px`)}}absoluteRect(t){return{top:t.offsetTop,bottom:t.offsetHeight+t.offsetTop,right:t.offsetLeft+t.offsetWidth,left:t.offsetLeft}}bounds(){var t=this.absoluteRect(this.container);return this.boundsR(t.bottom,t.top,t.right,t.left)}boundsR(t,e,i,s){var n=(t-e)/2,o=(i-s)/2,r={};return r.top=-(n-n*this.currentScale)*(1/this.currentScale),r.left=-(o-o*this.currentScale)*(1/this.currentScale),r.bottom=(-(this.img.offsetHeight*this.currentScale-2*n)+r.top*this.currentScale)*(1/this.currentScale),r.right=(-(this.img.offsetWidth*this.currentScale-2*o)+r.left*this.currentScale)*(1/this.currentScale),r}croppedDimensions(){return{dx:parseFloat(Math.abs(p.currentTx-Math.round(p.bounds().left))).toFixed(2),dy:parseFloat(Math.abs(p.currentTy-Math.round(p.bounds().top))).toFixed(2),dWidth:parseFloat(this.container.offsetWidth*(1/this.currentScale)).toFixed(2),dHeight:parseFloat(this.container.offsetHeight*(1/this.currentScale)).toFixed(2)}}drawCroppedImage(){var t=this.croppedDimensions(),e=this.shadowRoot.getElementById("crop-component-canvas");return e.width=t.dWidth,e.height=t.dHeight,e.getContext("2d").drawImage(this.img,t.dx,t.dy,t.dWidth,t.dHeight,0,0,e.width,e.height),e.toDataURL("image/jpeg")}get src(){return this.getAttribute("src")}get useBgImage(){var t=this.getAttribute("background-image");return t&&"false"!=t.toLowerCase()}}window.customElements.define("crop-component",CropComponent);