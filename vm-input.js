/*模拟数字输入框组件，只是为了打发无聊的时间
	使用v-model绑定数据;只支持数字输入
Demo：
<div id="test">
	<vm-input class="vm-input" v-model="testNum"></vm-input>
	<p>&nbsp;</p>
	<p>这是来自实例的：{{testNum}}</p>
	<button @click="changeVal">改变值</button>
</div>

<script>
var test = new Vue({
	el:'#test',
	data:{
		testNum :5
	},
	methods:{
		changeVal:function(){
			this.testNum = '10.00'
		}
	}
});
</script>
*/
Vue.component('vm-input',{
	template:'<div ref="vminput" @click="focusThis" :class="{\'focu\':isFocus}">\
		<span class="vm-view" :style="{\'margin-left\':\'-\'+leftHid+\'px\'}">{{inputNum}}</span>\
		<span class="vm-mark" v-if="isFocus"></span>\
	</div>',
	data:function(){
		
		return {
			inputNum:'',
			isFocus:false,
			leftHid:0
		}
	},
	props:['value'],
	methods:{
		inputNumFun:function(evt){
			console.log(evt)
		},
		keyUpEvt:function(e){
			var _this = this;
			
			if(e.key == 0 ||
				e.key == 1 ||
				e.key == 2 || 
				e.key == 3 || 
				e.key == 4 || 
				e.key == 5 || 
				e.key == 6 || 
				e.key == 7 || 
				e.key == 8 || 
				e.key == 9
			){
				_this.inputNum += e.key;
			}
			else if(e.keyCode == 8 || e.keyCode == 46){
				_this.inputNum = _this.inputNum.substr(0,_this.inputNum.length-1);
			}
			else if(e.key == '.' && _this.inputNum.indexOf('.')<0){
				_this.inputNum += e.key;
			}
			else if(e.keyCode == 38){
				_this.inputNum =_this.changeNum(_this.inputNum,'add')
			}
			else if(e.keyCode == 40){
				_this.inputNum =_this.changeNum(_this.inputNum,'desc')
			}
			_this.setViewSpace();
			_this.$emit('input',_this.inputNum);
		},
		focusThis:function(){
			var _this = this;
			_this.isFocus = true;
			
			window.addEventListener('keydown',_this.keyUpEvt,false);
		},
		blurThis:function(){
			var _this = this;
			_this.isFocus = false;
			
			window.removeEventListener('keydown',_this.keyUpEvt,false);
		},
		/* 当输入的数字超出宽度后 */
		setViewSpace:function(){
			//console.log(this.$el.childNodes[0].clientWidth)
			var pw = (this.$el.clientWidth-12)*.94;
			var w = this.$el.childNodes[0].clientWidth;
			if(w>=pw){
				this.leftHid = w-pw;
			}else{
				this.leftHid = 0;
			}
		},
		changeNum:function(str,type){
			var n = str.split('.');
			var res,nen;
			if(type == 'add'){
				nen = Number(n[0]) + 1;
			}
			else if(type == 'desc'){
				nen = Number(n[0]) - 1;
			}
			
			
			res = n[1] ? nen +'.'+ n[1] : nen;
			return res
		}
	},
	mounted:function(){
		var _this = this;
		window.addEventListener('click',function(e){
			if(e.target.className.indexOf('vm-input')>=0){
				_this.focusThis();
			}else{
				_this.blurThis();
			}
			
		});
		
		_this.inputNum = _this.$options.propsData.value+'';

	},
	watch:{
		value:function(n,o){
			this.inputNum = '';
			
			this.inputNum = n+'';
			this.$nextTick(this.setViewSpace);
		}
	}
});
