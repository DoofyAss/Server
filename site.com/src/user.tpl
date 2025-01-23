<div class='user'>
	{{ #each user }}
		<user name='{{ this.name }}' role='{{ this.role }}'></user>
	{{ /each }}
</div>
