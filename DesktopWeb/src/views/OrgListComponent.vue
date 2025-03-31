<template>
	<v-container>
		<v-card class="elevation-2">
			<v-card-title class="headline">Liste des organisations</v-card-title>

			<v-alert v-if="!getOrgs.length" type="info" elevation="2">
				Aucune organisation trouvée.
			</v-alert>

			<v-data-table
					v-else
					:headers="headers"
					:items="getOrgs"
					item-key="_id"
					class="elevation-1"
			>
				<template v-slot:item.actions="{ item }">
					<v-btn @click="selectOrg(item)" color="blue darken-1" small dark class="white--text">
						<v-icon left class="white--text">mdi-eye</v-icon>
						Détails
					</v-btn>
				</template>
			</v-data-table>

			<v-card-actions>
				<v-btn @click="openCreateDialog" color="primary" class="mt-4">
					Créer une organisation
				</v-btn>
			</v-card-actions>
		</v-card>

		<v-dialog v-model="dialog" max-width="500px" persistent>
			<v-card>
				<v-card-title class="headline">Créer une nouvelle organisation</v-card-title>
				<v-card-text>
					<v-text-field
							v-model="newOrg.name"
							label="Nom de l'organisation"
							required
							:error="!!error.name"
							:error-messages="error.name"
					/>
					<v-text-field
							v-model="newOrg.secret"
							label="Phrase secrète"
							type="password"
							required
							:error="!!error.secret"
							:error-messages="error.secret"
					/>
				</v-card-text>
				<v-card-actions class="justify-end">
					<v-btn @click="closeDialog">Annuler</v-btn>
					<v-btn color="primary" @click="handleCreateOrg">Créer</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import {mapState, mapActions, mapGetters, mapMutations} from "vuex";

export default {
	data() {
		return {
			dialog: false,
			newOrg: {name: "", secret: ""},
			error: {name: "", secret: ""},
			headers: [
				{text: "Nom", align: "start", value: "name"},
				{text: "Actions", align: "center", value: "actions", sortable: false},
			],
		};
	},
	computed: {
		...mapGetters("org", ["getOrgs", "getOrgSecret", "getSecretError"]),
		...mapState('org', ['currentOrg'])
	},
	created() {
		this.fetchOrgs();
	},
	methods: {
		...mapActions("org", ["fetchOrgs", "fetchOrgById", "createOrg", "addOrgToStore"]),
		...mapMutations('org', ['SET_CURRENT_ORG']),
		...mapActions('error', ['setError']),

		async selectOrg(org) {
			try {
				console.log("secret", `'${this.getOrgSecret}'`);
				console.log("id", org._id);

				await this.fetchOrgById({id: org._id, secret: this.getOrgSecret});

				if (this.currentOrg) {
					await this.$router.push({name: "OrgDetail", params: {id: org._id}});
				} else {
					console.error("Erreur : secret invalide ou organisation non trouvée.");
					await this.setError("secret invalide ou organisation non trouvée");
				}
			} catch (error) {
				console.error("Erreur lors de la sélection :", error);
			}
		},
		openCreateDialog() {
			this.newOrg = {name: "", secret: ""};
			this.error = {name: "", secret: ""};
			this.dialog = true;
		},
		closeDialog() {
			this.dialog = false;
		},
		async handleCreateOrg() {
			this.error = {name: "", secret: ""};

			if (!this.newOrg.name.trim()) this.error.name = "Nom requis";
			if (!this.newOrg.secret.trim()) this.error.secret = "Phrase secrète requise";

			if (this.error.name || this.error.secret) return;

			try {
				console.log("données en entrée:", this.newOrg);
				const createdOrg = await this.createOrg(this.newOrg);

				await this.addOrgToStore(createdOrg);

				this.dialog = false;
				await this.fetchOrgs();
			} catch (error) {
				console.error("Erreur lors de la création :", error);
				await this.setError(`Erreur lors de la création : ${error}`);
			}
		},
	},
};
</script>
