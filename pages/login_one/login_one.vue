<template>
	<view class="content">
		<view class="logo">
			<image src="../../static/images/login_one/logo.png" mode=""></image>
		</view>
		<view class="main">
			<view class="emailLogin btn" @tap="emailLogin">
				Email登录
			</view>
			<view class="pwdLogin btn" @tap="pwdLogin">
				密码登录
			</view>
			<view class="text">
				————————&nbsp; 还没有注册过 &nbsp;————————
			</view>
			<view class="register" @tap="register">
				注册
			</view>

			<view class="bottom">
				Designed by MaoYongYao
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			emailLogin: function() {
				uni.navigateTo({
					url: '../emaillogin/emaillogin'
				})
			},
			pwdLogin: function() {
				uni.navigateTo({
					url: '../pwdlogin/pwdlogin'
				})
			},
			register: function() {
				uni.navigateTo({
					url: '../register/register?from=register'
				})
			},
		}
	}
</script>

<style lang="scss">
	.content {
		.logo {
			text-align: center;
			padding-top: 100px;
			margin-bottom: 50px;
			image {
				width: 95px;
				height: 92px;
			}
		}
		.main {
			text-align: center;
			.btn {
				width: 295px;
				height: 56px;
				border-radius: 15px;
				/* 外部/red #E94057 */
				background: #E94057;
				margin: 10px auto;
				line-height: 56px;
				color: #fff;
			}
			.text {
				margin: 35px 0 15px 0;
				font-size: 12px;
				color: #7a7a7a;
			}
			.register {
				width: 295px;
				height: 56px;
				border: 1px solid #F3F3F3;
				border-radius: 15px;
				/* 外部/red #E94057 */
				background: #FFF;
				margin: 10px auto;
				line-height: 56px;
				color: rgb(233,64,87);
			}
		}
		.bottom {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			margin: 10px auto;
			color: #E94057;
			font-size: 12px;
		}
	}
</style>
