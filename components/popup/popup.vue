<template>
	<view class="content">
		<view class="top">
			<view class="top-left">
				<slot name="top-left"></slot>
			</view>
			<view class="top-right" @tap="finishi">
				完成
			</view>
		</view>
		<view class="main">
			<slot name="main"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "popup",
		data() {
			return {
			};
		},
		methods: {
			finishi: function() {
				this.$emit('finish');
			}
		}
	}
</script>

<style lang="scss">
	.content {
		background-color: #d5d5d5;
		width: 100%;
		height: 528rpx;

		border-radius: 40rpx 40rpx 0 0;
		z-index: 10;
	}
	.top {
		overflow: hidden;
		.top-left {
			float: left;
			margin: $uni-spacing-col-sm 0  0 $uni-spacing-col-sm;
			font-size: 46rpx;
			font-weight: 400;
			padding: 20rpx;
		}
		.top-right {
			float: right;
			font-size: 32rpx;
			margin: $uni-spacing-col-sm $uni-spacing-col-sm  0 0;
			line-height: 90rpx;
			padding-right: 20rpx;
		}

	}
	.main {
		padding: 32rpx $uni-spacing-col-base 0;
		// background-color: #6a6a6a;
	}
</style>
