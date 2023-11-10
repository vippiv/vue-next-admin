<template>
	<div
		class="testsipcall"
		id="sipcall"
	>
		<div class="">
			<div class="">
				<div
					class="  "
					id="login"
					style="width: 100%"
				>
					<div
						class="input-group margin-bottom-sm"
						style="display: flex; justify-content: center"
					>
						分机号@*<input
							class="form-control"
							type="text"
							placeholder="cs001"
							autocomplete="off"
							id="username"
							value="ggyy001"
							onkeypress="return checkEnter(this, event);"
						/>*@
					</div>
					<div
						class="input-group margin-bottom-sm"
						style="display: flex; justify-content: center"
					>
						分机密码@*<input
							class="form-control"
							type="text"
							placeholder="cs001"
							autocomplete="off"
							id="password"
							value="123456"
							onkeypress="return checkEnter(this, event);"
						/>*@
					</div>
					<div
						class="input-group margin-bottom-sm"
						style="display: flex; justify-content: center"
					>
						<a
							class="btn btn-success margin-bottom-sm"
							@click="reg"
							>注册</a
						>
						<a
							class="btn btn-success margin-bottom-sm"
							@click="unreg"
							>注销</a
						>
					</div>

					<div
						class="input-group margin-bottom-sm"
						style="display: flex; justify-content: center"
					>
						<a
							class="btn btn-success margin-bottom-sm"
							autocomplete="off"
							id="call"
							@click="CallPhone"
							>Call</a
						>
						@*
						<input
							class="form-control"
							type="text"
							placeholder="SIP URI to call (e.g:1000)"
							autocomplete="off"
							id="peer"
							value="13402515810"
							onkeypress="return checkEnter(this, event);"
						/>*@
					</div>
					<div
						id="videos"
						class="hide"
					>
						<div class="">
							<div class="panel panel-default">
								<div class="panel-heading">
									<h3 class="panel-title"></h3>
								</div>
								<div
									class="panel-body"
									id="videoleft"
									hidden="true"
								></div>
							</div>

							<div class="panel panel-default">
								<div class="panel-heading">
									<h3 class="panel-title"></h3>
								</div>
								<div
									class="panel-body"
									id="videoright"
									hidden="true"
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
//注册分机
function reg() {
	extension = $('#username').val();
	extensionpassword = $('#password').val();
	registerUsername();
}
//注销分机
function unreg() {
	janus.destroy();
	$('#username').removeAttr('disabled');
	$('#password').removeAttr('disabled');
}

//拨打电话
function CallPhone() {
	doCall($('#phone').val());
}
//挂断电话
function hangupCall() {
	doHangup();
}
</script>

<style lang="scss" scoped>
</style>