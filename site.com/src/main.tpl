<!DOCTYPE html>
<html>

	<head>
		<meta charset='utf-8'>
		<title>{{ server.hostname }}</title>
	</head>

	<body>
		[[ src/header ]]

		{{ #each array }}
			{{ this }}
		{{ /each }}

	</body>
</html>
