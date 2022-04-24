<template>
	<view class="content">
		<topBar>
			<template v-slot:center>
				<view class="title">
					创建群聊
				</view>
			</template>
		</topBar>
		<view class="main">
			<view class="group-img">
				<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
				<image :src="cropFilePath" @tap="upload"></image>
			</view>
			<view class="group-name">
				<input type="text" class="group-name-input" placeholder="为群起个名字" v-model="groupName"
					placeholder-style="color:#aaa;font-weight:400" />
			</view>
			<view class="title">
				用户
			</view>
			<view class="friend">

				<view class="user" v-for="(item, index) in user" :key="index">
					<view class="selected" :class="{isSelected:item.selected}" @tap="selectedPerson(item)">
						<image src="../../static/images/buildgroup/choice.png" class="selected-img" mode=""
							v-if="item.selected"></image>
					</view>
					<image :src="item.imgurl" mode="" class="user-img"></image>
					<view class="name">
						{{item.name}}
					</view>


				</view>
			</view>
		</view>
		<view class="bottom-bar">
			<view class="blurEffect"></view>
			<view class="bottom-btn" :class="{buildGruopBtn:checkGroupName&&checkGroupCount}" @tap="buildGroup">
				创建群聊({{this.isSelectCount}})
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import topBar from '../../components/topBars/topBar.vue';
	import toFileRequest from '../../network/fileRequest.js'
	import request from '../../network/request.js';
	export default {
		components: {
			topBar,
			ImageCropper,
		},
		data() {
			return {
				isSelectCount: 0, //被选中的人数
				groupName: '', //群组名称
				//图片裁剪参数
				tempFilePath: '',
				cropFilePath: '../../static/images/buildgroup/groupChat.png',
				havsHeadPortrait: false, //判断是否选择自定义头像
				user: [],
				uid: '',
				token: '',
				selectUsers: {}
			}
		},
		computed: {
			//判断群名是否为空
			checkGroupName: function() {
				if (this.groupName.length > 0)
					return true;
				else
					return false;
			},
			//判断是否选中人让创建群聊按钮变色
			checkGroupCount: function() {
				if (this.isSelectCount > 0)
					return true;
				else
					return false;
			}
		},
		onLoad() {
			this.getStorages();
			this.getFriend();
		},
		methods: {
			//获取缓存
			getStorages: function() {
				const storageValue = uni.getStorageSync('user');
				console.log(storageValue);
				if (storageValue) {
					this.uid = storageValue.id;
					this.token = storageValue.token;

				} else {
					uni.navigateTo({
						url: '../signin/signin'
					})
				}
			},
			//获取好友
			getFriend: function() {
				let data = {
					"uid": this.uid,
					"state": 0
				}
				request.toRequest('/home/homeIndex', data, 'POST').then(res => {
					let status = res[1].data.status;
					if (status == 200) {
						let resualt = res[1].data.resualt;
						for (let i = 0; i < resualt.length; i++) {
							this.user.push({
								"fid": resualt[i].id,
								"imgurl": this.apiUrl + resualt[i].imgurl,
								"name": resualt[i].name
							})
						}
						console.log(this.user);
					} else if (status == 500) {
						uni.showToast({
							title: '服务器出错啦！',
							icon: 'none',
							duration: 2000
						})
					} else if (status == 300) {
						uni.navigateTo({
							url: '../signin/signin'
						})
					}
				}).catch(err => {
					uni.showToast({
						title: '无数据！',
						icon: 'none',
						duration: 2000
					})
				})
			},
			//选人
			selectedPerson: function(e) {
				console.log(e);
				if (e.selected) {
					if (this.isSelectCount != 0)
						this.isSelectCount--;
					else
						this.isSelectCount = 0;
					e.selected = !e.selected;
					if (this.selectUsers.hasOwnProperty(e.fid)) {
						delete this.selectUsers[e.fid];
					}
				} else {
					this.isSelectCount++;
					e.selected = !e.selected;
					this.selectUsers[e.fid] = e.name;
				}
			},
			//创建群聊
			buildGroup: function() {
				if (this.isSelectCount > 0 && this.groupName.length > 0) {
					let data = {
						"uid": this.uid,
						"name": this.groupName,
						"imgurl": '/head_portrait/defaultGroupAvatar.png',
						"user": [this.uid]
					}
					for (let key in this.selectUsers) {
						data['user'].push(key)
					}
					request.toRequest('/group/createGroup', data, 'POST').then(res => {
						let status = res[1].data.status;
						let gruopID = res[1].data.groupID;
						if (status == 200) {
							if (this.havsHeadPortrait) {
								var base64String = this.cropFilePath; /*base64图片串*/
								//这里对base64串进行操作，去掉url头，并转换为byte
								var bytes = window.atob(base64String.split(',')[1]);
								var array = [];
								for (var i = 0; i < bytes.length; i++) {
									array.push(bytes.charCodeAt(i));
								}
								var blob = new Blob([new Uint8Array(array)], {
									type: 'image/jpeg'
								});
								let formData = new FormData();
								formData.append("uid", gruopID);
								formData.append("url", 'head_portrait');
								formData.append("file", blob, gruopID + ".png");

								toFileRequest.toFileReq(formData).then(res => {
									if (res.data.status == 200) {
										let data = {
										    "id": gruopID,
										    "type": "imgurl",
										    "newData": '/head_portrait/' + gruopID + '.png'
										}
										request.toRequest('/group/groupDetailUpdata', data, 'POST').then(res => {
											console.log(res);
											let status = res[1].data.status;
											if (status == 200) {

											} else if (status == 500) {
												uni.showToast({
													title: '服务器出错啦！',
													icon: 'none',
													duration: 2000
												})
											} else if (status == 300) {
												uni.navigateTo({
													url: '../signin/signin'
												})
											}
										})

										uni.showToast({
											title: '创建成功！',
											icon: 'none',
											duration: 2000
										})
									}
								}).catch(err => {
									console.log(err);
								})
							}

							uni.navigateTo({
								url: '../index/index'
							})
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							})
						} else if (status == 300) {
							uni.navigateTo({
								url: '../signin/signin'
							})
						}
					}).catch(err => {
						console.log(err);
						uni.showToast({
							title: '无数据！',
							icon: 'none',
							duration: 2000
						})
					})
				}
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
				this.havsHeadPortrait = true;
			},
			cancel() {
				console.log("canceled");
				this.tempFilePath = "";
			},
		}
	}
