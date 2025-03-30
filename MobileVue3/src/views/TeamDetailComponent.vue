<template>
	<ion-header>
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-back-button default-href="/orgs"></ion-back-button>
			</ion-buttons>
			<ion-title v-if="currentTeam">{{ teamName }}</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		<ion-card v-if="currentTeam">
			<ion-card-header>
				<ion-card-title>{{ teamName }}</ion-card-title>
			</ion-card-header>
			<ion-card-content>
				<ion-button expand="full" @click="openAddMemberDialog">Ajouter un membre</ion-button>
			</ion-card-content>
		</ion-card>

		<ion-list v-if="teamDetails.length">
			<ion-list-header>Membres de l'équipe</ion-list-header>
			<ion-item v-for="member in teamDetails" :key="member._id">
				<ion-label>
					<h2>{{ member.publicName }}</h2>
					<p>{{ member.realName }}</p>
				</ion-label>
				<ion-buttons slot="end">
					<ion-button @click="openEditMemberDialog(member)">
						<ion-icon name="create"></ion-icon>
					</ion-button>
					<ion-button color="danger" @click="confirmDeleteMember(member)">
						<ion-icon name="trash"></ion-icon>
					</ion-button>
				</ion-buttons>
			</ion-item>
		</ion-list>
		<ion-card v-else>
			<ion-card-content>
				<p>Aucun membre dans cette équipe.</p>
			</ion-card-content>
		</ion-card>

		<ion-modal :is-open="editMemberDialog">
			<ion-header>
				<ion-toolbar>
					<ion-title>Modifier un Héros</ion-title>
				</ion-toolbar>
			</ion-header>
			<ion-content class="ion-padding">
				<ion-item>
					<ion-label position="floating">Nom public</ion-label>
					<ion-input v-model="editHero.publicName" required></ion-input>
				</ion-item>
				<ion-item>
					<ion-label position="floating">Nom réel</ion-label>
					<ion-input v-model="editHero.realName" required></ion-input>
				</ion-item>
				<div v-for="(power, index) in editHero.powers" :key="index">
					<ion-item>
						<ion-label position="floating">Nom du pouvoir</ion-label>
						<ion-input v-model="power.name" required></ion-input>
					</ion-item>
					<ion-item>
						<ion-label>Type de pouvoir</ion-label>
						<ion-select v-model="power.type" :items="[1, 2, 3, 4, 5, 6, 7]" required></ion-select>
					</ion-item>
					<ion-item>
						<ion-label>Niveau</ion-label>
						<ion-range v-model="power.level" :min="0" :max="100" pin></ion-range>
					</ion-item>
					<ion-button color="danger" @click="removePower(index)">Supprimer</ion-button>
				</div>
				<ion-button expand="full" color="green" @click="addPower">Ajouter un pouvoir</ion-button>
				<ion-button expand="full" @click="confirmEditMember">Modifier</ion-button>
				<ion-button expand="full" fill="clear" @click="editMemberDialog = false">Annuler</ion-button>
			</ion-content>
		</ion-modal>

		<ion-modal :is-open="deleteDialog">
			<ion-header>
				<ion-toolbar>
					<ion-title>Confirmation</ion-title>
				</ion-toolbar>
			</ion-header>
			<ion-content class="ion-padding">
				<p>Voulez-vous vraiment supprimer ce membre ?</p>
				<ion-button color="danger" @click="deleteMember">Oui, supprimer</ion-button>
				<ion-button fill="clear" @click="deleteDialog = false">Annuler</ion-button>
			</ion-content>
		</ion-modal>

		<ion-modal :is-open="addMemberDialog">
			<ion-header>
				<ion-toolbar>
					<ion-title>Ajouter un Héros</ion-title>
				</ion-toolbar>
			</ion-header>
			<ion-content class="ion-padding">
				<ion-item>
					<ion-label position="floating">Nom public</ion-label>
					<ion-input v-model="newHero.publicName" required></ion-input>
				</ion-item>
				<ion-item>
					<ion-label position="floating">Nom réel</ion-label>
					<ion-input v-model="newHero.realName" required></ion-input>
				</ion-item>
				<div v-for="(power, index) in newHero.powers" :key="index">
					<ion-item>
						<ion-label position="floating">Nom du pouvoir</ion-label>
						<ion-input v-model="power.name" required></ion-input>
					</ion-item>
					<ion-item>
						<ion-label>Type de pouvoir</ion-label>
						<ion-select v-model="power.type" :items="[1, 2, 3, 4, 5, 6, 7]" required></ion-select>
					</ion-item>
					<ion-item>
						<ion-label>Niveau</ion-label>
						<ion-range v-model="power.level" :min="0" :max="100" pin></ion-range>
					</ion-item>
					<ion-button color="danger" @click="removePower(index)">Supprimer</ion-button>
				</div>
				<ion-button expand="full" color="green" @click="addPower">Ajouter un pouvoir</ion-button>
				<ion-button expand="full" @click="addMember">Ajouter</ion-button>
				<ion-button expand="full" fill="clear" @click="addMemberDialog = false">Annuler</ion-button>
			</ion-content>
		</ion-modal>
	</ion-content>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useOrgStore} from '@/store/org.store';
