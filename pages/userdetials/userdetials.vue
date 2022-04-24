<template>
	<view class="content">
		<topBar>
			<template v-slot:center>
				<view class="detials">
					详情
				</view>
			</template>
		</topBar>
		<view class="main">
			<view class="column heads">
				<view class="row">
					<view class="title">
						头像
					</view>
					<view class="cont">
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel" v-if="uid == id"></image-cropper>
						<image :src="cropFilePath" @tap="upload" class="user-img" v-if="uid == id"></image>
						<image :src="cropFilePath" class="user-img" v-if="uid != id"></image>
					</view>
					<view class="more" v-if="uid == id">
						<image src="../../static/images/userdetials/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" @tap="popupAnimat('tapChange','explain')">
					<view class="title">
						签名
					</view>
					<view class="cont">
						{{explain}}
					</view>
					<view class="more" v-if="uid == id">
						<image src="../../static/images/userdetials/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">
						注册
					</view>
					<view class="cont">
						{{signUpTime}}
					</view>
				</view>
				<view class="row">
					<view class="title">
						邮箱
					</view>
					<view class="cont">
						{{email}}
					</view>
				</view>
				<view class="row">
					<view class="title">
						性别
					</view>
					<view class="cont">
						<picker @change="bindPickerChange" :value="index" :range="sex">
							<view class="uni-input">{{sex[index]}}</view>
						</picker>
					</view>
					<view class="more" v-if="uid == id">
						<image src="../../static/images/userdetials/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">
						生日
					</view>
					<view class="cont">
						<picker mode="date" :value="birthday" :start="startDate" :end="endDate"
							@change="bindDateChange">
							<view class="uni-input">{{birthday}}</view>
						</picker>
					</view>
					<view class="more" v-if="uid == id">
						<image src="../../static/images/userdetials/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" @tap="popupAnimat('tapChange','phone')">
					<view class="title">
						手机
					</view>
					<view class="cont">
						{{phone}}
					</view>
					<view class="more" v-if="uid == id">
						<image src="../../static/images/userdetials/more.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<view class="bt2">
				退出系统
			</view>
		</view>
		<view class="popupContent" :style="{bottom:-+this.popupHeight+'px'}" :animation="popupanimationData">
			<popup class="popup" @finish="finish" v-if="isEP == 'explain'">
				<template v-slot:top-left>
					<view class="explain">签名</view>
				</template>
				<template v-slot:main>
					<textarea type="text" value="" v-model="changeExplain" class="explainInput" />
				</template>
			</popup>
			<popup class="popup" @finish="finish" v-if="isEP == 'phone'">
				<template v-slot:top-left>
					<view class="explain">手机号</view>
				</template>
				<template v-slot:main>
					<input type="text" v-model="changePhone" value="" class="phoneInput" />
				</template>
			</popup>
		</view>
	</view>
</template>

