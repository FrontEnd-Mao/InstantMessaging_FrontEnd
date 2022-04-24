<template>
	<view class="emoji" :style="{height: height + 'px'}">
		<view class="emoji-line" v-for="(line, i) in emojis" :key="i">
			<view class="emoji-line-item" v-for="(item, index) in line"  @tap="clickEmoji(item)" :key="index">
				{{item}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			height: {
				type: Number,
				default: 260
			}
		},
		data() {
			return {
				emojis: [
					['😀', '😁', '😂', '🤣', '😃','😄', '😅', '😆'],
					['😉', '😊', '😋', '😎', '😍','😘', '😗', '😚'],
					['💘', '❤', '💔', '💕', '💖','💙', '💝', '💟'],
					['😀', '😁', '😂', '🤣', '😃','😄', '😅', '😆'],
					['😉', '😊', '😋', '😎', '😍','😘', '😗', '😚'],
					['💘', '❤', '💔', '💕', '💖','💙', '💝', '💟'],
					['😀', '😁', '😂', '🤣', '😃','😄', '😅', '😆'],
					['😉', '😊', '😋', '😎', '😍','😘', '😗', '😚'],
					['💘', '❤', '💔', '💕', '💖','💙', '💝', '💟'],
					['😀', '😁', '😂', '🤣', '😃','😄', '😅', '😆'],
					['😉', '😊', '😋', '😎', '😍','😘', '😗', '😚'],
					['💘', '❤', '💔', '💕', '💖','💙', '💝', '💟'],
				]
			}
		},
		methods: {
			//点击表情
			clickEmoji: function(e) {
				this.$emit('getEmoji', e);
			}
		}
	}
</script>

<style lang="scss">
	.emoji {
		width: 100%;
		// height: 460rpx;
		padding: 16rpx 10rpx 178rpx 10rpx;
		box-sizing: border-box;
		overflow: hidden;
		overflow-y: auto;
		.emoji-line {
			display: flex;
		}
		.emoji-line-item {
			flex: 1;
			text-align: center;
			font-size: 40rpx;
			line-height: 72rpx;
		}
	}
</style>
