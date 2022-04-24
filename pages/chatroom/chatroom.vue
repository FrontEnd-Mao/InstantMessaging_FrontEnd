<template>
	<view class="center">
		<top-bar>
			<template v-slot:center>
				<view class="nikeName">
					{{fName}}
				</view>
			</template>
			<template v-slot:right>
				<!-- <view class="pice"></view> -->

				<view class="group-img" v-if="chatType == 1" @tap="intoGroupDetail">
					<image src="../../static/images/homeuser/more.png" mode=""></image>
				</view>
			</template>
		</top-bar>
		<scroll-view scroll-y="true" class="chat" scroll-with-animation="true" :scroll-into-view="scrollToView"
			@scrolltoupper="scrolltoupper">
			<view class="chat-main" :style="{paddingBottom: inputh + 'px'}">
				<view class="loading" :class="{displayNone: isLoading}">
					<view class="loading-img" :animation="animationData">
						<image src="../../static/images/chatroom/loading.png" mode=""></image>
					</view>
				</view>
				<view class="chat-ls" v-for="(item, index) in msgs" :key="index" :id="'msg'+item.id">
					<view class="chat-time">
						{{item.time}}
					</view>
					<view class="msg-m msg-left" v-if="item.from_id != uid">
						<image :src="item.imgurl" class="user-img" mode="" @tap="intoUserHome"></image>
						<view class="massage" v-if="item.types == 0">
							<view class="msg-text">
								{{item.message}}
							</view>
						</view>
						<view class="massage" v-if="item.types == 1">
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg(item.message)">
							</image>
						</view>
						<view class="massage" v-if="item.types == 2">
							<view class="msg-text  voice" :style="{width:item.message.time * 4 + 'px'}"
								@tap="playVoice(item.message.voice)">
								<image src="../../static/images/chatroom/voice.png" class="voice-img" mode=""></image>
								{{item.message.time}}''
							</view>
						</view>
						<view class="massage" v-if="item.types == 3">
							<view class="location" @tap="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>

								<!-- <map class="map-show" :latitude="item.message.latitude" :longitude="item.message.longitude" :markers="covers(item.message)"></map> -->
								<image src="../../static/images/chatroom/locationImg.png" class="map-img"
									mode="aspectFill"></image>
							</view>
						</view>
					</view>
					<view class="msg-m msg-right" v-else>
						<image :src="item.imgurl" class="user-img" mode="" @tap="intoUserDetials"></image>
						<view class="massage" v-if="item.types == 0">
							<view class="msg-text">
								{{item.message}}
							</view>
						</view>
						<view class="massage" v-if="item.types == 1">
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg(item.message)">
							</image>
						</view>
						<view class="massage" v-if="item.types == 2">
							<view class="msg-text  voice" :style="{width:item.message.time * 4 + 'px'}"
								@tap="playVoice(item.message.voice)">
								{{item.message.time}}''
								<image src="../../static/images/chatroom/voice.png" class="voice-img" mode=""></image>
							</view>
						</view>
						<view class="massage" v-if="item.types == 3">
							<view class="location" @tap="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>
								<!-- <map class="map-show" :latitude="item.message.latitude" :longitude="item.message.longitude" :markers="covers(item.message)"></map> -->
								<image src="../../static/images/chatroom/locationImg.png" class="map-img"
									mode="aspectFill"></image>
							</view>
						</view>
					</view>
				</view>

			</view>
		</scroll-view>
		<submit @inputs="inputs" @heights="heights"></submit>

	</view>
</template>

