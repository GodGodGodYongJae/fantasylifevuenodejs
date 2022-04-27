<template>
  <div>
    <button @click="showModal">b</button>
    <b-modal
      ref="attackModal"
      id="attack_modal"
      title="Attack "
      @cancel="init()"
    >
      <div class="typelist" v-if="displaynum == 0">
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
          <p>{{ item.patten_description }}</p>
        </button>
      </div>
      <div class="attackappointedlist" v-else-if="displaynum == 1">
        <button @click="onAppointSelect(1)">부위지정</button>
        <button @click="onAppointSelect(2)">강제지정</button>
        <button @click="onAppointSelect(3)">랜덤지정</button>
      </div>
      <div class="percentagelist" v-else-if="displaynum == 2">
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
      </div>
      <div v-else-if="displaynum == 3" class="attackResultPage">
        <div v-if="isattack == false" class="result_faild">
          <p style="font-size: 2em">공격에 실패하였습니다.</p>
        </div>
        <div v-else-if="isattack == true" class="result_true">
          <p class="pattenicons">
            <font-awesome-icon icon="fa-solid fa-star" />
          </p>
        </div>
      </div>
      <p class="my-4">Create Charater</p>
    </b-modal>
  </div>
</template>
<script>
export default {
  name: "attack-modal", //컴포넌트 이름
  components: {}, //다른 컴포넌트 사용시 import하고, 배열로 저장
  data() {
    // html과 자바스크립트 코드에서 사용할 데이터 변수 선언
    return {
      pid: 0,
      weaponObj: [],
      pattenList: [],
      selectPatten: 0,
      displaynum: 0,
      attackAppoint: 0,
      selectedParts: 0,
      isattack: false,
    };
  },
  props: {
    index: 0,
    playerobj: [],
  },
  created() {}, // 컴포넌트가 생성되면 실행
  methods: {
    onSelect(val) {
      this.displaynum = 1;
      console.log(this.index);
      // let filter_dscrition = this.pattenList[val].patten_description;
      // console.log(filter_dscrition.includes("'3성'"));
      // console.log("패턴선택" + val);
      // console.log(this.pattenList[val]);
    },
    onAppointSelect(val) {
      this.displaynum = 2;
      if (val == 1) this.attackAppoint = -30;
      else if (val == 3) this.selectedParts = 99;
    },
    onResultPage() {
      this.displaynum = 3;
      let appoint = 100 + parseInt(this.attackAppoint);
      let rand = Math.random() * 100;
      if (appoint >= rand) {
        this.isattack = true;
      } else {
        this.isattack = false;
      }
      console.log(rand);
    },
    init() {
      this.displaynum = 0;
      this.attackAppoint = 0;
      this.selectPatten = 0;
      this.selectedParts = 0;
    },
    showModal() {
      // console.log(this.playerobj);
      this.playerobj.forEach((element) => {
        this.pid = element.pid;
      });
      this.$http
        .post("/api/weapon/search", {
          pid: this.pid,
        })
        .then((res) => {
          this.weaponObj = res.data;
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
        // console.log(arr);
      });

      // console.log(parseInt(arr[0]));
      for (let index = 0; index < arr[0].length; index++) {
        arr2.push(arr[0][index]);
      }

      this.$http
        .post("/api/weapon/searchPatten", {
          arr: arr2,
        })
        .then((res) => {
          this.pattenList = res.data;
          console.log(this.pattenList);
        })
        .catch(function (error) {
          console.log("Serach Patten error :" + error);
        });
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