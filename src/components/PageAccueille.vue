<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>4 images :</span>
        <span class="font-weight-light">test de culture générale/QI</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout">Déconnexion</v-btn>
    </v-app-bar>
    <v-container class="grey lighten-5">
        <v-btn block rounded color="primary" @click="Connexion" x-large>Connectez-vous</v-btn>
        <p></p>
        <v-btn block rounded color="secondary" @click="Inscription" x-large>Inscrivez-vous</v-btn>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data: () => ({
  }),
  methods: {
    async Connexion () {
      this.$router.push('/PageConnexion')
      this.$router.go(1)
    },
    async Inscription () {
      this.$router.push('/PageInscription')
      this.$router.go(1)
    }
  }
}
