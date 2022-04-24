<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-right" @tap="toSignUp">
				<view class="text">
					注册
				</view>
			</view>
		</view>
		<view class="logo">
			<image src="../../static/images/index/logo.png" mode=""></image>
		</view>
		<view class="main">
			<view class="title">
				登录
			</view>
			<view class="slogan">
				您好，欢迎来到聊天室！
			</view>
			<view class="inputs">
				<input type="text" v-model="user" class="user" placeholder="用户名/邮箱"
					placeholder-style="color:#aaa;font-weight:400;" @blur="getUser" />
				<input type="password" v-model="passWord" class="psw" placeholder="密码"
					placeholder-style="color:#aaa;font-weight:400;" @blur="getPassWord" />
			</view>
			<view class="tip" v-if="!isLogin">
				输入账号密码错误！
			</view>
		</view>
		<view class="submit" @tap="login">登录</view>
	</view>
</template>

<script>
	import reqSignup from '../../network/signup/reqSignup.js'
	export default {
		data() {
			return {
				user: '',
				passWord: '',
				isLogin: true,
			}
		},
		onLoad(e) {
			if (e.user) {
				this.user = e.user;
				console.log(e.user);
			}
		},
		methods: {
			//点击注册跳转到注册页面
			toSignUp: function() {
				uni.navigateTo({
					url: '../signup/signup'
				})
			},
			//获取用户名 
			getUser: function(e) {
				this.user = e.detail.value;

			},
			//获取密码
			getPassWord: function(e) {
				this.passWord = e.detail.value;

			},
			//登录判断
			login: function() {
				if (this.user && this.passWord) {
					let data = {
						"data": this.user,
						"pwd": this.passWord
					}

					reqSignup.request('/signIn/signMatch', data, 'POST').then(res => {
						console.log(res);
						let status = res[1].data.status;
						if (status == 200) {
							let resualt = res[1].data.backValue;
							try {
								uni.setStorageSync('user', {
									'id': resualt.id,
									"name": resualt.name,
									"imgurl": resualt.imgurl,
									"token": resualt.token
								});
							} catch (e) {
								// error
								console.log("数据缓存出错");
							}
							uni.navigateTo({
								url: '../index/index'
							})

						} else if (status == 400) {
							uni.showToast({
								title: '账号或密码错误！',
								icon: 'none',
								duration: 2000
							})
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							})
						}
					})


				}
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
		background: $uni-bg-color;
		border-bottom: 1px solid $uni-bg-color;
		/**
		 * 此处有bug
		 box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.1);
		*/
		padding-left: $uni-spacing-col-base;


		.top-bar-right {
			float: right;
			padding-right: 32rpx;

			.text {
				line-height: 88rpx;
				color: $uni-text-color;
				font-size: $uni-font-size-lg;
				font-weight: 500;
			}
		}
	}

	.logo {
		text-align: center;

		image {
			padding-top: 256rpx;
			width: 194rpx;
			height: 92rpx;
			margin: 0 auto;
		}
	}

	.main {
		padding: 54rpx $uni-spacing-row-lg 120rpx;

		.title {
			font-size: 56rpx;
			font-weight: 700;
			color: $uni-text-color;
			line-height: 80rpx;
		}

		.slogan {
			font-size: 40rpx;
			color: $uni-text-color-grey;
			line-height: 56rpx;
		}

		.inputs {
			padding-top: 48rpx;

			input {
				height: 88rpx;
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
				border-bottom: 1px solid $uni-border-color;
			}

		}

		.tip {
			font-size: $uni-font-size-lg;
			color: $uni-color-warning;
			float: left;
			line-height: 56rpx;
		}
	}

	.submit {
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background: $uni-color-primary;
		font-weight: 700;
		box-shadow: 0px 50rpx 32rpx -36rpx rgba(255, 228, 49, 0.4);
		border-radius: 48rpx;
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		line-height: 96rpx;
		text-align: center;
	}
</style>
