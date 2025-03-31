<template>
	<v-app>
		<v-app-bar app>
			<v-btn icon @click="drawer = !drawer">
				<v-icon>mdi-menu</v-icon>
			</v-btn>
			<v-toolbar-title>Héros et Villains</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn v-if="!isLoggedIn" text @click="goToLogin">Se connecter</v-btn>
			<v-btn v-else text @click="logout">Se déconnecter</v-btn>
			<v-btn text @click="openSecretDialog">Phrase secrète</v-btn>
			<v-btn v-if="!isLoggedIn" text @click="goToRegister">S'inscrire</v-btn>
		</v-app-bar>

		<v-navigation-drawer v-model="drawer" app>
			<v-list>
				<v-list-item @click="goToHomePage">
					<v-list-item-content>
						<v-list-item-title>Accueil</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item @click="goToOrgList">
					<v-list-item-content>
						<v-list-item-title>Organisations</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item @click="goToTeamList">
					<v-list-item-content>
						<v-list-item-title>Équipes</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-main>
			<router-view></router-view>
		</v-main>

		<v-dialog v-model="dialog" max-width="500px">
			<v-card>
				<v-card-title class="headline">Saisir la phrase secrète</v-card-title>
				<v-card-text>
					<v-text-field
							v-model="secret"
							label="Phrase secrète"
							type="password"
					></v-text-field>
				</v-card-text>
				<v-card-actions>
					<v-btn color="primary" @click="saveSecret">Enregistrer</v-btn>
					<v-btn @click="dialog = false">Annuler</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="errorDialog" max-width="500px">
			<v-card>
				<v-card-title class="headline">Erreur</v-card-title>
				<v-card-text>
					{{ errorMessage }}
				</v-card-text>
				<v-card-actions>
					<v-btn color="primary" @click="closeErrorDialog">OK</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-app>
</template>

<script>
import {mapGetters, mapState} from "vuex";

export default {
	data() {
		return {
			drawer: false,
			secret: '',
			dialog: false,
			isLoggedIn: !!localStorage.getItem('xsrfToken'),
		};
	},
	computed: {
		...mapGetters("org", ["getOrgSecret", "getCurrentOrg"]),
		...mapState("error", ["errorMessage", "errorDialog"]),
	},

	methods: {
		goToLogin() {
			this.$router.push({name: 'Login'});
		},
		goToRegister() {
			this.$router.push({name: 'Register'});
		},
		logout() {
			localStorage.removeItem('xsrfToken');
			localStorage.removeItem('login');
			this.isLoggedIn = false;
			this.$router.push({name: 'Home'});
		},
		goToOrgList() {
			if (this.getOrgSecret !== null) {
				this.$router.push({name: 'OrgList'}).catch(() => {
				});
			}
		},
		goToTeamList() {
			if (this.getOrgSecret !== null && this.getCurrentOrg !== null) {
				this.$router.push({name: 'TeamList'}).catch(() => {
				});
			}
		},
		goToHomePage() {
			this.$router.push({name: 'Home'}).catch(() => {
			});
		},
		saveSecret() {
			this.$store.commit("org/SET_CURRENT_ORG_SECRET", this.secret);
			this.dialog = false;
		},
		closeErrorDialog() {
			this.$store.commit("error/CLEAR_ERROR");
		},
		openSecretDialog() {
			this.dialog = true;
		}
	},
	watch: {
		'$route'() {
			this.isLoggedIn = !!localStorage.getItem('xsrfToken');
		},
	},
};
</script>