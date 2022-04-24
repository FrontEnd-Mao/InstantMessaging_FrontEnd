<template>
	<view>
		<view class="submit">
			<view class="submit-chat">
				<view class="bt-img" @tap="switchVoiceOrTyping">
					<image :src="recordImgUrl" mode=""></image>
				</view>
				<textarea auto-height="true" class="chat-send btn" :class="{displayNone: !isRecord}" @input="inputs"
					v-model="msg" @focus="inputsFocus" />
				<view class="record btn" :class="{displayNone: isRecord}" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">
					按住 说话
				</view>
				<view class="bt-img" @tap="emoji">
					<image src="../../static/images/submit/expression.png" mode=""></image>
				</view>
				<view class="bt-img" @tap="more" :class="{displayNone: isSend}">
					<image src="../../static/images/submit/moreFeatures.png" mode=""></image>
				</view>
				<view class="bt-send" :class="{displayNone: !isSend}" @tap="sendMsg">
					发送
				</view>
			</view>
			<view class="chat-emoji" :class="{displayNone: isEmoji}">
				<view class="emoji-btn">
					<view class="emoji-btn-del" @tap="delEmoji">
						<image src="../../static/images/submit/Backspace.png" mode=""></image>
					</view>
				</view>
				<emoji @getEmoji="getEmoji" :height="260"></emoji>
			</view>
			<view class="more" :class="{displayNone: isMore}">
				<more @getImgPath="getImgPath" :isMore="this.isMore" @changeIsMore="changeIsMore" @getLocation="getLocation"></more>
			</view>
		</view>
		<view class="voice-bg"  :class="{displayNone: isVoice}">
			<view class="voice-bg-len">
				<view class="voice-bg-time" :style="{width:voiceTime/0.6 + '%'}">
					{{voiceTime}}
				</view>
			</view>
				<view class="voice-del">
					上划取消录音
				</view>
		</view>
	</view>
</template>

<script>
	import emoji from '../emoji/emoji.vue';
	import more from '../more/more.vue';
	const recorderManager = uni.getRecorderManager();

	export default {
		name: "submit",
		components: {
			emoji,
			more,
		},
		data() {
			return {
				isRecord: true, //true为显示输入框
				isEmoji: true, //true为表情消失
				isMore: true, //true为更多消失
				isSend: false, //true为发送按钮消失
				isVoice: true, //true为不发送语音消息
				msg: 'Hello', //消息输入框
				thimer: '', //计时器（统计录音时间）
				voiceTime: 1, //录音时长
				pageY: 0,
				tempFilePath: '', //录音地址
				recordImgUrl: '../../static/images/submit/voice.png', //录音按钮图片地址
			};
		},
		methods: {
			//获取模块高度
			getElementHeight: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.submit').boundingClientRect(data => {
					console.log(data.height);
					this.$emit('heights', data.height)
				}).exec();
			},
			//切换打字或者录音
			switchVoiceOrTyping: function() {

				if (this.isRecord) {
					this.recordImgUrl = '../../static/images/submit/keyboard.png';
					this.isSend = false;
					this.isMore = true;
				} else {
					this.recordImgUrl = '../../static/images/submit/voice.png';
					if (this.msg.length) {
						this.isSend = true;
					}
					this.isMore = true;
				}
				this.isEmoji = true;
				this.isRecord = !this.isRecord;



			},
			//控制表情模块显示与消失
			emoji: function() {
				this.isEmoji = !this.isEmoji;
				this.isMore = true;
				if (!this.isEmoji)
					this.isRecord = true;
				setTimeout(() => {
					this.getElementHeight();
				}, 10)

			},
			//控制发送按钮显示与消失
			inputs: function(e) {
				let chatMsg = e.detail.value;
				if (chatMsg.length)
					this.isSend = true;
				else
					this.isSend = false;
				this.msg = e.detail.value;
			},
			//发送文字
			sendMsg: function() {
				// this.$emit('inputs', this.msg);
				this.send(this.msg, 0);
				setTimeout(() => {
					this.msg = '';
					this.isSend = false;
				}, 0)
			},
			//输入框聚焦
			inputsFocus: function() {
				this.isEmoji = true;
				this.isMore = true;
				setTimeout(() => {
					this.getElementHeight();
				}, 10)
			},
			//接收表情
			getEmoji: function(e) {
				this.msg = this.msg + e;
				this.isSend = true;
				console.log(e);
			},
			//删除输入框中的表情
			delEmoji: function() {
				if (this.msg.length > 0) {
					this.msg = this.msg.substr(0, this.msg.length - 1);
				}
			},
			//发送
			send: function(msg, type) {
				let data = {
					message: msg,
					types: type
				}
				this.$emit('inputs', data);
				setTimeout(() => {
					this.msg = '';
				})
			},
			//点击更多
			more: function() {
				this.isEmoji = true;
				this.isMore = !this.isMore;
				setTimeout(() => {
					this.getElementHeight();
				}, 10)
			},
			//获取子组件传递的图片地址
			getImgPath: function(e) {
				this.send(e, 1);
			},
			//子组件改变父组件isMore的值
			changeIsMore: function(e) {
				this.isMore = e;
				setTimeout(() => {
					this.getElementHeight();
				}, 10)
			},
			//开始录音（按住说话事件）
			touchstart: function(e) {
				console.log('开始录音');
				this.pageY = e.changedTouches[0].pageY;
				this.isVoice = false;
				recorderManager.start();
				this.thimer = setInterval(() => {
					this.voiceTime++;
					console.log(this.voiceTime);
					if (this.voiceTime >= 4) {
						this.touchend();
						clearInterval(this.thimer);
					}
				}, 1000);

			},
			//结束录音（松开按住说话事件）
			touchend: function() {
				console.log('录音结束');
				
				recorderManager.stop();
				recorderManager.onStop((res) => {
					let data = {
						voice: res.tempFilePath,
						time: this.voiceTime,
					}
					if(!this.isVoice)
						this.send(data, 2);
					this.voiceTime = 1;
					this.isVoice = true;
				});
				clearInterval(this.thimer);
			},
			//上划取消发送语音
			touchmove: function(e) {
				if(this.pageY - e.changedTouches[0].pageY > 100) {
					this.isVoice = true;
				}
			},
			//获取位置信息
			getLocation: function(e) {
				this.send(e, 3)
			}
		}
	}
