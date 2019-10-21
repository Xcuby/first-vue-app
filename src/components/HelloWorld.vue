<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>4 images :</span>
        <span class="font-weight-light">  test de culture générale/QI</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
        <v-btn v-show="!page_accueille && !log" @click="logout">Déconnexion</v-btn>
    </v-app-bar>
  <v-container class="grey lighten-5">
    <div v-show="page_accueille">
      <v-btn block rounded color='primary' @click="logout_init_connexion" x-large>Connectez-vous</v-btn>
      <p></p>
      <v-btn block rounded color= 'secondary' @click="page_inscription" x-large>Inscrivez-vous</v-btn>
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
      <v-alert v-show="alerte_connexion" outlined class="text-center font-weight-medium" v-text="message_connexion"></v-alert>
    </div>
    <div v-show="profil">
      <h1>Bienvenue {{identifiant}},</h1>
      <div v-show ="message_score_profile">
      <p class="text-center font-weight-medium" >Votre meilleur score est de {{meilleur_score}} faute(s)</p>
      <p class="text-center font-weight-medium">historique de partie</p>
      <v-data-table
      :headers="[{ text: 'Partie n°', align: 'left', value: 'numeroPartie'}, { text: 'Score', value: 'score'}]"
      :items="score"
      :items-per-page="5"
    class="elevation-1"
  ></v-data-table>
      </div>
      <div v-show="!message_score_profile">
      <p>Vous n'avez pas encore de meilleur score, jouer au moins une fois pour en avoir un!</p>
      <p>Votre historique est vide pour l'instant !</p>
      </div>
      <v-btn block rounded color='primary' @click="Jouer">Jouer !</v-btn>
    </div>
    <div v-show="jouer" class="text-center display-1" v-text="enonce[image[0+m].type].consigne"></div>
    <div v-show="fin" class="text-center display-4" v-text="Score()"></div>
    <v-row align="center" justify="center">
      <v-img v-show="fin" :src="intelligence[fauteFinal()].src" aspect-ratio="1" class="grey darken-4 " max-width="1000" max-height="500"></v-img>
    </v-row>
    <div v-show="fin" class="text-center display-1" v-text="intelligence[fauteFinal()].titre"></div>
    <v-btn v-show="fin" @click="actualiser_score_utilisateur" block rounded color="primary">Terminer</v-btn>
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
        <v-btn v-show="montrerChampDeTexte(image[m].typeResp) && jouer" x-large color="primary" @click="validation(), validationText()">Valider</v-btn>
      </div>
    </v-row>
  </v-container>
  </v-app>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { METHODS } from 'http'
