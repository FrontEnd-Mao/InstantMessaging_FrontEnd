<template>
	<view>
		<topBar :animationDatas="animationData">
			<template v-slot:center>
				<view class="topTitle">
					群详情
				</view>
			</template>
		</topBar>
		<view class="bg">
			<image :src="cropFilePath" mode="aspectFill" class="bg-img"></image>
		</view>
		<view class="main">
			<view class="main-inner">
				<view class="inf">
					<view class="name">
						今天很好
					</view>
					<view class="time">
						2020/11/1
					</view>
					<view class="notice">
						sdsad大师级的撒理解你抵抗力散dsadsadassdad你还记得考虑撒很大抗裂砂浆农行卡撒娇电脑会不考虑三级那还得三
					</view>
				</view>
				<view class="member">
					<view class="top">
						<view class="title">
							群成员
						</view>
						<view class="more">
							成员管理
						</view>
						<image src="../../static/images/homeuser/more.png" class="more-img" mode="aspectFit"></image>
					</view>

					<view class="member-list" v-for="(item, index) in groupDatas" :key="index">
						<view class="imgs">
							<image src="../../static/images/grouphome/false.png" mode="" class="del"></image>
							<image :src="item.imgurl" mode="aspectFit" class="user-img"></image>
						</view>
						<view class="name">
							{{item.name}}
						</view>
					</view>
					<view class="member-list">
						<view class="imgs">
							<image src="../../static/images/grouphome/invitation.png" class="user-add"
								mode="aspectFill"></image>
						</view>
						<view class="name">
							邀请
						</view>
					</view>
				</view>
				<view class="clear"></view>
			</view>
			<view class="mitem">
				<view class="row">
					<view class="title">
						群名
					</view>
					<view class="cont" @tap="changeGroupName">
						{{nowGroupName}}
					</view>
					<view class="more">
						<image src="../../static/images/grouphome/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">
						群头像
					</view>
					<view class="cont">
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						<image :src="cropFilePath" mode="aspectFit" class="groupHead" @tap="upload"></image>
					</view>
					<view class="more">
						<image src="../../static/images/grouphome/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" @tap="groupAnnouncement">
					<view class="title">
						群公告
					</view>
					<view class="cont">
						{{nowGroupAnnouncement}}
					</view>
					<view class="more">
						<image src="../../static/images/grouphome/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" @tap="intraGroupName">
					<view class="title">
						群内名
					</view>
					<view class="cont">
						{{nowIntraGroupName}}
					</view>
					<view class="more">
						<image src="../../static/images/grouphome/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">
						消息免打扰
					</view>
					<view class="cont"></view>
					<view class="more">
						<switch class="switch" :checked="indicatorDots" @change="changeIndicatorDots"
							color="rgba(255,228,49,1)" />
					</view>
				</view>
				<view class="bt2">
					解散群
				</view>
			</view>
		</view>
		<view class="popupContent" :style="{bottom:-+this.popupHeight+'px'}" :animation="popupanimationData">
			<popup class="popup" @finish="finish" :popupHeight="popupHeight" v-if="isNN == 'groupName'">
				<template v-slot:top-left>
					<view class="groupName">群名</view>
				</template>
				<template v-slot:main>
					<input type="text" value="" class="groupNameInput" ref="groupNameInput" />
				</template>
			</popup>
			<popup class="popup" @finish="finish" :popupHeight="popupHeight" v-if="isNN == 'groupAnnouncement'">
				<template v-slot:top-left>
					<view class="groupName">群公告</view>
				</template>
				<template v-slot:main>
					<!-- <input type="text" value="" clsass="groupNameInput" /> -->
					<textarea class="groupAnnouncement" ref="groupAnnouncementText" />
				</template>
			</popup>
			<popup class="popup" @finish="finish" :popupHeight="popupHeight" v-if="isNN == 'intraGroupName'">
				<template v-slot:top-left>
					<view class="groupName">群内名</view>
				</template>
				<template v-slot:main>
					<input type="text" value="我" class="groupNameInput" ref="intraGroupNameInput" />
				</template>
			</popup>
		</view>

	</view>
</template>

