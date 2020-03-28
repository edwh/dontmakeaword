<template>
  <footer class="footer mt-2 mb-2">
    <div class="d-flex flex-column">
      <ul class="d-flex flex-column flex-md-row justify-content-between list-unstyled p-0 ml-2 mr-2" />
    </div>
  </footer>
</template>

<script>
export default {
  name: 'MainFooter'
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.footer {
  max-width: map-get($grid-breakpoints, 'md');
  margin: 0 auto;
}

@include media-breakpoint-up(md) {
  .menu__link {
    border: 1px $color-black solid;
    border-radius: 0.25rem;
    background-color: $color-white;
    padding: 0.375rem 0.75rem;
    color: $color-black;
  }
}

.link__icon {
  display: none;
}

@include media-breakpoint-up(md) {
  .link__icon {
    display: inline-block;
  }
}
</style>
