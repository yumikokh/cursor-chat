<template>
  <div class="container">
    <div>
      <h1 class="title">見えるカーソル</h1>
      <h2 class="subtitle">左上から自分の名前を変えられます</h2>
      <div class="links">
        <a
          href="https://github.com/yumikokh/multi-cursor"
          target="_blank"
          class="button--grey"
          >GitHub</a
        >
      </div>
    </div>
    <div class="name">
      <input type="text" v-model="name" />
      <div class="name__info">
        <p>現在の参加者：{{ Object.keys(users || {}).length }} 人</p>
        <ul>
          <li
            v-for="(user, key) in users"
            :key="key"
            :class="{ strong: key === userId }"
          >
            {{ user.name }}
          </li>
        </ul>
      </div>
    </div>
    <div
      class="cursor"
      v-for="(user, key) in users"
      v-show="key !== userId"
      :key="key"
      :style="{ transform: 'translate(' + user.x + 'px,' + user.y + 'px)' }"
    >
      <img src="~/assets/images/default-mac.png" alt />
      <div class="cursor__name">{{ user.name }}</div>
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
    name: 'anonymous',
    users: {}
  }),
  mounted() {
    const FPS = 20
    let startTime = performance.now()
    const timeKeeper = (x, y) => {
      // 1s以内だったらスキップ
      if (performance.now() - startTime < 1000 / FPS) {
        // requestAnimationFrame(timeKeeper)
        return
      }
      startTime = performance.now()
      fb.writeCursorPos(this.userId, this.name, x, y)
    }
    window.addEventListener('mousemove', ev => {
      requestAnimationFrame(() =>
        timeKeeper(ev.clientX - innerWidth / 2, ev.clientY - innerHeight / 2)
      )
      // console.log(ev.clientX, ev.clientY)
    })

    fb.listenCursorPos(val => {
      this.users = val
    })

    window.addEventListener('beforeunload', () => {
      fb.deleteCursor(this.userId)
    })
  },
  beforeDestroy() {
    fb.deleteCursor(this.userId)
  }
}
</script>

<style lang="scss">
.container {
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
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

.name {
  position: fixed;
  top: 20px;
  left: 20px;
  > input {
    border: 2px solid;
    font-weight: bold;
    padding: 0 3px;
    font-size: 20px;
    color: #000;
  }

  &__info {
    text-align: left;
    margin-top: 20px;
  }
}
.strong {
  font-weight: bold;
}

.cursor {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  width: 10px;
  height: 10px;
}
.cursor__name {
  border: 1px solid blue;
  padding: 0px 2px;
  position: absolute;
  left: 16px;
  bottom: -6px;
  font-size: 10px;
  font-weight: bold;
}
</style>
