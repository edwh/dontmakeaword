<template>
  <div class="text-center" @keydown.enter.exact.prevent="maybePlay">
    <h3>Add letters at the start or end.</h3>
    <h3>Must be part of a word.</h3>
    <h3>Not a whole word.</h3>
    <h3>That's it.</h3>
    <div class="justify-content-around d-flex">
      <b-input
        ref="input"
        :value="letters"
        size="lg"
        class="letters"
        autocomplete="off"
        :readonly="over"
        @keydown.prevent="check"
      />
    </div>
    <div v-if="over" class="mt-2">
      <div v-if="wholeWord" class="text-success">
        <b>{{ letters }}</b> is a word.  Gain {{ letters.length }} points.
      </div>
      <div v-else-if="!partOfWord" class="text-danger">
        <b>{{ letters }}</b> is not part of a word.  Lose {{ letters.length }} points.
      </div>
      <div v-if="couldhave" class="text-success">
        From {{ last }} could have reached <b>{{ couldhave }}</b>
      </div>
      <div v-else class="text-error">
        You got the best word!
      </div>
      <b-btn variant="success" class="mt-3 mb-4" @click="play">
        Play Again
      </b-btn>
    </div>
    <h3 v-if="total">
      Score: {{ total }} / {{ possible }}
    </h3>
    <main-footer />
  </div>
</template>

<style scoped lang="scss">
@import 'color-vars';

.half-pad-col-right {
  padding-right: 7.5px;
}

.half-pad-col-left {
  padding-left: 7.5px;
}
</style>

<script>
const MainFooter = () => import('~/components/MainFooter.vue')

export default {
  components: {
    MainFooter
  },

  data: function() {
    return {
      over: false,
      round: 0,
      total: 0,
      possible: 0,
      letters: null,
      partOfWord: true,
      wholeWord: false,
      last: null,
      couldhave: null
    }
  },

  mounted() {
    this.start()
  },

  methods: {
    async check(e) {
      const el = this.$refs.input.$el
      const pos = el.selectionStart
      this.last = this.letters

      if (e.key === 'Home' || e.key === 'ArrowLeft') {
        // Go to start
        el.selectionStart = 0
        el.selectionEnd = 0
      } else if (e.key === 'End' || e.key === 'ArrowRight') {
        el.selectionStart = this.letters.length
        el.selectionEnd = this.letters.length
      } else if (
        e.key.length === 1 &&
        (pos === this.letters.length || pos === 0)
      ) {
        console.log('Start or end')
        // Start or end of word
        if (pos === 0) {
          // Add to start
          this.letters = e.key + this.letters
          setTimeout(() => {
            el.selectionStart = 0
            el.selectionEnd = 0
          }, 200)
        } else {
          // Add to end
          this.letters += e.key
          setTimeout(() => {
            el.selectionStart = this.letters.length
            el.selectionEnd = this.letters.length
          }, 200)
        }

        this.partOfWord = await this.$store.dispatch('dictionary/partOfWord', {
          letters: this.letters
        })

        this.wholeWord = await this.$store.dispatch('dictionary/wholeWord', {
          letters: this.letters
        })

        if (this.wholeWord) {
          this.total += this.letters.length
          this.roundover()
        } else if (!this.partOfWord) {
          this.total -= this.letters.length
          this.roundover()
        } else {
          this.round = this.letters.length
        }
      } else {
        // Can't do stuff in the middle
        e.preventDefault()
        e.stopPropagation()
      }

      return false
    },
    async roundover() {
      this.over = true
      this.couldhave = await this.$store.dispatch('dictionary/couldhave', {
        letters: this.last
      })

      this.possible += this.couldhave.length

      this.timer = setTimeout(() => {
        this.play()
      }, 10000)
    },
    play() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.start()
    },
    async start() {
      this.letters = await this.$store.dispatch('dictionary/pick')
      this.round = 0
      this.over = false
    },
    maybePlay() {
      if (this.over) {
        this.start()
      }
    }
  }
}
</script>
<style scoped>
.letters {
  max-width: 300px;
  text-align: center;
}
</style>
