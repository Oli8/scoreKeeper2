<template>
  <div id="app">
    <b-navbar type="is-dark">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }" class="is-primary">
          ScoreKeeper
        </b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-dropdown label="Configs">
          <b-navbar-item tag="router-link"
                         :to="{ path: '/' }">
            Default
          </b-navbar-item>
          <b-navbar-item v-for="config in getConfigsList()" :key="config"
            tag="router-link"
            :to="{ path: `/${config.toLowerCase()}` }">
              {{ config }}
          </b-navbar-item>
        </b-navbar-dropdown>
        <b-navbar-item tag="div">
          <div class="buttons">
            <a class="button is-primary"
                href="https://github.com/Oli8/scoreKeeper2"
                target="_blank">
              About
            </a>
          </div>
          </b-navbar-item>
      </template>
    </b-navbar>

    <div class="container">
      <router-view :key="$route.path"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { capitalize } from 'lodash';

export default Vue.extend({
  name: 'App',
  methods: {
    getConfigsList(): string[] {
      return require.context(
        '@/game-configs/custom/',
        false,
        /^.*\.ts$/,
      ).keys()
       .map((config: string) => {
        // remove leading './' and ending '.ts'
        return capitalize(config.substring(
          config.lastIndexOf('/') + 1,
          config.lastIndexOf('.'),
        ));
       });
    },
  },
});
</script>

<style lang="scss">
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
    margin-bottom: 10px;

    &-brand {
      font-size: 30px;
    }
  }
}
</style>
