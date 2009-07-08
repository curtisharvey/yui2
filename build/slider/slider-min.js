(function(){var B=YAHOO.util.Dom.getXY,A=YAHOO.util.Event,D=Array.prototype.slice;function C(G,E,F,H){C.ANIM_AVAIL=(!YAHOO.lang.isUndefined(YAHOO.util.Anim));if(G){this.init(G,E,true);this.initSlider(H);this.initThumb(F);}}YAHOO.lang.augmentObject(C,{getHorizSlider:function(F,G,I,H,E){return new C(F,F,new YAHOO.widget.SliderThumb(G,F,I,H,0,0,E),"horiz");},getVertSlider:function(G,H,E,I,F){return new C(G,G,new YAHOO.widget.SliderThumb(H,G,0,0,E,I,F),"vert");},getSliderRegion:function(G,H,J,I,E,K,F){return new C(G,G,new YAHOO.widget.SliderThumb(H,G,J,I,E,K,F),"region");},SOURCE_UI_EVENT:1,SOURCE_SET_VALUE:2,SOURCE_KEY_EVENT:3,ANIM_AVAIL:false},true);YAHOO.extend(C,YAHOO.util.DragDrop,{_mouseDown:false,dragOnly:true,initSlider:function(E){this.type=E;this.createEvent("change",this);this.createEvent("slideStart",this);this.createEvent("slideEnd",this);this.isTarget=false;this.animate=C.ANIM_AVAIL;this.backgroundEnabled=true;this.tickPause=40;this.enableKeys=true;this.keyIncrement=20;this.moveComplete=true;this.animationDuration=0.2;this.SOURCE_UI_EVENT=1;this.SOURCE_SET_VALUE=2;this.valueChangeSource=0;this._silent=false;this.lastOffset=[0,0];},initThumb:function(F){var E=this;this.thumb=F;F.cacheBetweenDrags=true;if(F._isHoriz&&F.xTicks&&F.xTicks.length){this.tickPause=Math.round(360/F.xTicks.length);}else{if(F.yTicks&&F.yTicks.length){this.tickPause=Math.round(360/F.yTicks.length);}}F.onAvailable=function(){return E.setStartSliderState();};F.onMouseDown=function(){E._mouseDown=true;return E.focus();};F.startDrag=function(){E._slideStart();};F.onDrag=function(){E.fireEvents(true);};F.onMouseUp=function(){E.thumbMouseUp();};},onAvailable:function(){this._bindKeyEvents();},_bindKeyEvents:function(){A.on(this.id,"keydown",this.handleKeyDown,this,true);A.on(this.id,"keypress",this.handleKeyPress,this,true);},handleKeyPress:function(F){if(this.enableKeys){var E=A.getCharCode(F);switch(E){case 37:case 38:case 39:case 40:case 36:case 35:A.preventDefault(F);break;default:}}},handleKeyDown:function(J){if(this.enableKeys){var G=A.getCharCode(J),F=this.thumb,H=this.getXValue(),E=this.getYValue(),I=true;switch(G){case 37:H-=this.keyIncrement;break;case 38:E-=this.keyIncrement;break;case 39:H+=this.keyIncrement;break;case 40:E+=this.keyIncrement;break;case 36:H=F.leftConstraint;E=F.topConstraint;break;case 35:H=F.rightConstraint;E=F.bottomConstraint;break;default:I=false;}if(I){if(F._isRegion){this._setRegionValue(C.SOURCE_KEY_EVENT,H,E,true);}else{this._setValue(C.SOURCE_KEY_EVENT,(F._isHoriz?H:E),true);}A.stopEvent(J);}}},setStartSliderState:function(){this.setThumbCenterPoint();this.baselinePos=B(this.getEl());this.thumb.startOffset=this.thumb.getOffsetFromParent(this.baselinePos);if(this.thumb._isRegion){if(this.deferredSetRegionValue){this._setRegionValue.apply(this,this.deferredSetRegionValue);this.deferredSetRegionValue=null;}else{this.setRegionValue(0,0,true,true,true);}}else{if(this.deferredSetValue){this._setValue.apply(this,this.deferredSetValue);this.deferredSetValue=null;}else{this.setValue(0,true,true,true);}}},setThumbCenterPoint:function(){var E=this.thumb.getEl();if(E){this.thumbCenterPoint={x:parseInt(E.offsetWidth/2,10),y:parseInt(E.offsetHeight/2,10)};}},lock:function(){this.thumb.lock();this.locked=true;},unlock:function(){this.thumb.unlock();this.locked=false;},thumbMouseUp:function(){this._mouseDown=false;if(!this.isLocked()&&!this.moveComplete){this.endMove();}},onMouseUp:function(){this._mouseDown=false;if(this.backgroundEnabled&&!this.isLocked()&&!this.moveComplete){this.endMove();}},getThumb:function(){return this.thumb;},focus:function(){this.valueChangeSource=C.SOURCE_UI_EVENT;var E=this.getEl();if(E.focus){try{E.focus();}catch(F){}}this.verifyOffset();return !this.isLocked();},onChange:function(E,F){},onSlideStart:function(){},onSlideEnd:function(){},getValue:function(){return this.thumb.getValue();},getXValue:function(){return this.thumb.getXValue();},getYValue:function(){return this.thumb.getYValue();},setValue:function(){var E=D.call(arguments);E.unshift(C.SOURCE_SET_VALUE);return this._setValue.apply(this,E);},_setValue:function(I,L,G,H,E){var F=this.thumb,K,J;if(!F.available){this.deferredSetValue=arguments;return false;}if(this.isLocked()&&!H){return false;}if(isNaN(L)){return false;}if(F._isRegion){return false;}this._silent=E;this.valueChangeSource=I||C.SOURCE_SET_VALUE;F.lastOffset=[L,L];this.verifyOffset(true);this._slideStart();if(F._isHoriz){K=F.initPageX+L+this.thumbCenterPoint.x;this.moveThumb(K,F.initPageY,G);}else{J=F.initPageY+L+this.thumbCenterPoint.y;this.moveThumb(F.initPageX,J,G);}return true;},setRegionValue:function(){var E=D.call(arguments);E.unshift(C.SOURCE_SET_VALUE);return this._setRegionValue.apply(this,E);},_setRegionValue:function(F,J,H,I,G,K){var L=this.thumb,E,M;if(!L.available){this.deferredSetRegionValue=arguments;return false;}if(this.isLocked()&&!G){return false;}if(isNaN(J)){return false;}if(!L._isRegion){return false;}this._silent=K;this.valueChangeSource=F||C.SOURCE_SET_VALUE;L.lastOffset=[J,H];this.verifyOffset(true);this._slideStart();E=L.initPageX+J+this.thumbCenterPoint.x;M=L.initPageY+H+this.thumbCenterPoint.y;this.moveThumb(E,M,I);return true;},verifyOffset:function(F){var G=B(this.getEl()),E=this.thumb;if(!this.thumbCenterPoint||!this.thumbCenterPoint.x){this.setThumbCenterPoint();}if(G){if(G[0]!=this.baselinePos[0]||G[1]!=this.baselinePos[1]){this.setInitPosition();this.baselinePos=G;E.initPageX=this.initPageX+E.startOffset[0];E.initPageY=this.initPageY+E.startOffset[1];E.deltaSetXY=null;this.resetThumbConstraints();return false;}}return true;},moveThumb:function(K,J,I,G){var L=this.thumb,M=this,F,E,H;if(!L.available){return;}L.setDelta(this.thumbCenterPoint.x,this.thumbCenterPoint.y);E=L.getTargetCoord(K,J);F=[Math.round(E.x),Math.round(E.y)];if(this.animate&&L._graduated&&!I){this.lock();this.curCoord=B(this.thumb.getEl());this.curCoord=[Math.round(this.curCoord[0]),Math.round(this.curCoord[1])];setTimeout(function(){M.moveOneTick(F);
},this.tickPause);}else{if(this.animate&&C.ANIM_AVAIL&&!I){this.lock();H=new YAHOO.util.Motion(L.id,{points:{to:F}},this.animationDuration,YAHOO.util.Easing.easeOut);H.onComplete.subscribe(function(){M.unlock();if(!M._mouseDown){M.endMove();}});H.animate();}else{L.setDragElPos(K,J);if(!G&&!this._mouseDown){this.endMove();}}}},_slideStart:function(){if(!this._sliding){if(!this._silent){this.onSlideStart();this.fireEvent("slideStart");}this._sliding=true;}},_slideEnd:function(){if(this._sliding&&this.moveComplete){var E=this._silent;this._sliding=false;this._silent=false;this.moveComplete=false;if(!E){this.onSlideEnd();this.fireEvent("slideEnd");}}},moveOneTick:function(F){var H=this.thumb,G=this,I=null,E,J;if(H._isRegion){I=this._getNextX(this.curCoord,F);E=(I!==null)?I[0]:this.curCoord[0];I=this._getNextY(this.curCoord,F);J=(I!==null)?I[1]:this.curCoord[1];I=E!==this.curCoord[0]||J!==this.curCoord[1]?[E,J]:null;}else{if(H._isHoriz){I=this._getNextX(this.curCoord,F);}else{I=this._getNextY(this.curCoord,F);}}if(I){this.curCoord=I;this.thumb.alignElWithMouse(H.getEl(),I[0]+this.thumbCenterPoint.x,I[1]+this.thumbCenterPoint.y);if(!(I[0]==F[0]&&I[1]==F[1])){setTimeout(function(){G.moveOneTick(F);},this.tickPause);}else{this.unlock();if(!this._mouseDown){this.endMove();}}}else{this.unlock();if(!this._mouseDown){this.endMove();}}},_getNextX:function(E,F){var H=this.thumb,J,G=[],I=null;if(E[0]>F[0]){J=H.tickSize-this.thumbCenterPoint.x;G=H.getTargetCoord(E[0]-J,E[1]);I=[G.x,G.y];}else{if(E[0]<F[0]){J=H.tickSize+this.thumbCenterPoint.x;G=H.getTargetCoord(E[0]+J,E[1]);I=[G.x,G.y];}else{}}return I;},_getNextY:function(E,F){var H=this.thumb,J,G=[],I=null;if(E[1]>F[1]){J=H.tickSize-this.thumbCenterPoint.y;G=H.getTargetCoord(E[0],E[1]-J);I=[G.x,G.y];}else{if(E[1]<F[1]){J=H.tickSize+this.thumbCenterPoint.y;G=H.getTargetCoord(E[0],E[1]+J);I=[G.x,G.y];}else{}}return I;},b4MouseDown:function(E){if(!this.backgroundEnabled){return false;}this.thumb.autoOffset();this.baselinePos=[];},onMouseDown:function(F){if(!this.backgroundEnabled||this.isLocked()){return false;}this._mouseDown=true;var E=A.getPageX(F),G=A.getPageY(F);this.focus();this._slideStart();this.moveThumb(E,G);},onDrag:function(F){if(this.backgroundEnabled&&!this.isLocked()){var E=A.getPageX(F),G=A.getPageY(F);this.moveThumb(E,G,true,true);this.fireEvents();}},endMove:function(){this.unlock();this.fireEvents();this.moveComplete=true;this._slideEnd();},resetThumbConstraints:function(){var E=this.thumb;E.setXConstraint(E.leftConstraint,E.rightConstraint,E.xTickSize);E.setYConstraint(E.topConstraint,E.bottomConstraint,E.xTickSize);},fireEvents:function(G){var F=this.thumb,I,H,E;if(!G){F.cachePosition();}if(!this.isLocked()){if(F._isRegion){I=F.getXValue();H=F.getYValue();if(I!=this.previousX||H!=this.previousY){if(!this._silent){this.onChange(I,H);this.fireEvent("change",{x:I,y:H});}}this.previousX=I;this.previousY=H;}else{E=F.getValue();if(E!=this.previousVal){if(!this._silent){this.onChange(E);this.fireEvent("change",E);}}this.previousVal=E;}}},toString:function(){return("Slider ("+this.type+") "+this.id);}});YAHOO.lang.augmentProto(C,YAHOO.util.EventProvider);YAHOO.widget.Slider=C;})();YAHOO.widget.SliderThumb=function(G,B,E,D,A,F,C){if(G){YAHOO.widget.SliderThumb.superclass.constructor.call(this,G,B);this.parentElId=B;}this.isTarget=false;this.tickSize=C;this.maintainOffset=true;this.initSlider(E,D,A,F,C);this.scroll=false;};YAHOO.extend(YAHOO.widget.SliderThumb,YAHOO.util.DD,{startOffset:null,dragOnly:true,_isHoriz:false,_prevVal:0,_graduated:false,getOffsetFromParent0:function(C){var A=YAHOO.util.Dom.getXY(this.getEl()),B=C||YAHOO.util.Dom.getXY(this.parentElId);return[(A[0]-B[0]),(A[1]-B[1])];},getOffsetFromParent:function(H){var A=this.getEl(),E,I,F,B,K,D,C,J,G;if(!this.deltaOffset){I=YAHOO.util.Dom.getXY(A);F=H||YAHOO.util.Dom.getXY(this.parentElId);E=[(I[0]-F[0]),(I[1]-F[1])];B=parseInt(YAHOO.util.Dom.getStyle(A,"left"),10);K=parseInt(YAHOO.util.Dom.getStyle(A,"top"),10);D=B-E[0];C=K-E[1];if(isNaN(D)||isNaN(C)){}else{this.deltaOffset=[D,C];}}else{J=parseInt(YAHOO.util.Dom.getStyle(A,"left"),10);G=parseInt(YAHOO.util.Dom.getStyle(A,"top"),10);E=[J+this.deltaOffset[0],G+this.deltaOffset[1]];}return E;},initSlider:function(D,C,A,E,B){this.initLeft=D;this.initRight=C;this.initUp=A;this.initDown=E;this.setXConstraint(D,C,B);this.setYConstraint(A,E,B);if(B&&B>1){this._graduated=true;}this._isHoriz=(D||C);this._isVert=(A||E);this._isRegion=(this._isHoriz&&this._isVert);},clearTicks:function(){YAHOO.widget.SliderThumb.superclass.clearTicks.call(this);this.tickSize=0;this._graduated=false;},getValue:function(){return(this._isHoriz)?this.getXValue():this.getYValue();},getXValue:function(){if(!this.available){return 0;}var A=this.getOffsetFromParent();if(YAHOO.lang.isNumber(A[0])){this.lastOffset=A;return(A[0]-this.startOffset[0]);}else{return(this.lastOffset[0]-this.startOffset[0]);}},getYValue:function(){if(!this.available){return 0;}var A=this.getOffsetFromParent();if(YAHOO.lang.isNumber(A[1])){this.lastOffset=A;return(A[1]-this.startOffset[1]);}else{return(this.lastOffset[1]-this.startOffset[1]);}},toString:function(){return"SliderThumb "+this.id;},onChange:function(A,B){}});(function(){var A=YAHOO.util.Event,B=YAHOO.widget;function C(I,F,H,D){var G=this,J={min:false,max:false},E,K;this.minSlider=I;this.maxSlider=F;this.activeSlider=I;this.isHoriz=I.thumb._isHoriz;E=this.minSlider.thumb.onMouseDown;K=this.maxSlider.thumb.onMouseDown;this.minSlider.thumb.onMouseDown=function(){G.activeSlider=G.minSlider;E.apply(this,arguments);};this.maxSlider.thumb.onMouseDown=function(){G.activeSlider=G.maxSlider;K.apply(this,arguments);};this.minSlider.thumb.onAvailable=function(){I.setStartSliderState();J.min=true;if(J.max){G.fireEvent("ready",G);}};this.maxSlider.thumb.onAvailable=function(){F.setStartSliderState();J.max=true;if(J.min){G.fireEvent("ready",G);}};I.onMouseDown=F.onMouseDown=function(L){return this.backgroundEnabled&&G._handleMouseDown(L);};I.onDrag=F.onDrag=function(L){G._handleDrag(L);
};I.onMouseUp=F.onMouseUp=function(L){G._handleMouseUp(L);};I._bindKeyEvents=function(){G._bindKeyEvents(this);};F._bindKeyEvents=function(){};I.subscribe("change",this._handleMinChange,I,this);I.subscribe("slideStart",this._handleSlideStart,I,this);I.subscribe("slideEnd",this._handleSlideEnd,I,this);F.subscribe("change",this._handleMaxChange,F,this);F.subscribe("slideStart",this._handleSlideStart,F,this);F.subscribe("slideEnd",this._handleSlideEnd,F,this);this.createEvent("ready",this);this.createEvent("change",this);this.createEvent("slideStart",this);this.createEvent("slideEnd",this);D=YAHOO.lang.isArray(D)?D:[0,H];D[0]=Math.min(Math.max(parseInt(D[0],10)|0,0),H);D[1]=Math.max(Math.min(parseInt(D[1],10)|0,H),0);if(D[0]>D[1]){D.splice(0,2,D[1],D[0]);}this.minVal=D[0];this.maxVal=D[1];this.minSlider.setValue(this.minVal,true,true,true);this.maxSlider.setValue(this.maxVal,true,true,true);}C.prototype={minVal:-1,maxVal:-1,minRange:0,_handleSlideStart:function(E,D){this.fireEvent("slideStart",D);},_handleSlideEnd:function(E,D){this.fireEvent("slideEnd",D);},_handleDrag:function(D){B.Slider.prototype.onDrag.call(this.activeSlider,D);},_handleMinChange:function(){this.activeSlider=this.minSlider;this.updateValue();},_handleMaxChange:function(){this.activeSlider=this.maxSlider;this.updateValue();},_bindKeyEvents:function(D){A.on(D.id,"keydown",this._handleKeyDown,this,true);A.on(D.id,"keypress",this._handleKeyPress,this,true);},_handleKeyDown:function(D){this.activeSlider.handleKeyDown.apply(this.activeSlider,arguments);},_handleKeyPress:function(D){this.activeSlider.handleKeyPress.apply(this.activeSlider,arguments);},setValues:function(H,K,I,E,J){var F=this.minSlider,M=this.maxSlider,D=F.thumb,L=M.thumb,N=this,G={min:false,max:false};if(D._isHoriz){D.setXConstraint(D.leftConstraint,L.rightConstraint,D.tickSize);L.setXConstraint(D.leftConstraint,L.rightConstraint,L.tickSize);}else{D.setYConstraint(D.topConstraint,L.bottomConstraint,D.tickSize);L.setYConstraint(D.topConstraint,L.bottomConstraint,L.tickSize);}this._oneTimeCallback(F,"slideEnd",function(){G.min=true;if(G.max){N.updateValue(J);setTimeout(function(){N._cleanEvent(F,"slideEnd");N._cleanEvent(M,"slideEnd");},0);}});this._oneTimeCallback(M,"slideEnd",function(){G.max=true;if(G.min){N.updateValue(J);setTimeout(function(){N._cleanEvent(F,"slideEnd");N._cleanEvent(M,"slideEnd");},0);}});F.setValue(H,I,E,false);M.setValue(K,I,E,false);},setMinValue:function(F,H,I,E){var G=this.minSlider,D=this;this.activeSlider=G;D=this;this._oneTimeCallback(G,"slideEnd",function(){D.updateValue(E);setTimeout(function(){D._cleanEvent(G,"slideEnd");},0);});G.setValue(F,H,I);},setMaxValue:function(D,H,I,F){var G=this.maxSlider,E=this;this.activeSlider=G;this._oneTimeCallback(G,"slideEnd",function(){E.updateValue(F);setTimeout(function(){E._cleanEvent(G,"slideEnd");},0);});G.setValue(D,H,I);},updateValue:function(J){var E=this.minSlider.getValue(),K=this.maxSlider.getValue(),F=false,D,M,H,I,L,G;if(E!=this.minVal||K!=this.maxVal){F=true;D=this.minSlider.thumb;M=this.maxSlider.thumb;H=this.isHoriz?"x":"y";G=this.minSlider.thumbCenterPoint[H]+this.maxSlider.thumbCenterPoint[H];I=Math.max(K-G-this.minRange,0);L=Math.min(-E-G-this.minRange,0);if(this.isHoriz){I=Math.min(I,M.rightConstraint);D.setXConstraint(D.leftConstraint,I,D.tickSize);M.setXConstraint(L,M.rightConstraint,M.tickSize);}else{I=Math.min(I,M.bottomConstraint);D.setYConstraint(D.leftConstraint,I,D.tickSize);M.setYConstraint(L,M.bottomConstraint,M.tickSize);}}this.minVal=E;this.maxVal=K;if(F&&!J){this.fireEvent("change",this);}},selectActiveSlider:function(H){var E=this.minSlider,D=this.maxSlider,J=E.isLocked()||!E.backgroundEnabled,G=D.isLocked()||!E.backgroundEnabled,F=YAHOO.util.Event,I;if(J||G){this.activeSlider=J?D:E;}else{if(this.isHoriz){I=F.getPageX(H)-E.thumb.initPageX-E.thumbCenterPoint.x;}else{I=F.getPageY(H)-E.thumb.initPageY-E.thumbCenterPoint.y;}this.activeSlider=I*2>D.getValue()+E.getValue()?D:E;}},_handleMouseDown:function(D){if(!D._handled){D._handled=true;this.selectActiveSlider(D);return B.Slider.prototype.onMouseDown.call(this.activeSlider,D);}else{return false;}},_handleMouseUp:function(D){B.Slider.prototype.onMouseUp.apply(this.activeSlider,arguments);},_oneTimeCallback:function(F,D,E){F.subscribe(D,function(){F.unsubscribe(D,arguments.callee);E.apply({},[].slice.apply(arguments));});},_cleanEvent:function(K,E){var J,I,D,G,H,F;if(K.__yui_events&&K.events[E]){for(I=K.__yui_events.length;I>=0;--I){if(K.__yui_events[I].type===E){J=K.__yui_events[I];break;}}if(J){H=J.subscribers;F=[];G=0;for(I=0,D=H.length;I<D;++I){if(H[I]){F[G++]=H[I];}}J.subscribers=F;}}}};YAHOO.lang.augmentProto(C,YAHOO.util.EventProvider);B.Slider.getHorizDualSlider=function(H,J,K,G,F,D){var I=new B.SliderThumb(J,H,0,G,0,0,F),E=new B.SliderThumb(K,H,0,G,0,0,F);return new C(new B.Slider(H,H,I,"horiz"),new B.Slider(H,H,E,"horiz"),G,D);};B.Slider.getVertDualSlider=function(H,J,K,G,F,D){var I=new B.SliderThumb(J,H,0,0,0,G,F),E=new B.SliderThumb(K,H,0,0,0,G,F);return new B.DualSlider(new B.Slider(H,H,I,"vert"),new B.Slider(H,H,E,"vert"),G,D);};YAHOO.widget.DualSlider=C;})();YAHOO.register("slider",YAHOO.widget.Slider,{version:"@VERSION@",build:"@BUILD@"});