<script>
	import topBar from '../../components/topBars/gruopTopBar.vue';
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import popup from '../../components/popup/popup.vue';
	import datas from '../../commons/js/datas.js'
	export default {
		components: {
			topBar,
			popup,
			ImageCropper,
		},
		data() {
			return {
				gId: '',
				groupDatas: [],
				indicatorDots: true, //消息免打扰按钮状态
				//图片裁剪参数
				tempFilePath: '',
				cropFilePath: '',
				animationData: {}, //顶部返回栏动画
				popupanimationData: {}, //弹窗动画
				top: 0,
				popupHeight: 0, //弹窗高度
				isFinishi: true, //点击弹窗完成按钮出现的动画
				isNN: 'groupName', //判断点击的是群名还是群公告还是群内名-群名：groupName，群公告：groupAnnouncement，群内名：intraGroupName
				nowGroupName: '今天很好',
				nowGroupAnnouncement: '的撒旦撒旦',
				nowIntraGroupName: '我',
			};
		},
		onLoad: function(e) {
			this.gId = e.gId;
			this.cropFilePath = e.gImg;
			this.getGroupDatas();

		},
		onReady: function(e) {
			this.getTop();
			this.getPopupHeight();
		},
		methods: {
			getGroupDatas: function() {
				this.groupDatas = datas.friends();
			},
			//消息免打扰
			changeIndicatorDots(e) {
				this.indicatorDots = !this.indicatorDots
			},
			//头像
			upload() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ["album", "camera"], //从相册和拍照选择
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift();
					},
				});
			},
			confirm(e) {
				this.tempFilePath = "";
				this.cropFilePath = e.detail.tempFilePath;

				// #ifdef APP-PLUS||MP
				//除了H5端返回base64数据外，其他端都是返回临时地址，所以你要判断base64还是临时文件名，（用条件编译APP-PLUS||MP执行编译。）
				//按我这里是先上传裁剪得来的临时文件地址然后得到临时文件名，
				//待活你要判断是H5还是其他端传给后端类型参数让后端判断执行何种情况代码就OK了

				uni.uploadFile({
					url: "后端地址上传图片接口地址",
					filePath: this.cropFilePath,
					name: "file",
					fileType: "image",
					//formData:{},传递参数
					success: (uploadFileRes) => {
						var backstr = uploadFileRes.data;
						//自定义操作
					},

					fail(e) {
						console.log("this is errormes " + e.message);
					},
				});

				// #endif
			},
			cancel() {
				console.log("canceled");
				this.tempFilePath = "";
			},

			//获取距离顶部的高度用来配合顶部栏效果
			//获取main-inner模块高度
			getTop: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.main-inner').boundingClientRect(data => {
					this.top = data.top;
				}).exec();
			},

			//顶部动画
			addAnimat: function() {
				var animation = uni.createAnimation({
					duration: 300,
					timingFunction: 'linear',
				})
				if (this.top < 60)
					animation.opacity(1).step();
				else
					animation.opacity(0).step();
				this.animationData = animation.export();
			},
			//获取popup模块高度
			getPopupHeight: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.popupContent').boundingClientRect(data => {
					this.popupHeight = data.top;
		
				}).exec();
			},
			//弹窗动画
			popupAnimat: function(type) {
				var animation = uni.createAnimation({
					duration: 400,
					timingFunction: 'ease',
				})
				if (type == 'tapChange')
					animation.bottom(0).step();
				else
					animation.bottom(-this.popupHeight).step();
				this.popupanimationData = animation.export();
			},
			onPageScroll: function() {
				this.getTop();
				this.addAnimat();

			},
			//更改群名
			changeGroupName: function() {
				this.isNN = 'groupName';
				this.popupAnimat('tapChange');
			},
			//更改群公告
			groupAnnouncement: function() {
				this.isNN = 'groupAnnouncement';
				this.popupAnimat('tapChange');
			},
			//更改群内名
			intraGroupName: function() {
				this.isNN = 'intraGroupName';
				this.popupAnimat('tapChange');
			},
			//完成修改
			finish: function() {
				//获取输入框数值的方法还需要优化
				if (this.isNN == 'groupName') {
					this.nowGroupName = document.querySelector(".groupNameInput").getElementsByTagName('input')[0]._value;
					

				}
				else if (this.isNN == 'groupAnnouncement') {
					this.nowGroupAnnouncement = document.querySelector(".groupAnnouncement").getElementsByTagName('textarea')[0]._value;
					// console.log(document.querySelector(".groupAnnouncement").getElementsByTagName('textarea')[0]._value);
					
				}
				else {
					this.nowIntraGroupName = document.querySelector(".groupNameInput").getElementsByTagName('input')[0]._value;
				}
				this.popupAnimat('finish');
			},
		},
	}
</script>