</script>

<style lang="scss">
	.main {
		padding-top: 148rpx;
		display: flex;
		flex-direction: column;

		.group-img {
			margin: 0 auto;
			width: 199rpx;
			height: 196rpx;
			background-color: $uni-color-primary;
			box-shadow: 0px 36rpx 40rpx rgba(39, 40, 50, 0.1);
			border-radius: 40rpx;
			position: relative;

			image {
				width: 199rpx;
				height: 196rpx;
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				margin: auto;
				border-radius: 40rpx;
			}
		}

		.group-name {
			padding: 62rpx $uni-spacing-col-base 0;
		}

		.group-name-input {
			height: 92rpx;
			background-color: $uni-bg-color-grey;
			border-radius: 46px;
			text-align: center;
			font-size: 32rpx;
			color: $uni-text-color;
		}

		.title {
			padding: $uni-spacing-col-base;
			font-size: 44rpx;
			font-weight: 600;
			color: $uni-text-color;
			line-height: 60rpx;
		}

		.friend {
			height: 45vh;
			padding: 0 0 100rpx $uni-spacing-col-base;
			overflow: hidden;
			overflow-y: auto;

			.user {
				display: flex;
				flex-direction: row;
				height: 120rpx;
				align-items: center;

				.selected {
					flex: none;
					width: 48rpx;
					height: 48rpx;
					margin-right: 30rpx;
					background: rgba(255, 228, 49, 0.4);
					border-radius: 24rpx;
					position: relative;

					.selected-img {
						width: 40rpx;
						height: 40rpx;
						position: absolute;
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
						margin: auto;
					}
				}

				.user-img {
					width: 80rpx;
					height: 80rpx;
					margin-right: 32rpx;
					border-radius: $uni-border-radius-base;
				}

				.isSelected {
					background: rgba(255, 228, 49, 1);
				}

				.name {
					font-size: 36rpx;
					color: $uni-text-color;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
			}
		}

	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 104rpx;

		.blurEffect {
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 104rpx;
			background-color: #e7e6e6;
			// z-index: -1;
			filter: blur(20px);
		}

		.bottom-btn {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			text-align: center;
			line-height: 80rpx;
			width: 684rpx;
			height: 80rpx;

			background: #e1e1e1;
			// z-index: 1;
			border-radius: $uni-border-radius-sm;
		}

		.buildGruopBtn {
			background: $uni-color-primary;
		}

	}
</style>
