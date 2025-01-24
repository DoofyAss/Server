<!DOCTYPE html>
<html>

	<head>
		<meta charset='utf-8'>
		<title></title>
		<link rel='icon' href='favicon.ico' type='image/x-icon'>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	</head>

	<body>
		<main>
			<a>{{ message }}</a>
			<img width='192px' src='/img/cat.png'>
		</main>
	</body>

	<style>

		@font-face {
			font-family: 'light';
			src: url('/font/light.woff');
		}

		html, body {

			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
		}

		* {

			-webkit-user-select: none;
			font-family: light;
			font-size: 1.3125rem;
			line-height: 1.70625rem;
		}

		main {

			width: 100%;
			height: 100%;

			flex-direction: column;

			display: flex;
			align-items: center;
			justify-content: center;
		}
	</style>

</html>
