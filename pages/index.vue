<template>
  <div class="container">
    <div>
      <h1 class="title" @mousedown="onTitleMouseDown">
        <span
          v-for="(s, i) in 'cursor-chat'"
          :key="i"
          :class="{
            selected:
              (selectedTitleStart <= i && i <= selectedTitleEnd) ||
              (selectedTitleEnd <= i && i <= selectedTitleStart)
          }"
          ref="title"
          >{{ s }}</span
        >
      </h1>
      <h2 class="subtitle" @mousedown="onSubTitleMouseDown">
        <span
          v-for="(s, i) in '左上から自分の名前を変えられます'"
          :key="i"
          :class="{
            selected:
              (selectedSubTitleStart <= i && i <= selectedSubTitleEnd) ||
              (selectedSubTitleEnd <= i && i <= selectedSubTitleStart)
          }"
          ref="subTitle"
          >{{ s }}</span
        >
      </h2>
      <logo
        class="logo"
        :class="{ furueru: isKayacHover }"
        @mouseover.native="onKayacMouseOver"
        @mouseleave.native="onKayacMouseLeave"
      />
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
    users: {},
    isKayacHover: false,
    selectedTitleStart: -1,
    selectedTitleEnd: -1,
    selectedSubTitleStart: -1,
    selectedSubTitleEnd: -1,
    titlePositions: [],
    subTitlePositions: [],
    isTitleDragging: false,
    isSubTitleDragging: false
  }),
  methods: {
    onKayacMouseOver() {
      fb.writeHover('kayac', true)
    },
    onKayacMouseLeave() {
      fb.writeHover('kayac', false)
    },
    onTitleMouseDown(ev) {
      this.isTitleDragging = true
      const pos = ev.clientX - innerWidth / 2
      const index = this.checkIndex(this.titlePositions, pos)
      fb.writeTextIndex('title', index, index)
    },
    onSubTitleMouseDown(ev) {
      this.isSubTitleDragging = true
      const pos = ev.clientX - innerWidth / 2
      const index = this.checkIndex(this.subTitlePositions, pos)
      fb.writeTextIndex('subTitle', index, index)
    },
    checkIndex(array, num) {
      let index = 0
      array.forEach((val, i) => {
        if (val < num) index = i
      })
      return index
    }
  },
  mounted() {
    this.titlePositions = this.$refs.title.map(
      el => el.offsetLeft - innerWidth / 2
    )
    this.subTitlePositions = this.$refs.subTitle.map(
      el => el.offsetLeft - innerWidth / 2
    )
    const FPS = 20
    let startTime = performance.now()
    const timeKeeper = (x, y) => {
      // 1s以内だったらスキップ
      if (performance.now() - startTime < 1000 / FPS) {
        return
      }
      startTime = performance.now()
      fb.writeCursorPos(this.userId, this.name, x, y)
    }
    fb.listenCursorPos(val => {
      this.users = val
    })
    fb.listenHover(val => {
      this.isKayacHover = val.kayac ? val.kayac.isHover : false
    })
    fb.listenTextIndex(val => {
      this.selectedTitleStart = val.title ? val.title.startIndex : -1
      this.selectedTitleEnd = val.title ? val.title.endIndex : -1
      this.selectedSubTitleStart = val.subTitle ? val.subTitle.startIndex : -1
      this.selectedSubTitleEnd = val.subTitle ? val.subTitle.endIndex : -1
    })
    window.addEventListener('mousemove', ev => {
      requestAnimationFrame(() =>
        timeKeeper(ev.clientX - innerWidth / 2, ev.clientY - innerHeight / 2)
      )
      if (this.isTitleDragging) {
        const pos = ev.clientX - innerWidth / 2
        const index = this.checkIndex(this.titlePositions, pos)
        fb.writeTextIndex('title', this.selectedTitleStart, index)
      }
      if (this.isSubTitleDragging) {
        const pos = ev.clientX - innerWidth / 2
        const index = this.checkIndex(this.subTitlePositions, pos)
        fb.writeTextIndex('subTitle', this.selectedSubTitleStart, index)
      }
    })
    window.addEventListener('mousedown', ev => {
      if (!this.isTitleDragging) {
        fb.writeTextIndex('title', -1, -1)
      }
      if (!this.isSubTitleDragging) {
        fb.writeTextIndex('subTitle', -1, -1)
      }
    })
    window.addEventListener('mouseup', ev => {
      this.isTitleDragging = this.isSubTitleDragging = false
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
  margin-bottom: 10px;
  user-select: none;
  cursor: text;
}
.selected {
  background: #4393fc;
  color: #fff;
  padding: 16px 0;
}

.subtitle {
  font-weight: 300;
  font-size: 24px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
  user-select: none;
  cursor: text;
}

.logo {
  margin-top: 20px;
  cursor: pointer;
}

.name {
  position: fixed;
  top: 20px;
  left: 20px;
  text-align: left;
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
  pointer-events: none;
}
.cursor__name {
  border: 1px solid blue;
  padding: 0px 2px;
  position: absolute;
  left: 16px;
  bottom: -6px;
  font-size: 10px;
  font-weight: bold;
  background: rgba(#fff, 0.6);
}

.furueru {
  animation: furueru infinite alternate ease-in-out 0.05s;
}

@keyframes furueru {
  0% {
    transform: rotate(-3deg);
  }
  100% {
    transform: rotate(3deg);
  }
}
</style>