import {useTeamStore} from '@/store/team.store';
import {useHeroStore} from '@/store/hero.store';
import {useErrorStore} from '@/store/error.store';
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardContent,
	IonList,
	IonListHeader,
	IonItem,
	IonButtons,
	IonButton,
	IonIcon,
	IonModal,
	IonLabel,
	IonInput,
	IonSelect,
	IonRange,
	IonBackButton,
} from '@ionic/vue';

const orgStore = useOrgStore();
const teamStore = useTeamStore();
const heroStore = useHeroStore();
const errorStore = useErrorStore();

const addMemberDialog = ref(false);
const editMemberDialog = ref(false);
const deleteDialog = ref(false);
const newHero = ref({
	publicName: '',
	realName: '',
	powers: [],
});
const editHero = ref({
	publicName: '',
	realName: '',
	powers: [],
	_id: '',
});
const memberToDelete = ref<any | null>(null);

const currentTeam = computed(() => teamStore.currentTeam);
const teamName = computed(() => currentTeam.value ? currentTeam.value.name : 'Équipe sans nom');
const teamMembers = computed(() => {
	const org = orgStore.currentOrg[0];
	if (!org || !Array.isArray(org.teams) || !currentTeam.value) return [];
	const team = org.teams.find((t: any) => String(t._id) === String(currentTeam.value._id));
	return team ? team.members || [] : [];
});
const teamDetails = computed(() => {
	const teamMemberIds = teamMembers.value.map((member: any) => String(member));
	return heroStore.heroesDetails.filter((hero: any) => teamMemberIds.includes(String(hero._id)))
			.map((hero: any) => ({
				...hero,
				publicName: hero.publicName || 'Nom inconnu',
				realName: hero.realName || 'Nom réel inconnu',
			}));
});

onMounted(() => {
	loadHeroes();
});

const loadHeroes = async () => {
	try {
		const memberIds = teamMembers.value;
		for (const id of memberIds) {
			await heroStore.fetchHeroById({id, orgSecret: orgStore.currentOrgSecret!});
		}
	} catch (error: any) {
		errorStore.setError(`Erreur lors du chargement des héros: ${error}`);
	}
};

const openAddMemberDialog = () => {
	addMemberDialog.value = true;
};

const addPower = () => {
	newHero.value.powers.push({name: '', type: null, level: 50});
};

const removePower = (index: number) => {
	newHero.value.powers.splice(index, 1);
};

const addMember = async () => {
	try {
		if (!newHero.value.publicName || !newHero.value.realName) return;
		const hero = await heroStore.createHero(newHero.value);
		if (hero) {
			await teamStore.addMemberToTeam({teamId: currentTeam.value._id, heroId: hero._id});
			await orgStore.fetchOrgById({id: orgStore.currentOrg[0]._id, secret: orgStore.currentOrgSecret!});
			await loadHeroes();
		}
		addMemberDialog.value = false;
		newHero.value = {publicName: '', realName: '', powers: []};
	} catch (error: any) {
		errorStore.setError(`Erreur lors de l'ajout du héros: ${error.message || 'Erreur inconnue'}`);
	}
};

const openEditMemberDialog = (member: any) => {
	if (member) {
		editHero.value.publicName = member.publicName;
		editHero.value.realName = member.realName;
		editHero.value.powers = member.powers;
		editHero.value._id = member._id;
		editMemberDialog.value = true;
	} else {
		errorStore.setError('Données invalides pour le membre');
	}
};

const confirmEditMember = async () => {
	try {
		if (editHero.value && editHero.value._id) {
			await heroStore.updateHero({heroData: editHero.value, orgSecret: orgStore.currentOrgSecret!});
			await orgStore.fetchOrgById({id: orgStore.currentOrg[0]._id, secret: orgStore.currentOrgSecret!});
			await loadHeroes();
			editMemberDialog.value = false;
		}
	} catch (error: any) {
		errorStore.setError(`Erreur lors de la modification: ${error.message || 'Erreur inconnue'}`);
	}
};

const confirmDeleteMember = (member: any) => {
	memberToDelete.value = member;
	deleteDialog.value = true;
};

const deleteMember = async () => {
	try {
		if (memberToDelete.value && memberToDelete.value._id) {
			await teamStore.removeMemberFromTeam({teamId: currentTeam.value._id, heroId: memberToDelete.value._id});
			await orgStore.fetchOrgById({id: orgStore.currentOrg[0]._id, secret: orgStore.currentOrgSecret!});
			await loadHeroes();
			deleteDialog.value = false;
		}
	} catch (error: any) {
		errorStore.setError(`Erreur lors de la suppression: ${error.message || 'Erreur inconnue'}`);
	}
};
</script>