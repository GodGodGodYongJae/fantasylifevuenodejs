<template>
  <div>
    <!-- <button @click="showModal">b</button> -->
    <b-modal
      ref="attackModal"
      id="attack_modal"
      :title="`안녕` + displaynum"
      @cancel="init()"
      @ok="init()"
    >
      <div class="typelist" v-if="displaynum == displayenum.state.selector">
        <!-- <p>현재 Stemina : {{ chara }}</p> -->
        <button
          type="button"
          v-for="(item, key) in pattenList"
          :key="key"
          @click="onSelect(key)"
        >
          <p class="pattenicons">
            <font-awesome-icon
              v-for="icon in item.patten_ea"
              icon="fa-solid fa-star"
            />
          </p>
          {{ item.patten_name }}
          <p>cost : {{ parseInt(item.patten_stemina * main.turn) }}</p>
          <p>{{ item.patten_description }}</p>
        </button>
      </div>
      <div
        class="bulletReload"
        v-else-if="displaynum == displayenum.state.rdSelector"
      >
        <button type="button" @click="onBulletReload()">Reload.</button>
      </div>
      <div
        class="attackappointedlist"
        v-else-if="displaynum == displayenum.state.appointselect"
      >
        <button @click="onAppointSelect(1)">부위지정</button>
        <button @click="onAppointSelect(2)">강제지정</button>
        <button @click="onAppointSelect(3)">랜덤지정</button>
      </div>
      <div
        class="percentagelist"
        v-else-if="displaynum == displayenum.state.appointPercent"
      >
        <div class="percentage_circle">
          전체 퍼센트 : {{ 100 + parseInt(attackAppoint) }} %
        </div>
        가산 %
        <label style="display: flex">
          <input type="number" placeholder="가산%" v-model="attackAppoint" />
          %
        </label>

        <select v-if="selectedParts != 99" v-model="selectedParts">
          <option value="1">머리</option>
          <option value="2">어깨</option>
          <option value="3">흉부</option>
          <option value="4">허리</option>
          <option value="5">다리</option>
        </select>
        <button @click="onResultPage()">완료</button>
        <button @click="searchRangeEquipment()">테스트</button>
      </div>
      <div
        v-else-if="displaynum == displayenum.state.result"
        class="attackResultPage"
      >
        <div v-if="isattack == false" class="result_faild">
          <p style="font-size: 2em">공격에 실패하였습니다.</p>
        </div>
        <div v-else-if="isattack == true" class="result_true">
          <p class="pattenicons">
            <font-awesome-icon
              v-for="item in currentAppoint"
              icon="fa-solid fa-star"
            />
            <font-awesome-icon
              style="color: black !important"
              v-for="item in selectPatten.patten_ea - currentAppoint"
              icon="fa-solid fa-star"
            />
          </p>
          <div class="partHUD">
            타격 부위 :
            <p v-if="selectedParts == 1">머리</p>
            <p v-else-if="selectedParts == 2">어깨</p>
            <p v-else-if="selectedParts == 3">흉부</p>
            <p v-else-if="selectedParts == 4">허리</p>
            <p v-else-if="selectedParts == 5">다리</p>
            <p v-else>{{ selectedParts }}</p>
          </div>
          <div class="damageHUD">
            <p>총 데미지 : {{ Damage }}</p>
          </div>
        </div>
      </div>
      <p class="my-4">Create Charater</p>
    </b-modal>
  </div>
