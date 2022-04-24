<template>
	<view class="content">
		<backBtn></backBtn>
		<view class="text">
			注册
		</view>
		<view class="input">
			<view class="input-name" >
					<input type="text" @blur="getUserName" value="" class="input-item" placeholder="请输入你的真实姓名" placeholder-style="color:#aaa;font-weight:400;"/>
			</view>
			<view class="input-email">
					<input type="text" value="" @blur="judgeEmal" class="input-item" placeholder="请输入邮箱" placeholder-style="color:#aaa;font-weight:400;"/>
			</view>
			<view class="input-pwd">
					<input :type="type"  placeholder="请输入密码" placeholder-style="color:#aaa;font-weight:400;"
						@blur="getPassWord"  class="input-item"/>
					<image :src="lookUrl" class="openeye" mode="" @click="looks"></image>
			</view>
		</view>
		<view :class="[{register_btn_ok: isOk}, {register_btn_no: !isOk}]" @tap="register">
			注册
		</view>
	</view>
</template>

<script>
	import reqSignup from '../../network/signup/reqSignup.js'
	import backBtn from '../../components/backBtn/backBtn.vue'
	export default {
		components: {
			backBtn
		},
		data() {
			return {
				type: 'password',
				isUser: false, //用户名有效,用来显示后方对号
				userEmplog: false, //用户名被占有
				isEmal: false, //邮箱有效，用来显示后方对号
				emalEmplog: false, //邮箱被占有
				invalid: false, //邮箱无效
				occupy: false, //邮箱占用
				look: false, //密码可看
				lookUrl: '../../static/images/signin/closeeye.png',
				isOk: false, //注册按钮样式判断
				user: '',
				email: '',
				passWord: '',
			}
		},
		methods: {
			//切换查看密码
			looks: function() {
				if (this.look) {
					this.type = "password";
					this.look = !this.look;
					this.lookUrl = '../../static/images/signin/closeeye.png';
				} else {
					this.type = "text";
					this.look = !this.look;
					this.lookUrl = '../../static/images/signin/openeye.png';
				}
			},			//检查邮箱格式
			judgeEmal: function(e) {
				if (e.detail.value.length > 0) {
					var myreg =
						/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
					if (!myreg.test(e.detail.value)) {
						this.invalid = !this.invalid;
						uni.showToast({
							title: '邮箱无效！',
							icon: 'none',
							duration: 2000
						})
					} else {
						this.invalid = false;
						this.email = e.detail.value;
						let data = {
							data: this.email,
							type: 'email'
						}
						reqSignup.request('/signUp/judge', data, 'POST').then(res => {
							console.log(res);
							let status = res[1].data.status;
							if (status == 200) {
								let resualt = res[1].data.result;
								if (resualt > 0) {
									this.isEmal = false;
									this.emalEmplog = true;
									this.invalid = false;
									uni.showToast({
										title: '邮箱被占用！',
										icon: 'none',
										duration: 2000
									})
								} else {
									this.isEmal = true;
									this.emalEmplog = false;
									this.invalid = false;
									this.judgeSignUp();
	
								}

							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错啦！',
									icon: 'none',
									duration: 2000
								})
							}
						})
					}
				} else {
					this.isEmal = false;
					this.emalEmplog = false;
					this.invalid = false;
				}
			},
			//获取用户名
			getUserName: function(e) {
				this.user = e.detail.value;
				this.judgeSignUp();
			},
			//获取密码
			getPassWord: function(e) {
				this.passWord = e.detail.value;
				this.judgeSignUp();
			},
			//当用户名和邮箱正确时改变注册按钮样式
			judgeSignUp: function() {
				if (this.user.length>0 && this.isEmal && this.passWord.length > 5) {
					this.isOk = true;
				} else {
					this.isOk = false;
				}

			},
			//注册
			register: function() {
				if (this.isOk) {
					//注册
					let data = {
						"name": this.user,
						"pwd": this.passWord,
						"email": this.email
					}
					reqSignup.request('/signUp/add', data, 'POST').then(res => {
						console.log(res);
						let status = res[1].data.status;
						if (status == 200) {
							let uid = res[1].data.id;
							console.log('注册成功');
							uni.showToast({
								title: '注册成功！',
								icon: 'none',
								duration: 2000
							})
							this.isOk = false;
							let toURL = '../josbusiness/josbusiness?uid=' + uid
							setTimeout(function() {
								uni.navigateTo({
									url: toURL
								})
							}, 2000);

						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		.text {
			padding-top: 136rpx;
			font-size: 68rpx;
			margin-left: 80rpx;
			font-weight: 200;
			margin-bottom: 62rpx;
		}
		.input {
			.input-item {
				width: 590rpx;
				height: 95.28rpx;
				border-radius: 15px;
				/* 外部/White #FFFFFF */
				background: #FFFFFF;
				box-sizing: border-box;
				/* 外部/border #E8E6EA */
				border: 1px solid #E8E6EA;
				border-top-left: 0;
				margin-left: 80rpx;
				padding-left: 40rpx;
				margin-bottom: 50rpx;
			}
			
			.input-name {
				position: relative;
				&:before {
					content: '姓名';
					background-color: #FFFFFF;
					float: left;
					position: absolute;
					left: 120rpx;
					top: -20rpx;
					color: #939294;
				}
			}
			.input-email {
				position: relative;
				&:before {
					content: '邮箱';
					background-color: #FFFFFF;
					float: left;
					position: absolute;
					left: 120rpx;
					top: -20rpx;
					color: #939294;
				}
			}
			.input-pwd {
				position: relative;
				&:before {
					content: '密码';
					background-color: #FFFFFF;
					float: left;
					position: absolute;
					left: 120rpx;
					top: -20rpx;
					color: #939294;
				}
				.openeye {
					position: absolute;
					right: 100rpx;
					top: 24rpx;
					width: 42rpx;
					height: 42rpx;
				}
			}
		}
		.register_btn_ok {
			background: #E94057;
			width: 590rpx;
			height: 112rpx;
			border-radius: 30rpx;
			/* 外部/red #E94057 */
			margin-left: 80rpx;
			line-height: 112rpx;
			color: #FFFFFF;
			text-align: center;
		}
		.register_btn_no {
			width: 590rpx;
			height: 112rpx;
			border-radius: 30rpx;
			/* 外部/red #E94057 */
			background: #d5d5d5;
			margin-left: 80rpx;
			line-height: 112rpx;
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
