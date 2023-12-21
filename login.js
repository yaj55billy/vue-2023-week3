const { createApp, ref } = Vue;

const app = createApp({
	setup() {
		const user = ref({
			username: "",
			password: "",
		});
		const login = () => {
			const api = "https://ec-course-api.hexschool.io/v2/admin/signin";
			axios
				.post(api, user.value)
				.then((res) => {
					alert("登入成功");
					const { token, expired } = res.data;
					document.cookie = `hexToken=${token};expired=${new Date(
						expired
					)}; path=/`;
					window.location = "index.html";
				})
				.catch((error) => {
					alert(`登入失敗，錯誤訊息：${error.message}`);
				});
		};

		return {
			user,
			login,
		};
	},
});

app.mount("#app");
