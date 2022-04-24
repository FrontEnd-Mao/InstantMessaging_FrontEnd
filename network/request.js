import BaseUrl from './baseUrl.js'
 
export default {
	toRequest: function(url, datas, type){
		let baseUrl = BaseUrl.getBaseUrl()
		return uni.request({
			url: baseUrl + url,
			data: datas,
			method: type,
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
		})
	},
}