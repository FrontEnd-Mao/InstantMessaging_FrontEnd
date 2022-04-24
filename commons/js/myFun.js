export default {
	//聊天处理时间格式
	changeTime: function(timeStr) {
		let date = new Date(timeStr)
		let changeTimeStr = '';
		//获取今天的时间
		let nowYear = new Date().getFullYear(),
			nowMonth = new Date().getMonth() + 1,
			nowDay = new Date().getDate();
		//获取当时的时间
		let timeYear = date.getFullYear(),
			timeMonth = date.getMonth() + 1 > 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1),
			timeDay = date.getDate() > 10 ? date.getDate() : '0' + date.getDate(),
			timeHours = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours(),
			timeMinutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
		//判断时间
		if (nowYear != timeYear)
			changeTimeStr = timeYear + '/' + timeMonth + '/' + timeDay + ' ' + timeHours + ':' + timeMinutes;
		else {
			if ((nowMonth != timeMonth && nowDay != timeDay) || (nowMonth == timeMonth && nowDay - 2 > timeDay))
				changeTimeStr = timeMonth + '/' + timeDay + ' ' + timeHours + ':' + timeMinutes;
			else if (nowMonth == timeMonth && parseInt(nowDay) - 2 == timeDay) {
				changeTimeStr = '昨天' + ' ' + timeHours + ':' + timeMinutes;
			} else {
				changeTimeStr = timeHours + ':' + timeMinutes;
			}
		}
		return changeTimeStr;
	},
	/*
	 * 
	 * 1648029558506
	 * 2021-11-14  14:22
	 * 11-14 14:22
	 * 
	 */

	// 时间格式化
	timestampToTime(timestamp) {
		let newTime = new Date(timestamp);
		return newTime.getFullYear() + '-' + (newTime.getMonth() + 1) + '-' +  newTime.getDay();
	},
	//取得的值 2021-07-19 11:11:
	//间隔时间差
	spaceTime: function(old, now) {
		old = new Date(old);
		now = new Date(now);
		let told = old.getTime();
		let tnow = now.getTime();
		if (told > (tnow + 1000 * 60 * 5)) {
			return now;
		} else {
			return '';
		}
	},
	//节流
	debounce: function(fn, t) {
		let delay = t || 500;
		let timer;
		return function() {
			let args = arguments;
			if (timer) {
				clearTimeout(timer)
			}
			timer = setTimeout(() => {
				timer = null;
				fn.apply(this, args);
			}, delay);
		}
	},
	//节流
	debounce: function(fn, t) {
		let delay = t || 500;
		let timer;
		return function() {
			let args = arguments;
			if (timer) {
				clearTimeout(timer)
			}
			timer = setTimeout(() => {
				timer = null;
				fn.apply(this, args);
			}, delay);
		}
	},
	//查询公司--节流
	debounceSearchEnt: function(fn, t) {
		let delay = t || 800;
		let timer;
		return function() {
			let args = arguments;
			if (timer) {
				clearTimeout(timer)
			}
			timer = setTimeout(() => {
				timer = null;
				fn.apply(this, args);
			}, delay);
		}
	},
	quickSort: function(arr){
	    //如果数组<=1,则直接返回
	    if(arr.length<=1){return arr;}
	    var pivotIndex=Math.floor(arr.length/2);
	    //找基准，并把基准从原数组删除
	    var pivot=arr.splice(pivotIndex,1)[0];
	    //定义左右数组
	    var left=[];
	    var right=[];
	
	    //比基准大的放在left，比基准小的放在right
	    for(var i=0;i<arr.length;i++){
	        if(arr[i].lastTime>=pivot.lastTime){
	            left.push(arr[i]);
	        }
	        else{
	            right.push(arr[i]);
	        }
	    }
	    //递归
	    return this.quickSort(left).concat([pivot],this.quickSort(right));
	},
	//排序
	Sort:function(arr,obj) {
		let s;
			//降序
			for(let i=1;i<arr.length;i++) {
				for(let j=i;j>0;j--) {
					if(new Date(arr[j][obj]).valueOf() > new Date(arr[j-1][obj]).valueOf()) {
						s = arr[j];
						arr[j] = arr[j-1];
						arr[j-1] = s;
					}
				}
			}
			return arr;
		
	}

}
