/*
前端生成验证码组件
调用方式：
<v-code width="80" height="32" :changecode="'vcodeChage'" :codesize="6"></v-code>
参数说明：
changecode；String 可选 点击图片更新验证码后执行的方法.应该传父组件中函数的名称，函数可接收一个参数vCode:更换后的验证码

codesize：Number 可选 验证码的位数。默认值4，最大支持6位数字加字母
*/
Vue.component('v-code',{
	template:'<canvas id="v-code-canvas" @click="setCode"></canvas>',
	data:function(){
		return {
			codeDic:'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
			vcode:'',
			codeSize:4
		}
	},
	props:['changecode','codesize'],
	methods:{
		setCode:function(){
			var _this = this;
			_this.vcode = '';
			
			for(var i = 0;i<_this.codeSize;i++){
				var n = parseInt(Math.random()*100);
				_this.vcode += _this.codeDic[n];
			}
			
			var canvas = document.getElementById('v-code-canvas');
			var context = canvas.getContext('2d');
			context.clearRect(0,0,80,32);
			
			// 干扰线
			context.lineStyle='#ccc';
			context.lineWidth='2px';
			context.beginPath();
			
			var bx1 = parseInt(Math.random()*100);
			var by1 = parseInt(Math.random()*100);
			var bx2 = parseInt(Math.random()*100);
			var by2 = parseInt(Math.random()*100);
			var bx3 = parseInt(Math.random()*100);
			var by3 = parseInt(Math.random()*100);
			
			var yy =  parseInt(Math.random()*10)
			// 第一条
			context.moveTo(0,yy);
			
			context.bezierCurveTo(by1,by2,by3,bx2,bx1,bx3);
			// 第二条
			context.moveTo(0,yy-20);
			context.bezierCurveTo(by3,bx1,bx2,by1,bx3,by2);
			context.stroke();
			
			// 写验证码
			var b = [0,-2,2,-3,3,-3.5,3.5,-4,4,2.5,-2.5];
			context.textAlign="center"; 
			context.font = "normal small-caps normal 18px arial"; 
			context.fillStyle = '#8d9eff';
			for(var i = 0;i<_this.codeSize;i++){
				var n = parseInt(Math.random()*10);
				var x = parseInt(15)+parseInt(i*11);
				var y = parseInt(20)+parseInt(b[n]);
				context.fillText(_this.vcode[i],x,y);
			}
			//console.log(canvas.toDataURL("images/jpeg",0.1))
			
			// 通知父组件
			if(_this.$options.propsData.changecode){
				_this.$parent.$emit('v-code-mark',_this.vcode);
			}
		}
	},
	mounted:function(){
		var _this = this;
		
		if(_this.$options.propsData.changecode){
			this.$parent.$on('v-code-mark',_this.$parent[_this.$options.propsData.changecode])
		}
		
		if(_this.$options.propsData.codesize != 0 && _this.$options.propsData.codesize != '' && _this.$options.propsData.codesize !=undefined && _this.$options.propsData.codesize != null && _this.$options.propsData.codesize<=6){
			_this.codeSize = _this.$options.propsData.codesize
		}
		
		this.setCode();
	}
});