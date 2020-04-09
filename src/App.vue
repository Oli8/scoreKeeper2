<template>
  <div id="app">
    <b-navbar type="is-dark">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }" class="is-primary">
          ScoreKeeper
        </b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons">
            <a class="button is-primary">
              About
            </a>
          </div>
          </b-navbar-item>
      </template>
    </b-navbar>

    <router-view/>
  </div>
</template>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

#app {
  font-family: 'Space Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  h1, h2, h3, h4, h5, h6, .navbar-brand {
    font-family: 'BioRhyme', serif;
  }

  .navbar {
    padding: 20px;

    &-brand {
      font-size: 30px;
    }
  }
}

</style>
