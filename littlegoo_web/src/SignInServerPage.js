import { useState, useEffect } from 'react';

export default function SignInServerPage() {
	// ตอนเริ่ม load, ให้ set ตัวแปร done เป็น true จะไม่ load อีก
	const [done, setDone] = useState(false);

	// ตอนจบ, set ตัวแปร data เป็นข้อมูลที่ได้มา
	const [data, setData] = useState();

	// ตอนเริ่ม page
	useEffect(() => {
		if (!done) {
			setDone(true);

			// ยิง service ของเราเอง
			const uri = `http://localhost:8080/signin${window.location.search}`;
			const options = {
				method: 'GET',
			};

			console.log(`uri: ${uri}`);
			fetch(uri, options).then((res) => {
				if (res.status === 200) {
					res.json().then((json) => {
						setData(json);
					});
				}
			});
		}
	}, [done]);

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
