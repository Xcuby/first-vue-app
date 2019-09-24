<template>
  <v-container class="grey lighten-5">
    <div class="text-center font-weight-medium" v-text="enonce[image[0].type].consigne"></div>
    <v-row justify:space arround>
      <template v-for="n in 4">
        <v-col :key="n">
          <v-hover v-slot:default="{ hover }">
            <v-card
              class="pa-2"
              :color="image[n-1].color"
              v-on:click="image[n-1].color = validationCard(image[n-1].reponse), changementQuestion (image, validationCard(image[n-1].reponse))"
              outlined
              tile
              :elevation="hover ? 0 : 19"
            >
              <v-img
                :src="image[n-1].src"
                aspect-ratio="1"
                class="grey lighten-2"
                max-width="600"
                max-height="215"
              ></v-img>
              <div class="text-center font-weight-medium" v-text="image[n-1].titre"></div>
            </v-card>
          </v-hover>
        </v-col>
        <v-responsive v-if="n-1 === 1" :key="`width-${n-1}`" width="100%"></v-responsive>
      </template>
    </v-row>
    <v-row justify:space arround>
      <v-col md="10">
        <v-text-field
          :background-color="couleurText"
          v-model="reponse"
          @click="resetCouleur()"
          @keyup.enter="validation(), validationText(image[0].reponse), changementQuestion(image, couleurText)"
          label="Entrez votre réponse"
          filled
        ></v-text-field>
      </v-col>
      <div class="my-3">
        <v-btn x-large color="primary" @click="validation(), validationText(image[0].reponse), changementQuestion(image, couleurText)">Valider</v-btn>
      </div>
    </v-row>
  </v-container>
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
          'A votre avis de quand datent ces photos (elles ont toutes été prises à la même date), entrez votre réponse dans le champ de texte!'
      },
      { consigne: "Quel est la personne (ou objet) la plus âgée (ou le plus ancien), cliquez directement sur l'image!" }
    ],
    reponse: '',
    valider: false,
    couleurText: '',
    nombreDeFaute: 0,
    image: [
      {
        src: require('@/assets/bugatti.jpg'),
        titre: 'Bugatti chiron',
        color: '',
        type: 0,
        reponse: false
      },
      {
        src: require('@/assets/Ferrari.jpg'),
        titre: 'Ferrari F8 tributo',
        color: '',
        reponse: false
      },
      {
        src: require('@/assets/lamborghini.jpg'),
        titre: 'Lamborghini aventador S',
        color: '',
        reponse: false
      },
      {
        src: require('@/assets/2Cheveaux.jpg'),
        titre: 'Citroën 2 Chevaux',
        color: '',
        reponse: true
      },
      {
        src: require('@/assets/drapeauBlanc.jpg'),
        titre: 'Blanc',
        color: '',
        type: 1,
        reponse: 'drapeau'
      },
      {
        src: require('@/assets/drapeauFr.jpg'),
        titre: 'France',
        color: '',
        reponse: 'drapeau'
      },
      {
        src: require('@/assets/drapeauNoir.jpg'),
        titre: 'Noir',
        color: '',
        reponse: 'drapeau'
      },
      {
        src: require('@/assets/drapeauPirate.jpg'),
        titre: 'Pirate',
        color: '',
        reponse: 'drapeau'
      },
      {
        src: require('@/assets/DiCaprio1998.jpg'),
        titre: 'Léonardo DiCaprio dans le film Titanic',
        color: '',
        type: 2,
        reponse: '1998'
      },
      {
        src: require('@/assets/CDM1998.jpg'),
        titre: 'La France championne du monde de Foot',
        color: '',
        reponse: '1998'
      },
      {
        src: require('@/assets/Chirac1998.jpg'),
        titre: 'Jacques Chirac, président de la France à cette époque',
        color: '',
        reponse: '1998'
      },
      {
        src: require('@/assets/BillClinton1998.jpg'),
        titre: 'Bill Clinton, président des Etats-Unis à cette époque',
        color: '',
        reponse: '1998'
      },
      {
        src: require('@/assets/TractionAvant.jpg'),
        titre: 'Première citroëne Traction-avant',
        color: '',
        type: 3,
        reponse: false
      },
      {
        src: require('@/assets/ValeryGiscardDEstaing.jpeg'),
        titre: "Valery Giscard d'Estaing, ancien président de la France",
        color: '',
        reponse: true
      },
      {
        src: require('@/assets/BrigitteMacron.jpg'),
        titre: 'Brigitte Macron, première dame de France actuelle',
        color: '',
        reponse: false
      },
      {
        src: require('@/assets/MachineDeTuring.jpg'),
        titre: 'Première machine de Turing (créé par Alain Turing)',
        color: '',
        reponse: false
      }
    ]
  }),
  methods: {
    login () {
      // connecter utilisateur
      fetch('http://localhost:4000/api/login', {
        method: 'POST',
        body: { login: xav }
      })
        .then(response => {
          console.log('response is:', response)
        })
        .then(jsondata => {
          console.log('response is:', jsondata)
        })
    },
    validationCard (c) {
      if (typeof c === 'boolean') {
        if (c === true) {
          return 'green'
        } else {
          this.nombreDeFaute++
          return 'red'
        }
      } else {
        return ''
      }
    },
    validationText (c) {
      console.log(c)
      if (typeof c === 'string' && this.valider === true) {
        if (c === this.reponse.toLowerCase()) {
          this.couleurText = 'green'
          return ''
        } else {
          this.nombreDeFaute++
          this.couleurText = 'red'
          return ''
        }
      }
    },
    changementQuestion (liste, couleur) {
      if (couleur === 'green' && liste.length > 4) {
        for (var i = 0; i < 4; i++) {
          liste.shift()
        }
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
      return ''
    }
  }
}
</script>
