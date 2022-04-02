import { Settings } from './Settings';

export default function HomePage() {
	return (
		<div>
			<div><a href={Settings.signIn()}>Sign-in Google</a></div>
			<div><a href={Settings.signInServer()}>Sign-in Google Server</a></div>
		</div>
	);
}
