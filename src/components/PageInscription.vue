<template>
  <v-container class="grey lighten-5">
    <v-btn @click="retour_page_accueille" rounded>Retour</v-btn>
    <v-text-field
      label="Identifiant"
      filled
      v-model="identifiant"
      :rules="[rules_mdp_id.required]"
      hint="Champs requis"
      counter
    ></v-text-field>
    <v-text-field
      v-model="mdp"
      :append-icon="show_mdp ? 'Cacher' : 'Afficher'"
      :rules="[rules_mdp_id.required]"
      :type="show_mdp ? 'text' : 'password'"
      label="Mot de passe"
      hint="Champs requis"
      counter
      @click:append="show_mdp = !show_mdp"
    ></v-text-field>
    <v-btn @click="addLog" block rounded>Inscription</v-btn>
    <p v-show="message_score_profile">{{message_connexion}}</p>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    message_score_profile: false,
    message_connexion: '',
    identifiant: '',
    mdp: '',
    show_mdp: false,
    rules_mdp_id: {
      required: value => !!value || 'Champ requis'
    }
  }),
  methods: {
    async addLog () {
      if (this.identifiant !== '' && this.mdp !== '') {
        const response = await this.axios.post(this.url + '/api/addLog', {
          login: this.identifiant,
          password: this.mdp
        })
        if (response.data.message === 'user created succesfull') {
          this.message_score_profile = true
          this.message_connexion = 'Votre profil a été créé avec succès, vous pouvez maintenant vous connecter!'
          this.identifiant = ''
          this.mdp = ''
        } else if (
          response.data.message === 'user already exist, please enter new id'
        ) {
          this.message_score_profile = true
          this.message_connexion = "Ce nom d'utilisateur est déjà utilisé, veuillez en utiliser un nouveau!"
        }
        console.log('response is:', response)
      } else {
        this.message_score_profile = true
        this.message_connexion = 'Les deux champs sont requis'
      }
    },
    async retour_page_accueille () {
      this.$router.push('/PageAccueille')
    }
  }
}
</script>
