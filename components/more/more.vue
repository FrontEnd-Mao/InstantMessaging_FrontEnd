<template>
	<view>
		<view class="more-list" v-for="(item, index) in imgDates" :key="index" @tap="tapFun(index)">
			<image :src="item.url" mode=""></image>
			<view class="more-list-title">{{item.title}}</view>
		</view>
	</view>

</template>

<script>
	export default {
		name:"more",
		data() {
			return {
				imgDates: [
				{
					url:'../../static/images/submit/picture.png',
					title:'图片',
				},
				{
					url:'../../static/images/submit/camera.png',
					title:'相机',
				},
				{
					url:'../../static/images/submit/position.png',
					title:'位置',
				},
				{
					url:'../../static/images/submit/phone.png',
					title:'相机',
				},
				{
					url:'../../static/images/submit/file.png',
					title:'文件',
				},
				]
			};
		},
		methods: {
			//获取模块高度
			getElementHeight: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.more-list').boundingClientRect(data => {
					this.$emit('heights', data.height)
				}).exec();
			},
			//为v-for循环出来的元素选择事件
			tapFun: function(index) {
				//修改父组件中isMore的值
				this.$emit('changeIsMore', true);
				switch(index) {
					case 0: this.sendImg('album');break;
					case 1: this.sendImg('camera');break;
					case 2: this.sendLocation();break;
					case 3: this.telePhone();break;
					case 4: this.sendFile();break;
				}
			},
			//选择图片并发送
			sendImg: function(e) {
				let _this = this;
				let count = 9;
				if(e == 'album') {
					count = 9;
				}
				else {
					count = 1;
				}
				uni.chooseImage({
					count: count, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [e], //从相册选择
					success: function (res) {
						console.log(JSON.stringify(res.tempFilePaths));
						const filePaths = res.tempFilePaths;
						for(let i=0;i<filePaths.length;i++) {
							_this.$emit('getImgPath', filePaths[i]);
						}
					}
				});
			},
			//打开相机拍照
			useCamera: function() {
				console.log("打开相机拍照");
			},
			//发送位置
			sendLocation: function() {
				console.log("发送位置");
				let _this = this;
				uni.chooseLocation({
					success: function (res) {
						let data = {
								name: res.name,
								address: res.address,
								latitude: res.latitude,
								longitude: res.longitude,
						}
						_this.$emit("getLocation", data);
					}
				});
			},
			//打电话
			telePhone: function() {
				console.log("打电话");
			},
			//发送文件
			sendFile: function() {
				console.log("发送文件");
			},
			
		}
	}
</script>

<style lang="scss">
	.more-list {
		width: 25%;
		text-align: center;
		float: left;
		padding-top: 32rpx;
		image {
			width: 72rpx;
			height: 72rpx;
			padding: 24rpx;
			background-color: rgba(255,255,255,1);
			border-radius: 24rpx;
		}
		.more-list-title {
			font-size: 24rpx;
			color: rbga(39,40,50,0.5);
			line-height: 34rpx;
		}
	}
</style>
