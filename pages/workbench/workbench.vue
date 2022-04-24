<template>
	<view class="content">
		<view class="top-bar">
			工作台
		</view>
		<view class="main">
			<view class="model_one">
				<view class="memorandum">
					<view class="title">
						备忘录
					</view>
					<view class="memorandumContent">

					</view>
				</view>
				<view class="model_one_right">
					<view class="model_one_right_top">
						<view class="alreadyDone">
							<view class="title">
								我的已办
							</view>
							<view class="alreadyDoneContent">
								20
							</view>
						</view>
						<view class="apply">
							<view class="title">
								我的申请
							</view>
							<view class="applyContent">
								20
							</view>
						</view>
					</view>
					<view class="needDealt">
						<view>
							<view class="title">
								我的代办
							</view>
							<view class="needDealtContent">
								5
							</view>
						</view>

						<image class="needDealtImg" src="../../static/images/workbench/needDealtImg.png" mode="">
						</image>
					</view>
				</view>
			</view>
			<view class="model_two">
				<view class="title">
					工具
				</view>
			</view>
			<view class="model_three">
				<view class="title">
					企业工作流程
				</view>
				<view class="content">
					<view class="process" v-for="(item, index) in processList" :key="item.workFlowId" @tap="intoProcess(item.workFlowId)">
						<image class="processImg" src="../../static/images/workbench/process.png" mode=""></image>
						<view class="workFlowName">
							{{item.workFlowName}}
						</view>
					</view>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '../../network/request.js';
	export default {
		data() {
			return {
				uid: '',
				token: '',
				role: '',
				enterpriseId: '',
				processList: [],
			};
		},
		mounted() {
			this.getStorages();
			this.getProcess();
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
			//获取流程数据
			getProcess() {
				let data = {
					eid: this.enterpriseId,
					pageSize: 10,
					nowPage: 0,
				};
				console.log('查询流程');
				request.toRequest('/backstage/SearchWorkFlow', data, 'POST')
					.then((res) => {
						console.log(res[1]);
						this.processList = res[1].data.e;
					})
					.catch((err) => {
						console.log(err);
					});
			},
			//进入流程
			intoProcess(workFlowId) {
				uni.navigateTo({
					url: '../process/process?workflowId=' + workFlowId
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		background-color: rgb(247, 247, 247);

		.top-bar {
			position: fixed;
			top: 0;
			left: 0;
			height: 88rpx;
			width: 100%;
			background-color: #E94057;
			text-align: center;
			color: #FFFFFF;
			line-height: 88rpx;
			font-size: 45rpx;
			font-weight: 100;
			font-family: AlibabaPuHuiTiL;
		}

		.main {
			padding: $uni-spacing-col-base;
			margin-top: 88rpx;

			.model_one {
				display: flex;
				flex-direction: row;
				color: #3D3D3D;
				font-weight: 100;

				.memorandum {
					width: 288rpx;
					height: 326rpx;
					border-radius: 20rpx;
					background: #FFFFFF;
					// box-shadow: 0px 8rpx 20rpx 0px rgba(0, 0, 0, 0.3);

					.title {
						padding: 20rpx;
					}
				}

				.model_one_right {
					.model_one_right_top {
						display: flex;
						flex-direction: row;

						.alreadyDone {
							width: 184rpx;
							height: 154rpx;
							border-radius: 20rpx;
							background: #FFFFFF;
							// box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
							margin-left: $uni-spacing-col-sm;
							margin-bottom: $uni-spacing-col-sm;
							text-align: center;

							.title {
								padding: 20rpx;
							}

							.alreadyDoneContent {
								font-size: 50rpx;
							}
						}

						.apply {
							width: 184rpx;
							height: 154rpx;
							border-radius: 20rpx;
							background: #FFFFFF;
							// box-shadow: 0px 8rpx 20rpx 0px rgba(0, 0, 0, 0.3);
							margin-left: $uni-spacing-col-sm;
							margin-bottom: $uni-spacing-col-sm;
							text-align: center;

							.title {
								padding: 20rpx;
							}

							.applyContent {
								font-size: 50rpx;
							}
						}
					}


					.needDealt {
						width: 382rpx;
						height: 154rpx;
						border-radius: 20rpx;
						background: #FFFFFF;
						// box-shadow: 0px 8rpx 20rpx 0px rgba(0, 0, 0, 0.3);
						margin-left: $uni-spacing-col-sm;
						display: flex;
						flex-direction: row;

						.title {
							padding: 20rpx;
						}

						.needDealtContent {
							padding-left: 60rpx;
							font-size: 50rpx;

						}

						.needDealtImg {
							width: 135rpx;
							height: 135rpx;
							float: right;
							margin: 10rpx 0 0 60rpx;
						}

					}
				}

			}

			.model_two {
				width: 676rpx;
				height: 304rpx;
				border-radius: 20rpx;
				background: #FFFFFF;
				// box-shadow: 0px 8rpx 20rpx 0px rgba(0, 0, 0, 0.3);
				margin-top: 46rpx;
				color: #3D3D3D;
				font-weight: 100;

				.title {
					padding: 20rpx;
				}
			}

			.model_three {
				width: 676rpx;
				height: 364rpx;
				border-radius: 20rpx;
				background: #FFFFFF;
				// box-shadow: 0px 8rpx 20rpx 0px rgba(0, 0, 0, 0.3);
				margin-top: 46rpx;
				color: #3D3D3D;
				font-weight: 100;

				.title {
					padding: 20rpx;
				}
				.content {
					width: 100%;
					.process {
						width: 120rpx;
						float: left;
						margin: 7rpx;
						text-align: center;
						font-size: 28rpx;
						.processImg {
							width: 70rpx;
							height: 70rpx;
						}
					}
				}
			}
		}
	}
</style>
