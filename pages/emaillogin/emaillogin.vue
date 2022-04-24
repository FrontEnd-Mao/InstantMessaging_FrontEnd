<template>
	<view class="content">
		<back-btn></back-btn>
		<view class="text">
			<h1>我的邮箱</h1>
			<view class="notice">
				请输入您的有效的邮箱。我们将向您发送一个4位代码来验证您的帐户。
			</view>
		</view>
		<view class="email">
			<image src="../../static/images/pwdlogin/email.png" class="email-img" mode=""></image>
			<input type="text" value="" class="email-input" placeholder="请输入你的email"
				placeholder-style="color:#aaa;font-weight:400;" @input="decheckEmail" />
			<view class="email_err" v-show="isEmail">
				邮箱格式错误
			</view>
		</view>
		<view class="login-btn" @tap="send">
			发送
		</view>
	</view>
</template>

<script>
	import myFun from '../../commons/js/myFun.js'
	import reqSignup from '../../network/signup/reqSignup.js'
	import backBtn from '../../components/backBtn/backBtn.vue'
	export default {
		components: {
			backBtn
		},
		data() {
			return {
				isEmail: false,
				email: '',
			}
		},
		methods: {
			decheckEmail: myFun.debounce(function(e) {
				let email = e.detail.value;
				if (email.length > 0) {
					this.checkEmail(email);
				}
			}),
			checkEmail: function(e) {

				var myreg =
					/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
				if (!myreg.test(e)) {
					this.isEmail = true;
				} else {
					this.isEmail = false;
					this.email = e;

				}
			},
			send: function() {
				if(!this.isEmail) {
					let data = {
						"email": this.email
					}
					reqSignup.request('/signIn/generateVerificationCode', data, 'POST').then(res => {
						console.log(res);
						let status = res[1].data.status;
						if (status == 200) {
							uni.navigateTo({
								url: '../emaillogin/verificationcode?email=' + this.email
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
		.text {
			padding-top: 124rpx;
			margin-left: 80rpx;
			margin-bottom: 86rpx;

			.notice {
				margin-top: 20rpx;
				width: 590rpx;
				font-weight: 5;
				font-size: 26rpx;
			}
		}

		.email {
			position: relative;
			width: 590rpx;
			height: 94rpx;
			margin-left: 80rpx;

			.email-img {
				position: absolute;
				top: 22rpx;
				left: 26rpx;
				width: 48rpx;
				height: 48rpx;
				z-index: 0;
			}

			.email-input {
				width: 100%;
				height: 94rpx;
				border-radius: 30rpx;
				padding-left: 120rpx;
				/* 外部/White #FFFFFF */
				background: #FFFFFF;
				box-sizing: border-box;
				/* 外部/border #E8E6EA */
				border: 2rpx solid #E8E6EA;

				&::before {
					content: "";
					position: absolute;
					left: 100rpx;
					top: 28rpx;
					width: 2rpx;
					height: 36rpx;
					background: #D8D8D8;
					z-index: 1;
				}
			}
			.email_err {
					float: right;
					color: #E94057;
					font-size: 30rpx;
					margin-top: 20rpx;
			}
		}

		.pwd {
			position: relative;
			top: 36rpx;
			width: 590rpx;
			height: 94rpx;
			margin-left: 80rpx;

			.email-img {
				position: absolute;
				top: 22rpx;
				left: 26rpx;
				width: 48rpx;
				height: 48rpx;
				z-index: 0;
			}

			.email-input {
				width: 100%;
				height: 94rpx;
				border-radius: 30rpx;
				padding-left: 120rpx;
				/* 外部/White #FFFFFF */
				background: #FFFFFF;
				box-sizing: border-box;
				/* 外部/border #E8E6EA */
				border: 2rpx solid #E8E6EA;

				&::before {
					content: "";
					position: absolute;
					left: 100rpx;
					top: 28rpx;
					width: 2rpx;
					height: 36rpx;
					background: #D8D8D8;
					z-index: 1;
				}
			}
		}

		.login-btn {
			width: 590rpx;
			height: 112rpx;
			border-radius: 30rpx;
			/* 外部/red #E94057 */
			background: #E94057;
			margin-left: 80rpx;
			margin-top: 80rpx;
			color: #FFFFFF;
			line-height: 112rpx;
			text-align: center;
			font-size: 40rpx;
		}
	}
</style>
