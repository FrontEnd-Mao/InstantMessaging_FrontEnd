<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="intoUserHome">
				<image :src="imgurl" mode=""></image>
			</view>
			<view class="top-bar-center">
				<image src="../../static/images/index/logo.png" class="logo" mode=""></image>
			</view>

			<view class="top-bar-right">
				<view class="search" @tap="toSearch">
					<image src="../../static/images/index/search.png" mode=""></image>
				</view>
				<view class="add" @tap="toBuildGroup">
					<image src="../../static/images/index/add.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="refresh" v-if="!haveFriend">
				<image src="../../static/images/index/noFriend.png" class="nofriend" mode=""></image>
				<view class="ref-title">
					下拉刷新
				</view>
			</view>
			<view class="apply"></view>
			<view class="friends">
				<view class="friend-list" v-for="(item, index) in chatList" :key="item.id" @tap="intoChatRoom(item)">
					<view class="friend-list-l">
						<text class="tip" v-if="item.unReadMsgCount > 0">{{item.unReadMsgCount}}</text>
						<image :src="item.imgurl" mode=""></image>
					</view>
					<view class="friend-list-r">
						<view class="top">
							<view class="name">
								{{item.name}}
							</view>
							<view class="time">
								{{item.lastTime}}
							</view>
							<view class="news">
								{{item.message}}
							</view>
						</view>
					</view>
				</view>
				<!--群组-->
				<!-- 				<view class="friend-list" @tap="intoGroupRoom">
					<view class="friend-list-l">
						<image src="../../static/images/imag/headPic2.png" mode=""></image>
					</view>
					<view class="friend-list-r">
						<view class="top">
							<view class="name">
								群组
							</view>
							<view class="time">
								13:43
							</view>
							<view class="news">
								是大的撒多撒多撒多
							</view>
						</view>
					</view>
				</view> -->
			</view>
		</view>
