<template>
	<ion-page>
		<ion-content>
			<ion-card>
				<ion-card-header>
					<ion-card-title>Liste des équipes</ion-card-title>
				</ion-card-header>

				<ion-item v-if="!teams.length">
					<ion-label>Aucune équipe trouvée.</ion-label>
				</ion-item>

				<ion-list v-else>
					<ion-item v-for="team in teams" :key="team._id" @click="selectTeam(team)">
						<ion-label>{{ team.name }}</ion-label>
						<ion-button slot="end" color="primary">
							Sélectionner
						</ion-button>
					</ion-item>
				</ion-list>

				<ion-card-content>
					<ion-button @click="openAddTeamDialog">Créer une équipe</ion-button>
				</ion-card-content>
			</ion-card>

			<ion-alert
					:is-open="addTeamDialog"
					@didDismiss="addTeamDialog = false"
					header="Créer une nouvelle équipe"
					:inputs="[
          {
            placeholder: 'Nom de l\'équipe',
            type: 'text',
            value: newTeamName,
            handler: (input: any) => (newTeamName = input.value),
          },
        ]"
					:buttons="[
          {
            text: 'Annuler',
            role: 'cancel',
          },
          {
            text: 'Créer',
            handler: () => createNewTeam(),
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
	IonAlert
} from '@ionic/vue';
import {useTeamStore} from '@/store/team.store';
import {useOrgStore} from '@/store/org.store';
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
		IonAlert
	},
	setup() {
		const router = useRouter();
		const teamStore = useTeamStore();
		const orgStore = useOrgStore();
		const errorStore = useErrorStore();

		const addTeamDialog = ref(false);
		const newTeamName = ref('');
		const teams = computed(() => teamStore.teams);
		const currentOrg = computed(() => orgStore.currentOrg);

		const fetchTeams = async () => {
			try {
				await teamStore.fetchTeams();
			} catch (error: any) {
				console.error("Failed to fetch teams", error);
				errorStore.setError(`Failed to fetch teams: ${error.message}`);
			}
		}

		onMounted(async () => {
			await fetchTeams();
		});

		const selectTeam = (team: any) => {
			teamStore.setCurrentTeam(team);
			router.push({name: 'TeamDetail', params: {id: team._id}});
		};

		const openAddTeamDialog = () => {
			newTeamName.value = '';
			addTeamDialog.value = true;
		};

		const createNewTeam = async () => {
			if (!newTeamName.value.trim()) return;
			try {
				await teamStore.createTeam({name: newTeamName.value});
				addTeamDialog.value = false;
				newTeamName.value = '';
				await fetchTeams();
			} catch (error: any) {
				console.error('Erreur lors de la création de l\'équipe :', error);
				errorStore.setError(`Erreur lors de la création de l\'équipe: ${error.message}`);
			}
		};

		return {
			addTeamDialog,
			newTeamName,
			teams,
			currentOrg,
			selectTeam,
			openAddTeamDialog,
			createNewTeam,
		};
	},
});
</script>