</script>

<style lang="scss">
	.submit {
		width: 100%;
		background-color: rgba(244, 244, 244, 0.96);
		border-top: 1px solid $uni-border-color;
		position: fixed;
		bottom: 0;
		z-index: 1002;
		// padding-bottom: 15rpx;
	}

	.displayNone {
		display: none;
	}

	.submit-chat {
		width: 100%;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding-top: 15rpx;
		padding-bottom: 15rpx;

		image {
			width: 60rpx;
			height: 60rpx;
			margin: 0 10rpx;
			flex: auto;
		}

		.btn {
			flex: auto;
			background-color: #fff;
			padding: 20rpx;
			border-radius: 10rpx;
			max-height: 160rpx;
			margin: 0 20rpx;
			overflow: hidden;
			overflow-y: scroll;
		}

		.chat-send {
			line-height: 42rpx;
		}

		.bt-send {
			width: 126rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			background-color: rgba(255, 228, 49, 1);
			border-radius: 12rpx;
			font-size: 12rpx;
			margin-right: 10rpx;
			justify-content: center;
			align-items: center;
			// color: #fff;
		}

		.record {
			text-align: center;
			color: $uni-text-color-grey
		}


	}

	.chat-emoji {
		width: 100%;
		height: 460rpx;
		background-color: rgba(236, 237, 238, 1);
		box-shadow: 0px -1rpx 0px 0px rgba(0, 0, 0, 0.1);

		.emoji-btn {
			width: 110rpx;
			height: 94rpx;
			background-color: rgba(236, 237, 238, 0.9);
			// background-color: #999;
			position: fixed;
			bottom: 20rpx;
			right: 15rpx;
			display: flex;

			.emoji-btn-del {
				flex: 1;
				margin-top: 15rpx;
				height: 64rpx;
				background-color: #FFFFFF;
				text-align: center;
				line-height: 80rpx;
				border-radius: 12rpx;

				image {
					width: 52rpx;
					height: 52rpx;
					padding-top: 6rpx;
				}
			}
		}
	}

	.more {
		width: 100%;
		height: 436rpx;
		background: rgba(236, 237, 238, 1);
		box-shadow: 0px -1rpx 0px 0px rgba(0, 0, 0, 0.1);
		bottom: env(safe-area-inset-bottom);
		padding: 8rpx 20rpx;
		box-sizing: border-box;
	}

	.voice-bg {
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 1001;

		.voice-bg-len {
			height: 84rpx;
			width: 600rpx;
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			top: 0;
			margin: auto;
			background-color: rgba(255, 255, 255, 0.2);
			border-radius: 42rpx;
			text-align: center;
			.voice-bg-time {
				line-height: 84rpx;
				display: inline-block;
				min-width: 120rpx;
				background-color: $uni-color-primary;
				border-radius: 42rpx;
			}
		}
		.voice-del {
			width: 100%;
			position: absolute;
			bottom: 148rpx;
			text-align: center;
			color: #FFFFFF;
			font-size: $uni-font-size-base;
		}
	}
</style>