<script>
	import topBar from '../../components/topBars/topBar.vue';
	import submit from '../../components/submit/submit.vue';

	import request from '../../network/request.js';
	import datas from '../../commons/js/datas.js'
	import myFun from '../../commons/js/myFun.js'
	//音频播放实例
	const innerAudioContext = uni.createInnerAudioContext();
	export default {
		components: {
			topBar,
			submit,

		},
		data() {
			return {
				uid: '',
				uImgUrl: '',
				token: '',
				name: '',
				fName: '',
				fid: '',
				fImgUrl: '',
				chatType: 0, //聊天类型 如果是0则是1对1，1是群聊
				msgs: [],
				imgMsg: [], //预览图片的地址
				scrollToView: '',
				inputh: '64',
				animationData: {}, //动画数据
				nowPage: 0,
				pageSize: 10, //分页条数
				animationLoading: '',
				isLoading: true,
				isHistoryLodingOver: false, //判断历史记录是否加载完
				beginLoading: true, //禁止多次加载
				isPlayOrPause: true, //点击语音播放或暂停
				groupMember: [], //群成员
			}
		},
		onLoad: function(e) {
			this.fid = e.fid;
			this.fName = e.fname;
			this.fImgUrl = e.fimg;
			this.chatType = e.type;

			this.getStorages();
			this.getMsg(this.nowPage);
			this.receiveSocketMsg();
			if (this.chatType == 1)
				this.getGroupMember();
		},
		methods: {
			getStorages: function() {
				const storageValue = uni.getStorageSync('user');
				console.log(storageValue);
				if (storageValue) {
					this.uid = storageValue.id;
					this.uImgUrl = this.apiUrl + storageValue.imgurl;
					this.token = storageValue.token;
					this.name = storageValue.name;
				} else {
					uni.navigateTo({
						url: '../signin/signin'
					})
				}
			},
			//动画效果
			nextPage: function() {
				if (this.beginLoading) {
					this.beginLoading = false;
					var animation = uni.createAnimation({
						duration: 1000,
						timingFunction: 'ease',
					})
					this.animation = animation
					// animation.scale(2,2).rotate(45).step()
					let i = 1; //循环动画

					this.animationLoading = setInterval(function() {
						animation.rotate(i * 30).step()
						this.animationData = animation.export()
						i++;
						//4s后执行查询操作
						if (i > 10) {

							if (this.nowPage > datas.message().length / this.pageSize) {

								this.nowPage = parseInt(datas.message().length / this.pageSize);
							}
							if (this.msgs.length == datas.message().length) {
								this.isHistoryLodingOver = true;
							}
							if (!this.isHistoryLodingOver)
								this.getHistoryMsg(this.nowPage);
							//当最后的消息读完以后，将不会调取获取历史信息方法，所以要再关闭一次				  
							else {
								clearInterval(this.animationLoading);
								this.isLoading = true;
								console.log('无消息');
							}
							i = 0
						}
					}.bind(this), 200)
				}

			},
			//获取聊天记录
			getMsg: function(page) {
				if (this.chatType == 0) {
					let data = {
						"uid": this.uid,
						"fid": this.fid,
						"pageSize": this.pageSize,
						"nowPage": this.nowPage,
						"state": 1,
						"token": this.token
					}
					console.log(data);
					request.toRequest('/chat/msg', data, 'POST').then(res => {
						let status = res[1].data.status;
						if (status == 200) {
							let msg = res[1].data.resualt;
							if (msg.length > 0) {
								console.log(msg);
								for (let i = 0; i < msg.length; i++) {
									msg[i].time = myFun.changeTime(msg[i].time);
									msg[i].imgurl = this.apiUrl + msg[i].imgurl;
									if ((msg[i]).types === 1) {
										msg[i].message = msg[i].imgUrl;
										this.imgMsg.push(msg[i].imgUrl);
									}
									this.msgs.unshift(msg[i]);
									
								}
								console.log(this.msgs);
								if (msg.length == 10) {
									this.nowPage++;
								} else {
									this.nowPage = -1;
								}
								//定位最后一条聊天数据的tip，让内容划到最后一条
								this.$nextTick(function() {
									this.scrollToView = 'msg' + this.msgs[msg.length - 1].id;
								})
								clearInterval(this.animationLoading);
								this.isLoading = true;
							}
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							})
						} else if (status == 300) {
							uni.navigateTo({
								url: '../signin/signin'
							})
						}
					})
				} else {
					let data = {
						"uid": this.uid,
						"fid": this.fid, //群id
						"pageSize": this.pageSize,
						"nowPage": this.nowPage,
						"state": 1,
						"token": this.token
					}
					console.log(data);
					request.toRequest('/chat/groupMsg', data, 'POST').then(res => {
						let status = res[1].data.status;
						if (status == 200) {
							let msg = res[1].data.resualt;
							if (msg.length > 0) {
								console.log(msg);
								for (let i = 0; i < msg.length; i++) {
									msg[i].time = myFun.changeTime(msg[i].time);
									if ((msg[i]).types === 1) {
										msg[i].message = msg[i].imgUrl;
										this.imgMsg.push(msg[i].imgUrl);
									}
									this.msgs.unshift(msg[i]);
								}

								if (msg.length == 10) {
									this.nowPage++;
								} else {
									this.nowPage = -1;
								}
								//定位最后一条聊天数据的tip，让内容划到最后一条
								this.$nextTick(function() {
									this.scrollToView = 'msg' + this.msgs[msg.length - 1].id;
								})
								clearInterval(this.animationLoading);
								this.isLoading = true;
							}
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							})
						} else if (status == 300) {
							uni.navigateTo({
								url: '../signin/signin'
							})
						}
					})
				}
			},
			getMs1g: function(page) {
				let msg = datas.message();
				let pageStart = 0;
				//防止数组指针溢出
				if (msg.length - this.pageSize * page < 0)
					pageStart = 0;
				else
					pageStart = msg.length - this.pageSize * page;
				for (let i = pageStart; i < msg.length; i++) {
					msg[i].time = myFun.changeTime(msg[i].time);
					if ((msg[i]).types === 1) {
						msg[i].message = msg[i].imgUrl;
						this.imgMsg.push(msg[i].imgUrl);
					}
					this.msgs.unshift(msg[i]);
				}
				this.nowPage++;
				//定位最后一条聊天数据的tip，让内容划到最后一条
				this.$nextTick(function() {
					this.scrollToView = 'msg' + this.msgs[this.msgs.length - 1].id;
				})
				clearInterval(this.animationLoading);
				this.isLoading = true;
			},
			//获取历史聊天记录
			getHistoryMsg: function(page) {
				console.log("下拉");
				let msg = datas.message();
				let pageStart = 0;
				let pageEnd = 0;
				//防止数组指针溢出
				if (msg.length - this.pageSize * page < this.pageSize) {
					pageStart = 0;
					pageEnd = msg.length - this.pageSize * page
				} else {
					pageStart = msg.length - this.pageSize * page;
					pageEnd = pageStart + this.pageSize;
				}
				console.log("开始：" + pageStart + "结束：" + pageEnd);
				for (let i = pageEnd - 1; i >= pageStart; i--) {
					msg[i].time = myFun.changeTime(msg[i].time);
					if ((msg[i]).types === 1) {
						msg[i].message = msg[i].imgUrl;
						this.imgMsg.unshift(msg[i].imgUrl);
					}
					this.msgs.unshift(msg[i]);
				}
				this.nowPage++;
				//定位最后一条聊天数据的tip，让内容划到最后一条
				this.$nextTick(function() {
					this.scrollToView = 'msg' + this.msgs[this.msgs.length - 1].id;
				})
				clearInterval(this.animationLoading);
				this.isLoading = true;
				//运行滚动加载
				this.beginLoading = true;
			},
			//滚动到顶部获取数据
			scrolltoupper: function() {
				this.isLoading = false;
				this.debounce(this.nextPage(), 10000);

			},
			//防抖函数
			debounce: function(fn, wait) {
				var timer = null;
				return function() {
					if (timer !== null) {
						console.log('清除上一次');
						clearTimeout(timer);
					}
					timer = setTimeout(fn, wait);
				}
			},
			//预览图片
			previewImg: function(imgUrl) {
				let index = 0;
				for (let i = 0; i < this.imgMsg.length; i++) {
					if (this.imgMsg[i] == imgUrl)
						index = i;

				}
				uni.previewImage({
					current: index,
					urls: this.imgMsg,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			//接受传送内容
			inputs: function(e) {
				console.log(e);
				let data = {
					from_id: this.uid, //用户id
					imgurl: this.uImgUrl, //头像
					message: e.message, //消息
					types: e.types, //内容类型。0代表文字，1代表图片链接，2音频链接
					time: myFun.changeTime(new Date()),
					tip: this.msgs.length
				}
				this.msgs.push(data);
				//把图片链接加入到预览图片的数组中
				console.log(this.msgs);
				this.goBottom();

				//socket提交
				if (this.chatType == 0) {
					if (e.types == 0 || e.types == 3) {
						//文字和位置
						this.sendSocket(e)
					} else if (e.types === 1) {
						//图片
						this.imgMsg.push(e.message);
					} else if (e.types === 2) {
						//音频
					}
				} else {
					if (e.types == 0 || e.types == 3) {
						//文字和位置
						this.sendSocket(e)
					} else if (e.types === 1) {
						//图片
						this.imgMsg.push(e.message);
					} else if (e.types === 2) {
						//音频
					}
				}

			},
			//获取群成员
			getGroupMember: function() {
				let data = {
					"groupId": this.fid
				}
				request.toRequest('/chat/getGroupMembers', data, 'POST').then(res => {
					let status = res[1].data.status;
					if (status == 200) {
						this.groupMember = res[1].data.resualt;

					} else if (status == 500) {
						uni.showToast({
							title: '服务器出错啦！',
							icon: 'none',
							duration: 2000
						})
					} else if (status == 300) {
						uni.navigateTo({
							url: '../signin/signin'
						})
					}
				})
			},

			//聊天数据发送给后端
			sendSocket: function(e) {
				if (this.chatType == 0) {
					//1对1聊天
					this.socket.emit('msg', e, this.uid, this.fid);
				} else {
					//群聊,这里的fid是群id
					console.log(this.groupMember);
					this.socket.emit('groupMsg', e, this.uid, this.fid, this.groupMember, this.name);
				}
			},
			//数据接收
			receiveSocketMsg: function() {
				this.socket.on('msg', (msg, fromId, tip) => {

					if (fromId == this.fid && tip == 0) {
						console.log(fromId);
						// debugger;
						let data = {
							from_id: fromId, //用户id
							imgurl: this.apiUrl + '/head_portrait/'+ fromId + '.png', //头像
							message: msg.message, //消息
							types: msg.types, //内容类型。0代表文字，1代表图片链接，2音频链接
							time: myFun.changeTime(new Date()),
							id: this.msgs.length
						}
						console.log(data);
						this.msgs.push(data);
						if (msg.types === 1) {
							//图片
							this.imgMsg.push(e.message);
						}

						console.log(this.msgs);
						this.$nextTick(function() {
							this.scrollToView = 'msg' + this.msgs[this.msgs.length - 1].id;
						})
					} else {
						console.log(fromId);
						let data = {
							from_id: fromId, //用户id
							imgUrl: this.apiUrl + '/head_portrait/'+ fromId + '.png', //头像
							message: msg.message, //消息
							types: msg.types, //内容类型。0代表文字，1代表图片链接，2音频链接
							time: myFun.changeTime(new Date()),
							id: this.msgs.length
						}
						console.log(data);
						this.msgs.push(data);
						if (msg.types === 1) {
							//图片
							this.imgMsg.push(e.message);
						}

						console.log(this.msgs);
						this.$nextTick(function() {
							this.scrollToView = 'msg' + this.msgs[this.msgs.length - 1].id;
						})
					}



				})
			},
			//接受发送框整体高度
			heights: function(e) {
				this.inputh = e;
				this.goBottom();
			},
			//滚动到底部
			goBottom: function() {
				this.scrollToView = '';
				this.$nextTick(function() {
					let len = this.msgs.length - 1;
					this.scrollToView = 'msg' + this.msgs[len].id;
				})
			},
			//音频播放		
			playVoice: function(e) {

				innerAudioContext.src = e;
				innerAudioContext.play(() => {
					console.log('开始播放');

				});
				this.isPlayOrPause = !this.isPlayOrPause;
				innerAudioContext.onError((res) => {
					console.log(res.errMsg);
					console.log(res.errCode);
				});

			},
			//地图定位
			covers: function(e) {
				let map = [{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../static/images/chatroom/location.png',
					width: 52,
					height: 52,
				}]
				return (map)
			},
			//查看地图位置
			openLocation: function(e) {
				uni.openLocation({
					latitude: e.latitude,
					longitude: e.longitude,
					success: function() {
						console.log('success');
					}
				});
			},
			//进入用户简介
			intoUserHome: function() {
				uni.navigateTo({
					url: '../userhome/userhome'
				})
			},
			intoUserDetials: function() {
				uni.navigateTo({
					url: '../userdetials/userdetials'
				})
			},
			//进入群详情
			intoGroupDetail: function() {
				uni.navigateTo({
					url: '../grouphome/grouphome?gid=' + this.fid
				})
			},
			
		}
	}
</script>

<style lang="scss">
	.center {
		background-color: rgb(243, 243, 243);
	}

	.group-img {
		float: right;
		line-height: 88rpx;
		padding-top: 11rpx;

		image {
			width: 66rpx;
			height: 66rpx;
		}
	}

	.displayNone {
		display: none;
	}

	.chat {
		width: 100%;
		height: 100vh;

		// margin-top: 89rpx;
		.chat-main {
			padding-left: $uni-spacing-col-base;
			padding-right: $uni-spacing-col-base;
			padding-top: 100rpx;
			// padding-bottom: 120rpx;
			display: flex;
			flex-direction: column;
		}

		.loading {
			text-align: center;

			image {
				width: 50rpx;
				height: 50rpx;
			}
		}

		.chat-ls {
			.chat-time {
				font-size: $uni-spacing-col-sm;
				color: rgba(39, 40, 50, 0.3);
				line-height: 34rpx;
				text-align: center;
				padding: 20rpx 0;
			}
		}

		.msg-m {
			display: flex;
			padding: 20rpx 0;

			.user-img {
				flex: none;
				width: $uni-img-size-sm;
				height: $uni-img-size-sm;
				border-radius: $uni-border-radius-base;
			}

			.message {
				max-width: 80%;
				flex: none;
				overflow: hidden;

			}

			.msg-text {
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
				padding: 18rpx 24rpx;
			}

			.msg-img {
				max-width: 400rpx;
				border-radius: $uni-border-radius-base;
			}

			.location {
				background-color: #FFFFFF;
				width: 464rpx;
				height: 284rpx;
				overflow: hidden;

				.map-name {
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
					padding: 18rpx 24rpx 0 24rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}

				.map-address {
					font-size: $uni-font-size-sm;
					color: $uni-text-color-disable;
					padding: 0 24rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;

				}

				.map-img {
					width: 464rpx;
					height: 190rpx;
					padding-top: 8rpx;
				}
			}

			.voice {
				width: 200rpx;
				min-width: 80rpx;
				max-width: 400rpx;
			}

			.voice-img {
				width: 38rpx;
				height: 46rpx;

			}

		}

		.msg-left {
			flex-direction: row;

			.msg-text {
				margin-left: 16rpx;
				background-color: #eae5e0;
				border-radius: 0px 20px 20px 20px;
				max-width: 75%;
			}

			.msg-img {
				margin-left: 16rpx;
			}

			.voice {
				text-align: right;
			}

			.voice-img {
				float: left;
				vertical-align: middle;
			}

			.location {
				border-radius: 0rpx 20rpx 20rpx 20rpx;
				margin-left: 16rpx;
			}
		}

		.msg-right {
			flex-direction: row-reverse;

			.msg-text {
				margin-right: 16rpx;
				background-color: #eae5e0;
				border-radius: 20px 0px 20px 20px;
				max-width: 85%;
				float: right;
			}

			.msg-img {
				margin-right: 16rpx;
			}

			.voice {
				text-align: right;
			}

			.voice-img {
				float: left;
			}

			.location {
				border-radius: 20rpx 0rpx 20rpx 20rpx;
				margin-right: 16rpx;
			}
		}
	}
</style>
