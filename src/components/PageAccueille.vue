<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>4 images :</span>
        <span class="font-weight-light">test de culture générale/QI</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-container class="grey lighten-5">
      <div v-show="page_accueille">
        <v-btn block rounded color="primary" @click="page_connexion" x-large>Connectez-vous</v-btn>
        <p></p>
        <v-btn block rounded color="secondary" @click="page_inscription" x-large>Inscrivez-vous</v-btn>
      </div>
      <div v-show="connexion">
        <v-btn @click="retour_page_accueille" rounded>Retour</v-btn>
        <v-text-field
          @keyup.enter="login"
          label="Identifiant"
          filled
          v-model="identifiant"
          :rules="[rules_mdp_id.required]"
          hint="Champs requis"
          counter
        ></v-text-field>
        <v-text-field
          @keyup.enter="login"
          v-model="mdp"
          :append-icon="show_mdp ? 'Cacher' : 'Afficher'"
          :rules="[rules_mdp_id.required]"
          :type="show_mdp ? 'text' : 'password'"
          label="Mot de passe"
          hint="Champs requis"
          counter
          @click:append="show_mdp = !show_mdp"
        ></v-text-field>
        <v-btn @click="login" block rounded color="primary">Connexion</v-btn>
      </div>
      <div v-show="inscription">
        <v-btn @click="retour_page_accueille" rounded>Retour</v-btn>
        <v-text-field
          @keyup.enter="addLog"
          label="Identifiant"
          filled
          v-model="identifiant"
          :rules="[rules_mdp_id.required]"
          hint="Champs requis"
          counter
        ></v-text-field>
        <v-text-field
          @keyup.enter="addLog"
          v-model="mdp"
          :append-icon="show_mdp ? 'Cacher' : 'Afficher'"
          :rules="[rules_mdp_id.required]"
          :type="show_mdp ? 'text' : 'password'"
          label="Mot de passe"
          hint="Champs requis"
          counter
          @click:append="show_mdp = !show_mdp"
        ></v-text-field>
        <v-btn @click="addLog" block rounded color="primary">Inscription</v-btn>
      </div>
      <div>
        <v-alert
          v-show="alerte_connexion"
          outlined
          class="text-center font-weight-medium"
          v-text="message_connexion"
        ></v-alert>
      </div>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    identifiant: '',
    mdp: '',
    m: 0,
    show_mdp: false,
    alerte_connexion: false,
    page_accueille: true,
    connexion: false,
    inscription: false,
    profil: false,
    historique: false,
    rank: false,
    message_score_profile: false,
    score: [],
    classement_global: [],
    type_alerte_connexion: '',
    url: '',
    rules_mdp_id: {
      required: value => !!value || 'Champ requis'
    },
    message_connexion: '',
    meilleur_score: 0
  }),
  methods: {
    async Connexion () {
      this.$router.push('/PageConnexion')
    },
    async Inscription () {
      this.$router.push('/PageInscription')
    },
    async login () {
      // connecter l'utilisateur
      if (this.inscription !== '' && this.mdp !== '') {
        const response = await this.axios.post(this.url + '/api/login', {
          login: this.identifiant,
          password: this.mdp
        })
        this.alerte_connexion = true
        if (response.data.message === 'connected') {
          this.inscription = false
          this.connexion = false
          this.profil = true
          this.alerte_connexion = false
          this.meilleur_score = response.data.meilleur_score
          this.score = response.data.historique
          this.classement_global = response.data.classement_global
          sessionStorage.setItem('identifiant', this.identifiant)
          this.$router.push('/PageProfile')
          if (this.meilleur_score === null) {
            this.message_score_profile = false
          } else {
            this.message_score_profile = true
          }
        } else if (response.data.message === "user doesn't exist") {
          this.type_alerte_connexion = 'error'
          this.message_connexion = "Nom d'utilisateur ou mot de passe incorecte"
        }
        console.log('response is:', response)
      }
    },
    async addLog () {
      if (this.inscription !== '' && this.mdp !== '') {
        const response = await this.axios.post(this.url + '/api/addLog', {
          login: this.identifiant,
          password: this.mdp
        })
        this.alerte_connexion = true
        if (response.data.message === 'user created succesfull') {
          this.page_accueille = true
          this.inscription = false
          this.type_alerte_connexion = 'success'
          this.message_connexion =
          'Votre profil a été créé avec succès, vous pouvez maintenant vous connecter!'
          this.identifiant = ''
          this.mdp = ''
        } else if (
          response.data.message === 'user already exist, please enter new id'
        ) {
          this.type_alerte_connexion = 'error'
          this.message_connexion =
          "Ce nom d'utilisateur est déjà utilisé, veuillez en utiliser un nouveau!"
        }
        console.log('response is:', response)
      }
    },

    retour_page_accueille () {
      this.page_accueille = true
      this.inscription = false
      this.connexion = false
      this.identifiant = ''
      this.mdp = ''
    },

    page_inscription () {
      this.page_accueille = false
      this.inscription = true
    },

    page_connexion () {
      this.page_accueille = false
      this.connexion = true
    }
  }
}
</script>
