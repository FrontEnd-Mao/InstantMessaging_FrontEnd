export default {
	friends: function() {
		let friendArr = [{
				id: 1,
				imgurl: '../../static/images/imag/headPic2.png',
				tip: 0,
				name: '机器一号',
				time: new Date(),
				news: '的撒旦撒旦撒旦撒旦撒大苏打'
			},
			{
				id: 2,
				imgurl: '../../static/images/imag/headPic3.png',
				tip: 12,
				name: '机器二号',
				time: new Date(),
				news: '的撒旦撒旦撒旦撒旦撒大苏打'
			},
			{
				id: 3,
				imgurl: '../../static/images/imag/headPic4.png',
				tip: 4,
				name: '机器四号',
				time: new Date(),
				news: '打撒打撒打撒达瓦我去额前恶趣味'
			},
			{
				id: 4,
				imgurl: '../../static/images/imag/headPic4.png',
				tip: 4,
				name: '机器三号',
				time: new Date(),
				news: '打撒打撒打撒达瓦我去额前恶趣味'
			},
			{
				id: 5,
				imgurl: '../../static/images/imag/headPic5.png',
				tip: 6,
				name: '宝宝五号',
				time: new Date(),
				news: '臭小子创造性创造性乘坐出租车  等到'
			},
			{
				id: 6,
				imgurl: '../../static/images/imag/headPic5.png',
				tip: 6,
				name: '宝宝五号',
				time: new Date(),
				news: '臭小子创造性创造性乘坐出租车  等到'
			},
			{
				id: 7,
				imgurl: '../../static/images/imag/headPic2.png',
				tip: 2,
				name: '机器一号',
				time: new Date(),
				news: '的撒旦撒旦撒旦撒旦撒大苏打'
			},
			{
				id: 8,
				imgurl: '../../static/images/imag/headPic3.png',
				tip: 12,
				name: '机器二号',
				time: new Date(),
				news: '的撒旦撒旦撒旦撒旦撒大苏打'
			},
			{
				id: 9,
				imgurl: '../../static/images/imag/headPic4.png',
				tip: 4,
				name: '机器四号',
				time: new Date(),
				news: '打撒打撒打撒达瓦我去额前恶趣味'
			},
			{
				id: 10,
				imgurl: '../../static/images/imag/headPic4.png',
				tip: 4,
				name: '机器三号',
				time: new Date(),
				news: '打撒打撒打撒达瓦我去额前恶趣味'
			},
			{
				id: 11,
				imgurl: '../../static/images/imag/headPic5.png',
				tip: 6,
				name: '宝宝五号',
				time: new Date(),
				news: '臭小子创造性创造性乘坐出租车  等到'
			},
			{
				id: 12,
				imgurl: '../../static/images/imag/headPic5.png',
				tip: 6,
				name: '宝宝五号',
				time: new Date(),
				news: '臭小子创造性创造性乘坐出租车  等到'
			},
		]
		return friendArr;
	},
	//聊天记录测试
	message: function() {
		let msgs = [{
				id: 'a', //用户id
				imgUrl: '../../static/images/imag/headPic5.png', //头像
				message: '1大萨达萨达阿萨德撒大萨达萨达撒撒撒的，但是啊，大萨达撒的，撒大撒', //消息
				types: 0, //内容类型。0代表文字，1代表图片链接，2音频链接
				time: new Date() - 164802955850,
				tip: 0
			},
			{
				id: 'a', //用户id
				imgUrl: '../../static/images/imag/headPic5.png', //头像
				message: '2大萨达萨达阿萨德撒大萨达萨达撒撒撒的，但是啊，大萨达撒的，撒大撒', //消息
				types: 0, //内容类型。0代表文字，1代表图片链接，2音频链接
				time: new Date() - 1648029558,
				tip: 1
			},
			{
				id: 'a', //用户id
				imgUrl: '../../static/images/imag/headPic5.png', //头像
				message: '3大萨达萨达的，撒大撒', //消息
				types: 0, //内容类型。0代表文字，1代表图片链接，2音频链接
				time: 1647900000000,
				tip: 2
			},
			{
				id: 'b', //用户id
				imgUrl: '../../static/images/imag/headPic4.png', //头像
				message: '4泥水匠蒂萨的撒的撒的我去破分开惹我皮卡剧佛', //消息
				types: 0, //内容类型。0代表文字，1代表图片链接，2音频链接
				time: new Date() - 10000,
				tip: 3
			},
			{
				id: 'b', //用户id
				imgUrl: '../../static/images/imag/headPic4.png', //头像
				message: '5大萨达萨达阿萨和用途江汉油田江汉油田一题欢聚一堂好他撒撒撒的，但是啊，大萨达撒的，撒大撒', //消息
				types: 0, //内容类型。0代表文字，1代表图片链接，2音频链接
				time: new Date() - 100,
				tip: 4
			},
			{
				id: 'a', //用户id
				imgUrl: '../../static/images/imag/headPic5.png', //头像
				message: '大萨达erwrewr ewr ewrewrewr 的，但是啊，大萨达撒的，撒大撒', //消息
				types: 0, //内容类型。0代表文字，1代表图片链接，2音频链接
				time: new Date() - 100,
				tip: 5
			},
			{
				id: 'b', //用户id
				imgUrl: '../../static/images/imag/headPic4.png', //头像
				message: '大萨达萨那就好寡妇年不给发货官方回复通过后达萨达撒撒撒的，但是啊，大萨达撒的，撒大撒', //消息
				types: 1, //内容类型。0代表文字，1代表图片链接，2音频链接
				time: new Date() - 100,
				tip: 6
			},
			{
				id: 'a', //用户id
				imgUrl: '../../static/images/imag/headPic5.png', //头像
				message: '大个梵蒂冈天人永隔投入到返回个梵蒂冈达撒的，撒大撒', //消息
				types: 1, //内容类型。0代表文字，1代表图片链接，2音频链接
				time: new Date() - 100,
				tip: 7
			},
			{
				id: 'b', //用户id
				imgUrl: '../../static/images/imag/headPic4.png', //头像
				message: {
					voice: 'a',
					time: 60,
				}, //消息
				types: 2, //内容类型。0代表文字，1代表图片链接，2音频链接
				time: new Date() - 100,
				tip: 8
			},
			{
				id: 'a', //用户id
				imgUrl: '../../static/images/imag/headPic5.png', //头像
				message: {
					voice: 'a',
					time: 18,
				}, //消息
				types: 2, //内容类型。0代表文字，1代表图片链接，2音频链接
				time: new Date() - 100,
				tip: 9
			},
			{
				id: 'b', //用户id
				imgUrl: '../../static/images/imag/headPic4.png', //头像
				message: {
					"name": "沟赵乡轻工业大学科学校区菜鸟驿站(枫香街店)郑州轻工业大学科学校区",
					"address": "河南省郑州市中原区沟赵乡轻工业大学科学校区菜鸟驿站(枫香街店)郑州轻工业大学科学校区",
					"latitude": 34.814112,
					"longitude": 113.510282
				}, //消息
				types: 3, //内容类型。0代表文字，1代表图片链接，2音频链接
				time: new Date() - 100,
				tip: 10
			},
			{
				id: 'a', //用户id
				imgUrl: '../../static/images/imag/headPic5.png', //头像
				message: {
					"name": "沟赵乡轻工业大学科学校区菜鸟驿站(枫香街店)郑州轻工业大学科学校区",
					"address": "河南省郑州市中原区沟赵乡轻工业大学科学校区菜鸟驿站(枫香街店)郑州轻工业大学科学校区",
					"latitude": 34.814112,
					"longitude": 113.510282
				}, //消息
				types: 3, //内容类型。0代表文字，1代表图片链接，2音频链接
				time: new Date() - 100,
				tip: 11
			},
		]
		return msgs;
	}
}
