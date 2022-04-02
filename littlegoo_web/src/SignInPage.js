import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import queryString from 'query-string';
import Settings from './Settings';

export default function SignInPage() {
	// เพื่อเอาค่า code จาก query string
	const [searchParams,] = useSearchParams();

	// ตอนเริ่ม load, ให้ set ตัวแปร done เป็น true จะไม่ load อีก
	const [done, setDone] = useState(false);

	// ตอนจบ, set ตัวแปร data เป็นข้อมูลที่ได้มา
	const [data, setData] = useState();

	const signIn = async () => {
		// อ่านค่า code จาก query string
		const code = searchParams.get('code');
		console.log(`code: ${code}`);
		const redirectUri = `http://localhost:3000/signin`;
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
					client_id: Settings.clientId,
					client_secret: Settings.clientSecret,
					redirect_uri: redirectUri,
					grant_type: 'authorization_code',
				}),
			};

			const res = await fetch(uri, options);
			console.log(`${uri}: ${res.status} ${res.statusText}`);
			if (res.status !== 200)
				return null;

			token = await res.json();
			console.log(`token: ${JSON.stringify(token, null, 2)}`);
			if (!token.access_token || !token.id_token)
				return null;
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
				return null;

			user = await res.json();
			console.log(`user: ${JSON.stringify(user, null, 2)}`);
			if (!user.email || !user.name)
				return null;
		}

		return { user, token };
	}

	// ตอนเริ่ม page
	useEffect(() => {
		if (!done) {
			setDone(true);
			signIn().then((result) => {
				if (result)
					setData(result);
			});
		}
	}, [done, signIn]);

	// ถ้ามี data แล้ว
	if (data) {
		return (
			<div>
				<div style={{ marginBottom: '1em' }}>Email: {data.user.email}</div>
				<div style={{ marginBottom: '1em' }}>Name: {data.user.name}</div>
				<div style={{ marginBottom: '1em' }}><img src={data.user.picture} alt={data.user.email} /></div>
				<div style={{ marginBottom: '1em' }}>User JSON: <output>{JSON.stringify(data.user, null, 2)}</output></div>
				<div style={{ marginBottom: '1em' }}>Token JSON: <output>{JSON.stringify(data.token, null, 2)}</output></div>
			</div>
		);
	}

	return (
		<div />
	);
}
