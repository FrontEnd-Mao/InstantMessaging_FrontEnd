<template>
	<view>
		<view class="upload" @tap="upload">
			上传图片
		</view>
	</view>
</template>

<script>
	import request from '../../network/fileRequest.js'
	export default {
		data() {
			return {

			};
		},
		methods: {
			upload: function() {
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFiles[0];
						console.log(tempFilePaths);
						console.log(chooseImageRes);
						let formData = new FormData();
						formData.append("uid", '1');
						formData.append("url", 'users');
						formData.append("file", tempFilePaths, "1.png");
						console.log(formData);
						request.toFileReq(formData).then(res => {
							console.log(res);
						}).catch(err =>{
							console.log(err);
						})
						
					}
				});
			},
			test: function() {
				console.log('测试接口');
				uni.request({
					url: 'http://localhost:8081/photos/upload', //仅为示例，并非真实接口地址。
					data: {
						data: "mao",
						pwd: "123456"
					},
					method: "POST",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8 '
					},
					success: (res) => {
						console.log(res.data);
						this.text = 'request success';
					},
					fail: (err) => {
						console.log(err);
					}
				});
			}
		}
	}
</script>

<style lang="scss">

</style>
