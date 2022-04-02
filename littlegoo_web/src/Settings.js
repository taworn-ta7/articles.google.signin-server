export const Settings = {
	// ใช้ Client Id และ Client Secret ที่คุณได้จากตอนแรก ก๊อป ตัด แปะ ตรงนี้ครับ
	clientId: '840617482634-nbl6rqjqfouiod05n90eudk179l1mkad.apps.googleusercontent.com',
	clientSecret: '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',

	scope: [
		`https://www.googleapis.com/auth/userinfo.profile`,
		`https://www.googleapis.com/auth/userinfo.email`,
	],

	signIn: () => `https://accounts.google.com/o/oauth2/v2/auth`
		+ `?redirect_uri=http://localhost:3000/signin`
		+ `&client_id=${Settings.clientId}`
		+ `&access_type=offline&response_type=code&prompt=consent`
		+ `&scope=${Settings.scope.join(' ')}`,

	signInServer: () => `https://accounts.google.com/o/oauth2/v2/auth`
		+ `?redirect_uri=http://localhost:3000/signin-server`
		+ `&client_id=${Settings.clientId}`
		+ `&access_type=offline&response_type=code&prompt=consent`
		+ `&scope=${Settings.scope.join(' ')}`,
};

export default Settings;
