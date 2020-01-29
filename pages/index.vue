<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">multi-website</h1>
      <h2 class="subtitle">My dazzling Nuxt.js project</h2>
      <div class="links">
        <a href="https://nuxtjs.org/" target="_blank" class="button--green"
          >Documentation</a
        >
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
          >GitHub</a
        >
      </div>
    </div>
    <div
      class="circle"
      v-for="(user, name) in users"
      :key="name"
      :style="{ transform: 'translate(' + user.x + 'px,' + user.y + 'px)' }"
    >
      <img src="~/assets/images/default-mac.png" alt="" />
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import * as fb from '~/lib/firebase'

export default {
  components: {
    Logo
  },
  data: () => ({
    userId: Math.random()
      .toString(36)
      .substr(2, 9),
    users: ''
  }),
  mounted() {
    console.log('mounte')
    const FPS = 20
    let startTime = performance.now()
    const timeKeeper = (x, y) => {
      // 1s以内だったらスキップ
      if (performance.now() - startTime < 1000 / FPS) {
        // requestAnimationFrame(timeKeeper)
        return
      }
      startTime = performance.now()
      fb.writeCursorPos(this.userId, x, y)
    }
    window.addEventListener('mousemove', ev => {
      requestAnimationFrame(() => timeKeeper(ev.clientX, ev.clientY))
      // console.log(ev.clientX, ev.clientY)
    })

    fb.listenCursorPos(val => {
      this.users = val
    })

    window.addEventListener('beforeunload', () => {
      fb.deleteCursor(this.userId)
    })
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.circle {
  position: fixed;
  left: 0;
  top: 0;
}
</style>
