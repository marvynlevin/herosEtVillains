<template>
	<ion-page>
		<ion-content>
			<ion-card v-if="currentTeam">
				<ion-card-header>
					<ion-card-title>{{ teamName }}</ion-card-title>
					<ion-button @click="openAddMemberDialog">Ajouter un membre</ion-button>
				</ion-card-header>

				<ion-card-content>
					<ion-list v-if="teamDetails.length">
						<ion-item v-for="member in teamDetails" :key="member._id">
							<ion-label>
								<div>Nom: {{ member.publicName }}</div>
								<div>Réel: {{ member.realName }}</div>
								<div>Rôle: {{ member._id }}</div>
							</ion-label>
							<ion-button @click="openEditMemberDialog(member)" color="primary">Modifier</ion-button>
							<ion-button @click="confirmDeleteMember(member)" color="danger">Supprimer</ion-button>
						</ion-item>
					</ion-list>
					<p v-else class="ion-text-center">Aucun membre dans cette équipe.</p>
				</ion-card-content>
			</ion-card>

			<ion-alert
					:is-open="editMemberDialog"
					@didDismiss="editMemberDialog = false"
					header="Modifier un Héros"
					:inputs="editMemberInputs"
					:buttons="[
          {
            text: 'Annuler',
            role: 'cancel',
          },
          {
            text: 'Modifier',
            handler: (data) => confirmEditMember(data),
          },
        ]"
			></ion-alert>

			<ion-alert
					:is-open="deleteDialog"
					@didDismiss="deleteDialog = false"
					header="Confirmation"
					message="Voulez-vous vraiment supprimer ce membre ?"
					:buttons="[
          {
            text: 'Annuler',
            role: 'cancel',
          },
          {
            text: 'Oui, supprimer',
            handler: () => deleteMember(),
          },
        ]"
			></ion-alert>

			<ion-alert
					:is-open="addMemberDialog"
					@didDismiss="addMemberDialog = false"
					header="Ajouter un Héros"
					:inputs="addMemberInputs"
					:buttons="[
          {
            text: 'Annuler',
            role: 'cancel',
          },
          {
            text: 'Ajouter',
            handler: (data) => addMember(data),
          },
        ]"
			></ion-alert>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import {defineComponent, ref, computed, onMounted} from 'vue';
