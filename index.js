const { createApp, ref, onMounted } = Vue;

const app = createApp({
	setup() {
		const apiUrl = "https://ec-course-api.hexschool.io/v2/api",
			apiPath = "hexschool-billyji";

		const products = ref([]),
			tempProduct = ref({ imagesUrl: [] }),
			productModal = ref(null), // dom
			delProductModal = ref(null); // dom
		let productModalHandle = ref(null), // 程式控制
			delProductModalHandle = ref(null); // 程式控制

		const getProducts = () => {
			const api = `${apiUrl}/${apiPath}/admin/products/all`;
			axios
				.get(api)
				.then((res) => {
					products.value = res.data.products;
				})
				.catch((error) => {
					console.log(error);
				});
		};

		const checkAdmin = () => {
			const api = `${apiUrl}/user/check`;
			axios
				.post(api)
				.then((res) => {
					getProducts();
				})
				.catch((error) => {
					alert(`無此頁面權限，請重新登入。錯誤碼：${error}`);
					window.location = "login.html";
				});
		};

		const openModal = (status, product) => {
			if (status === "new") {
				tempProduct.value = {
					imagesUrl: [],
				};
				productModalHandle.value.show();
			} else {
				// 淺拷貝
				tempProduct.value = { ...product };

				status === "edit"
					? productModalHandle.value.show()
					: delProductModalHandle.value.show();
			}
		};
		const updateProduct = () => {
			let api = `${apiUrl}/${apiPath}/admin/product`;
			let httpMethod = "post";

			if (tempProduct.value.id) {
				api = `${apiUrl}/${apiPath}/admin/product/${tempProduct.value.id}`;
				httpMethod = "put";
			}

			axios[httpMethod](api, { data: tempProduct.value })
				.then((res) => {
					getProducts();

					productModalHandle.value.hide();
				})
				.catch((err) => {
					alert(err.response.data.message);
					productModalHandle.value.hide();
				});
		};

		const deleteProduct = () => {
			const api = `${apiUrl}/${apiPath}/admin/product/${tempProduct.value.id}`;
			axios
				.delete(api)
				.then((res) => {
					alert(res.data.message);
					getProducts();
					delProductModalHandle.value.hide();
				})
				.catch((err) => {
					alert(err.data.message);
					delProductModalHandle.value.hide();
				});
		};
		const addInitImages = () => {
			tempProduct.value.imagesUrl = [];
			tempProduct.value.imagesUrl.push("");
		};

		onMounted(() => {
			const token = document.cookie.replace(
				/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
				"$1"
			);

			axios.defaults.headers.common.Authorization = token;
			checkAdmin();

			// 使用 new 建立 bootstrap Modal，拿到實體 DOM 並賦予到變數上，這樣就可以進行 Ｍodal 操作
			productModalHandle.value = new bootstrap.Modal(productModal.value);
			delProductModalHandle.value = new bootstrap.Modal(delProductModal.value);
		});

		return {
			products,
			tempProduct,
			productModal,
			delProductModal,
			openModal,
			updateProduct,
			deleteProduct,
			addInitImages,
		};
	},
});

app.mount("#app");
