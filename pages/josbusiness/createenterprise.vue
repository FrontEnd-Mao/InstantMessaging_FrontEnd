<template>
	<view class="content">
		<backBtn></backBtn>
		<view class="logo">
			<image src="../../static/images/josbusiness/people.png" class="people-img" mode=""></image>
			<view class="text">补全信息创建企业</view>
		</view>
		<view class="input">
			<view class="input-enterpriseName">
				<input type="text" value="" class="input-item" @blur="getEnterpriseName" />
			</view>
			<!-- 			<view class="input-name">
				<input type="text" value="" class="input-item" @blur="getFounderName" />
			</view> -->
		</view>
		<view :class="[{establish_btn_ok: isOk}, {establish_btn_no: !isOk}]" @tap="build">
			创建
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
				isOk: false, //创办按钮样式判断
				isEnterpriseName: false,
				enterpriseName: '', //公司名称
				// founderName: '', //创办人名称
				uid: '',
			};
		},
		onLoad(e) {
			this.uid = e.uid;
		},
		methods: {
			getEnterpriseName: function(e) {
				if (e.detail.value.length > 0) {
					let data = {
						"data": e.detail.value,
						"type": "name"
					}
					reqSignup.request('/enterprise/judgeValue', data, 'POST').then(res => {
						console.log(res);
						let status = res[1].data.status;
						if (status == 200) {
							let resualt = res[1].data.result;
							if (resualt > 0) {
								this.isEnterpriseName = false;
								this.judgeSignUp();
								uni.showToast({
									title: '名称被占用！',
									icon: 'none',
									duration: 2000
								})
							} else {
								this.enterpriseName = e.detail.value;
								this.isEnterpriseName = true;
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

			},
			getFounderName: function(e) {
				this.founderName = e.detail.value;
				this.judgeSignUp();
			},
			//当公司名称和创办人输入正确时
			judgeSignUp: function() {
				if (this.isEnterpriseName) {
					this.isOk = true;
				} else {
					this.isOk = false;
				}

			},
			build: function() {
				if (this.isOk) {
					let data = {
						"name": this.enterpriseName,
						"uid": this.uid
					}
					reqSignup.request('/enterprise/buildEnterprise', data, 'POST').then(res => {
						console.log(res);
						let status = res[1].data.status;
						if (status == 200) {
							uni.showToast({
								title: '创办成功！',
								icon: 'none',
								duration: 2000
							})
							setTimeout(function() {
								uni.navigateTo({
									url: '../login_one/login_one'
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
		.logo {
			margin-bottom: 50rpx;

			.people-img {
				padding-top: 100rpx;
				padding-left: 274rpx;
				margin-bottom: 20rpx;
				width: 200rpx;
				height: 212rpx;
			}

			.text {
				text-align: center;
				font-size: 48rpx;
				font-weight: 10;
			}
		}

		.input {
			.input-item {
				width: 590rpx;
				height: 95.28rpx;
				border-radius: 15px;
				/* 外部/White #FFFFFF */
				background: #FFFFFF;
				box-sizing: border-box;
				/* 外部/border #E8E6EA */
				border: 1px solid #E8E6EA;
				border-top-left: 0;
				margin-left: 80rpx;
				padding-left: 40rpx;
				margin-bottom: 50rpx;
			}

			.input-enterpriseName {
				position: relative;

				&:before {
					content: '企业名称';
					background-color: #FFFFFF;
					float: left;
					position: absolute;
					left: 120rpx;
					top: -20rpx;
					color: #939294;
				}
			}

			.input-name {
				position: relative;

				&:before {
					content: '姓名';
					background-color: #FFFFFF;
					float: left;
					position: absolute;
					left: 120rpx;
					top: -20rpx;
					color: #939294;
				}
			}
		}

		.establish_btn_no {
			width: 590rpx;
			height: 112rpx;
			border-radius: 30rpx;
			/* 外部/red #E94057 */
			background: #d5d5d5;
			margin-left: 80rpx;
			line-height: 112rpx;
			color: #FFFFFF;
			text-align: center;
		}

		.establish_btn_ok {
			width: 590rpx;
			height: 112rpx;
			border-radius: 30rpx;
			/* 外部/red #E94057 */
			background: #E94057;
			margin-left: 80rpx;
			line-height: 112rpx;
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
