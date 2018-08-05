<template lang="pug">
  .app(:style="style")
    .navbar
      router-link(tag="div" to="/").site-title data mining
      router-link.navbar__item(
        v-for="(page, index) in pages"
        :key="index"
        :to="page.path"
      ) {{ page.title }}
    .main
      router-view
</template>

<script>
const isProd = process.env.NODE_ENV === 'production'
export default {
  data () {
    return {
      style: isProd ? null : {
        'margin-bottom': '400px'
      }
    }
  },
  computed: {
    currentPage() {
      const path = this.$route.path;
      return this.pages.filter(page => page.path === path)[0];
    },
  },
  created() {
    this.pages = this.$pages.sort((a, b) => a.index - b.index);
  },
};
</script>

<style>
body {
  background-color: #fff;
}

.app {
  width: 100%;
  height: 100%;
  color: #444;
}

.navbar {
  box-sizing: border-box;
  border-right: 1px solid #f0f0f0;

  & .site-title {
    font: 28px/1.4 fantasy;
    margin: 16px 0 6px;
    text-align: center;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  & a {
    color: #444;
  }
}

@media screen and (min-width: 720px) {
  .navbar {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 200px;
  }
  .main {
    margin-left: 200px;
  }
}
</style>
