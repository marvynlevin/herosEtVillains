<template>
  <div class="home">
    <h1>Bienvenue sur la page d'accueil</h1>
    <p>Ceci est la page d'accueil de votre application. Vous pouvez commencer à naviguer en utilisant les liens ci-dessous.</p>
    <router-link to="/auth">Aller à l'authentification</router-link>
<!--    <br />-->
<!--    <router-link to="/orgs">Aller aux organisations</router-link>-->
<!--    <br />-->
<!--    <router-link to="/teams">Aller aux équipes</router-link>-->
  </div>
</template>

<script>
export default {
  name: 'HomeView',
};
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 100px;
}

.home h1 {
  font-size: 3rem;
  color: #1890ff;
}

.home p {
  font-size: 1.2rem;
  color: #555;
}

.home a {
  font-size: 1.1rem;
  color: #1890ff;
  text-decoration: none;
}

.home a:hover {
  text-decoration: underline;
}
</style>
