Vue.component("digit", {
  props: ['digitValue', 'pos'],
  computed: {
    itemsValue() {
      switch (+this.digitValue) {
        case 1: return {h: [0, 0, 0], v: [1, 1, 0, 0]};
        case 2: return {h: [1, 1, 1], v: [1, 0, 1, 0]};
        case 3: return {h: [1, 1, 1], v: [1, 1, 0, 0]};
        case 4: return {h: [0, 1, 0], v: [1, 1, 0, 1]};
        case 5: return {h: [1, 1, 1], v: [0, 1, 0, 1]};
        case 6: return {h: [1, 1, 1], v: [0, 1, 1, 1]};
        case 7: return {h: [1, 0, 0], v: [1, 1, 0, 0]};
        case 8: return {h: [1, 1, 1], v: [1, 1, 1, 1]};
        case 9: return {h: [1, 1, 1], v: [1, 1, 0, 1]};
        default: return {h: [1, 0, 1], v: [1, 1, 1, 1]};
      }
    }
  },
  template: `<div class='digit'>
      <template v-for='val in itemsValue.h'>
        <transition name='hide-horizontal'>
          <div v-show='val' class='digit-item-h'></div>
        </transition>
      </template>
      <template v-for='val in itemsValue.v'>
        <transition name='hide-vertical'>
          <div v-show='val' class='digit-item-v'></div>
        </transition>
      </template>
      <div class='dot' v-if='pos==1||pos==3' />
    </div>`,
});

Vue.component("circle-component", {
  props: ['time', 'count'],
  data: () => ({
    diallines: [],
    itemsInSec: 0,

    randomHighlight:new Set(),
  }),
  mounted() {
    this.itemsInSec = this.count / 60;
    for (let i = 0; i < this.count; i++) {
      this.diallines.push(i);
    }
    this.setRandomHighlight();
  },
  watch:{
    time(val,oldVal){
      if(val[1] != oldVal[1]) this.setRandomHighlight();
    }
  },
  methods: {
    isCurrSecond(val) {
      let currItem = this.time[2] * this.itemsInSec + Math.floor(this.time[3] * this.itemsInSec / 1000);
      return val == currItem ? 2 : 1;
    },
    isCurrMinute(val) {
      return val == this.time[1] * this.itemsInSec;
    },
    isCurrHour(val) {
      let hours = this.time[0] >= 12 ? this.time[0] - 12 : this.time[0];
      return val == hours * (this.count / 12) + Math.round(this.time[1]*(this.count/720));
    },
    setRandomHighlight(){
      this.randomHighlight.clear();
      for (var i = 0; i < this.getRandom(this.count-50,this.count); i++) {
        this.randomHighlight.add(this.getRandom(0,this.count));
      }
    },
    inRandomHighlight(val){
      return this.randomHighlight.has(val) || this.isCurrHour(val) || this.isCurrMinute(val);
    },
    getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
  },
  template: `<div class = 'circle'>
        <div v-for='d in diallines' class = 'dialline'
          :class='{"dialline-hours":d%(count/12)==0,"dialline-highlight-h":isCurrHour(d),"dialline-highlight-m":isCurrMinute(d),"dialline-highlight":inRandomHighlight(d)}'
          :style='{transform:"rotate(" + (360/count)*d + "deg) translateY(-254px) scale(" + isCurrSecond(d) + ")"}'/>
    </div>`,
});

new Vue({
  el: '#main-container',
  data: {
    numbers: [],
    time: [],
    count: 120,
  },
  mounted() {;
    setInterval(() => {
      let date = new Date();
      this.setCircleTime(date);
      this.setNumbers(date);
    }, 60000 / this.count);
  },
  methods: {
    setCircleTime(date){
      let ms = date.getMilliseconds();
      this.time = this.getTime(date);
      this.time.push(ms);
    },
    setNumbers(date){
      this.numbers = this.getDigitValues(date);
    },
    getTime(date) {
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      return [h, m, s];
    },
    getDigitValues(date) {
      let result = [];
      this.addZero(this.getTime(date), result);
      return result;
    },
    addZero(val, res) {
      for (let i = 0; i < val.length; i++) {
        if (val[i] / 10 < 1) {
          res.push(0, val[i]);
        } else res.push(Math.floor(val[i] / 10), val[i] % 10);
      }
    },
  }
});
