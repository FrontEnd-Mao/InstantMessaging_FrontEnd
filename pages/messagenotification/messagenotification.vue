<template>
	<view class="content">
		<tao-bar>
			<template v-slot:center>
				<view class="title">
					消息通知
				</view>
			</template>
		</tao-bar>
		<view class="message">
			<view class="addEnterprise" v-for="(item, index) in applyList" :key="item.ApplyId">
				<view class="refuse" @tap="refuse(item.ApplyId)">
					<view class="text">
						拒绝
					</view>
				</view>
				<view class="center">
					<view class="headPortrait">
						<image :src="item.imgurl" mode=""></image>
					</view>

					<view class="name">
						{{item.name}}
					</view>
					<view class="time">
						{{item.applicationTime}}
					</view>
				</view>
				<view class="agree" @tap="agree(item.ApplyId)">
					<view class="text">
						同意
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import taoBar from '../../components/topBars/topBar.vue'
	import request from '../../network/request.js';
	import myFun from '../../commons/js/myFun.js'
	export default {
		components: {
			taoBar
		},
		data() {
			return {
				uid: '',
				token: '',
				role: '',
				enterpriseId: '',
				applyList: [],
			};
		},
		mounted() {
			this.getStorages();
			if(this.role == 'builder' || this.role == 'admin')
				this.getApplyEnterprise();
		},
		methods: {
			//获取缓存
			getStorages: function() {
				const storageValue = uni.getStorageSync('user');
				console.log(storageValue);
				if (storageValue) {
					this.uid = storageValue.id
					this.token = storageValue.token;
					this.role = storageValue.role;
					this.enterpriseId = storageValue.enterpriseId;
				} else {
					uni.navigateTo({
						url: '../sign/signin'
					})
				}
			},
			//获取申请加入企业人员
			getApplyEnterprise() {
				let data = {
					eid: this.enterpriseId
				}
				request.toRequest('/enterprise/searchApply', data, 'POST').then(res => {
					let status = res[1].data.status;
					if (status == 200) {
						this.applyList = res[1].data.backValue;
						this.applyList.forEach(item => {
							item.imgurl = this.apiUrl + item.imgurl;
							item.applicationTime = myFun.timestampToTime(item.applicationTime);
						})
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
			//同意加入
			agree(ApplyId) {
				console.log(ApplyId);
				let data = {
					"ApplyId": ApplyId,
					"uid": this.uid,
					"eid": this.eid
				}
				request.toRequest('/enterprise/agreeJoinEnterprise', data, 'POST').then(res => {
					let status = res[1].data.status;
					if (status == 200) {
						for(let i=0;i< this.applyList.length;i++) {
							if(this.applyList[i].ApplyId == ApplyId)
								this.applyList.splice(i, 1);
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
			//拒绝加入
			refuse(ApplyId) {
				let data = {
					"ApplyId": ApplyId,
				}
				request.toRequest('/enterprise/refuseJoinEnterprise', data, 'POST').then(res => {
					let status = res[1].data.status;
					if (status == 200) {
						for(let i=0;i< this.applyList.length;i++) {
							if(this.applyList[i].ApplyId == ApplyId)
								this.applyList.splice(i, 1);
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
		}
	}
</script>

<style lang="scss">
	.message {
		padding-top: 92rpx;
		margin-top: 10rpx;

		.addEnterprise {
			display: flex;
			flex-direction: row;
			padding: $uni-spacing-col-lg;
			margin: 30rpx 30rpx 50rpx 30rpx;
			border-radius: $uni-border-radius-base;
			box-shadow: 0px 24rpx 64rpx -8rpx rgba(0, 0, 0, 0.1);
			height: 150rpx;

			.refuse {
				text-align: center;
				flex: 1;

				.text {
					background: rgb(254, 236, 236);
					height: 66rpx;
					width: 150rpx;
					line-height: 66rpx;
					color: rgb(254, 113, 116);
					border-radius: 15rpx;
				}
			}

			.center {
				flex: 1;
				text-align: center;
				position: relative;
				top: -70rpx;

				.headPortrait {
					image {
						width: 146rpx;
						height: 146rpx;
						border-radius: 50%;
					}
				}

				.time {
					font-size: $uni-font-size-sm;
				}
			}

			.agree {
				flex: 1;
				text-align: center;

				.text {
					float: right;
					background: rgb(255, 224, 44);
					height: 66rpx;
					width: 150rpx;
					line-height: 66rpx;
					border-radius: 15rpx;
				}
			}
		}
	}
</style>
