/**
 * Example ARK Code
 */

var request = require('request');

request({
	url : 'https://testapi.ark.com/email/youremail@domain.com',
	headers : {
		api_token : process.env.ARK_API_TOKEN
	}
}, function(err, response, body) {
	if (err)
		throw err;
	console.log(body); // response object is printed
});