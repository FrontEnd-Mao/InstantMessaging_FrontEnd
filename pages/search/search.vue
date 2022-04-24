<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-div">
				<image src="../../static/images/index/search.png" class="search-img" mode=""></image>
				<input type="search" placeholder="搜索用户/群" class="search" placeholder-style="color:#aaa;font-weight:400;"
					@input="search" />
			</view>
			<view class="top-bar-right">
				<view class="text" @tap="backOne">取消</view>
			</view>
		</view>
		<view class="main">
			<view class="search-user result">
				<view class="title">用户</view>
				<view class="list user" v-for="(item, index) in userArr" :key="index">
					<image :src="item.imgurl" mode="" @tap="intoUserHome(item)"></image>
					<view class="names">
						<view class="name" v-html="item.name">
						</view>
						<view class="email" v-html="item.email">
						</view>
					</view>
					<view class="right-bt" @tap="intoSendMsg(item)">
						发送
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import myFun from '../../commons/js/myFun.js'
	import reqSearch from '../../network/search/reqSearch.js'
	export default {
		data() {
			return {
				token: '',
				uid: '',
				userArr: [],
			};
		},
		onLoad: function() {
			this.getStorages();
		},
		//返回上一页
		methods: {
			backOne: function() {
				uni.navigateTo({
					url: '../index/index'
				})
			},
			//获取缓存
			getStorages: function() {
				const storageValue = uni.getStorageSync('user');
				console.log(storageValue);
				if (storageValue) {
					this.uid = storageValue.uid;
					this.token = storageValue.token;
				} else {
					uni.navigateTo({
						url: '../signin/signin'
					})
				}
			},
			search: myFun.debounce(function(e) {
				this.userArr = [];
				let searchValue = e.detail.value;
				if (searchValue.length > 0) {
					this.searchUser(searchValue);
				}
			}),
			searchUser: function(e) {
				let data = {
					"data": e,
					"token": this.token
				}
				reqSearch.request('/search/searchUser', data, 'POST').then(res => {
					console.log(res);
					let status = res[1].data.status;
					if (status == 200) {

						let arr = res[1].data.resualt;
						let exp = eval("/" + e + "/g");
						for (let i = 0; i < arr.length; i++) {
							arr[i].imgurl = this.apiUrl + arr[i].imgurl;
							arr[i].name = arr[i].name.replace(exp, "<span style='color:#4AAAFF;'>" + e +
								"</span>");
							arr[i].email = arr[i].email.replace(exp, "<span style='color:#4AAAFF;'>" + e +
								"</span>");
							this.userArr.push(arr[i])
						}

					} else if (status == 500) {
						uni.showToast({
							title: '服务器出错啦！',
							icon: 'none',
							duration: 2000
						})
					} else if (status == 300) {
						//token失效
						uni.navigateTo({
							url: '../signin/signin'
						})
					}
				})
			},
			intoUserHome: function(item) {
				uni.navigateTo({
					url: '../userhome/userhome?id=' + item._id
				})
			},
			intoSendMsg: function(item) {
				console.log(item);
				uni.navigateTo({
					url: '../chatroom/chatroom?fid=' + item._id + '&fname=' + item.name + '&fimg=' + item
						.imgurl + '&type=' + 0
				})
			}
		}

	}
</script>

<style lang="scss">
	.content {
		padding-top: var(--status-bar-height);
	}

	//头部样式
	.top-bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 88rpx;
		z-index: 1001;
		padding-top: var(--status-bar-height);
		box-sizing: border-box;
		background: rgba(255, 255, 255, 0.96);
		border-bottom: 1px solid $uni-bg-color;
		padding-left: $uni-spacing-col-base;

		/**
		 * 此处有bug
		 box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.1);
		*/
		.search-div {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			z-index: -1;
			box-sizing: border-box;
			padding: 14rpx 118rpx 14rpx $uni-spacing-col-base;
		}

		.search {
			height: 60rpx;
			background: $uni-bg-color-grey;
			border-radius: 10rpx;
			padding: 0 60rpx 0 12rpx;
		}

		.search-img {
			position: absolute;
			right: 130rpx;
			top: 22rpx;
			width: 40rpx;
			height: 40rpx;
		}

		.top-bar-right {
			float: right;
			padding-right: 32rpx;

			.text {
				line-height: 88rpx;
				color: $uni-text-color;
				font-size: $uni-font-size-lg;
				font-weight: 500;
			}
		}
	}

	.main {
		padding: 88rpx $uni-spacing-col-base 0 $uni-spacing-col-base;

		.result {
			padding-top: $uni-spacing-col-base;

			.title {
				font-size: 20px;
				// font-family: PingFangSC-Semibold,PingFang SC;
				font-weight: 600;
				color: $uni-text-color;
				line-height: 60px;
			}

			.list {
				width: 100%;
				height: 80rpx;
				padding: 20rpx;

				image {
					width: 80rpx;
					height: 80rpx;
					border-radius: $uni-border-radius-base;
					float: left;
				}
			}

			.names {
				padding-left: $uni-spacing-col-base;
				float: left;
			}

			.name {
				font-size: 36rpx;
				color: $uni-text-color;
				line-height: 50rpx;
			}

			.email {
				font-size: $uni-font-size-sm;
				color: $uni-text-color;
				line-height: 18rpx;
			}

			.right-bt {
				float: right;
				width: 120rpx;
				height: 48rpx;
				background: $uni-color-primary;
				border-radius: 24rpx;
				color: $uni-text-color;
				line-height: 48rpx;
				text-align: center;
				margin-top: 16rpx;
				font-size: $uni-font-size-base;
			}
		}
	}
</style>
