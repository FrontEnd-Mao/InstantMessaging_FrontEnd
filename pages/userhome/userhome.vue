<template>
	<view>
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/signup/back.png" mode=""></image>
			</view>
			<view class="top-bar-right">
				<view class="more">
					<image src="../../static/images/homeuser/more.png" mode="" @tap="intoUserDetail"></image>
				</view>
			</view>
		</view>
		<view class="bg">

			<image :src="imgurl" class="bg-img" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="user-header">
				<view class="sex" :style="{background: sexBg}">
					<image src="../../static/images/homeuser/man.png" mode=""></image>
				</view>
				<image :src="imgurl" class="user-img" mode="aspectFill"></image>
			</view>
			<view class="user-imf">
				<view class="name">
					{{name}}
				</view>
				<view class="email">
					{{email}}
				</view>
				<view class="intr">
					{{explain}}
				</view>
			</view>
		</view>
		<view class="bottom-bar" v-if="sendButton">
			<view class="bottom-btn">
				发送信息
			</view>
		</view>
	</view>
</template>

<script>
	import request from '../../network/request.js'
	import myFun from '../../commons/js/myFun.js'
	export default {
		data() {
			return {
				sexBg: 'rgb(85, 170, 255)',
				uid: '', //用户id
				token: '',
				name: '',
				email: '',
				explain: '',
				imgurl: '',
				sendButton: false,
			}
		},
		onLoad: function(e) {
			this.getStorages(e);
			this.getUserInfo();
			if(e.id != this.uid)
				this.sendButton = true;
		},
		methods: {
			//返回登录界面
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			//获取缓存数据
			getStorages: function(e) {
				const storageValue = uni.getStorageSync('user');
				console.log(storageValue);
				if (storageValue) {
					this.token = storageValue.token;
					this.uid = storageValue.id;
				} else {
					uni.navigateTo({
						url: '../signin/signin'
					})
				}
			},
			//获取用户信息
			getUserInfo: function() {
				let data = {
					"id": this.uid,
					"token": this.token
				}
				request.toRequest('/user/userDetail', data, 'POST').then(res => {
					console.log(res);
					let status = res[1].data.status;
					if (status == 200) {
						let resualt = res[1].data.resualt[0];
						this.name = resualt.name;
						this.email = resualt.email;
						this.imgurl = this.apiUrl + resualt.imgurl;
						this.explain = resualt.explain ? resualt.explain : '这个人很懒什么都没有写~';
						console.log(this.imgurl);
					} else if (status == 500) {
						uni.showToast({
							title: '服务器出错啦！',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			intoUserDetail: function() {
				uni.navigateTo({
					url: '../userdetials/userdetials?id=' + this.uid
				})
			}

		}
	}
</script>

<style lang="scss">
	.content {
		padding-top: var(--status-bar-height);
	}

	.top-bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 88rpx;
		z-index: 1001;
		padding-top: var(--status-bar-height);
		box-sizing: border-box;
		/**
		 * 此处有bug
		 box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.1);
		*/
		padding-left: $uni-spacing-col-base;


		.top-bar-left {
			float: left;
			padding-top: 15rpx;

			image {
				width: 58rpx;
				height: 58rpx;
				border-radius: 16rpx;
			}
		}

		.top-bar-right {
			float: right;

			.more {
				padding-top: 10rpx;
				padding-right: $uni-spacing-col-base;

				image {
					width: 62rpx;
					height: 62rpx;
				}
			}

		}
	}

	.bg {
		position: fixed;
		z-index: -2;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		.bg-img {
			opacity: 0.4;
			position: absolute;
			z-index: -1;
			left: -10rpx;
			right: -10rpx;
			width: 110%;
			height: 110%;
			filter: blur(16px);
		}
	}

	.main {
		z-index: 1;
		text-align: center;

		.user-header {
			width: 412rpx;
			height: 412rpx;
			margin: 0 auto;
			position: relative;
			padding-top: 148rpx;

			.sex {
				z-index: 2;
				position: absolute;
				bottom: 12rpx;
				right: 22rpx;
				width: 64rpx;
				height: 64rpx;

				border-radius: $uni-border-radius-circle;

				image {
					padding-top: 16rpx;
					width: 32rpx;
					height: 32rpx;
				}
			}

			.user-img {
				width: 400rpx;
				height: 400rpx;
				border-radius: 48rpx;
				border: 6rpx solid rgba(255, 255, 255, 1);
			}
		}

		.user-imf {
			padding-top: 42rpx;

			.name {
				font-size: 52rpx;
				color: $uni-text-color;
				line-height: 74rpx;
			}

			.email {
				font-size: $uni-font-size-base;
				line-height: 40rpx;
				color: $uni-text-color
			}

			.intr {
				padding-top: 20rpx;
				font-size: $uni-font-size-base;
				font-weight: 300;
				color: rgb(39, 40, 50.1);
				line-height: 40rpx;
			}
		}
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 104rpx;

		.bottom-btn {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			text-align: center;
			line-height: 80rpx;
			width: 684rpx;
			height: 80rpx;
			background: $uni-color-primary;

			border-radius: $uni-border-radius-sm;
		}

	}
</style>
