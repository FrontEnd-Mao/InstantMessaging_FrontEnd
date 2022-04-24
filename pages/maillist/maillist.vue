<template>
	<view class="content">
		<view class="top-bar">
			通讯录
		</view>
		<view class="news" @tap="messageNotification">
			<view class="text">
				消息通知
			</view>
			<image src="../../static/images/grouphome/more.png" mode=""></image>
		</view>
		<view class="maillist">
			通讯录
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
			messageNotification() {
				uni.navigateTo({
					url: '../messagenotification/messagenotification'
				});
			},
		}
	}
</script>

<style lang="scss">
	.content {
		background-color: rgba(245,247,246, 0.1);
		.top-bar {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 88rpx;
			z-index: 1001;
			padding-top: var(--status-bar-height);
			box-sizing: border-box;
			background: rgba(255,255,255,0.96);
			border-bottom: 1px solid $uni-bg-color;
			// padding-left: $uni-spacing-col-base;
			text-align: center;
			line-height: 88rpx;
			 // box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.1);
		}
		.news {
			background: #FFFFFF;
			margin: 150rpx $uni-spacing-col-base 0 $uni-spacing-col-base;
			.text {
				display: inline;
				vertical-align: middle;
				
			}
			image {
				float: right;
				width: 52rpx;
				height: 52rpx;
			}
		}
	}
</style>
