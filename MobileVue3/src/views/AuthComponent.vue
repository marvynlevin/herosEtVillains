<template>
	<ion-page>
		<ion-content>
			<ion-alert
					:is-open="dialog"
					@didDismiss="closeDialog"
					header="Entrer le mot de passe secret"
					:inputs="[
          {
            placeholder: 'Mot de passe secret',
            type: 'password',
            value: secret,
            handler: (input: any) => (secret = input.value),
          },
        ]"
					:buttons="[
          {
            text: 'Annuler',
            role: 'cancel',
          },
          {
            text: 'Valider',
            handler: () => submitSecret(),
          },
        ]"
			></ion-alert>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import {defineComponent, ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import {IonPage, IonContent, IonAlert} from '@ionic/vue';
import {useOrgStore} from '@/store/org.store';

export default defineComponent({
	components: {
		IonPage,
		IonContent,
		IonAlert
	},
	setup() {
		const router = useRouter();
		const orgStore = useOrgStore();

		const dialog = ref(true);
		const secret = ref('');
		const error = ref<string | null>(null);

		const currentOrgSecret = computed(() => orgStore.orgSecret);

		const closeDialog = () => {
			dialog.value = false;
		};

		const submitSecret = () => {
			if (!secret.value.trim()) {
				error.value = 'Le mot de passe secret est requis.';
				return;
			}

			orgStore.setOrgSecret(secret.value);
			closeDialog();
			router.push({name: 'OrgList'});
		};

		return {
			dialog,
			secret,
			error,
			currentOrgSecret,
			closeDialog,
			submitSecret,
		};
	},
});
</script>
