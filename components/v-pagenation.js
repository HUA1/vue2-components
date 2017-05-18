/* vue分页组件
调用方式：
<v-pagenation :total="20" :current="1" :viewnum="10" :changpage="'getDataBypage'" :canskip="true"></v-pagenation>

属性说明：
total：    Number *必须 页码总数
current：  Number 可选 当前页码 默认值 1
viewnum：  Number 可选 可见页数个数 默认值 10
canskip:   boolean 可选 是否显示跳页 默认false
changpage：String *必须 点击页码时要执行的方法名称(此方法应该是父组件中的名称);此方法可以接收一个值：pageNo,当前点击时的页码数
*/

Vue.component('v-pagenation',{
	template:'<div class="v-pagenation" v-if="total>0">\
		<ul>\
			<li v-if="starPage>1" @click="changePage(1)"><span class="span">首页</span></li>\
			<li v-if="(curpage-1)<=0"><span class="span">&lt;</span></li>\
			<li v-else @click="changePage(curpage-1)"><span class="span">&lt;</span></li>\
			<li v-for="page in total" v-if="page>=starPage && page<=endPage" :class="{\'activepage\':page == curpage}">\
				<span class="span" v-if="page == curpage">{{page}}</span>\
				<span class="span" v-else @click="changePage(page)">{{page}}</span>\
			</li>\
			<li v-if="(curpage+1)<=total" @click="changePage(curpage+1)"><span class="span">&gt;</span></li>\
			<li v-else><span class="span">&gt;</span></li>\
			<li v-if="endPage<total" @click="changePage(total)"><span class="span">末页</span></li>\
		</ul>\
		<span class="page-info">共{{total}}页</span>\
		<span class="page-info" v-if="canskip ? canskip : false">到\
			<select v-model="skipPage" @change="skipToPage()">\
				<option v-for="page in total" :value="page">{{page}}</option>\
			</select>\
		页</span>\
	</div>',
	data:function(){
		return {
			curpage:1,
			starPage:1,
			endPage:10,
			
			totalpage:21,
			canviewnum:10,
			skipPage:1
		}
	},
	props:['total','current','viewnum','changpage','canskip'],
	methods:{
		changePage:function(page){
			this.curpage = page;
			this.skipPage = page;
			this.setList(page);
			// 触发父组件上的方法并传递当前页码
			this.$parent.$emit('v-pagenation',page);
		},
		setList:function(curpage){
			// 总页数不小于可见页数时
			if(this.$options.propsData.total>=this.canviewnum){
				if(curpage>=this.endPage && curpage!=this.$options.propsData.total){
					// 这里处理的是下一页等情况
					//this.starPage = this.starPage+1;
					this.starPage = curpage-(this.canviewnum-2);
					this.endPage = curpage+1;
				}
				else if(curpage<=this.starPage && curpage != 1){
					// 这里处理的是上一页等情况
					this.starPage = curpage-1;
					//this.endPage = this.endPage-1;
					this.endPage = curpage+(this.canviewnum-2);
				}
				else if(curpage == this.$options.propsData.total){
					// 这里处理的是点击末页的情况
					this.starPage = curpage-(this.canviewnum-1);
					this.endPage = curpage;
				}
				else if(curpage == 1){
					// 这里处理的是点击首页的情况
					this.starPage = curpage;
					this.endPage = this.canviewnum;
				}
				
			}
			// 总页数小于可见页数时
			else{
				this.starPage = 1;
				this.endPage = this.$options.propsData.total;
			}
		},
		skipToPage:function(){
			this.curpage = this.skipPage;
			this.setList(this.skipPage);
			// 触发父组件上的方法并传递当前页码
			this.$parent.$emit('v-pagenation',this.skipPage);
		}
	},
	mounted:function(){
		
		// 初始化起始页码和当前页码以及显示页数
		this.starPage = 1;
		this.curpage = this.$options.propsData.current || 1;
		this.canviewnum = this.$options.propsData.viewnum || 10;
		
		//if(this.$options.propsData.total>this.canviewnum){
			this.endPage = this.canviewnum;
		//}else{
		//	this.endPage = this.$options.propsData.total;
		//}
		
		// 给父组件添加监听事件
		this.$parent.$on('v-pagenation',this.$parent[this.$options.propsData.changpage])
	}
});

// 前端验证码组件
Vue.component('v-code',{
	template:'<canvas id="v-code-canvas" @click="setCode"></canvas>',
	data:function(){
		return {
			codeDic:'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
			vcode:''
		}
	},
	props:['changecode'],
	methods:{
		setCode:function(){
			var _this = this;
			_this.vcode = '';
			
			for(var i = 0;i<4;i++){
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
			for(var i = 0;i<4;i++){
				var n = parseInt(Math.random()*10);
				var x = parseInt(20)+parseInt(i*12);
				var y = parseInt(20)+parseInt(b[n]);
				context.fillText(_this.vcode[i],x,y);
			}
			console.log(canvas.toDataURL("images/jpeg",0.1))
			
			// 通知父组件
			if(_this.$options.propsData.changecode){
				_this.$parent.$emit('v-code-mark',_this.vcode);
			}
		}
	},
	mounted:function(){
		var _this = this;
		this.setCode();
		if(_this.$options.propsData.changecode){
			this.$parent.$on('v-code-mark',_this.$parent[_this.$options.propsData.changecode])
		}
	}
});
