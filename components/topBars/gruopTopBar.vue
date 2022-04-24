<template>
	<view>
		<view class="top-bar bg-bar" :animation="animationDatas">
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
		props: {
			animationDatas: {
				type: Object,
				default: 0,
			}
		},
		watch: {
			animationDatas() {
				this.aniDatas = this.animationDatas;
			}
		},
		data() {
			return {
				aniDatas: {}
			};
		},
		onLoad: function() {
			console.log(1);
		},
		methods: {
			//返回登录界面
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			//顶部动画
		},
	}
</script>

<style lang="scss">
	.bg-bar {
		background-color: #FFFFFF;
		opacity: 0;
	}
	.top-bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 88rpx;
		z-index: 1001;
		// background-color: #FFFFFF;
		padding-top: var(--status-bar-height);
		box-sizing: border-box;
		/**
		 * 此处有bug
		 * */
		 box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.1);
		
		// padding-left: $uni-spacing-col-base;


		.top-bar-left {
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
			text-align: center;
			line-height: 88rpx;
			padding-right: $uni-spacing-col-base;
			font-weight: 600;
			font-size: $uni-font-size-title;
		}
		.top-bar-right { 
			float: right;
			padding-right: $uni-spacing-col-base;
			font-size: 12rpx;
			.more {
				padding-top: 10rpx;
				padding-right: $uni-spacing-col-base;
				image {
					width: 62rpx;
					height: 62rpx;
				}
			}
			
		}
	}
</style>
