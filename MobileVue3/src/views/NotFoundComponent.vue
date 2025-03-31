<template>
	<ion-page>
		<ion-content>
			<div class="not-found">
				<h1>404 - Page Not Found</h1>
				<p>Sorry, the page you are looking for does not exist.</p>
				<router-link to="/">Go to Homepage</router-link>
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {IonPage, IonContent} from '@ionic/vue';
import {useRouter} from 'vue-router';

export default defineComponent({
	name: 'NotFoundComponent',
	components: {
		IonPage,
		IonContent,
	},
	setup() {
		const router = useRouter();

		const goToHomePage = () => {
			router.push('/');
		};

		return {
			goToHomePage,
		};
	},
});
</script>

<style scoped>
.not-found {
	text-align: center;
	margin-top: 100px;
}

.not-found h1 {
	font-size: 4rem;
	color: #ff4d4f;
}

.not-found p {
	font-size: 1.2rem;
}

.not-found a {
	font-size: 1.1rem;
	color: #1890ff;
	text-decoration: none;
}

.not-found a:hover {
	text-decoration: underline;
}
</style>
