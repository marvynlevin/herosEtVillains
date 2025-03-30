<template>
	<ion-app>
		<ion-page>
			<ion-router-outlet/>
		</ion-page>
	</ion-app>
</template>

<script setup lang="ts">
import {IonApp, IonRouterOutlet, IonPage} from '@ionic/vue';
import {useRecaptchaProvider} from "vue-recaptcha";

useRecaptchaProvider()
</script>