<style lang="scss">
	.clear {
		clear: both;
	}

	.topTitle {
		padding-right: 35rpx;
	}

	.bg {
		width: 100%;
		height: 100%;
		background: #FFFFFF;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;

		.bg-img {
			width: 100%;
			height: 750rpx;
		}
	}

	.main {
		padding-top: 360rpx;

		.main-inner {
			width: 100%;
			min-height: 800rpx;
			background-color: #FFFFFF;
			border-radius: 40rpx 40rpx 0 0;
		}

		.inf {
			padding: $uni-spacing-row-base $uni-spacing-col-base 40rpx $uni-spacing-row-base;
			box-sizing: border-box;
			border-bottom: 1px solid #eee;

			.name {
				float: left;
				font-size: 48rpx;
				font-weight: 600;
				color: #3399FF;
				line-height: 66rpx;
			}

			.time {
				float: right;
				font-size: 28rpx;
				color: rgba(39, 40, 50, 0.5);
				line-height: 66rpx;
			}

			.notice {
				padding-top: 20rpx;
				font-size: 28rpx;
				color: #272832;
				line-height: 40rpx;
				clear: both;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}

		.member {
			// border-bottom: 1px solid #eee;

			.top {
				padding: $uni-spacing-row-base $uni-spacing-col-base 40rpx $uni-spacing-row-base;
				box-sizing: border-box;
				height: 100rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: flex-end;

				.title {
					flex: 1;
					font-size: 36rpx;
					font-weight: 600;
					color: #272832;
				}

				.more {
					float: right;
					// padding-right: 20rpx;
					font-size: 32rpx;
					font-weight: 400;
					color: rgba(39, 40, 50, 0.6);
				}

				.more-img {
					width: 26rpx;
					height: 38rpx;
				}
			}

			.member-list {
				width: 100%;
				padding: 20rpx 16rpx;
				box-sizing: border-box;
			}

			.member-list {
				padding-bottom: 32rpx;
				width: 20%;
				float: left;
				text-align: center;

				.imgs {
					display: inline-block;
					position: relative;
					width: 104rpx;
					height: 104rpx;
					border-radius: 20rpx;
					background-color: $uni-color-primary;
				}

				.user-img {
					width: 104rpx;
					height: 104rpx;
					border-radius: 20rpx;
				}

				.del {
					width: 40rpx;
					height: 40rpx;
					position: absolute;
					top: -16rpx;
					right: -16rpx;
					z-index: 10;
				}

				.name {
					padding: 0 8rpx;
					font-size: 8rpx;
					;
					color: #272832;
					line-height: 40rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.user-add {
					width: 104rpx;
					height: 104rpx;
					padding: 32rpx;
					box-sizing: border-box;
				}
			}
		}

		.mitem {
			display: flex;
			flex-direction: column;
			padding-top: 22rpx;
			width: 100%;
			background-color: #fff;

			.row {
				display: flex;
				flex-direction: row;
				// border-bottom: 1px solid #eee;
			}

			.user-img {
				width: $uni-img-size-lg;
				height: $uni-img-size-lg;
				border-radius: $uni-border-radius-base;
			}

			.title {
				flex: none;
				padding: 0 $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 112rpx;
			}

			.cont {
				flex: auto;
				padding-left: $uni-spacing-col-sm;
				font-size: $uni-font-size-lg;
				color: $uni-text-color-grey;
				line-height: 112rpx;
				height: 112rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.groupHead {
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
				margin-top: 16rpx 0 0 0;
			}

			.more {
				flex: none;
				height: 112rpx;
				align-items: center;
				display: flex;

				image {
					width: 80rpx;
					height: 28rpx;
				}
			}

			.switch {
				margin-right: 16rpx;
			}
		}

		.bt2 {
			text-align: center;
			font-size: $uni-font-size-lg;
			font-weight: 400;
			color: $uni-color-warning;
			line-height: 88rpx;
			margin-top: 120rpx;
		}
	}

	.popupContent {
		width: 100%;
		position: fixed;
		// bottom: 0;
		left: 0;

		.popup {

			.groupNameInput {
				height: 92rpx;
				background-color: $uni-bg-color-grey;
				border-radius: 46px;
				text-align: center;
				font-size: 32rpx;
				color: $uni-text-color;
				margin-top: 52rpx;
			}

			.groupAnnouncement {
				width: 100%;
				height: 300rpx;
				background-color: #fff;
				border-radius: 10rpx;
				padding: 10rpx;
				box-sizing: border-box;
			}

			.finishi {
				float: right;
				font-size: 32rpx;
				margin: $uni-spacing-col-sm $uni-spacing-col-sm 0 0;
				line-height: 90rpx;
				padding-right: 20rpx;
			}
		}
	}
</style>
