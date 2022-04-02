'use strict';
const fetch = require('node-fetch');
const queryString = require('query-string');
const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const GOOGLE_CLIENT_ID = '840617482634-nbl6rqjqfouiod05n90eudk179l1mkad.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

router.get('/', [
], asyncHandler(async (req, res, next) => {
	// อ่านค่า code จาก query string
	const { code } = req.query;
	console.log(`code: ${code}`);
	const redirectUri = `http://localhost:3000/signin-server`;
	console.log(`redirectUri: ${redirectUri}`);

	// ยิง service เพื่อขอค่า token
	let token;
	{
		const uri = `https://oauth2.googleapis.com/token`;
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: queryString.stringify({
				code,
				client_id: GOOGLE_CLIENT_ID,
				client_secret: GOOGLE_CLIENT_SECRET,
				redirect_uri: redirectUri,
				grant_type: 'authorization_code',
			}),
		};

		const res = await fetch(uri, options);
		console.log(`${uri}: ${res.status} ${res.statusText}`);
		if (res.status !== 200)
			throw new Error(`response.status !== 200`);

		token = await res.json();
		console.log(`token: ${JSON.stringify(token, null, 2)}`);
		if (!token.access_token || !token.id_token)
			throw new Error(`invalid sign-in`);
	}

	// ยิง service เพื่อขอค่า user information
	let user;
	{
		const uri = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token.access_token}`;
		const options = {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token.id_token}`,
			},
		};

		const res = await fetch(uri, options);
		console.log(`${uri}: ${res.status} ${res.statusText}`);
		if (res.status !== 200)
			throw new Error(`response.status !== 200`);

		user = await res.json();
		console.log(`loaded information: ${JSON.stringify(user, null, 2)}`);
		if (!user.email || !user.name)
			throw new Error(`invalid sign-in`);
	}

	// สำเร็จ
	res.status(200).send({
		token,
		user,
	});
}));

module.exports = router;
