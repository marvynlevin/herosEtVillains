<template>
	<ion-page>
		<ion-content>
			<ion-card>
				<ion-card-header>
					<ion-card-title class="headline">Liste des organisations</ion-card-title>
				</ion-card-header>

				<ion-item v-if="!orgs.length">
					<ion-label>Aucune organisation trouvée.</ion-label>
				</ion-item>

				<ion-list v-else>
					<ion-item v-for="org in orgs" :key="org._id" @click="selectOrg(org)">
						<ion-label>{{ org.name }}</ion-label>
						<ion-button slot="end" color="primary">
							<ion-icon :icon="eye"></ion-icon>
							Détails
						</ion-button>
					</ion-item>
				</ion-list>

				<ion-card-content>
					<ion-button @click="openCreateDialog">
						Créer une organisation
					</ion-button>
				</ion-card-content>
			</ion-card>

			<ion-alert
					:is-open="dialog"
					@didDismiss="closeDialog"
					header="Créer une nouvelle organisation"
					:inputs="[
          {
            placeholder: 'Nom de l\'organisation',
            type: 'text',
            value: newOrg.name,
            handler: (input: any) => (newOrg.name = input.value),
          },
          {
            placeholder: 'Phrase secrète',
            type: 'password',
            value: newOrg.secret,
            handler: (input: any) => (newOrg.secret = input.value),
          },
        ]"
					:buttons="[
          {
            text: 'Annuler',
            role: 'cancel',
          },
          {
            text: 'Créer',
            handler: () => handleCreateOrg(),
          },
        ]"
			></ion-alert>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import {defineComponent, ref, computed, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {
	IonPage,
	IonContent,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardContent,
	IonList,
	IonItem,
	IonLabel,
	IonButton,
	IonIcon,
	IonAlert
} from '@ionic/vue';
import {eye} from 'ionicons/icons';
import {useOrgStore} from '@/store/org.store'; // Import Pinia store
import {useErrorStore} from '@/store/error.store';

export default defineComponent({
	components: {
		IonPage,
		IonContent,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
		IonList,
		IonItem,
		IonLabel,
		IonButton,
		IonIcon,
		IonAlert
	},
	setup() {
		const router = useRouter();
		const orgStore = useOrgStore();
		const errorStore = useErrorStore();

		const dialog = ref(false);
		const newOrg = ref({name: '', secret: ''});
		const error = ref({name: '', secret: ''});
		const orgs = computed(() => orgStore.orgs);
		const orgSecret = computed(() => orgStore.orgSecret);
		const currentOrg = computed(() => orgStore.currentOrg);

		const fetchOrgs = async () => {
			await orgStore.fetchOrgs();
		};

		onMounted(() => {
			fetchOrgs();
		});

		const selectOrg = async (org: any) => {
			try {
				console.log('secret', `'${orgSecret.value}'`);
				console.log('id', org._id);

				await orgStore.fetchOrgById({id: org._id, secret: orgSecret.value!});

				if (currentOrg.value) {
					router.push({name: 'OrgDetail', params: {id: org._id}});
				} else {
					console.error('Erreur : secret invalide ou organisation non trouvée.');
					errorStore.setError('secret invalide ou organisation non trouvée');
				}
			} catch (err: any) {
				console.error('Erreur lors de la sélection :', err);
				errorStore.setError(`Erreur lors de la sélection : ${err.message}`);
			}
		};

		const openCreateDialog = () => {
			newOrg.value = {name: '', secret: ''};
			error.value = {name: '', secret: ''};
			dialog.value = true;
		};

		const closeDialog = () => {
			dialog.value = false;
		};

		const handleCreateOrg = async () => {
			error.value = {name: '', secret: ''};

			if (!newOrg.value.name.trim()) error.value.name = 'Nom requis';
			if (!newOrg.value.secret.trim()) error.value.secret = 'Phrase secrète requise';

			if (error.value.name || error.value.secret) return;

			try {
				console.log('données en entrée:', newOrg.value);
				const createdOrg = await orgStore.createOrg(newOrg.value);
				if (createdOrg) {
					dialog.value = false;
					await fetchOrgs();
				}
			} catch (err: any) {
				console.error('Erreur lors de la création :', err);
				errorStore.setError(`Erreur lors de la création : ${err.message}`);
			}
		};

		return {
			dialog,
			newOrg,
			error,
			orgs,
			orgSecret,
			currentOrg,
			fetchOrgs,
			selectOrg,
			openCreateDialog,
			closeDialog,
			handleCreateOrg,
			eye
		};
	},
});
</script>