<!-- 		<view class="tabBar">
			<view class="tabBarItem">
				<image src="../../static/images/index/chat.png" mode=""></image>
				<view class="text">消息</view>
			</view>
			<view class="tabBarItem">
				<image src="../../static/images/index/contacts.png" mode=""></image>
				<view class="text">通讯录</view>
			</view>
			<view class="tabBarItem">
				<image src="../../static/images/index/workbench.png" mode=""></image>
				<view class="text">工作台</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js';
	import request from '../../network/request.js';
	import myFun from '../../commons/js/myFun.js';
	export default {
		data() {
			return {
				title: 'Hello',
				chatList: [],
				arrList: [],
				groupList: [],
				fid: 1,
				fImgUrl: '../../static/images/imag/headPic3.png',
				uid: '', //用户id
				imgurl: '../../static/images/index/logo.png', //用户头像
				token: '', //用户token
				haveFriend: true, //是否用友好友
			}
		},
		onLoad() {
			this.getStorages();
			this.getChatList();
			this.join(this.uid);
			this.receiveSocketMsg();
		},
		onPullDownRefresh() {
			this.chatList = [];
			this.getFriend();
			console.log(this.haveFriend);
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 2000);
		},
		methods: {
			getStorages: function() {
				const storageValue = uni.getStorageSync('user');
				console.log(storageValue);
				if (storageValue) {
					this.uid = storageValue.id;
					this.imgurl = this.apiUrl + storageValue.imgurl;
					this.token = storageValue.token;

				} else {
					uni.navigateTo({
						url: '../signin/signin'
					})
				}
			},
			async getChatList() {
				//先获取好友数据再获取群数据
				await this.getFriend();
				await this.getGroup()
				myFun.Sort(this.arrList, 'lastTime', 0);
				for(let i=0;i<this.arrList.length;i++)
					this.arrList[i].lastTime = myFun.changeTime(this.arrList[i].lastTime);
				this.chatList = this.arrList;
				
				console.log(this.chatList);
			},
			getFriend: function() {
				let data = {
					"uid": this.uid,
					"state": 0
				}
				return request.toRequest('/home/homeIndex', data, 'POST').then(res => {
					let status = res[1].data.status;
					if (status == 200) {
						let resualt = res[1].data.resualt;
						if (resualt.length)
							this.haveFriend = true;
						else
							this.haveFriend = false;
						for (let i = 0; i < resualt.length; i++) {
							resualt[i].imgurl = this.apiUrl + resualt[i].imgurl;
						}
						this.arrList = resualt;
						if (this.arrList.length) {
							for (let i = 0; i < this.arrList.length; i++) {
								this.getLastMsg(this.arrList, i);			
								this.getUnreadMsg(this.arrList, i);
							}
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
				}).catch(err => {
					uni.showToast({
						title: '无数据！',
						icon: 'none',
						duration: 2000
					})
				})
			},
			//获取一对一最后一条消息
			getLastMsg: function(arr, i) {
				let data = {
					"uid": this.uid,
					"fid": arr[i].id,
					"token": this.token
				}
				request.toRequest('/home/getLastMsg', data, 'POST').then(res => {
					let status = res[1].data.status;
					if (status == 200) {
						let resualt = res[1].data.resualt;
						let e = arr[i];
						e.message = resualt.message;
						e.lastTime = resualt.time;
						arr.splice(i, 1, e);
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
			//获取一对一未读消息数
			getUnreadMsg: function(arr, i) {
				let data = {
					"uid": this.uid,
					"fid": arr[i].id,
					"token": this.token
				}
				request.toRequest('/home/unreadMsg', data, 'POST').then(res => {
					let status = res[1].data.status;
					if (status == 200) {
						let resualt = res[1].data.resualt;
						let e = arr[i];
						e.unReadMsgCount = resualt;
						arr.splice(i, 1, e);
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
			//数据接收
			receiveSocketMsg: function() {
				this.socket.on('msg', (msg, fromId, type, groupId) => {
					if(type == 0) {
						let nmsg = "";
						if (msg.types == 0) {
							nmsg = msg.message;
							console.log(nmsg);
						} else if (msg.types == 1) {
							nmsg = '[图片]';
						} else if (msg.types == 2) {
							nmsg = '[语音]';
						} else if (msg.types == 3) {
							nmsg = '[地图]';
						}
						console.log(msg);
						for (let i = 0; i < this.chatList.length; i++) {
							
							if (this.chatList[i].id == fromId) {

								let e = this.chatList[i];
								e.lastTime = myFun.changeTime(new Date());
								e.message = nmsg;
								console.log(this.chatList);
								this.chatList[i].unReadMsgCount++;
								this.chatList.splice(i, 1);
								this.chatList.unshift(e)
							}
						}
					}else{
						let nmsg = "";
						if (msg.types == 0) {
							nmsg = msg.fromName + ":" +msg.message;
							console.log(nmsg);
						} else if (msg.types == 1) {
							nmsg = '[图片]';
						} else if (msg.types == 2) {
							nmsg = '[语音]';
						} else if (msg.types == 3) {
							nmsg = '[地图]';
						}
						console.log(msg);
						for (let i = 0; i < this.chatList.length; i++) {
							
							if (this.chatList[i].id == groupId) {
						
								let e = this.chatList[i];
								e.lastTime = myFun.changeTime(new Date());
								e.message = nmsg;
								console.log(this.chatList);
								this.chatList[i].unReadMsgCount++;
								this.chatList.splice(i, 1);
								this.chatList.unshift(e)
							}
						}
					}

				})
			},
			//获取群数据
			getGroup: function() {
				let data = {
					"uid": this.uid
				}
				return request.toRequest('/home/getGroup', data, 'POST').then(res => {
					let status = res[1].data.status;
					if (status == 200) {
						for (let i = 0; i < res[1].data.resualt.length; i++) {
							res[1].data.resualt[i].imgurl = this.apiUrl + res[1].data.resualt[i].imgurl;
							this.arrList.push(res[1].data.resualt[i]);
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
			},
			//注册socket
			join: function(uid) {
				this.socket.emit('login', this.uid);
			},
			//跳转到搜索页
			toSearch: function() {
				uni.navigateTo({
					url: '../search/search'
				})
			},
			//进入了聊天界面
			intoChatRoom: function(item) {
				uni.navigateTo({
					url: '../chatroom/chatroom?fid=' + item.id + '&fname=' + item.name + '&fimg=' + item
						.imgurl + '&type=' + item.type
				})
				let data = {
					"uid": this.uid,
					"fid": item.id
				}
				request.toRequest('/home/updataStateMsg', data, 'POST').then(res => {
					let status = res[1].data.status;
					console.log(data);
					if (status == 200) {
						for (let i = 0; i < this.chatList.length; i++) {
							if (this.chatList[i].id == item.id) {
								let e = this.chatList[i];
								this.chatList[i].unReadMsgCount = 0;
								this.chatList.splice(i, 1, e);
							}
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
			},
			//进入创建群里
			toBuildGroup: function() {
				uni.navigateTo({
					url: '../buildgroup/buildgroup'
				})
			},
			//进入群组聊天界面
			intoGroupRoom: function() {
				uni.navigateTo({
					url: '../grouphome/grouphome?gId=' + this.fid + '&gImg=' + this.fImgUrl,
				})
			},
			//进入个人详情页
			intoUserHome: function() {
				console.log(111);
				uni.navigateTo({
					url: '../userhome/userhome?id=' + this.uid
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: var(--status-bar-height);
	}

	//信息列表
	.main {
		padding-top: 104rpx;
		// border: 1px solid red;
		padding-bottom: 120rpx;
		width: 100%;
	}

	.refresh {
		text-align: center;
		padding-top: 180rpx;

		.nofriend {
			width: 50rxp;
			height: 400rpx;
		}

		.ref-title {
			padding-top: 10rpx;
			font-size: $uni-font-size-base;
			color: rgba(39, 40, 50, 0.4);
			line-height: 40rpx;
		}
	}

	.friend-list {
		height: 96rpx;

		padding: 16rpx $uni-spacing-col-base;

		//点击以后背景变色
		&:active {
			background-color: $uni-bg-color-grey;
		}

		.friend-list-l {
			position: relative;
			float: left;

			image {
				width: 96rpx;
				height: 96rpx;
				border-radius: $uni-border-radius-base;
			}

			.tip {
				position: absolute;
				top: -6rpx;
				left: 68rpx;
				height: 36rpx;
				min-width: 36rpx;
				z-index: 10;
				background: $uni-color-warning;
				color: $uni-text-color-inverse;
				border-radius: $uni-border-radius-circle;
				font-size: $uni-font-size-sm;
				line-height: 36rpx;
				text-align: center;
			}
		}

		.friend-list-r {
			padding-left: 128rpx;

			.top {
				.name {
					float: left;
					width: 80%;
					font-size: 36rpx;
					font-weight: 400;
					color: $uni-text-color;
					line-height: 50rpx;
				}

				.time {
					float: right;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-disable;
					line-height: 50rpx;
				}
			}
		}

		.news {
			float: left;
			width: 70%;
			font-size: $uni-font-size-base;
			color: $uni-text-color-disable;
			line-height: 40rpx;
			overflow: hidden;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;

		}

	}

	.tabBar {
		width: 100%;
		height: 120rpx;
		display: flex;
		z-index: 1001;
		text-align: center;
		background: $uni-bg-color;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		border-top: 1px solid #e5e5e5;
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.1);

		.tabBarItem {
			flex: 1;
			padding-top: 15rpx;

			image {
				text-align: center;
				vertical-align: middle;
				width: 62rpx;
				height: 62rpx;
			}

			.text {
				font-size: $uni-font-size-sm;
				color: $uni-text-color;
			}
		}
	}
</style>
