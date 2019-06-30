<template>
  <v-container fluid>
    <v-layout>
      <v-flex>
        <v-card height="100%">
          <v-layout>
            <v-flex xs12 md4>
              <v-textarea
                v-model="source"
                solo
                flat
                auto-grow
                placeholder="Source"
                class="elevation-0"
                rows="15"
              ></v-textarea>
            </v-flex>

            <v-divider vertical></v-divider>

            <v-flex
              xs12
              md4
            >
              <v-card-text>
                <v-treeview
                  v-model="tree"
                  :items="analysysItems"
                  :active.sync="selectedItems"
                  item-key="index"
                  activatable
                  active-class="grey lighten-4 indigo--text"
                  selected-color="indigo"
                  open-on-click
                  selectable
                  expand-icon="mdi-chevron-down"
                  on-icon="mdi-bookmark"
                  off-icon="mdi-bookmark-outline"
                  indeterminate-icon="mdi-bookmark-minus"
                >
                  <template v-slot:prepend="{ item, open }">
                    <v-icon v-if="item.icon" :color="item.color">
                      {{ item.icon }}
                    </v-icon>
                  </template>
                </v-treeview>
              </v-card-text>
            </v-flex>

            <v-divider vertical></v-divider>

            <v-flex
              xs12
              md4
            >
              <ResultList :selected="selected" v-if="selected" />
            </v-flex>
          </v-layout>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn
              flat
              @click="reset()"
            >
              Reset
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
              class="white--text"
              color="green darken-1"
              depressed
              @click="analyse()"
            >
              Analyse
              <v-icon right>play_arrow</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TokensExtractor from './../services/tokens-extractor'
import ResultList from './ResultList'

export default {
  data() {
    return {
      analysysItems: [],
      source: `12..#
1..
1#.!
12 3x+2.5
3 7
x12+7.5
123x+2.5
3-7
10 / 3
x * y - z
zmienna1 + zmienna2
w1a*w2b
A3457g4h - t !!!!~ 345
10.3-alfa
0.685739*5 
(x+y)*z
(a * a) + b
(a * a#) + b
(0.1 - beta) + 8`,
      selectedItems: [],
      tree: [],
    }
  },
  computed: {
    selected() {
      if (this.selectedItems.length === 0) {
        return
      }

      return this.analysysItems[this.selectedItems[0]]
    }
  },
  methods: {
    reset() {
      this.tree = []
      this.analysysItems = []
    },
    analyse() {
      this.tree = []
      const lines = this.source.split('\n')
      this.analysysItems = lines.map((line, index) => {
        if (line.trim() === '') {
          return {
            index: index,
            name: 'Line ' + (index + 1),
            icon: 'check_box_outline_blank',
            extraction: extractor,
          }          
        }

        const extractor = new TokensExtractor(line)
        if (extractor.ignoredStrings.length) {
          return {
            index: index,
            name: 'Line ' + (index + 1),
            icon: 'indeterminate_check_box',
            color: 'red',
            extraction: extractor,
          }
        }

        return {
          index: index,
          name: 'Line ' + (index + 1),
          icon: 'check_box',
          color: 'green',
          extraction: extractor,
        }
      })
    },
  },
  components:{
    ResultList,
  },
}
/*
12 3x+2.5
3 7
x12+7.5
123x+2.5
3-7
10 / 3
x * y - z
zmienna1 + zmienna2
w1a*w2b
A3457g4h - t !!!!~ 345
10.3-alfa
0.685739*5 
(x+y)*z
(a * a) + b
(a * a#) + b
(0.1 - beta) + 8
*/
</script>
