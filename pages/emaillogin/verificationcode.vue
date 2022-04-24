<template>
	<view class="content">
		<backBtn></backBtn>
		<view class="timer" v-if="!show">
			{{count}}S后可重新发送
		</view>
		<view class="text">
			我们已经发送过去，请输入验证码
		</view>
		<view class="main">
			<view class="inputs"
				:class="[{noInput:inputOne.isNoInput},{entering:inputOne.isEncodeing},{entered:inputOne.isEntered}]">
				<input type="number" :focus="current == 1" @keydown.delete="delate(1)" @blur="checkeLen(1)"
					v-model="value.value1" maxlength="1" :cursor="value.value1.length" @input="checked(1)"
					:class="[{noCode:inputOne.isNoInput},{enteringCode:inputOne.isEncodeing}]" />
			</view>
			<view class="inputs"
				:class="[{noInput:inputTwo.isNoInput},{entering:inputTwo.isEncodeing},{entered:inputTwo.isEntered}]">
				<input type="number" :focus="current == 2" @keydown.delete="delate(2)" @blur="checkeLen(2)"
					v-model="value.value2" maxlength="1" :cursor="value.value1.length" value="" @input="checked(2)"
					:class="[{noCode:inputTwo.isNoInput},{enteringCode:inputTwo.isEncodeing}]" />
			</view>
			<view class="inputs"
				:class="[{noInput:inputThree.isNoInput},{entering:inputThree.isEncodeing},{entered:inputThree.isEntered}]">
				<input type="number" :focus="current == 3" @keydown.delete="delate(3)" @blur="checkeLen(3)"
					v-model="value.value3" maxlength="1" :cursor="value.value1.length" value="" @input="checked(3)"
					:class="[{noCode:inputThree.isNoInput},{enteringCode:inputThree.isEncodeing}]" />
			</view>
			<view class="inputs"
				:class="[{noInput:inputFore.isNoInput},{entering:inputFore.isEncodeing},{entered:inputFore.isEntered}]">
				<input type="number" :focus="current == 4" @keydown.delete="delate(4)" @blur="checkeLen(4)"
					v-model="value.value4" maxlength="1" :cursor="value.value1.length" value="" @input="checked(4)"
					:class="[{noCode:inputFore.isNoInput},{enteringCode:inputFore.isEncodeing}]" />
			</view>
		</view>
		<view class="reSend" :class="{NoreSend: !show}" @tap="reSend">
			重新发送
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
				current: 1,
				count: '',
				timer: null,
				show: true,
				value: {
					value1: '',
					value2: '',
					value3: '',
					value4: '',
				},
				email: '',
				inputOne: {
					"isNoInput": false,
					"isEncodeing": true,
				},
				inputTwo: {
					"isNoInput": true,
					"isEncodeing": false,
				},
				inputThree: {
					"isNoInput": true,
					"isEncodeing": false,
				},
				inputFore: {
					"isNoInput": true,
					"isEncodeing": false,
				},
			};
		},
		onLoad(e) {
			this.setTime();
			this.email = e.email;
		},
		methods: {
			//设置定时器
			setTime: function() {
				const TIME_COUNT = 60;
				if (!this.timer) {
					this.count = TIME_COUNT;
					this.show = false;
					this.timer = setInterval(() => {
						if (this.count > 0 && this.count <= TIME_COUNT) {
							this.count--;
						} else {
							this.show = true;
							clearInterval(this.timer);
							this.timer = null;
						}
					}, 1000)
				}
			},
			delate: function(type) {
				if (type != 1) {
					let str = 'value' + type
					if (!this.value[str].length) {
						this.current--;
					}
				}
			},
			checked: function(type) {
				this.current = type
				let str = 'value' + type;
				if (this.current != 4 && this.value[str].length)
					this.current++;

				console.log(this.current);
				if (type == 1) {
					this.inputOne.isNoInput = false;
					this.inputOne.isEncodeing = true;

				} else if (type == 2) {
					this.inputTwo.isNoInput = false;
					this.inputTwo.isEncodeing = true;

				} else if (type == 3) {
					this.inputThree.isNoInput = false;
					this.inputThree.isEncodeing = true;

				} else {
					this.inputFore.isNoInput = false;
					this.inputFore.isEncodeing = true;

				}

				if (this.value.value1 && this.value.value2 && this.value.value3 && this.value.value4) {
					let code = this.value.value1 + this.value.value2 + this.value.value3 + this.value.value4
					let data = {
						"email": this.email,
						"code": code,
					}
					reqSignup.request('/signIn/matchCode', data, 'POST').then(res => {
						console.log(res);
						let status = res[1].data.status;
						let backValue = res[1].data.backValue
						if (status == 200) {
							//判断是否加入企业
							let datas = {
								"uid": backValue.id
							}
							reqSignup.request('/enterprise/judgeUserIntoEnter', datas, 'POST').then(res => {
								console.log(res);
								let status = res[1].data.status;
								if (status == 200) {
									let count = res[1].data.backValue.result;
									console.log(count);
									if (count) {
										
										try {
											uni.setStorageSync('user', {
												'id': backValue.id,
												"enterpriseId": res[1].data.backValue.enterpriseId,
												"name": backValue.name,
												"imgurl": backValue.imgurl,
												"token": backValue.token,
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
										uni.showToast({
											title: '登录成功，但您还未加入企业！',
											icon: 'none',
											duration: 2000
										})
										setTimeout(function() {
										uni.navigateTo({
											url: '../josbusiness/josbusiness?from=login&uid=' + backValue.id
										})
										}, 2000);
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
						} else if (status == 500) {
							uni.showToast({
								title: '验证码错误！',
								icon: 'none',
								duration: 2000
							})
						}
					})
				}
			},
			checkeLen: function(type) {
				if (type == 1) {
					if (!this.value['value1'].length) {
						this.inputOne.isNoInput = true;
						this.inputOne.isEncodeing = false;
					}
				} else if (type == 2) {
					if (!this.value['value2'].length) {
						this.inputTwo.isNoInput = true;
						this.inputTwo.isEncodeing = false;
					}
				} else if (type == 3) {
					if (!this.value['value3'].length) {
						this.inputThree.isNoInput = true;
						this.inputThree.isEncodeing = false;
					}
				} else {
					if (!this.value['value4'].length) {
						this.inputFore.isNoInput = true;
						this.inputFore.isEncodeing = false;
					}
				}
			},
			//重新发送
			reSend: function() {
				if (!this.show) {

				} else {
					this.setTime();
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
		},
	}
</script>

<style lang="scss">
	.content {
		.back {
			width: 104rpx;
			height: 104rpx;
			border-radius: 30rpx;
			/* 外部/White #FFFFFF */
			background: #FFFFFF;
			box-sizing: border-box;
			/* 外部/border #E8E6EA */
			border: 2rpx solid #E8E6EA;
			text-align: center;
			position: relative;
			left: 40rpx;
			top: 40rpx;
			padding-top: 28rpx;

			image {

				width: 48rpx;
				height: 48rpx;
				transform: rotate(360deg);
			}
		}

		.timer {
			width: 362rpx;
			height: 82rpx;
			font-family: GenJyuuGothic-Monospace-ExtraLight;
			font-size: 36rpx;
			font-weight: 200;
			line-height: 102rpx;
			text-align: center;
			position: absolute;
			left: 0;
			top: -740rpx;
			right: 0;
			bottom: 0;
			margin: auto;
		}

		.text {
			width: 376rpx;
			padding-top: 230rpx;
			margin-left: 180rpx;
			margin-bottom: 56rpx;
			font-size: 18px;
			font-weight: 100;
			line-height: 27px;
			text-align: center;
		}

		.main {
			margin-left: 122rpx;

			.inputs {
				width: 114rpx;
				height: 104rpx;
				border-radius: 30rpx;
				float: left;
				text-align: center;

				margin-right: 16rpx;

				input {
					width: 114rpx;
					height: 104rpx;
					font-size: 48rpx;
					font-weight: 10;
				}
			}

			//已经输入完毕的样式
			.entered {
				background: #E94057;

				.enteredCode {
					color: #fff;
				}
			}

			//正在输入的样式
			.entering {
				background: #E94057;

				.enteringCode {
					border-radius: 15px;
					/* 外部/White #FFFFFF */
					background: #FFFFFF;
					/* 外部/red #E94057 */
					border: 1px solid #E94057;
					color: #E94057;
				}
			}

			//没有输入的样式
			.noInput {
				.noCode {
					border-radius: 15px;
					/* 外部/White #FFFFFF */
					background: #FFFFFF;
					/* 外部/border #E8E6EA */
					border: 1px solid #E8E6EA;
				}
			}


		}

		.reSend {
			float: right;
			width: 160rpx;
			height: 48rpx;
			margin-right: 90rpx;
			margin-top: 30rpx;
			/* 外部/H5/16 Bold */
			font-family: GenJyuuGothic-Monospace-ExtraLight;
			font-size: 32rpx;
			font-weight: 200;
			line-height: 48rpx;
			letter-spacing: 0rpx;
			/* 外部/red #E94057 */
			color: #E94057;
		}

		.NoreSend {
			color: #CCCCCC;
		}
	}
</style>
