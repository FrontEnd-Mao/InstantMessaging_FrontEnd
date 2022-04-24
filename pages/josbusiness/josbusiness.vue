<template>
	<view class="content">
		<backBtn></backBtn>
		<view class="tips" v-if="tips">
			您还没有加入企业，请选择以下操作
		</view>
		<view class="text">我想要</view>
		<view class="choice">
			<view class="no-choice" :class="{choiced:isChoice}" @tap="choice">
				创办企业
				<image src="../../static/images/josbusiness/Vector.png" class="vector-img" mode=""></image>
			</view>
			<view class="no-choice" :class="{choiced:!isChoice}" @tap="choice">
				加入企业
				<image src="../../static/images/josbusiness/Vector.png" class="vector-img" mode=""></image>
			</view>
		</view>
		<view class="btn" @tap="next">
			继续
		</view>
	</view>
</template>

<script>
	import backBtn from '../../components/backBtn/backBtn.vue'
	export default {
		components: {
			backBtn
		},
		data() {
			return {
				isChoice: true,
				uid: '',
				jos: 'Start',
				tips: false,
			};
		},
		onLoad(e) {
			this.uid = e.uid;
			if(e.from = 'login') {
				this.tips = true;
			}
			else{
				this.tips = false;
			}
		},
		methods: {
			choice: function() {
				this.isChoice = !this.isChoice;
				if(this.isChoice)
					this.jos = 'Start';
				else 
					this.jos = 'Join';
			},
			next: function() {
				if(this.jos == 'Start') {
					uni.navigateTo({
						url: '../josbusiness/createenterprise?uid=' + this.uid
					})
				}
				else {
					uni.navigateTo({
						url: '../josbusiness/joinenterprise?uid=' + this.uid
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		.tips {
			text-align: center;
			padding-top: 100rpx;
			font-size: 28rpx;
			font-size: 100;
			color: #E94057;
		}
		.text {
			padding-top: 50rpx;
			margin-left: 80rpx;
			margin-bottom: 40rpx;
			font-size: 64rpx;
			font-weight: 10;
		}
		.choice {
			.no-choice {
				width: 590rpx;
				height: 116rpx;
				line-height: 116rpx;
				border-radius: 30rpx;
				/* 外部/White #FFFFFF */
				background: #FFFFFF;
				box-sizing: border-box;
				/* 外部/border #E8E6EA */
				border: 2rpx solid #E8E6EA;
				padding-left: 40rpx;
				margin-left: 80rpx;
				margin-bottom: 44rpx;
			}
			.choiced {
				width: 590rpx;
				height: 116rpx;
				line-height: 116rpx;
				border-radius: 30rpx;
				/* 外部/White #FFFFFF */
				background: #E94057;
				color: #fff;
				box-sizing: border-box;
				/* 外部/border #E8E6EA */
				border: 2rpx solid #E8E6EA;
				padding-left: 40rpx;
				margin-left: 80rpx;
				margin-bottom: 44rpx;
			}
			.vector-img {
				width: 30rpx;
				height: 30rpx;
				float: right;
				padding-top: 42rpx;
				padding-right: 20px;
			}
		}



		
		.btn {
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
