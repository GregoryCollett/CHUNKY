"use strict";angular.module("chunky",["ngRoute","ui.bootstrap"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html"}).otherwise({redirectTo:"/"})}]).service("chunkySynth",["audioCtx","Oscillator","Filter","Envelope","Distortion","Reverb","LFO","Noise",function(a,b,c,d,e,f,g,h){var i=function(a){this.ctx=a,this.voices={},this.sampleRate=2048,this.osc1=new b(this.ctx,{shape:"sawtooth",octave:4,detune:-10}),this.osc2=new b(this.ctx,{shape:"sawtooth",octave:3,detune:10}),this.osc3=new b(this.ctx,{shape:"square",octave:1}),this.noise=new h(this.ctx),this.vcf=new c(this.ctx,{type:"bandpass"}),this.vcf2=new c(this.ctx,{type:"highpass"}),this.vcfEnvelope=new d(this.ctx),this.vcaEnvelope=new d(this.ctx),this.env1=new d(this.ctx),this.env2=new d(this.ctx),this.distortion=new e(this.ctx),this.reverb=new f(this.ctx),this.master=this.ctx.createGain(),this.analyser=this.ctx.createAnalyser(),this.oscs=[this.osc1,this.osc2,this.osc3,this.noise],this.filters=[this.vcf,this.vcf2],this.envelopes=[this.vcfEnvelope,this.vcaEnvelope,this.env1,this.env2],this.vcfmix=.5,this.analyser.fftSize=2048,this.master.gain.value=1;for(var i=0;i<this.oscs.length;i++)this.oscs[i].connect(this.vcf.input),this.oscs[i].connect(this.vcf2.input);this.vcf.connect(this.distortion.input),this.vcf2.connect(this.distortion.input),this.distortion.connect(this.reverb),this.reverb.connect(this.master),this.master.connect(this.analyser),this.analyser.connect(this.ctx.destination),this.vcfEnvelope.connect(this.vcf,["_filter","frequency"]),this.vcfEnvelope.connect(this.vcf2,["_filter","frequency"]),this.vcaEnvelope.connect(this.master,"gain"),this.lfo=new g(this.ctx,{target:this.vcf2._filter.frequency,callback:function(a,b){a.setValueAtTime(b,0)}})};return i.prototype=Object.create(null,{playNote:{value:function(a,b){var c;for(this.voices[a]=b,c=0;c<this.envelopes.length;c++)(!this.envelopes[c].reTrigger&&1===Object.keys(this.voices).length||this.envelopes[c].reTrigger)&&this.envelopes[c].triggerOn();for(c=0;c<this.oscs.length;c++)this.oscs[c].start(a,b)}},stop:{value:function(a,c){var d;for(delete this.voices[a],d=0;d<this.oscs.length;d++)this.oscs[d]instanceof b?this.oscs[d].stop(a,c):Object.keys(this.voices).length<1&&this.oscs[d].stop(a,c)}},loadPatch:{value:function(){}},savePatch:{value:function(){}},vcfMix:{enumberable:!0,get:function(){return this._vcfMix},set:function(a){this._vcfMix=a,this.vcf.input.gain.value=parseFloat(a),this.vcf2.input.gain.value=parseFloat(1-a)}},glide:{enumberable:!0,get:function(){return this._glide},set:function(a){this._glide=parseFloat(a)}}}),i.isEmpty=function(a){return 0===Object.keys(a).length},new i(a)}]).controller("chunkyController",["$scope","chunkySynth",function(a,b){a.chunky=b,a.keyboard={keydown:function(b,c){a.chunky.playNote(b,c)},keyup:function(b,c){a.chunky.stop(b,c)}}}]),angular.module("chunky").directive("knob",["$document",function(a){return{restrict:"EA",replace:!0,template:'<div class="knob"><p data-ng-if="label" data-ng-bind="label" class="label"></p><div class="knob-face"><div class="knob-moving-face"><div class="knob-hand"></div></div></div><canvas class="knob-progress"></canvas></div>',scope:{value:"=",label:"@",options:"=",min:"=",max:"=",speed:"=",scale:"=",step:"="},link:function(b,c){function d(a){o.clickpos=a.pageY||a.originalEvent.targetTouches[0].pageY,o.focus=!0,o.initdeg=l.data("degs"),c.data("md",!0)}function e(a){var d=a.pageY||a.originalEvent.targetTouches[0].pageY,e=l.data("degs"),f=(o.clickpos-d)*h.speed,g=f*v+e;p>g&&g>q?e=g:g>p?e=p:q>g&&(e=q),e>q?c.addClass("turned-on"):c.removeClass("turned-on"),l.data("degs",e),l.css("-webkit-transform","rotate("+e+"deg)"),l.css("-moz-transform","rotate("+e+"deg)"),l.css("-ms-transform","rotate("+e+"deg)"),l.css("-o-transform","rotate("+e+"deg)"),l.css("transform","rotate("+e+"deg)");var i=l.data("degs")+p,j=Math.round(i/t*u);j+=h.min*u,j/=u,b.$apply(function(){b.value=parseFloat(j.toFixed(2))}),r=a.pageY||a.originalEvent.targetTouches[0].pageY,a.preventDefault()}function f(){o.focus=!1,l.data("md",!1)}b.options=b.options||{};var g={range:270,responsive:b.options.responsive||!1,min:b.min||b.options.min||0,max:b.max||b.options.max||100,speed:b.speed||b.options.speed||.5,scale:b.scale||b.step||b.options.scale||1,holdKey:!1,groupKey:!1},h=g,i=h.range/2,j=c,k=c.find(".knob-face"),l=k.find(".knob-moving-face"),m=l.find(".knob-hand"),n=j.find(".knob-progress");l.css("position","relative").css("overflow","hidden").css("float","none").css("-webkit-transform","rotate("+-i+"deg)").css("-moz-transform","rotate("+-i+"deg)").css("-ms-transform","rotate("+-i+"deg)").css("-o-transform","rotate("+-i+"deg)").css("transform","rotate("+-i+"deg)").data("degs",-i).data("value",0).data("md",!1).css("z-index","29"),k.css("float","none"),n.css("position","absolute").css("top",0).css("left",0).css("width",0).css("z-index","0"),h.responsive&&(j.addClass("knob-responsive"),k.css("height",k.width()));l.width()/2-m.width()/2;m.css("position","absolute").css("left","15px").css("height",l.innerHeight()/2);var o={},p=h.range/2,q=-1*p,r=0,s=h.max-h.min,t=h.range/s,u=1/h.scale,v=h.range/(h.max-h.min)*h.scale;o.clickPos=0,o.focus=!1,o.holdKey=!1,o.groupKey=!1,o.initDeg=0,l.on("touchstart",function(a){d(a)}),a.on("touchmove",function(a){o.focus&&(e(a,!0),b.$apply())}),a.on("touchend",function(){f()}),l.on("mousedown",function(a){d(a)}),a.on("mousemove",function(a){o.focus&&(e(a,!1),b.$apply())}),a.on("mouseup",function(){f()})}}}]),angular.module("chunky").directive("keyboard",["$window",function(a){return{restrict:"EA",scope:{keyup:"&",keydown:"&",polyphonic:"="},link:function(b,c){var d=new QwertyHancock({id:c.id,width:a.window.innerWidth,height:150,octaves:2,startNote:"C0"}),e={};d.keyDown=function(a,c){b.$apply(function(){b.keydown()(a,c),e[a]=!0})},d.keyUp=function(a,c){b.$apply(function(){delete e[a],b.polyphonic&&b.keyup()(a,c)})}}}}]),angular.module("chunky").directive("oscilloscope",function(){return{restrict:"EA",template:"<canvas></canvas>",replace:!0,scope:{analyser:"="},link:function(a,b){var c=b.parent(),d=b[0],e=d.getContext("2d"),f=a.analyser.fftSize,g=new Uint8Array(f);d.width=c[0].offsetWidth,a.analyser.getByteTimeDomainData(g);var h=function(){requestAnimationFrame(h);a.analyser.getByteTimeDomainData(g),e.fillStyle="rgb(200, 200, 200)",e.fillRect(0,0,d.width,d.height),e.lineWidth=2,e.strokeStyle="rgb(0, 0, 0)",e.beginPath();for(var b=10*d.width/f,c=0,i=0;f>i;i++){var j=g[i]/128,k=j*d.height/2;0===i?e.moveTo(c,k):e.lineTo(c,k),c+=b}e.lineTo(d.width,d.height/2),e.stroke()};h()}}}),angular.module("chunky").directive("envelope",["$window",function(){return{restrict:"EA",template:"<canvas></canvas>",replace:!0,scope:{params:"=",inverted:"="},link:function(a,b){function c(){requestAnimationFrame(c);e.clearRect(0,0,f,g),e.lineWidth=2,e.beginPath(),a.inverted?(e.moveTo(h*(1-a.params.attack),0),e.lineTo(h,g),e.lineTo(h*(a.params.decay+1),g*(1-a.params.sustain)),e.lineTo(3*h,g*(1-a.params.sustain)),e.lineTo(h*(a.params.release+3),0)):(e.moveTo(h*(1-a.params.attack),g),e.lineTo(h,0),e.lineTo(h*(a.params.decay+1),g*(1-a.params.sustain)),e.lineTo(3*h,g*(1-a.params.sustain)),e.lineTo(h*(a.params.release+3),g)),e.strokeStyle="rgb(196,221,232)",e.stroke()}var d=b,e=(b.parent(),d[0].getContext("2d")),f=d[0].width,g=d[0].height,h=f/4;d.css("background-color","rgba(9,12,21,0.6)").css("border","1px solid rgb(57,64,72)").css("margin-top","5px"),c()}}}]),angular.module("chunky").directive("killRightClick",["$document",function(a){return{restrict:"CA",link:function(){a.on("contextmenu",function(){})}}}]),angular.module("chunky").service("audioCtx",["$window",function(){var a=window.AudioContext||window.webkitAudioContext||window.mozAudioContext||window.oAudioContext||window.msAudioContext;return a?new a:void 0}]),angular.module("chunky").factory("Oscillator",function(){var a=function(a){return 0===Object.keys(a).length},b=function(a,b){b=b||{},this.ctx=a,this.type="oscillator",this.voices={},this.controlNode=a.createGain(),this.node=this.ctx.createGain(),this.output=a.createGain(),this.frequency=b.frequency||55,this.octave=b.octave||2,this.fine=b.detune||0,this.shape=b.shape||"sine",this.controlNode.gain.value=.5,this.node.gain.value=0,this.output.gain.value=0,this.controlNode.connect(this.node),this.node.connect(this.output),this._enabled=!1};return b.prototype=Object.create(null,{connect:{value:function(a){this.output.connect(a.input?a.input:a)}},disconnect:{value:function(){this.output.disconnect()}},init:{value:function(){}},start:{value:function(a,b){this.frequency=b;var c=this.ctx.currentTime,d=this.ctx.createOscillator();return d.type=this.shape,d.frequency.value=this.frequency,d.detune.value=this.fine,d.connect(this.controlNode),d.start(0),this.voices[a]=d,this.output.gain.setValueAtTime(1,c),this}},stop:{value:function(b){return this.voices[b].disconnect(),delete this.voices[b],a(this.voices)&&this.output.gain.setValueAtTime(0,0),this}},shape:{enumerable:!0,get:function(){return this._shape},set:function(a){this._shape=a}},frequency:{enumerable:!0,get:function(){return this._frequency},set:function(a){this._frequencyKey=a,this._frequency=Math.pow(2,this.octave)*this._frequencyKey}},octave:{enumerable:!0,get:function(){return this._octave},set:function(a){this._octave=a}},fine:{enumerable:!0,get:function(){return this._fine},set:function(a){this._fine=a}},gain:{enumerable:!0,get:function(){return this.controlNode.gain.value},set:function(a){this.controlNode.gain.setValueAtTime(a,0)}},enabled:{enumerable:!0,get:function(){return this._enabled},set:function(a){this._enabled=a,this._enabled?this.node.gain.setValueAtTime(1,0):this.node.gain.setValueAtTime(0,0)}}}),b}),angular.module("chunky").factory("Noise",function(){var a={white:function(a){var b,c;for(b=a.outputBuffer.getChannelData(0),c=0;c<b.length;c++)b[c]=2*Math.random()-1},pink:function(a){var b,c,d,e,f,g,h,i,j,k;for(b=c=d=e=f=g=h=0,i=a.outputBuffer.getChannelData(0),k=0;k<i.length;k++)j=2*Math.random()-1,b=.99886*b+.0555179*j,c=.99332*c+.0750759*j,d=.969*d+.153852*j,e=.8665*e+.3104856*j,f=.55*f+.5329522*j,g=-.7616*g-.016898*j,i[k]=b+c+d+e+f+g+h+.5362*j,i[k]*=.11,h=.115926*j},brown:function(a){var b,c,d,e;for(b=a.outputBuffer.getChannelData(0),d=0,e=0;e<b.length;e++)c=2*Math.random()-1,b[e]=(d+.02*c)/1.02,d=b[e],b[e]*=3.5}},b=function(b,c){c=c||{},this.ctx=b,this.type="noise",this.node=this.ctx.createScriptProcessor(2048,1,1),this._wet=this.ctx.createGain(),this._controlGain=this.ctx.createGain(),this.output=this.ctx.createGain(),this._enabled=!1,this._type=c.type||"white",this._wet.gain.value=0,this.output.gain.value=0,this.node.onaudioprocess=a[this._type],this.node.connect(this._wet),this._wet.connect(this._controlGain),this._controlGain.connect(this.output)};return b.prototype=Object.create(null,{connect:{value:function(a){this.output.connect(a)}},disconnect:{value:function(){this.output.disconnect()}},start:{value:function(){this.output.gain.setValueAtTime(1,0)}},stop:{value:function(){this.output.gain.setValueAtTime(0,0)}},gain:{enumerable:!0,get:function(){return this._controlGain.gain.value},set:function(a){this._controlGain.gain.setValueAtTime(a,0)}},enabled:{enumerable:!0,get:function(){return this._enabled},set:function(a){this._enabled=a,this._enabled?this._wet.gain.setValueAtTime(1,0):this._wet.gain.setValueAtTime(0,0)}},generator:{enumerable:!0,get:function(){return this._type},set:function(b){this._type=b,this.node.onaudioprocess=a[b]}}}),b.White=function(a){var c={};return c.onaudioprocess=function(a){var b,c;for(b=a.outputBuffer.getChannelData(0),c=0;c<b.length;c++)b[c]=2*Math.random()-1},new b(a,c)},b.Pink=function(a){var c={};return c.onaudioprocess=function(a){var b,c,d,e,f,g,h,i,j,k;for(b=c=d=e=f=g=h=0,i=a.outputBuffer.getChannelData(0),j=2*Math.random()-1,k=0;k<i.length;k++)b=.99886*b+.0555179*j,c=.99332*c+.0750759*j,d=.969*d+.153852*j,e=.8665*e+.3104856*j,f=.55*f+.5329522*j,g=-.7616*g-.016898*j,i[k]=b+c+d+e+f+g+h+.5362*j,i[k]*=.11,h=.115926*j},new b(a,c)},b.Brown=function(a){var c={};return c.onaudioprocess=function(a){var b,c,d,e;for(b=a.outputBuffer.getChannelData(0),c=2*Math.random()-1,d=0,e=0;e<b.length;e++)b[e]=(d+.02*c)/1.02,d=b[e],b[e]*=3.5},new b(a,c)},b}),angular.module("chunky").factory("Filter",function(){var a=function(a,b){this.ctx=a,this.input=this.ctx.createGain(),this.output=this.ctx.createGain(),this._filter=this.ctx.createBiquadFilter(),this._dry=this.ctx.createGain(),this._wet=this.ctx.createGain();var c=this.meta.params;b=b||{},this._type=b.type||c.type.defaultValue,this._filter.frequency.value=b.frequency||c.frequency.defaultValue,this._filter.Q.value=b.resonance||c.resonance.defaultValue,this._filter.gain.value=b.gain||c.gain.defaultValue,this._wet.gain.value=b.wet||c.wet.defaultValue,this._dry.gain.value=b.dry||c.dry.defaultValue,this._filter.type=this._type,this.input.connect(this._filter),this._filter.connect(this._wet),this._wet.connect(this.output),this.input.connect(this._dry),this._dry.connect(this.output),this._enabled=!0,this._envelope=void 0};return a.prototype=Object.create(null,{connect:{value:function(a){this.output.connect(a)}},disconnect:{value:function(){this.output.disconnect()}},meta:{value:{params:{frequency:{min:30,max:22050,defaultValue:300,type:"float"},resonance:{min:1e-4,max:20,defaultValue:1,type:"float"},gain:{min:-40,max:40,defaultValue:1,type:"float"},wet:{min:0,max:1,defaultValue:1,type:"float"},dry:{min:0,max:1,defaultValue:0,type:"float"}}}},envelope:{enumerable:!0,get:function(){return this._envelope},set:function(a){this._envelope=a,this._envelope.range=[80,25e3*Math.pow(this.frequency/1e3,2)+80]}},frequency:{enumerable:!0,get:function(){return this._filter.frequency.value},set:function(a){this._filter.frequency.setValueAtTime(a,0),this._envelope&&this._envelope.range&&(this._envelope.range=[80,25e3*Math.pow(a/1e3,2)+80])}},resonance:{enumerable:!0,get:function(){return this._filter.Q.value},set:function(a){this._filter.Q.setValueAtTime(a,0)}},gain:{enumerable:!0,get:function(){return this._filter.gain.value},set:function(a){this._filter.gain.setValueAtTime(a,0)}},wet:{enumerable:!0,get:function(){return this._wet.gain.value},set:function(a){this._wet.gain.setValueAtTime(a,0)}},dry:{enumerable:!0,get:function(){return this._dry.gain.value},set:function(a){this._dry.gain.setValueAtTime(a,0)}},enabled:{enumerable:!0,get:function(){return this._enabled},set:function(a){this._enabled=a,this._enabled?(this._dry.gain.setValueAtTime(0,0),this._wet.gain.setValueAtTime(1,0)):(this._dry.gain.setValueAtTime(1,0),this._wet.gain.setValueAtTime(0,0))}}}),a}),angular.module("chunky").factory("Envelope",function(){var a=function(a){this.parent=a.parent||null,this.target=a.target||null,this.meta=a.meta||{},this.range=a.range||this.params.range.defaultValue};a.prototype=Object.create(null,{range:{get:function(){return[this.min,this.max]},set:function(a){this.min=parseFloat(a[0]),this.max=parseFloat(a[1])}},params:{value:{range:{defaultValue:[0,1]}}}});var b=function(a){this.ctx=a,this.attack=1e3,this.decay=5e4,this.sustain=100,this.release=1e3,this.inverted=!1,this.reTrigger=!1,this.targets=[]};return b.prototype=Object.create(null,{params:{value:{attack:{name:"attack",label:"ATK",min:0,max:5e4},decay:{name:"decay",label:"DCY",min:0,max:5e4},sustain:{name:"sustain",label:"SUS",min:0,max:100},release:{name:"release",label:"REL",min:0,max:5e4}}},connect:{value:function(b,c,d){var e;e=angular.isArray(c)?b[c[0]][c[1]]:b[c];var f=new a({parent:b,target:e,meta:d});return b.envelope=f,this.targets.push(f),f}},attack:{get:function(){return this._attack},set:function(a){this._attack=parseFloat(a/5e4)}},decay:{get:function(){return this._decay},set:function(a){this._decay=parseFloat(a/5e4)}},sustain:{get:function(){return this._sustain},set:function(a){this._sustain=parseFloat(a/100)}},release:{get:function(){return this._release},set:function(a){this._release=parseFloat(a/5e4)}},inverted:{enumerable:!0,get:function(){return this._inverted},set:function(a){this._inverted=a}},reTrigger:{enumerable:!0,get:function(){return this._retrig},set:function(a){this._retrig=a}},triggerOn:{value:function(){for(var a=this.ctx.currentTime,b=0;b<this.targets.length;b++)this.processTriggerOn(this.targets[b],a)}},processTriggerOn:{value:function(a,b){this.inverted?(a.target.cancelScheduledValues(b),a.target.setValueAtTime(a.max,b),a.target.linearRampToValueAtTime(a.min,b+this.attack),a.target.linearRampToValueAtTime(this.sustain*(a.min-a.max)+a.max,b+this.attack+this.decay)):(a.target.cancelScheduledValues(b),a.target.setValueAtTime(a.min,b),a.target.exponentialRampToValueAtTime(a.max,b+this.attack),a.target.linearRampToValueAtTime(this.sustain*(a.max-a.min)+a.min,b+this.attack+this.decay))}},triggerOff:{value:function(){for(var a=this.ctx.currentTime,b=0;b<this.targets.length;b++)this.targets[b].target.linearRampToValueAtTime(0,a+this.release),this.targets[b].target.linearRampToValueAtTime(0,a+this.release+.01),this.targets[b].target.cancelScheduledValues(0,a+this.release+.02)}}}),b}),angular.module("chunky").factory("LFO",function(){var a=function(a,b){b=b||{},this.ctx=a,this.output=this.ctx.createScriptProcessor(256,1,1),this.frequency=b.frequency||this.params.frequency.value,this.offset=b.offset||this.params.offset.value,this.oscillation=b.offset||this.params.oscillation.value,this.phase=b.phase||this.params.phase.value,this.target=b.target||{},this.output.onaudioprocess=this.callback(b.callback||function(){}),this.output.connect(this.ctx.destination)};return a.prototype=Object.create(null,{params:{writable:!0,value:{frequency:{name:"frequency",label:"FREQ",value:1,defaultValue:1,min:0,max:20,step:.01,type:"float"},offset:{name:"offset",label:"OFST",value:.85,defaultValue:.85,min:0,max:22049,step:1,type:"float"},oscillation:{name:"oscillation",label:"OSC",value:.3,defaultValue:.3,min:-22050,max:22050,step:1,type:"float"},phase:{name:"phase",label:"PHSE",value:0,defaultValue:0,min:0,max:2*Math.PI,step:.01,type:"float"}}},frequency:{enumerable:!0,get:function(){return this._frequency},set:function(a){this._frequency=parseFloat(a),this.params.frequency.value=parseFloat(a),this._phaseInc=2*Math.PI*this._frequency*256*44100}},offset:{enumerable:!0,get:function(){return this._offset},set:function(a){this._offset=parseFloat(a),this.params.offset.value=parseFloat(a)}},oscillation:{enumerable:!0,get:function(){return this._oscillation},set:function(a){this._oscillation=parseFloat(a),this.params.oscillation.value=parseFloat(a)}},phase:{get:function(){return this._phase},set:function(a){this._phase=parseFloat(a),this.params.phase.value=parseFloat(a)}},target:{get:function(){return this._target},set:function(a){this._target=a}},callback:{value:function(a){var b=this;return function(){b._phase+=b._phaseInc,b._phase>2*Math.PI&&(b._phase=0),a(b._target,b._offset+b._oscillation*Math.sin(b._phase))}}}}),a}),angular.module("chunky").factory("Reverb",function(){var a=function(a){this.ctx=a,this.input=this.ctx.createGain(),this.node=this.ctx.createConvolver(),this.output=this.ctx.createGain(),this._dry=this.ctx.createGain(),this._wet=this.ctx.createGain(),this.output.gain.value=1,this._dry.gain.value=1,this._wet.gain.value=0,this._seconds=2,this._decay=2,this._reverse=0,this.input.connect(this.node),this.node.connect(this._wet),this._wet.connect(this.output),this.input.connect(this._dry),this._dry.connect(this.output),this.buildImpulse(),this.enabled=!1};return a.prototype=Object.create(null,{meta:{value:{params:{}}},connect:{value:function(a){this.output.connect(a)}},disconnect:{value:function(){this.output.disconnect()}},buildImpulse:{value:function(){var a,b,c=this.ctx.sampleRate,d=c*this._seconds,e=this._decay,f=this.ctx.createBuffer(2,d,c),g=f.getChannelData(0),h=f.getChannelData(1);for(b=0;d>b;b++)a=this._reverse?d-1:b,g[b]=(2*Math.random()-1)*Math.pow(1-a/d,e),h[b]=(2*Math.random()-1)*Math.pow(1-a/d,e);this.node.buffer=f}},toggleEnabled:{value:function(){this.enabled=!this.enabled,this.enabled?(this._dry.gain.value=.2,this._wet.gain.value=1):(this._dry.gain.value=1,this._wet.gain.value=0)}},seconds:{enumerable:!0,get:function(){return this._seconds},set:function(a){this._seconds=a,this.buildImpulse()}},decay:{enumerable:!0,get:function(){return this._decay},set:function(a){this._decay=a,this.buildImpulse()}}}),a}),angular.module("chunky").factory("Distortion",function(){var a=function(a){this.ctx=a,this.input=this.ctx.createGain(),this.output=this.ctx.createGain(),this.wet=this.ctx.createGain(),this.wet.gain.value=0,this.dry=this.ctx.createGain(),this.dry.gain.value=1,this.bandpass=this.ctx.createBiquadFilter(),this.bandpassWet=this.ctx.createGain(),this.bandpassDry=this.ctx.createGain(),this.waveShaper=this.ctx.createWaveShaper(),this.lowpass=this.ctx.createBiquadFilter(),this.input.connect(this.dry),this.input.connect(this.wet),this.wet.connect(this.bandpass),this.bandpass.connect(this.bandpassWet),this.bandpass.connect(this.bandpassDry),this.bandpassWet.connect(this.waveShaper),this.bandpassDry.connect(this.waveShaper),this.waveShaper.connect(this.lowpass),this.dry.connect(this.output),this.lowpass.connect(this.output),this.bandpass.frequency.value=800,this.bandpassWet.gain.value=.5,this.lowpass.frequency.value=3e3,this._drive=.5,this.bandpassDry.gain.value=.5,this.enabled=!1};return a.prototype=Object.create(null,{meta:{value:{params:{preBand:{min:0,max:1,defaultValue:.5,type:"float"},colour:{min:0,max:22050,defaultValue:800,type:"float"},drive:{min:0,max:1,defaultValue:.5,type:"float"},postCut:{min:0,max:22050,defaultValue:3e3,type:"float"}}}},connect:{value:function(a){this.output.connect(a.input?a.input:a)}},disconnect:{value:function(){this.output.disconnect()}},preBand:{enumerable:!0,get:function(){return this.bandpassWet.gain.value},set:function(a){this.bandpassWet.gain.setValueAtTime(a,0),this.bandpassDry.gain.setValueAtTime(1-a,0)}},colour:{enumerable:!0,get:function(){return this.bandpass.frequency.value},set:function(a){this.bandpass.frequency.setValueAtTime(a,0)}},drive:{enumerable:!0,get:function(){return this._drive},set:function(a){var b=100*a,c=22050,d=new Float32Array(c),e=Math.PI/180,f=0;for(this._drive=a,f;c>f;f++){var g=2*f/c-1;d[f]=(3+b)*g*20*e/(Math.PI+b*Math.abs(g))}}},postCut:{enumerable:!0,get:function(){return this.lowpass.frequency.value},set:function(a){this.lowpass.frequency.setValueAtTime(a,0)}},toggleEnabled:{value:function(){this.enabled=!this.enabled,this.enabled?(this.dry.gain.value=.4,this.wet.gain.value=1):(this.dry.gain.value=1,this.wet.gain.value=0)}}}),a});