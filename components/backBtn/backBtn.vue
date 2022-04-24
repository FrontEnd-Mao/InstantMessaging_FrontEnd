<template>
	<view>
		<view class="back" @tap="back">
			<image src="../../static/images/imag/right.png" mode="" class="back-img"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: "backBtn",
		data() {
			return {

			};
		},
		methods:{
			back: function() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>
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


	}
	.back-img {
		width: 48rpx;
		height: 48rpx;
		/* transform: rotate(360deg); */
	}
</style>
