<template>
  <div @click="showTitle" class="container">
    <div class="mainHUD">
      <div class="images">
        <img
          :src="`https://s3flpostrecture.s3.ap-northeast-2.amazonaws.com/${display_img}`"
        />
      </div>
      <div class="name">
        <p>{{ display_name }}</p>
      </div>

      <!-- <li v-for="item in arr">
        <input type="text" placeholder="name" v-model="item.name" />
        <input type="number" placeholder="hp" v-model="item.hp" />
        <input type="number" placeholder="atk" v-model="item.atk" />
        <input type="number" placeholder="def" v-model="item.def" />
        <input type="number" placeholder="stemina" v-model="item.stemina" />
        <input
          type="number"
          placeholder="currentStemina"
          v-model="currentStemina"
        />
        <input type="number" v-model="currentTurn" />
        {{ item.name }}
      </li> -->
    </div>
    <div class="currentHUD">
      <b-progress :max="maxhp" height="2rem">
        <b-progress-bar
          style="background-color: red !important"
          :value="currentHP"
        >
          <span
            >HP: <strong>{{ currentHP.toFixed(2) }} / {{ maxhp }}</strong></span
          >
        </b-progress-bar>
      </b-progress>
      <b-progress :max="maxst" height="2rem">
        <b-progress-bar
          style="background-color: #ffd700 !important"
          :value="currentStemina"
        >
          <span
            >ST:
            <strong>{{ currentStemina.toFixed(2) }} / {{ maxst }}</strong></span
          >
        </b-progress-bar>
      </b-progress>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.playerobj.forEach((element) => {
      this.display_name = element.name;
      this.maxst = element.stemina;
      this.currentStemina = element.stemina;
      this.display_img = element.img;
      this.maxhp = element.hp;
      this.currentHP = element.hp;
    });
  },
  name: "charactercard-component",
  props: {
    atkpatten: Array,
    index: 0,
    type: "",
    playerobj: {
      tpye: Object,
      default: function () {
        return [
          {
            name: "",
            hp: Number,
            atk: Number,
            def: Number,
            stemina: Number,
            vit: Number,
          },
        ];
      },
    },
  },
  data() {
    return {
      value: 0,
      arr: this.playerobj,
      currentStemina: 0,
      currentTurn: 0,
      maxhp: 0,
      maxst: 0,
      currentHP: 0,
      display_name: "",
      display_img: "",
      isTurn: false,
    };
  },
  methods: {
    showTitle() {
      // console.log(this.arr);
      this.$emit("SelectCard", this.arr, this.index);
    },
    setCp(obj) {
      this.arr = obj;
      console.log(this.arr);
      this.arr.forEach((element) => {
        this.display_name = element.name;
        this.maxst = element.stemina;
        this.currentStemina = element.stemina;
        this.display_img = element.img;
        this.maxhp = element.hp;
        this.currentHP = element.hp;
      });
    },
    turnCp(max) {
      let _vit = 0;
      this.playerobj.forEach((element) => {
        _vit = element.vit;
      });
      if (this.currentTurn < max) this.currentTurn += parseInt(_vit);
      else this.isTurn = true;
    },
    getCurrentTurn() {
      return this.isTurn;
    },
    setSetCurrentStemina() {
      this.playerobj.forEach((element) => {
        this.currentStemina += Math.floor(parseInt(element.vit) * 0.5);
        if (this.currentStemina > parseInt(element.stemina)) {
          this.currentStemina = parseInt(element.stemina);
        }
      });
    },
    myTurn() {
      let _name = "";
      this.currentTurn = 0;
      this.isTurn = false;
      this.playerobj.forEach((element) => {
        console.log(element.name);
        _name = element.name;
      });
      return _name;
    },
    getThisCard() {
      return this;
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.container {
  width: 300px;
  height: 400px;
  display: flex;
  padding: 10px !important;
  align-items: center;
}

.mainHUD {
  width: 300px;
  height: 400px;
  background-size: cover;
  /* background-image: url("https://s3flpostrecture.s3.ap-northeast-2.amazonaws.com/charaterui.png "); */
  /* background-color: blanchedalmond; */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: space-around; */
}
.images {
  margin-top: 90px;
  width: 180px;
  height: 220px;
  background-color: rgba(0, 255, 255, 0.473);
  display: flex;
  flex-direction: column;
}
.images img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.name {
  margin-top: 35px;
}
.mainHUD p {
  font-size: 21px;
  font-weight: bold;
  color: white;
}
.currentHUD {
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: center;
}
.currentHUD .progress-bar {
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
}
input {
  font-family: auto;
  font-size: revert !important;
  line-height: auto !important;
}
</style>