<script>
	import topBar from '../../components/topBars/topBar.vue';
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import popup from '../../components/popup/popup.vue';
	import toFileRequest from '../../network/fileRequest.js'
	import request from '../../network/request.js';
	import myFun from '../../commons/js/myFun.js'
	export default {
		components: {
			topBar,
			ImageCropper,
			popup,
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				sex: ['男', '女', '机器人'], //性别选择
				index: 0, //性别选择的值
				birthday: currentDate,
				signUpTime: '', //注册时间
				//图片裁剪参数
				tempFilePath: '',
				cropFilePath: '',
				tempFile: '', //获取上传图片
				uid: '', //登录用户id
				id: '', //访问用户id
				name: '',
				email: '',
				explain: '',
				phone: '',
				popupanimationData: {}, //弹窗动画
				popupHeight: 0, //弹窗高度
				popupHeight: 0, //弹窗高度
				isFinishi: true, //点击弹窗完成按钮出现的动画
				changeExplain: '', //绑定修改签名中的文本框explain
				changePhone: '', //绑定修改手机中的文本框phone
				isEP: 'explain' //判断弹出框中是签名还是手机号
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onLoad: function(e) {
			this.id = e.id;
			this.getStorages();
			this.getUserInfo();
		},
		onReady: function(e) {
			this.getPopupHeight();
		},
		methods: {
			//获取缓存数据
			getStorages: function() {
				const storageValue = uni.getStorageSync('user');
				console.log(storageValue);
				if (storageValue) {
					this.uid = storageValue.id
					this.token = storageValue.token;
					this.cropFilePath = this.apiUrl + storageValue.imgurl;
					this.tempFilePath = this.apiUrl + storageValue.imgurl;
					console.log(this.cropFilePath);
				} else {
					uni.navigateTo({
						url: '../signin/signin'
					})
				}
			},
			//获取用户信息
			getUserInfo: function() {
				let data = {
					"id": this.id,
					"token": this.token
				}
				request.toRequest('/user/userDetail', data, 'POST').then(res => {
					console.log(res);
					let status = res[1].data.status;
					if (status == 200) {
						let resualt = res[1].data.resualt[0];
						this.name = resualt.name;
						this.email = resualt.email;
						this.signUpTime = myFun.timestampToTime(resualt.time);
						this.cropFilePath = '../../static/images/index/' + resualt.imgurl;
						this.phone = resualt.phone ? resualt.phone : '无';
						this.explain = resualt.explain ? resualt.explain : '这个人很懒什么都没有写~';
						this.birthday = resualt.birth ? myFun.timestampToTime(resualt.birth) : '无~';
						this.changeExplain = this.explain;
						this.changePhone = this.phone;
						console.log(this.birthday);
						if (resualt.sex == 'asexual')
							this.index = 2;
						else if (resualt.sex == 'male')
							this.index = 0;
						else
							this.index = 1;
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
			},
			//点击更改签名信息弹窗完成按钮
			finish: function() {
				let data = {};
				if (this.isEP == 'explain') {
					data = {
						"id": this.uid,
						"type": "explain",
						"newData": this.changeExplain
					}
				} else {
					data = {
						"id": this.uid,
						"type": "phone",
						"newData": this.changePhone
					}
				}
				console.log(data);
				request.toRequest('/user/userDetailUpdata', data, 'POST').then(res => {
					console.log(res);
					let status = res[1].data.status;
					if (status == 200) {
						if (this.isEP == 'explain') {
							this.explain = this.changeExplain;
						} else {
							this.phone = this.changePhone;
						}
						this.popupAnimat('finish');
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


			},
			//获取popup模块高度
			getPopupHeight: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.popupContent').boundingClientRect(data => {
					this.popupHeight = data.top;
					console.log(this.popupHeight);
				}).exec();
			},
			//弹窗动画
			popupAnimat: function(type, model) {
				var animation = uni.createAnimation({
					duration: 400,
					timingFunction: 'ease',
				})
				if (model == 'explain') {
					this.isEP = 'explain';
				} else {
					this.isEP = 'phone';
				}
				if (type == 'tapChange')
					animation.bottom(0).step();
				else
					animation.bottom(-this.popupHeight).step();
				this.popupanimationData = animation.export();
			},
			//选择性别
			bindPickerChange: function(e) {
				if (this.uid == this.id) {

					this.index = e.target.value;
					let sex = '';
					if (this.index == 0) {
						sex = 'male';
					} else if (this.index == 1) {
						sex = 'female';
					} else {
						sex = 'asexual';
					}
					let data = {
						"id": this.uid,
						"type": "sex",
						"newData": sex
					}
					request.toRequest('/user/userDetailUpdata', data, 'POST').then(res => {
						console.log(res);
						let status = res[1].data.status;
						if (status == 200) {
							console.log('picker发送选择改变，携带值为', e.target.value)
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


				}

			},
			//选择日期
			bindDateChange: function(e) {
				if (this.uid == this.id) {
					this.birthday = e.target.value
					console.log('picker发送选择改变，携带值为', e.target.value)
					let data = {
						"id": this.uid,
						"type": "birth",
						"newData": this.birthday
					}
					request.toRequest('/user/userDetailUpdata', data, 'POST').then(res => {
						console.log(res);
						let status = res[1].data.status;
						if (status == 200) {
							console.log('picker发送选择改变，携带值为', e.target.value)
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
				}

			},
			//获取日期
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			//头像
			upload() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ["album", "camera"], //从相册和拍照选择
					success: (res) => {
						
						this.tempFilePath = res.tempFilePaths.shift();
						console.log(res.tempFilePaths);
					},
				});
			},
			confirm(e) {
				this.tempFilePath = "";
				this.cropFilePath = e.detail.tempFilePath;
				console.log(e.detail);
				var base64String = this.cropFilePath;	/*base64图片串*/			 
				//这里对base64串进行操作，去掉url头，并转换为byte
				var bytes = window.atob(base64String.split(',')[1]);
				var array = [];
				for(var i = 0; i < bytes.length; i++){
				    array.push(bytes.charCodeAt(i));
				}
				var blob = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});			
				let formData = new FormData();
				formData.append("uid", this.uid);
				formData.append("url", 'head_portrait');
				formData.append("file", blob, this.uid + ".png");
				console.log(formData);
				toFileRequest.toFileReq(formData).then(res => {
					if(res.data.status == 200) {
						let headPortraitName = res.data.fileName;
						let data = {
							"id": this.uid,
							"type": "imgurl",
							"newData": '/head_portrait/' + headPortraitName
						}
						request.toRequest('/user/userDetailUpdata', data, 'POST').then(res => {
							console.log(res);
							let status = res[1].data.status;
							if (status == 200) {
								try {
									uni.setStorageSync('user', {
										'id': this.uid,
										"name": this.name,
										"imgurl": '/head_portrait/' + headPortraitName,
										"token": this.token
									});
								} catch (e) {
									// error
									console.log("数据缓存出错");
								}
								
								uni.showToast({
									title: '修改头像成功',
									icon: 'none',
									duration: 2000
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
						})
					}
				}).catch(err =>{
					console.log(err);
				})

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
		padding-top: 118rpx;
		display: flex;
		flex-direction: column;

		.column {
			display: flex;
			flex-direction: column;

			.row {
				display: flex;
				flex-direction: row;
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
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
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
		}

		.bt2 {
			text-align: center;
			font-size: $uni-font-size-lg;
			font-weight: 400;
			color: $uni-color-warning;
			line-height: 88rpx;
			margin-top: 160rpx;
		}
	}

	.popupContent {
		width: 100%;
		position: fixed;
		// bottom: 0;
		left: 0;

		.popup {
			.explainInput {
				width: 100%;
				height: 300rpx;
				background-color: #fff;
				border-radius: 10rpx;
				padding: 10rpx;
				box-sizing: border-box;
			}

			.phoneInput {
				height: 92rpx;
				background-color: $uni-bg-color-grey;
				border-radius: 46px;
				text-align: center;
				font-size: 32rpx;
				color: $uni-text-color;
				margin-top: 52rpx;
			}
		}
	}
</style>
