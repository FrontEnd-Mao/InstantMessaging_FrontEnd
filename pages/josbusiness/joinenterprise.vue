<template>
	<view class="content">
		<backBtn></backBtn>
		<view class="logo">
			<image src="../../static/images/josbusiness/chat.png" class="chat-img" mode=""></image>
			<view class="text">加入企业</view>
		</view>
		<view class="input">
			<view class="input-enterpriseID">
				<input type="text" v-model="eid" value="" class="input-item" @input="dejudgeEnterprise" />
			</view>
		</view>
		<view class="notice">
			<view class="notice-title">
				注意
			</view>
			<view class="text-content">
				申请加入企业需要企业管理员审批同意以后才能加入，如登录进去以后还未显示进入企业，请自行与企业联系处理
			</view>
		</view>
		<view :class="[{establish_btn_ok: isOk}, {establish_btn_no: !isOk}]" @tap="join">
			加入
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
				isOk: false,
				eid: '',
				uid: '',
			};
		},
		onLoad(e) {
			this.uid = e.uid;
		},
		methods: {
			dejudgeEnterprise: myFun.debounceSearchEnt(function(e) {
				let eid = e.detail.value;
				if (eid.length > 0) {
					this.judgeEnterprise(eid);
				}
			}),
			judgeEnterprise: function(eid) {
				let data = {
					"data": eid,
					"type": "_id"
				}
				reqSignup.request('/enterprise/judgeValue', data, 'POST').then(res => {
					console.log(res);
					let status = res[1].data.status;
					if (status == 200) {
						let resualt = res[1].data.result;
						if (resualt != 0) {
							this.isOk = true;

						} else {
							this.isOk = false;
							uni.showToast({
								title: '该公司不存在！',
								icon: 'none',
								duration: 2000
							})
						}

					} else if (status == 500) {
						uni.showToast({
							title: '服务器出错啦！',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			join: function() {
				let data = {
					"eid": this.eid,
					"uid": this.uid
				}
				if (this.isOk) {
					reqSignup.request('/enterprise/applyToJoin', data, 'POST').then(res => {
						console.log(res);
						let status = res[1].data.status;
						if (status == 200) {
							uni.showToast({
								title: '申请成功！请等待管理员审核',
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

			.chat-img {
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
			margin-bottom: 40rpx;

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

			.input-enterpriseID {
				position: relative;

				&:before {
					content: '企业ID';
					background-color: #FFFFFF;
					float: left;
					position: absolute;
					left: 120rpx;
					top: -20rpx;
					color: #939294;
				}
			}

		}

		.notice {
			width: 590rpx;
			text-align: center;
			margin-left: 80rpx;

			.notice-title {
				font-size: 48rpx;
				font-weight: 10;
				margin-bottom: 20rpx;
			}

			margin-bottom: 28rpx;

			.text-content {
				font-size: 26rpx;
				font-weight: 10;
			}
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
	}
</style>