import {useRouter, useRoute} from 'vue-router';
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
	IonAlert,
	IonInput,
	IonSelect,
	IonSelectOption,
	IonRange
} from '@ionic/vue';
import {useTeamStore} from '@/store/team.store';
import {useOrgStore} from '@/store/org.store';
import {useHeroStore} from '@/store/hero.store';
import {useErrorStore} from '@/store/error.store';
import type {Hero, Power} from '@/store/hero.store'

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
		IonAlert,
		IonInput,
		IonSelect,
		IonSelectOption,
		IonRange
	},
	setup() {
		const router = useRouter();
		const route = useRoute();
		const teamStore = useTeamStore();
		const orgStore = useOrgStore();
		const heroStore = useHeroStore();
		const errorStore = useErrorStore();

		const addMemberDialog = ref(false);
		const editMemberDialog = ref(false);
		const deleteDialog = ref(false);
		const newHero = ref<Hero>({
			_id: '',
			publicName: '',
			realName: '',
			powers: [{name: '', type: null, level: 50}],
		});
		const editHero = ref<Hero>({
			_id: '',
			publicName: '',
			realName: '',
			powers: [{name: '', type: null, level: 50}],
		});
		const memberToDelete = ref<Hero | null>(null);

		const teamName = computed(() => (teamStore.currentTeam ? teamStore.currentTeam.name : 'Équipe sans nom'));
		const currentTeam = computed(() => teamStore.currentTeam);
		const currentOrg = computed(() => orgStore.currentOrg);
		const orgSecret = computed(() => orgStore.orgSecret);
		const heroesDetails = computed(() => heroStore.heroesDetails);

		const teamMembers = computed((): string[] => {
			if (!currentOrg.value || !Array.isArray(currentOrg.value) || currentOrg.value.length === 0) {
				return [];
			}
			const org = currentOrg.value[0];

			if (!org || !Array.isArray(org.teams)) {
				return [];
			}

			const teamId = teamStore.currentTeam ? teamStore.currentTeam._id : null;

			if (!teamId) {
				return [];
			}

			const team = org.teams.find((t: any) => String(t._id) === String(teamId));

			if (!team) {
				return [];
			}
			return team.members || [];
		});

		const teamDetails = computed((): Hero[] => {
			const teamMemberIds = teamMembers.value.map(memberId => String(memberId));
			return heroesDetails.value.filter(hero =>
					teamMemberIds.includes(String(hero._id))
			).map(hero => ({
				...hero,
				publicName: hero.publicName || 'Nom inconnu',
				realName: hero.realName || 'Nom réel inconnu',
			}));
		});

		const loadHeroes = async () => {
			try {
				const memberIds = teamMembers.value;
				for (const id of memberIds) {
					await heroStore.fetchHeroById({id, orgSecret: orgSecret.value!});
				}
			} catch (error: any) {
				console.error('Erreur lors du chargement des héros:', error);
				errorStore.setError(`Erreur lors du chargement des héros: ${error.message}`);
			}
		};

		const addMemberInputs = computed(() => [
			{
				name: 'publicName',
				placeholder: 'Nom public',
				type: 'text',
				value: newHero.value.publicName,
			},
			{
				name: 'realName',
				placeholder: 'Nom réel',
				type: 'text',
				value: newHero.value.realName,
			},
			...newHero.value.powers!.flatMap((power: any, index: number) => [
				{
					name: `powerName${index}`,
					placeholder: `Nom du pouvoir ${index + 1}`,
					type: 'text',
					value: power.name,
				},
				{
					name: `powerType${index}`,
					type: 'number',
					placeholder: `Type du pouvoir ${index + 1}`,
					value: power.type,
				},
				{
					name: `powerLevel${index}`,
					type: 'number',
					placeholder: `Niveau du pouvoir ${index + 1}`,
					min: 0,
					max: 100,
					value: power.level
				}
			]),
		]);

		const editMemberInputs = computed(() => [
			{
				name: 'publicName',
				placeholder: 'Nom public',
				type: 'text',
				value: editHero.value.publicName,
			},
			{
				name: 'realName',
				placeholder: 'Nom réel',
				type: 'text',
				value: editHero.value.realName,
			},
			...editHero.value.powers!.flatMap((power: any, index: number) => [
				{
					name: `powerName${index}`,
					placeholder: `Nom du pouvoir ${index + 1}`,
					type: 'text',
					value: power.name,
				},
				{
					name: `powerType${index}`,
					type: 'number',
					placeholder: `Type du pouvoir ${index + 1}`,
					value: power.type,
				},
				{
					name: `powerLevel${index}`,
					type: 'number',
					placeholder: `Niveau du pouvoir ${index + 1}`,
					min: 0,
					max: 100,
					value: power.level
				}
			]),
		]);

		onMounted(async () => {
			const teamId = route.params.id;
			if (teamId) {
				teamStore.fetchTeamById(teamId as string);
				await orgStore.fetchOrgById({
					id: (orgStore.currentOrg as unknown as Array<any>)[0]!._id,
					secret: orgSecret.value!
				});
				await loadHeroes();
			}
		});

		const openAddMemberDialog = () => {
			addMemberDialog.value = true;
			newHero.value = {_id: '', publicName: '', realName: '', powers: [{name: '', type: null, level: 50}]};
		};

		const openEditMemberDialog = (member: Hero) => {
			editHero.value = {...member};
			editMemberDialog.value = true;
		};

		const addMember = async (data: any) => {
			try {
				const newPower: Power[] = [];
				for (let i = 0; ; i++) {
					if (data[`powerName${i}`] === undefined) break;
					newPower.push({
						name: data[`powerName${i}`],
						type: data[`powerType${i}`] !== undefined ? parseInt(data[`powerType${i}`], 10) : null,
						level: data[`powerLevel${i}`] !== undefined ? parseInt(data[`powerLevel${i}`], 10) : 50
					});
				}

				const heroData: Hero = {
					_id: '',
					publicName: data.publicName,
					realName: data.realName,
					powers: newPower
				}

				const hero = await heroStore.createHero(heroData);
				if (hero) {
					await teamStore.addMemberToTeam({teamId: teamStore.currentTeam!._id, heroId: hero._id});
					await orgStore.fetchOrgById({
						id: (orgStore.currentOrg as unknown as Array<any>)[0]!._id,
						secret: orgSecret.value!
					});
					await loadHeroes();
				}
				addMemberDialog.value = false;
			} catch (error: any) {
				console.error(error.message || 'Erreur lors de l\'ajout du héros.');
				errorStore.setError(`Erreur lors de l'ajout du héros: ${error?.message}`);
			}
		};

		const confirmEditMember = async (data: any) => {
			try {
				const updatedPowers: Power[] = [];
				for (let i = 0; ; i++) {
					if (data[`powerName${i}`] === undefined) break;
					updatedPowers.push({
						name: data[`powerName${i}`],
						type: data[`powerType${i}`] !== undefined ? parseInt(data[`powerType${i}`], 10) : null,
						level: data[`powerLevel${i}`] !== undefined ? parseInt(data[`powerLevel${i}`], 10) : 50
					});
				}

				const updatedHeroData: Hero = {
					...editHero.value,
					publicName: data.publicName,
					realName: data.realName,
					powers: updatedPowers
				}
				await heroStore.updateHero({heroData: updatedHeroData as any, orgSecret: orgSecret.value!});
				await orgStore.fetchOrgById({
					id: (orgStore.currentOrg as unknown as Array<any>)[0]._id,
					secret: orgSecret.value!
				});
				await loadHeroes();
				editMemberDialog.value = false;
			} catch (error: any) {
				console.error(error.message || "Erreur lors de la modification.");
				errorStore.setError(`Erreur lors de la modification: ${error?.message}`);
			}
		};

		const confirmDeleteMember = (member: Hero) => {
			memberToDelete.value = member;
			deleteDialog.value = true;
		};

		const deleteMember = async () => {
			try {
				if (memberToDelete.value && memberToDelete.value._id) {
					await teamStore.removeMemberFromTeam({
						teamId: teamStore.currentTeam!._id,
						heroId: memberToDelete.value._id,
					});
					await orgStore.fetchOrgById({
						id: (orgStore.currentOrg as unknown as Array<any>)[0]._id,
						secret: orgSecret.value!
					});
					await loadHeroes();
					deleteDialog.value = false;
				}
			} catch (error: any) {
				console.error(error.message || 'Erreur lors de la suppression.');
				errorStore.setError(`Erreur lors de la suppression: ${error?.message}`);
			}
		};

		return {
			addMemberDialog,
			editMemberDialog,
			deleteDialog,
			newHero,
			editHero,
			memberToDelete,
			teamName,
			teamDetails,
			currentTeam,
			openAddMemberDialog,
			openEditMemberDialog,
			confirmDeleteMember,
			addMember,
			confirmEditMember,
			deleteMember,
			addMemberInputs,
			editMemberInputs
		};
	},
});
</script>
