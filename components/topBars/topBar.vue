<template>
	<view>
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/signup/back.png" mode="" ></image>
			</view>
			<view class="top-bar-center">
				<slot name="center" ></slot>
			</view>
			<view class="top-bar-right">
				<slot name="right"></slot>
			</view>
			
		 </view>
	</view>
</template>

<script>
	export default {
		name:"topBar",
		data() {
			return {
				
			};
		},
		methods: {
			//返回登录界面
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
		}
	}
</script>

<style lang="scss">
	.top-bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 88rpx;
		z-index: 1001;
		background-color: #FFFFFF;
		padding-top: var(--status-bar-height);
		box-sizing: border-box;
		display: flex;
		/**
		 * 此处有bug
		 * */
		 box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.1);
		
		// padding-left: $uni-spacing-col-base;


		.top-bar-left {
			flex: 1;
			float: left;
			padding-top: 15rpx;
			padding-left: $uni-spacing-col-base;
			image {
				width: 58rpx;
				height: 58rpx;
				border-radius: 16rpx;
			}
		}
		.top-bar-center {
			flex: 1;
			text-align: center;
			line-height: 88rpx;
			// padding-right: $uni-spacing-col-base;
			font-weight: 600;
			font-size: $uni-font-size-title;
		}
		.top-bar-right { 
			flex: 1;
			float: right;
			padding-right: $uni-spacing-col-base;
			font-size: 12rpx;

			
		}
	}
</style>
