/**
@数字滚动抽奖组件
属性：
arrlist----| 必填 Array  数字一维数组 
speed------| 可选 Number 数字跳动的速度 默认值0.1秒，单位是秒
max--------| 可选 Number 最大抽奖次数 默认值999999
hidebtn----| 可选 Boolean 是否隐藏组件的控制按钮 默认值 false 

事件：
initReward----| 初始化组件，接收一个数字数组参数。 调用方式 evtCrnter.$emit('initReward',[5,6,9]);
startReward---| 触发开始抽奖按钮。调用方式 evtCrnter.$emit('startReward');
resetReward---| 触发重置按钮。调用方式 evtCrnter.$emit('resetReward');
finishReward--| 每次抽奖完成后执行的函数，会传递出一个参数：当前完成的抽奖次数。监听方式：evtCrnter.$on('finishReward',func(t));


----------demo------------
<div id="rrr">
	<vreward :arrlist="arr3"></vreward>
	<button @click="fun1">初始化</button>
	<button @click="fun3">开始</button>
	<button @click="fun4">重置</button>
</div>

var r = new Vue({
	el:'#rrr',
	data:{
		arr3 : [9,8,3,5,4,0,6,9,5]
	},
	methods:{
		fun1:function(){
			console.log('开始了');
			evtCrnter.$emit('initReward',[5,6,9]);
		},
		fun2:function(ct){
			console.log('结束了'+ct);
		},
		fun3:function(){
			evtCrnter.$emit('startReward');
		},
		fun4:function(){
			evtCrnter.$emit('resetReward');
		}
	},
	mounted:function(){
		evtCrnter.$on('finishReward',this.fun2)
	}
});
*/
var evtCrnter = new Vue({});0
Vue.component('vreward',{
	template:'<div class="reward-wrap">\
		<div v-for="(item,index) in arrs" :class="[\'item\',{\'current\':index == currentSit}]">{{item.current}}</div>\
		<span class="ctrlBtnsGroup" v-if="!hidebtn">\
			<span class="item ctrlBtns" @click="setNum" v-if="beginCtrl == 1">开始</span>\
			<span class="item ctrlBtns" v-if="beginCtrl == 2">进行中...</span>\
			<span class="item ctrlBtns" @click="reSet" v-if="beginCtrl == 3">重置</span>\
			<span class="item ctrlBtns" v-if="beginCtrl == 4">没有机会了</span>\
		</span>\
	</div>',
	props:['arrlist','speed','max','hidebtn'],
	data:function(){
		return {
			arrs:[], // 数字数组
			currentSit : 0, // 当前位置
			times : 0, // 当前抽奖次数
			maxTimes:0,
			skipSpeed : 0,
			beginCtrl:1 // 1 开始； 2 进行中；3 重置；4 超过最大次数禁用
		}
	},
	methods:{
		init:function(arr){
			this.skipSpeed = this.$options.propsData.speed ? this.$options.propsData.speed*1000 : 100;
			this.maxTimes = this.$options.propsData.max ? this.$options.propsData.max : 99999;
			this.arrs = [];
			this.reSet();
			if(arr && arr.length){
				for(var i=0;i<arr.length;i++){
					this.arrs.push({current:0,end:arr[i]});
				}
				return;
			}
			else if(this.$options.propsData.arrlist.length){
				var al = this.$options.propsData.arrlist;
				for(var i=0;i<al.length;i++){
					this.arrs.push({current:0,end:al[i]});
				}
			}else{
				console.info('the array list of number is must');
				return;
			}
		},
		setNum : function(){
			var _this = this;
			if(this.times < this.maxTimes){
				_this.beginCtrl = 2;
				if(_this.currentSit<_this.arrs.length){
					setTimeout(function(){
						_this.setCurNum();
					},_this.skipSpeed);
				}else{
					_this.times++;
					_this.beginCtrl = 3;
					
					// 当前轮抽奖完成后触发完成事件
					evtCrnter.$emit('finishReward',_this.times);
				}
			}else{
				// 设置状态
				this.beginCtrl=4;
			}
		},
		setCurNum : function(){
			
			if(this.arrs[this.currentSit].current<this.arrs[this.currentSit].end){
				this.arrs[this.currentSit].current++;
			}else{
				this.currentSit++;
			}
			this.setNum();
			
		},
		reSet : function(){
			var _this = this;
			this.currentSit = 0;
			_this.beginCtrl = 1;
			
			for(var i=0;i<this.arrs.length;i++){
				this.arrs[i].current = 0;
			}
			
		}
	},
	mounted:function(){
		//初始化数据
		this.init();
		
		// 暴露开始监听事件
		evtCrnter.$on('startReward',this.setNum);
		// 暴露重置监听事件
		evtCrnter.$on('resetReward',this.reSet);
		// 暴露初始化监听事件
		evtCrnter.$on('initReward',this.init);
	}
});