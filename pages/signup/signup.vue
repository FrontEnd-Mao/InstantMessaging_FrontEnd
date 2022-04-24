<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/signup/back.png" mode=""></image>
			</view>

		</view>
		<view class="logo">
			<image src="../../static/images/index/logo.png" mode=""></image>
		</view>
		<view class="main">
			<view class="title">
				注册
			</view>
			<view class="inputs">
				<view class="inputs-div">
					<input type="text" class="user" placeholder="请取个花名吧" placeholder-style="color:#aaa;font-weight:400;"
						@blur="getUser" />
					<view class="occupy" v-if="userEmplog">
						已占用
					</view>
					<image src="../../static/images/signin/right.png" class="ok" mode="" v-if="isUser"></image>
				</view>
				<view class="inputs-div">
					<input type="text" class="emal" placeholder="请输入邮箱" placeholder-style="color:#aaa;font-weight:400;"
						@blur="judgeEmal" />
					<view class="occupy" v-if="emalEmplog">
						已占用
					</view>
					<view class="invalid" v-if="invalid">
						邮箱无效
					</view>
					<image src="../../static/images/signin/right.png" class="ok" v-if="isEmal" mode=""></image>
				</view>
				<view class="inputs-div">
					<input :type="type" class="psw" placeholder="请输入密码" placeholder-style="color:#aaa;font-weight:400;"
						@blur="getPassWord" />
					<image :src="lookUrl" class="openeye" mode="" @click="looks"></image>
				</view>

			</view>

		</view>
		<view :class="[{submit: isOk}, {submit1: !isOk}]" @tap="siginUp">注册</view>
	</view>
</template>

<script>
	import reqSignup from '../../network/signup/reqSignup.js'

	export default {
		data() {
			return {
				type: 'password',
				isUser: false, //用户名有效,用来显示后方对号
				userEmplog: false, //用户名被占有
				isEmal: false, //邮箱有效，用来显示后方对号
				emalEmplog: false, //邮箱被占有
				invalid: false, //邮箱无效
				occupy: false, //邮箱占用
				look: false, //密码可看
				lookUrl: '../../static/images/signin/closeeye.png',
				isOk: false, //注册按钮样式判断
				user: '',
				email: '',
				passWord: '',
			}
		},
		methods: {
			//返回登录界面
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			//切换查看密码
			looks: function() {
				if (this.look) {
					this.type = "password";
					this.look = !this.look;
					this.lookUrl = '../../static/images/signin/closeeye.png';
				} else {
					this.type = "text";
					this.look = !this.look;
					this.lookUrl = '../../static/images/signin/openeye.png';
				}
			},
			//检查邮箱格式
			judgeEmal: function(e) {
				if (e.detail.value.length > 0) {
					var myreg =
						/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
					if (!myreg.test(e.detail.value)) {
						this.invalid = !this.invalid;
					} else {
						this.invalid = false;
						this.email = e.detail.value;
						let data = {
							data: this.email,
							type: 'email'
						}
						reqSignup.request('/signUp/judge', data, 'POST').then(res => {
							console.log(res);
							let status = res[1].data.status;
							if (status == 200) {
								let resualt = res[1].data.result;
								if (resualt > 0) {
									this.isEmal = false;
									this.emalEmplog = true;
									this.invalid = false;
								} else {
									this.isEmal = true;
									this.emalEmplog = false;
									this.invalid = false;
									this.judgeSignUp();
								}

							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错啦！',
									icon: 'none',
									duration: 2000
								})
							}
						})
					}
				} else {
					this.isEmal = false;
					this.emalEmplog = false;
					this.invalid = false;
				}
			},
			//获取用户名
			getUser: function(e) {
				this.user = e.detail.value;
				if (this.user.length > 0) {
					let data = {
						data: this.user,
						type: 'name'
					}
					reqSignup.request('/signUp/judge', data, 'POST').then(res => {
						console.log(res);
						let status = res[1].data.status;
						if (status == 200) {
							let resualt = res[1].data.result;
							if (resualt > 0) {
								this.isUser = false;
								this.userEmplog = true;
							} else {
								this.isUser = true;
								this.userEmplog = false;
								this.judgeSignUp();
							}

						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							})
						}
					})
				} else {
					this.isUser = false;
					this.userEmplog = false;
				}
			},
			//获取密码
			getPassWord: function(e) {
				this.passWord = e.detail.value;
				this.judgeSignUp();

			},
			//当用户名和邮箱正确时改变注册按钮样式
			judgeSignUp: function() {
				if (this.isUser && this.isEmal && this.passWord.length > 5) {
					this.isOk = true;
				} else {
					this.isOk = false;
				}

			},
			//注册
			siginUp: function() {
				if (this.isOk) {
					//注册
					let data = {
						"name": this.user,
						"pwd": this.passWord,
						"email": this.email
					}
					reqSignup.request('/signUp/add', data, 'POST').then(res => {
						console.log(res);
						let status = res[1].data.status;
						if (status == 200) {
							let resualt = res[1].data.result;
							console.log('注册成功');
							uni.showToast({
								title: '注册成功！',
								icon: 'none',
								duration: 2000
							})
							this.isOk = false;
							let toURL = '../signin/signin?user=' + this.user
							setTimeout(function() {
								uni.navigateTo({
									url: toURL
								})
							}, 2000);

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


		.top-bar-left {
			float: left;
			padding-top: 15rpx;

			image {
				width: 68rpx;
				height: 68rpx;
				border-radius: 16rpx;
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

		.inputs-div {
			position: relative;
		}

		.occupy,
		.invalid {
			position: absolute;
			right: 0;
			top: 0rpx;
			font-size: $uni-font-size-base;
			color: $uni-color-warning;
			line-height: 88rpx;
		}

		.ok {
			position: absolute;
			right: 0;
			top: 36rpx;
			width: 42rpx;
			height: 42rpx;
		}

		.closeeye {
			position: absolute;
			right: 0;
			top: 36rpx;
			width: 42rpx;
			height: 42rpx;
		}

		.openeye {
			position: absolute;
			right: 0;
			top: 36rpx;
			width: 42rpx;
			height: 42rpx;
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

	.submit1 {
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background: rgba(39, 40, 50, 0.2);
		border-radius: 48rpx;
		font-size: $uni-font-size-lg;
		font-weight: 700;
		color: $uni-text-color-inverse;
		line-height: 96rpx;
		text-align: center;
	}
</style>
