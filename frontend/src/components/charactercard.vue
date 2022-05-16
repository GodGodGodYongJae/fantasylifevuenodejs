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
    <div class="currentHUD">
      <b-progress :max="maxmp" height="2rem">
        <b-progress-bar
          style="background-color: lightskyblue !important"
          :value="currentMP"
        >
          <span
            >MP: <strong>{{ currentMP.toFixed(2) }} / {{ maxmp }}</strong></span
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
      this.pid = element.pid;
      this.currentMP = element.mp;
      this.maxmp = element.mp;
    });
    this.searchRunic();
    this.searchWeapon();
    this.searchEquipment();
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
      pid: 0,
      arr: this.playerobj,
      currentStemina: 0,
      currentTurn: 0,
      maxhp: 0,
      maxst: 0,
      maxmp: 0,
      currentHP: 0,
      currentMP: 0,
      display_name: "",
      display_img: "",
      isTurn: false,
      isBullet: false,
      Weapon: [],
      Weapon_type: "",
      Weapon_PattenList: [],
      Equipment: [],
      Runic: [],
      selectRunic: [],
    };
  },
  methods: {
    showTitle() {
      this.$emit("SelectCard", this.arr, this.index);
    },
    setCp(obj) {
      this.arr = obj;
      console.log(this.arr);
      this.arr.forEach((element) => {
        this.pid = element.pid;
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
    setTurnCurrentStemina() {
      this.playerobj.forEach((element) => {
        this.currentStemina += Math.floor(parseInt(element.vit) * 0.5);
        if (this.currentStemina > parseInt(element.stemina)) {
          this.currentStemina = parseInt(element.stemina);
        }
      });
    },
    setTurnCurrentMP() {
      this.playerobj.forEach((element) => {
        this.currentMP += Math.floor(parseInt(element.vit) * 0.5);
        if (this.currentMP > parseInt(element.mp)) {
          this.currentMP = parseInt(element.mp);
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
    searchWeapon() {
      this.$http
        .post("/api/weapon/search", {
          pid: this.pid,
        })
        .then((res) => {
          this.Weapon = res.data;
          this.Weapon_type = this.Weapon[0].weapon_type; // 타입을 정해준다. attackmodal에서 타입에따라, 보여지는 화면이 달라지기에
          this.searchWeaponPattenList();
        });
    },
    searchRunic() {
      this.$http
        .post("/api/magical/runicsearch", {
          pid: this.pid,
        })
        .then((res) => {
          if (res.data[0] == undefined) return;
          let _arr = res.data;
          _arr.forEach((element) => {
            this.Runic.push(element.userunic_rid.split(","));
          });
        });
    },
    searchWeaponPattenList() {
      let _arr = [];
      let _arr2 = [];
      this.Weapon_PattenList = [];
      console.log("search_Weapon Start... ");
      this.Weapon.forEach((element) => {
        _arr.push(element.weapon_pattenlist.split(","));
      });
      for (let index = 0; index < _arr[0].length; index++) {
        _arr2.push(_arr[0][index]);
      }
      this.$http
        .post("/api/weapon/searchPatten", {
          arr: _arr2,
        })
        .then((res) => {
          this.Weapon_PattenList = res.data;
          // console.log("Patten", this.Weapon_PattenList);
        })
        .catch(function (error) {
          // console.log("PattenSerach : " + error);
        });
    },
    searchEquipment() {
      this.$http
        .post("/api/equipment/search", {
          pid: this.pid,
        })
        .then((res) => {
          this.Equipment = res.data;
          // console.log("Equipment : ", this.Equipment);
        })
        .catch(function (error) {
          // console.log("Equipment Search : " + error);
        });
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