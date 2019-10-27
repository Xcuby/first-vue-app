<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>4 images :</span>
        <span class="font-weight-light">test de culture générale/QI</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-show="!page_accueille && !log" @click="logout">Déconnexion</v-btn>
    </v-app-bar>
    <v-container class="grey lighten-5">
      <div v-show="page_accueille">
        <v-btn block rounded color="primary" @click="logout_init_connexion" x-large>Connectez-vous</v-btn>
        <p></p>
        <v-btn block rounded color="secondary" @click="page_inscription" x-large>Inscrivez-vous</v-btn>
      </div>
      <div v-show="log">
        <v-btn @click="retour_page_accueille" rounded>Retour</v-btn>
        <v-text-field
          label="Identifiant"
          filled
          v-model="identifiant"
          :rules="[rules_mdp_id.required, rules_mdp_id.min]"
          hint="Au moins 4 caracteres"
          counter
        ></v-text-field>
        <v-text-field
          v-model="mdp"
          :append-icon="show_mdp ? 'Cacher' : 'Afficher'"
          :rules="[rules_mdp_id.required, rules_mdp_id.min]"
          :type="show_mdp ? 'text' : 'password'"
          label="Mot de passe"
          hint="Au moins 4 caracteres"
          counter
          @click:append="show_mdp = !show_mdp"
        ></v-text-field>
        <v-btn @click="login" v-show="connexion" block rounded color="primary">Connexion</v-btn>
        <v-btn @click="addLog" v-show="inscription" block rounded color="primary">Inscription</v-btn>
      </div>
      <div>
        <v-alert
          v-show="alerte_connexion"
          outlined
          class="text-center font-weight-medium"
          v-text="message_connexion"
        ></v-alert>
      </div>
      <div v-show="profil">
        <v-btn v-show="historique || rank" @click="retour_profil" rounded>Retour</v-btn>
        <div v-show="!historique && !rank">
          <h1>Bienvenue {{identifiant}},</h1>
          <div v-show="message_score_profile">
            <p
              class="text-center font-weight-medium"
            >Votre meilleur score est de {{meilleur_score}} faute(s)</p>
          </div>
          <div v-show="!message_score_profile">
            <p>Vous n'avez pas encore de meilleur score, jouer au moins une fois pour en avoir un!</p>
          </div>
          <v-btn block rounded color="primary" @click="Jouer">Jouer !</v-btn>
          <p></p>
          <v-btn @click="historic" block rounded color="secondary">Historique personnel</v-btn>
          <p></p>
          <v-btn
            @click="classement_general"
            block
            rounded
            color="secondary"
          >Classement général entre tous les joueurs</v-btn>
        </div>
        <div v-show="historique" rounded color="primary">
          <div v-show="message_score_profile">
            <p class="text-center font-weight-medium">HISTORIQUE PERSONNEL</p>
            <v-data-table
              :headers="[{ text: 'Partie n°', align: 'left', value: 'numeroPartie'}, { text: 'Nombre de fautes', value: 'score'}]"
              :items="score"
              :items-per-page="5"
              class="elevation-1"
            ></v-data-table>
          </div>
          <div v-show="!message_score_profile">
            <p>Votre historique est vide pour l'instant !</p>
          </div>
        </div>
        <div v-show="rank" rounded color="primary">
          <p class="text-center font-weight-medium">CLASSEMENT GLOBAL</p>
          <v-data-table
            :headers="[{ text: 'Rang', align: 'left', value: 'rang'}, { text: 'Pseudo du joueur', value: 'username'}, { text: 'Nombre de fautes', value: 'score'}]"
            :items="classement_global"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table>
        </div>
      </div>
      <div v-show="jouer" class="text-center display-1" v-text="enonce[image[0+m].type].consigne"></div>
      <div v-show="fin" class="text-center display-4" v-text="Score()"></div>
      <v-row align="center" justify="center">
        <v-img
          v-show="fin"
          :src="intelligence[fauteFinal()].src"
          aspect-ratio="1"
          class="grey darken-4"
          max-width="1000"
          max-height="500"
        ></v-img>
      </v-row>
      <div v-show="fin" class="text-center display-1" v-text="intelligence[fauteFinal()].titre"></div>
      <v-btn
        v-show="fin"
        @click="actualiser_score_utilisateur"
        block
        rounded
        color="primary"
      >Terminer</v-btn>
      <v-row justify:space arround>
        <template v-for="n in 4">
          <v-col :key="n">
            <v-hover v-slot:default="{ hover }">
              <v-card
                v-show="jouer"
                class="pa-2"
                :color="image[n-1+m].color"
                v-on:click="validationCard(n-1)"
                outlined
                tile
                :elevation="hover ? 0 : 19"
              >
                <v-img
                  :src="image[n-1+m].src"
                  aspect-ratio="1"
                  class="grey lighten-2"
                  max-width="600"
                  max-height="215"
                ></v-img>
                <div class="text-center font-weight-medium" v-text="image[n-1+m].titre"></div>
              </v-card>
            </v-hover>
          </v-col>
          <v-responsive v-if="n-1 === 1" :key="`width-${n-1}`" width="100%"></v-responsive>
        </template>
      </v-row>
      <v-row justify:space arround>
        <v-col md="10">
          <v-text-field
            v-show="montrerChampDeTexte(image[m].typeResp) && jouer"
            :background-color="couleurText"
            v-model="reponse"
            @click="resetCouleur()"
            @keyup.enter="validation(), validationText()"
            label="Entrez votre réponse"
            filled
          ></v-text-field>
        </v-col>
        <div class="my-3">
          <v-btn
            v-show="montrerChampDeTexte(image[m].typeResp) && jouer"
            x-large
            color="primary"
            @click="validation(), validationText()"
          >Valider</v-btn>
        </div>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    identifiant: '',
    mdp: '',
    nombreDeFaute: 0,
    fin: false,
    log: false,
    m: 0,
    show_mdp: false,
    alerte_connexion: false,
    page_accueille: true,
    connexion: false,
    inscription: false,
    profil: false,
    historique: false,
    rank: false,
    jouer: false,
    message_score_profile: false,
    score: [],
    classement_global: [],
    type_alerte_connexion: '',
    url: 'http://localhost:4000',
    rules_mdp_id: {
      required: value => !!value || 'Champ requis',
      min: v => v.length >= 4 || 'Min 4 caracteres'
    },
  }),
  methods: {
    async Connexion () {
      this.$router.push('/PageConnexion')
    },
    async Inscription () {
      this.$router.push('/PageInscription')
    }
  }
}
</script>
