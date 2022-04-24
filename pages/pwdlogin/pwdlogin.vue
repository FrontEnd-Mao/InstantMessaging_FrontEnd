<template>
	<view class="content">
		<backBtn></backBtn>
		<view class="text">
			<h1>密码登录</h1>
		</view>
		<view class="email">
			<image src="../../static/images/pwdlogin/email.png" class="email-img" mode=""></image>
			<input type="text" value="" class="email-input" placeholder="请输入你的email"
				placeholder-style="color:#aaa;font-weight:400;" v-model="email" />
		</view>
		<view class="pwd">
			<image src="../../static/images/pwdlogin/pwd.png" class="email-img" mode=""></image>
			<input type="password" value="" class="email-input" placeholder="请输入密码"
				placeholder-style="color:#aaa;font-weight:400;" v-model="pwd" />
		</view>
		<view class="login-btn" @tap="login">
			登录
		</view>
	</view>
</template>

<script>
	import reqSignup from '../../network/signup/reqSignup.js'
	import backBtn from '../../components/backBtn/backBtn.vue'
	export default {
		components: {
			backBtn
		},
		data() {
			return {
				email: '',
				pwd: '',
			}
		},
		methods: {
			login: function() {
				if (this.email && this.pwd) {
					let data = {
						"data": this.email,
						"pwd": this.pwd
					}
					reqSignup.request('/signIn/signMatch', data, 'POST').then(res => {
						console.log(res);
						let status = res[1].data.status;
						if (status == 200) {
							let resualt = res[1].data.backValue;
							console.log(resualt);
							let datas = {
								"uid": resualt.id
							}
							//判断是否加入企业
							reqSignup.request('/enterprise/judgeUserIntoEnter', datas, 'POST').then(res => {
								console.log(res);
								let status = res[1].data.status;
								if (status == 200) {
									let count = res[1].data.backValue.result;
									if (count) {
										try {
											uni.setStorageSync('user', {
												'id': resualt.id,
												"enterpriseId": res[1].data.backValue.enterpriseId,
												"name": resualt.name,
												"imgurl": resualt.imgurl,
												"token": resualt.token,
												"role": res[1].data.backValue.role
											});
										} catch (e) {
											// error
											console.log("数据缓存出错");
										}
										uni.showToast({
											title: '登录成功！',
											icon: 'none',
											duration: 2000
										})
										setTimeout(function() {
											uni.switchTab({
												url: '../index/index'
											})
										}, 2000);
									} else {
										uni.navigateTo({
											url: '../josbusiness/josbusiness?from=login&uid=' +
												resualt.id
										})
									}

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
		.text {
			padding-top: 124rpx;
			margin-left: 80rpx;
			margin-bottom: 86rpx;

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