export default {
  data: () => ({
    enonce: [
      { consigne: "Trouvez l'intrus parmis les images suivantes, cliquez directement sur l'image!" },
      { consigne: 'Entrez le points communs entre ces différentes images, entrez votre réponse dans le champ de texte!' },
      {
        consigne:
          'A votre avis de quelle année datent ces photos (elles ont toutes été prises à la même date), entrez votre réponse dans le champ de texte!'
      },
      { consigne: "Quel est la personne (ou objet) la plus âgée (ou le plus ancien), cliquez directement sur l'image!" },
      { consigne: 'Qui est le premier président des Etats-Unis?' },
      { consigne: 'Où Abraham Lincoln a t-il été assassiné?' },
      { consigne: 'Quand a eu lieu la bataille du Chemin des Dames?' }
    ],
    reponse: '',
    identifiant: '',
    mdp: '',
    valider: false,
    couleurText: '',
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
    jouer: false,
    message_score_profile: false,
    score: [],
    type_alerte_connexion: '',
    url: 'http://localhost:4000',
    rules_mdp_id: {
      required: value => !!value || 'Champ requis',
      min: v => v.length >= 4 || 'Min 4 caracteres'
    },
    message_connexion: '',
    meilleur_score: 0,
    image: [
      {
        src: require('@/assets/bugatti.jpg'),
        titre: 'Bugatti chiron',
        color: '',
        type: 0,
        reponse: false,
        typeResp: 'click'
      },
      {
        src: require('@/assets/Ferrari.jpg'),
        titre: 'Ferrari F8 tributo',
        color: '',
        type: 0,
        reponse: false
      },
      {
        src: require('@/assets/lamborghini.jpg'),
        titre: 'Lamborghini aventador S',
        color: '',
        type: 0,
        reponse: false
      },
      {
        src: require('@/assets/2Cheveaux.jpg'),
        titre: 'Citroën 2 Chevaux',
        color: '',
        type: 0,
        reponse: false
      },
      {
        src: require('@/assets/drapeauBlanc.jpg'),
        titre: 'Blanc',
        color: '',
        type: 1,
        reponse: '',
        typeResp: 'text'
      },
      {
        src: require('@/assets/drapeauFr.jpg'),
        titre: 'France',
        color: '',
        type: 1,
        reponse: ''
      },
      {
        src: require('@/assets/drapeauNoir.jpg'),
        titre: 'Noir',
        color: '',
        type: 1,
        reponse: ''
      },
      {
        src: require('@/assets/drapeauPirate.jpg'),
        titre: 'Pirate',
        color: '',
        type: 1,
        reponse: ''
      },
      {
        src: require('@/assets/DiCaprio1998.jpg'),
        titre: 'Léonardo DiCaprio dans le film Titanic',
        color: '',
        type: 2,
        reponse: '',
        typeResp: 'text'
      },
      {
        src: require('@/assets/CDM1998.jpg'),
        titre: 'La France championne du monde de Foot',
        color: '',
        type: 2,
        reponse: ''
      },
      {
        src: require('@/assets/Chirac1998.jpg'),
        titre: 'Jacques Chirac, président de la France à cette époque',
        color: '',
        type: 2,
        reponse: ''
      },
      {
        src: require('@/assets/BillClinton1998.jpg'),
        titre: 'Bill Clinton, président des Etats-Unis à cette époque',
        color: '',
        type: 2,
        reponse: ''
      },
      {
        src: require('@/assets/TractionAvant.jpg'),
        titre: 'Première citroëne Traction-avant',
        color: '',
        type: 3,
        reponse: false,
        typeResp: 'click'
      },
      {
        src: require('@/assets/ValeryGiscardDEstaing.jpeg'),
        titre: "Valery Giscard d'Estaing, ancien président de la France",
        color: '',
        type: 3,
        reponse: false
      },
      {
        src: require('@/assets/BrigitteMacron.jpg'),
        titre: 'Brigitte Macron, première dame de France actuelle',
        color: '',
        type: 3,
        reponse: false
      },
      {
        src: require('@/assets/MachineDeTuring.jpg'),
        titre: 'Première machine de Turing (créé par Alain Turing)',
        color: '',
        type: 3,
        reponse: false
      },
      {
        src: require('@/assets/Lincoln.jpg'),
        titre: 'Abraham Lincoln',
        color: '',
        type: 4,
        reponse: false,
        typeResp: 'click'
      },
      {
        src: require('@/assets/Roosevelt.jpg'),
        titre: 'Theodore Roosevelt',
        color: '',
        type: 4,
        reponse: false
      },
      {
        src: require('@/assets/Washinghton.jpg'),
        titre: 'George Washinghton',
        color: '',
        type: 4,
        reponse: false
      },
      {
        src: require('@/assets/Kennedy.jpg'),
        titre: 'John Fitzgerald Kennedy',
        color: '',
        type: 4,
        reponse: false
      },
      {
        src: require('@/assets/theatre.jpg'),
        titre: 'Dans un théatre',
        color: '',
        type: 5,
        reponse: false,
        typeResp: 'click'
      },
      {
        src: require('@/assets/Bureau_oval.jpg'),
        titre: 'Dans le bureau ovale',
        color: '',
        type: 5,
        reponse: false
      },
      {
        src: require('@/assets/baignoire.jpg'),
        titre: 'Dans sa baignoire',
        color: '',
        type: 5,
        reponse: false
      },
      {
        src: require('@/assets/parade.jpg'),
        titre: "Lors d'un défilé public",
        color: '',
        type: 5,
        reponse: false
      },
      {
        src: require('@/assets/guerreAlgérie.jpg'),
        titre: "Guerre d'Algérie",
        color: '',
        type: 6,
        reponse: false,
        typeResp: 'click'
      },
      {
        src: require('@/assets/guerreDeSécession.jpg'),
        titre: 'Guerre de Sécession',
        color: '',
        type: 6,
        reponse: false
      },
      {
        src: require('@/assets/1ereGuerreMondiale.jpg'),
        titre: 'Première guerre mondiale',
        color: '',
        type: 6,
        reponse: false
      },
      {
        src: require('@/assets/2ndGuerreMondiale.jpg'),
        titre: 'Second guerre mondiale',
        color: '',
        type: 6,
        reponse: false
      }
    ],
    intelligence: [
      {
        src: require('@/assets/YagamiLight.jpeg'),
        titre: "Tu as l'intelligence de Yagami Light de Death Note.\nTu as un QI de 300!!!!"
      },
      {
        src: require('@/assets/SherlockHolmes.jpg'),
        titre: "Tu as l'intelligence de Sherlock Holmes.\nTu as un QI de 260!!!"
      },
      {
        src: require('@/assets/Rick.jpg'),
        titre: "Tu as l'intelligence de Rick de Rick & Morty.\nTu as un QI 220!!!"
      },
      {
        src: require('@/assets/Yoda.jpg'),
        titre: "Tu as l'intelligence de Yoda de Star Wars. \n Tu as un QI de 180!!!"
      },
      {
        src: require('@/assets/Einstein.jpg'),
        titre: "Tu as l'intelligence de Einstein. \n Tu as un QI de 160!!"
      },
      {
        src: require('@/assets/Leonard.jpeg'),
        titre: "Tu as l'intelligence de Leonard de The Big Bang theory. \n Tu as un QI de 140!!"
      },
      {
        src: require('@/assets/MorganFreeman.jpg'),
        titre: "Tu as l'intelligence de Morgan Freeman. \n Tu as un QI de 130!"
      },
      {
        src: require('@/assets/Saitama.png'),
        titre: "Tu as l'intelligence de Saitama de One punch man. \n Tu as un QI de 90..."
      },
      {
        src: require('@/assets/Reese.jpg'),
        titre: "Tu as l'intelligence de Reese de Malcom. \n Tu as un QI de 70..."
      },
      {
        src: require('@/assets/Junior.png'),
        titre: "Tu as l'intelligence de Junior dans Ma famille d'abord. \n Tu as un QI de 50...."
      },
      {
        src: require('@/assets/Homer.jpg'),
        titre: "Tu as l'intelligence d'Homer dans les Simpson. \n Tu as un QI de 30......."
      }
    ]
  }),
  methods: {
    async login () {
      // connecter l'utilisateur
      const response = await this.axios.post(this.url + '/api/login', {
        login: this.identifiant,
        password: this.mdp
      })
      this.alerte_connexion = true
      if (response.data.message === 'connected') {
        this.log = false
        this.profil = true
        this.alerte_connexion = false
        this.meilleur_score = response.data.meilleur_score
        this.score = response.data.historique
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
    },
    async addLog () {
      const response = await this.axios.post(this.url + '/api/addLog', {
        login: this.identifiant,
        password: this.mdp
      })
      this.alerte_connexion = true
      if (response.data.message === 'user created succesfull') {
        this.page_accueille = true
        this.log = false
        this.inscription = false
        this.type_alerte_connexion = 'success'
        this.message_connexion = 'Votre profil a été créé avec succès, vous pouvez maintenant vous connecter!'
        this.identifiant = ''
        this.mdp = ''
      } else if (response.data.message === 'user already exist, please enter new id') {
        this.type_alerte_connexion = 'error'
        this.message_connexion = "Ce nom d'utilisateur est déjà utilisé, veuillez en utiliser un nouveau!"
      }
      console.log('response is:', response)
    },
    async logout () {
      const response = await this.axios.get(this.url + '/api/logout')
      if (response.data.message === 'you are now disconnected') {
        this.log = false
        this.jouer = false
        this.m = 0
        this.nombreDeFaute = 0
        this.fin = false
        this.page_accueille = true
        this.profil = false
        this.connexion = false
        this.inscription = false
        console.log('response is:', response)
      }
    },

    logout_init_connexion () {
      this.page_accueille = false
      this.connexion = true
      this.log = true
    },

    async actualiser_score_utilisateur () {
      this.fin = false
      this.profil = true
      this.m = 0
      this.message_score_profile = true
      if ((this.meilleur_score != null && this.meilleur_score > this.nombreDeFaute)) {
        this.meilleur_score = this.nombreDeFaute
        const response = await this.axios.post(this.url + '/api/score', {
          login: this.identifiant,
          password: this.mdp,
          meilleur_score: this.meilleur_score,
          score: this.nombreDeFaute
        })
        this.score = response.data.historique
        console.log('response is:', response)
      } else if (this.meilleur_score === null) {
        this.meilleur_score = this.nombreDeFaute
        const response = await this.axios.post(this.url + '/api/score', {
          login: this.identifiant,
          password: this.mdp,
          meilleur_score: this.meilleur_score,
          score: this.nombreDeFaute
        })
        this.score = response.data.historique
        console.log('response is:', response)
      } else {
        const response = await this.axios.post(this.url + '/api/score', {
          login: this.identifiant,
          password: this.mdp,
          score: this.nombreDeFaute
        })
        this.score = response.data.historique
        console.log('response is:', response)
      }
      this.nombreDeFaute = 0
    },

    async validationCard (indice) {
      if (this.image[this.m].typeResp === 'click') {
        const response = await this.axios.post(this.url + '/api/reponse', {
          type: this.image[indice + this.m].type,
          reponse: indice
        })
        console.log('response is:', response)
        if (response.data.message === 'true') {
          this.image[indice + this.m].color = 'green'
        } else {
          if (this.image[indice + this.m].color === '') {
            this.nombreDeFaute++
            this.image[indice + this.m].color = 'red'
          }
        }
      }
      if (this.image[indice + this.m].color === 'green' && this.image.length - this.m > 4) {
        for (var i = 0; i < 4; i++) {
          this.image[i + this.m].color = ''
        }
        this.m = this.m + 4
        return ''
      } else if (this.image.length - this.m === 4 && this.image[indice + this.m].color === 'green') {
        this.fin = true
        this.jouer = false
        for (var j = 0; j < 4; j++) {
          this.image[j + this.m].color = ''
        }
        return ''
      }
    },
    async validationText () {
      if (this.image[this.m].typeResp === 'text' && this.valider === true) {
        const response = await this.axios.post(this.url + '/api/reponse', {
          type: this.image[this.m].type,
          reponse: this.reponse.toLowerCase()
        })
        console.log('response is:', response)
        if (response.data.message === 'true') {
          this.couleurText = 'green'
        } else {
          this.nombreDeFaute++
          this.couleurText = 'red'
        }
      }
      if (this.couleurText === 'green' && this.image.length - this.m > 4) {
        this.m = this.m + 4
        this.couleurText = ''
        this.reponse = ''
        return ''
      } else if (this.couleurText === 'green' && this.image.length - this.m > 4) {
        this.fin = true
        this.jouer = false
        this.couleurText = ''
        this.reponse = ''
        return ''
      }
    },

    validation () {
      this.valider = true
    },
    resetCouleur () {
      this.couleurText = ''
      this.reponse = ''
      return ''
    },
    montrerChampDeTexte (typeResp) {
      if (this.fin || typeResp === 'click') {
        return false
      } else {
        return true
      }
    },
    Score () {
      const fautes = this.nombreDeFaute
      return fautes + ' faute(s) !'
    },
    fauteFinal () {
      if (this.nombreDeFaute > 10) {
        return 10
      } else {
        return this.nombreDeFaute
      }
    },
    page_inscription () {
      this.page_accueille = false
      this.inscription = true
      this.log = true
    },
    retour_page_accueille () {
      this.page_accueille = true
      this.inscription = false
      this.connexion = false
      this.log = false
      this.identifiant = ''
      this.mdp = ''
    },
    Jouer () {
      this.profil = false
      this.jouer = true
    }
  }
}
</script>
