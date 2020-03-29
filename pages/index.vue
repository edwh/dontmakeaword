<template>
  <div class="text-center">
    <h3>Add letters at the start or end.</h3>
    <h3>Must be part of a word.</h3>
    <h3>Not a whole word.</h3>
    <h3>That's it.</h3>
    <div class="justify-content-around d-flex">
      <b-input
        ref="input"
        :key="bump"
        v-model="inputletters"
        size="lg"
        class="letters"
        autocomplete="off"
        :disabled="over"
        @keydown.prevent="move"
        @textInput="check"
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
        From '<b>{{ last }}</b>' you could have reached <b>{{ couldhave }}</b>
      </div>
      <div v-else-if="wholeWord" class="text-danger">
        You got the best word!
      </div>
      <b-btn variant="success" class="mt-3 mb-4" @click="play">
        Play Again ({{ playIn }})
      </b-btn>
    </div>
    <h3 v-if="total">
      Score: {{ total }} / {{ possible }} = {{ percent }}%
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
      inputletters: null,
      partOfWord: true,
      wholeWord: false,
      last: null,
      couldhave: null,
      playIn: null,
      bump: 0
    }
  },

  computed: {
    percent() {
      return Math.round((100 * this.total) / this.possible)
    }
  },

  mounted() {
    this.start()
  },

  methods: {
    move(e) {
      const el = this.$refs.input.$el
      const pos = el.selectionStart

      if (e.keyCode === 36 || e.keyCode === 37) {
        // Home or left - go to start
        el.selectionStart = 0
        el.selectionEnd = 0
      } else if (e.keyCode === 35 || e.keyCode === 39) {
        // End or right - go to end
        el.selectionStart = this.letters.length
        el.selectionEnd = this.letters.length
      } else if (
        (pos === this.letters.length || pos === 0) &&
        ((e.keyCode > 64 && e.keyCode < 91) ||
          (e.keyCode > 96 && e.keyCode < 123))
      ) {
        // This only works on desktop because on mobile keypress events aren't usable.
        // updated.
        //
        // Alphabetic at start or end
        if (pos === 0) {
          this.addToStart(el, e.key)
        } else {
          this.addToEnd(el, e.key)
        }
      }
    },

    check(e) {
      // On mobile keypress etc aren't usable, so we use textInput to get the key.
      const el = this.$refs.input.$el
      const pos = el.selectionStart
      const key = e.data
      const keyCode = key.charCodeAt(0)

      console.log('Key', key, keyCode, pos, this.letters, el.value, e)

      if (pos === 0) {
        this.addToStart(el, key)
      } else if (pos === this.letters.length) {
        this.addToEnd(el, key)
      }

      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()

      return false
    },

    addToStart(el, key) {
      // Add to start
      console.log('Add to start', key)
      this.last = this.letters
      this.letters = key + this.letters
      this.inputletters = this.letters.toUpperCase()
      setTimeout(() => {
        el.selectionStart = 0
        el.selectionEnd = 0
      }, 200)

      this.checkOver()
    },

    addToEnd(el, key) {
      // Add to end
      console.log('Add to end', key)
      this.last = this.letters
      this.letters += key
      this.inputletters = this.letters.toUpperCase()
      setTimeout(() => {
        el.selectionStart = this.letters.length
        el.selectionEnd = this.letters.length
      }, 200)

      this.checkOver()
    },

    async checkOver() {
      console.log('Check over', this.letters)
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
        this.total = this.total < 0 ? 0 : this.total
        this.roundover()
      } else {
        this.round = this.letters.length
      }
    },
    countDown() {
      if (this.timer) {
        clearTimeout(this.timer)
      }

      if (this.playIn <= 1) {
        this.play()
      } else {
        this.playIn--
        this.timer = setTimeout(this.countDown, 1000)
      }
    },
    async roundover() {
      this.over = true
      this.couldhave = await this.$store.dispatch('dictionary/couldhave', {
        letters: this.last
      })

      this.possible += this.couldhave
        ? this.couldhave.length
        : this.letters.length

      this.playIn = 10
      this.countDown()
    },
    play() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }

      this.start()
    },
    force() {
      // We do this to override whatever might happen on mobile keyboards
      this.inputletters = this.letters.toUpperCase()
      setTimeout(this.force, 100)
    },
    async start() {
      this.letters = await this.$store.dispatch('dictionary/pick')
      this.inputletters = this.letters
      this.round = 0
      this.over = false

      this.force()
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
