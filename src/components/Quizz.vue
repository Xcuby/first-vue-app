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
       <div v-show="!fin" class="text-center display-1" v-text="enonce[image[0+m].type].consigne"></div>
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
                v-show="!fin"
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
            v-show="montrerChampDeTexte(image[m].typeResp) && !fin"
            :background-color="couleurText"
            v-model="reponse"
            @click="resetCouleur"
            @keyup.enter="validation (), validationText ()"
            label="Entrez votre réponse"
            filled
          ></v-text-field>
        </v-col>
        <div class="my-3">
          <v-btn
            v-show="montrerChampDeTexte(image[m].typeResp) && !fin"
            x-large
            color="primary"
            @click="validation () , validationText ()"
          >Valider</v-btn>
        </div>
      </v-row>
      <div v-show="erreurLogin">
          <v-alert type="error">Vous devez être connecté pour faire le Quizz!</v-alert>
        </div>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    url: 'http://localhost:4000',
    m: 0,
    valider: false,
    couleurText: '',
    nombreDeFaute: 0,
    fin: false,
    reponse: '',
    erreurLogin: false,
    enonce: [
      {
        consigne:
          "Trouvez l'intrus parmis les images suivantes, cliquez directement sur l'image!"
      },
      {
        consigne:
          'Entrez le point commun entre ces différentes images, entrez votre réponse dans le champ de texte!'
      },
      {
        consigne:
          'A votre avis de quelle année datent ces photos (elles ont toutes été prises à la même date), entrez votre réponse dans le champ de texte!'
      },
      {
        consigne:
          "Quel est la personne (ou objet) la plus âgée (ou le plus ancien), cliquez directement sur l'image!"
      },
      { consigne: "Qui est le premier président des Etats-Unis, cliquez directement sur l'image!" },
      { consigne: "Où Abraham Lincoln a t-il été assassiné, cliquez directement sur l'image!" },
      { consigne: "Quand a eu lieu la bataille du Chemin des Dames, cliquez directement sur l'image!" },
      { consigne: "Quel animal aquatique est-il le plus rapide parmis les animaux suivants, cliquez directement sur l'image!" },
      { consigne: "Quel animal terrestre est-il le plus rapide parmis les animaux suivants, cliquez directement sur l'image!" },
      { consigne: "Quel est l'intrus parmis les animaux suivants, cliquez directement sur l'image!" },
      { consigne: "Quel monnaie existe encore parmis les suivantes, cliquez directement sur l'image!" },
      { consigne: 'Quel est le courant artistique de ces tableaux, entrez votre réponse dans le champ de texte!' },
      { consigne: "Quel est l'animal (ou objet) le plus lourd parmis les suivants, cliquez directement sur l'image!" }
    ],
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
      },
      {
        src: require('@/assets/dauphin.jpeg'),
        titre: 'Dauphin',
        color: '',
        type: 7,
        reponse: false,
        typeResp: 'click'
      },
      {
        src: require('@/assets/Marlin_bleu.jpg'),
        titre: 'Marlin bleu',
        color: '',
        type: 7,
        reponse: false
      },
      {
        src: require('@/assets/requin.jpg'),
        titre: 'Requin',
        color: '',
        type: 7,
        reponse: false
      },
      {
        src: require('@/assets/baleine.jpg'),
        titre: 'Baleine',
        color: '',
        type: 7,
        reponse: false
      },
      {
        src: require('@/assets/Girafe.jpeg'),
        titre: 'Girafe',
        color: '',
        type: 8,
        reponse: false,
        typeResp: 'click'
      },
      {
        src: require('@/assets/Lion.jpg'),
        titre: 'Lion',
        color: '',
        type: 8,
        reponse: false
      },
      {
        src: require('@/assets/Panthere.jpg'),
        titre: 'Panthère',
        color: '',
        type: 8,
        reponse: false
      },
      {
        src: require('@/assets/Guépard.jpg'),
        titre: 'Guépard',
        color: '',
        type: 8,
        reponse: false
      },
      {
        src: require('@/assets/cameleon.jpg'),
        titre: 'Cameleon',
        color: '',
        type: 9,
        reponse: false,
        typeResp: 'click'
      },
      {
        src: require('@/assets/salamandre.jpg'),
        titre: 'Salamandre',
        color: '',
        type: 9,
        reponse: false
      },
      {
        src: require('@/assets/Tortue.jpg'),
        titre: 'Tortue',
        color: '',
        type: 9,
        reponse: false
      },
      {
        src: require('@/assets/crocodile.jpg'),
        titre: 'Crocodile',
        color: '',
        type: 9,
        reponse: false
      },
      {
        src: require('@/assets/renminbi.jpg'),
        titre: 'Le renminbi',
        color: '',
        type: 10,
        reponse: false,
        typeResp: 'click'
      },
      {
        src: require('@/assets/pesète.jpg'),
        titre: 'La pesète',
        color: '',
        type: 10,
        reponse: false
      },
      {
        src: require('@/assets/franc.jpg'),
        titre: 'Le franc',
        color: '',
        type: 10,
        reponse: false
      },
      {
        src: require('@/assets/schilling.jpg'),
        titre: 'Le schilling',
        color: '',
        type: 10,
        reponse: false
      },
      {
        src: require('@/assets/monet.jpg'),
        titre: 'Impression, soleil levant de Monet',
        color: '',
        type: 11,
        reponse: '',
        typeResp: 'text'
      },
      {
        src: require('@/assets/Manet.jpg'),
        titre: "Le Déjeuner sur l'herbe de Manet",
        color: '',
        type: 11,
        reponse: ''
      },
      {
        src: require('@/assets/morisot.jpg'),
        titre: 'Le Berceau de Morisot',
        color: '',
        type: 11,
        reponse: ''
      },
      {
        src: require('@/assets/Degas.jpg'),
        titre: 'La Classe de danse de Degas',
        color: '',
        type: 11,
        reponse: ''
      },
      {
        src: require('@/assets/baleine.jpg'),
        titre: 'Baleine bleue',
        color: '',
        type: 12,
        reponse: false,
        typeResp: 'click'
      },
      {
        src: require('@/assets/camion.jpg'),
        titre: 'Camion citerne',
        color: '',
        type: 12,
        reponse: false
      },
      {
        src: require('@/assets/Avion.jpg'),
        titre: 'Airbus A220',
        color: '',
        type: 12,
        reponse: false
      },
      {
        src: require('@/assets/Bateau_croisiere.jpg'),
        titre: 'Navire de croisière',
        color: '',
        type: 12,
        reponse: false
      }

    ],
    intelligence: [
      {
        src: require('@/assets/YagamiLight.jpeg'),
        titre:
          "Tu as l'intelligence de Yagami Light de Death Note.\nTu as un QI de 300!!!!"
      },
      {
        src: require('@/assets/SherlockHolmes.jpg'),
        titre: "Tu as l'intelligence de Sherlock Holmes.\nTu as un QI de 260!!!"
      },
      {
        src: require('@/assets/Rick.jpg'),
        titre:
          "Tu as l'intelligence de Rick de Rick & Morty.\nTu as un QI 220!!!"
      },
      {
        src: require('@/assets/Yoda.jpg'),
        titre:
          "Tu as l'intelligence de Yoda de Star Wars. \n Tu as un QI de 180!!!"
      },
      {
        src: require('@/assets/Einstein.jpg'),
        titre: "Tu as l'intelligence de Einstein. \n Tu as un QI de 160!!"
      },
      {
        src: require('@/assets/Leonard.jpeg'),
        titre:
          "Tu as l'intelligence de Leonard de The Big Bang theory. \n Tu as un QI de 140!!"
      },
      {
        src: require('@/assets/MorganFreeman.jpg'),
        titre: "Tu as l'intelligence de Morgan Freeman. \n Tu as un QI de 130!"
      },
      {
        src: require('@/assets/Saitama.png'),
        titre:
          "Tu as l'intelligence de Saitama de One punch man. \n Tu as un QI de 90..."
      },
      {
        src: require('@/assets/Reese.jpg'),
        titre:
          "Tu as l'intelligence de Reese de Malcom. \n Tu as un QI de 70..."
      },
      {
        src: require('@/assets/Junior.png'),
        titre:
          "Tu as l'intelligence de Junior dans Ma famille d'abord. \n Tu as un QI de 50...."
      },
      {
        src: require('@/assets/Homer.jpg'),
        titre:
          "Tu as l'intelligence d'Homer dans les Simpson. \n Tu as un QI de 30......."
      }
    ]
  }),
  methods:
 {
   async logout () {
     const response = await this.axios.get(this.url + '/api/logout')
     if (response.data.message === 'you are now disconnected') {
       this.m = 0
       console.log('response is:', response)
       this.$router.push('./PageAccueille')
     }
   },
   async actualiser_score_utilisateur () {
     this.fin = false
     this.m = 0
     await this.axios.post(this.url + '/api/score', {
       score: this.nombreDeFaute
     })
     this.nombreDeFaute = 0
     this.$router.push('./PageProfile')
   },

   async validationCard (indice) {
     if (this.image[this.m].typeResp === 'click') {
       const response = await this.axios.post(this.url + '/api/reponse', {
         type: this.image[indice + this.m].type,
         reponse: indice
       })
       console.log('response is:', response)
       if (response.data.message === 'Authentification requise') {
         this.erreurLogin = true
       } else if (response.data.message === 'true') {
         this.image[indice + this.m].color = 'green'
       } else {
         if (this.image[indice + this.m].color === '') {
           this.nombreDeFaute++
           this.image[indice + this.m].color = 'red'
         }
       }
     }
     if (
       this.image[indice + this.m].color !== '' &&
        this.image.length - this.m > 4
     ) {
       for (var i = 0; i < 4; i++) {
         this.image[i + this.m].color = ''
       }
       this.m = this.m + 4
       return ''
     } else if (
       this.image.length - this.m === 4 &&
        this.image[indice + this.m].color !== ''
     ) {
       this.fin = true
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
     if (this.couleurText !== '' && this.image.length - this.m > 4) {
       this.m = this.m + 4
       this.couleurText = ''
       this.reponse = ''
       return ''
     } else if (this.couleurText !== '' && this.image.length - this.m > 4) {
       this.fin = true
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
   }
 }
}
</script>
