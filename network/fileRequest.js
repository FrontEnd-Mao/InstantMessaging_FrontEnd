import axios from 'axios'
import BaseUrl from './baseUrl.js'

export default {
	toFileReq: function(datas) {
		let baseUrl = BaseUrl.getBaseUrl()
		console.log('开始请求');
		return axios({
			method: 'POST',
			url: baseUrl + '/photos/upload',
			data: datas,
		})
	}
}