</template>
<script>
import bdm from "../assets/common/battledamageManager";
let BattleManager = "";
export default {
  name: "attack-modal", //컴포넌트 이름
  components: {}, //다른 컴포넌트 사용시 import하고, 배열로 저장
  data() {
    // html과 자바스크립트 코드에서 사용할 데이터 변수 선언
    return {
      pid: 0,
      weaponObj: [],
      pattenList: [],
      selectPatten: [],
      displayenum: {
        state: {
          start: 0,
          selector: 1,
          rdSelector: 2,
          magicSelector: 3,
          appointselect: 4,
          appointPercent: 5,
          result: 6,
        },
      },
      displaynum: 1,
      attackAppoint: 0,
      selectedParts: 0,
      isattack: false,
      currentAppoint: 0,
      Damage: 0,
      targetEquipment: [],
      targetsEquipment: [],
    };
  },
  props: {
    index: 0,
    targetindex: 0,
    playerobj: [],
    targetobj: [],
    main: [],
  },
  created() {
    BattleManager = new bdm.attackPatten(this);
    // BattleManager.runPatten();
  }, // 컴포넌트가 생성되면 실행
  methods: {
    ReShow() {
      this.$refs.attackModal.show();
    },
    getPlayerindex() {
      //console.log(this.index);
      return this.index;
      // return this.index;
    },
    onBulletReload() {
      BattleManager.setBullet(true);
      console.log(this);
      this.$refs.attackModal.hide();
      this.main.onTurn();
    },
    onSelect(val) {
      this.selectPatten = this.pattenList[val];
      if (this.selectPatten.patten_range == 1)
        this.displaynum = this.displayenum.state.appointselect;
      else {
        this.selectedParts = 99;
        this.displaynum = this.displayenum.state.appointPercent;
        this.getRangePlayer(this.selectPatten.patten_range);
      }
    },
    getRangePlayer(val) {
      this.main.onRangeAttack(val);
      this.$refs.attackModal.hide();
    },
    onAppointSelect(val) {
      this.displaynum = this.displayenum.state.appointPercent;
      if (val == 1) this.attackAppoint = -30;
      else if (val == 3) this.selectedParts = 99;
    },
    randPartSelect() {
      let rand = Math.floor(Math.random() * 5) + 1;
      this.selectedParts = rand;
    },
    async onResultPage() {
      this.displaynum = this.displayenum.state.result;
      let appoint = 100 + parseInt(this.attackAppoint);
      let rand = Math.random() * 100;
      this.currentAppoint = Math.floor(
        Math.random() * parseInt(this.selectPatten.patten_ea) + 1
      );

      if (this.selectedParts == 99) this.randPartSelect();
      await this.searchEquipment();

      if (appoint >= rand) {
        this.isattack = true;
        BattleManager.runPatten(this.selectPatten);
      } else {
        this.isattack = false;
        BattleManager.runFaild(this.selectPatten);
      }
      console.log(rand);
      console.log(this.currentAppoint);
    },
    init() {
      this.displaynum = 0;
      this.attackAppoint = 0;
      this.selectPatten = [];
      this.selectedParts = 0;
    },
    showModal() {
      this.init();
      this.playerobj.forEach((element) => {
        this.pid = element.pid;
      });
      this.$http
        .post("/api/weapon/search", {
          pid: this.pid,
        })
        .then((res) => {
          this.weaponObj = res.data;
          if (this.weaponObj[0].weapon_type == "ad")
            this.displaynum = this.displayenum.state.selector;
          else if (this.weaponObj[0].weapon_type == "rd")
            if (BattleManager.getBullet())
              this.displaynum = this.displayenum.state.selector;
            else this.displaynum = this.displayenum.state.rdSelector;
          else if (this.weaponObj[0].weapon_type == "md")
            this.displaynum = this.displayenum.state.magicSelector;
          this.searchWeapons();
        })
        .catch(function (error) {
          console.log("Weapon Search Error" + error);
        });

      this.$refs["attackModal"].show();
    },
    searchWeapons() {
      let arr = [];
      let arr2 = [];
      this.pattenList = [];
      console.log("searchWeapon Start .. ");
      this.weaponObj.forEach((element) => {
        arr.push(element.weapon_pattenlist.split(","));
      });

      for (let index = 0; index < arr[0].length; index++) {
        arr2.push(arr[0][index]);
      }

      this.$http
        .post("/api/weapon/searchPatten", {
          arr: arr2,
        })
        .then((res) => {
          this.pattenList = res.data;
        })
        .catch(function (error) {
          console.log("Serach Patten error :" + error);
        });
    },
    async searchEquipment() {
      // targetEquipment

      var response = await this.$http
        .post("/api/equipment/search", {
          pid: this.targetobj[0].pid,
          part: parseInt(this.selectedParts),
        })
        .then((res) => {
          this.targetEquipment = res.data[0];
          if (this.targetEquipment == undefined) {
            this.targetEquipment = { def: 0 };
          }
        })
        .catch(function (error) {
          console.log("Equipment Search Error" + error);
        });
    },
    searchRangeEquipment() {
      let arr = this.main.rangetargedata;
      let arr2 = [];
      let arr3 = [];
      console.log("searchRange Equipement Start .. ");

      for (let index = 0; index < arr.length; index++) {
        arr2.push(arr[index][0]);
      }
      arr2.forEach((element) => {
        //부위 까지 랜덤.. 힘들다!
        let rand = Math.floor(Math.random() * 5 + 1);
        arr3.push([element.pid, rand]);
      });
      console.log(arr3);
      this.$http
        .post("/api/equipment/searchRange", {
          pid: arr3,
        })
        .then((res) => {
          //여기 2022-05-02 일단 데이터를 안줌. 해야댐
          console.log(res.data);
        })
        .catch(function (error) {
          console.log("Equipment Search Error" + error);
        });
      // var response = await this.$http
      //   .post("/api/equipment/searchRange", {
      //     pid: this.targetobj[0].pid,
      //     part: parseInt(this.selectedParts),
      //   })
      //   .then((res) => {
      //     this.targetEquipment = res.data[0];
      //     if (this.targetEquipment == undefined) {
      //       this.targetEquipment = { def: 0 };
      //     }
      //   })
      //   .catch(function (error) {
      //     console.log("Equipment Search Error" + error);
      //   });
    },
  }, // 컴포넌트 내에서 사용할 메소드 정의
};
</script>
<style scoped>
.typelist {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;
}
.attackappointedlist {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;
}
.pattenicons {
  font-size: 20px;
  color: lightskyblue;
  margin-bottom: 0px !important;
}
.partHUD {
  display: flex;
}
.percentagelist {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.percentage_circle {
  width: 200px;
  height: 200px;
  border-radius: 100px;
  background-color: lightcoral;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  font-weight: bold;
}
</style>