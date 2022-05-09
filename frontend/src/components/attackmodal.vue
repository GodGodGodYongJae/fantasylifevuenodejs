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
      </div>
      <div
        v-else-if="displaynum == displayenum.state.result"
        class="attackResultPage"
      >
        <div v-if="isattack == false" class="result_faild">
          <p style="font-size: 2em">공격에 실패하였습니다.</p>
          <font-awesome-icon class="pattenicons" icon="fa-solid fa-star" />
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
          <div class="resultMsgHUD">
            <p v-for="item in msglist">
              {{ item.msg }}
            </p>
          </div>
        </div>
        <div v-else-if="isattack == true" class="result_true">
          <p class="pattenicons">
            <font-awesome-icon
              v-for="item in currentStar"
              icon="fa-solid fa-star"
            />
            <font-awesome-icon
              style="color: black !important"
              v-for="item in selectPatten.patten_ea - currentStar"
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
          <div class="resultMsgHUD">
            <div class="resultMsg" v-for="item in msglist">
              {{ item.msg }}
            </div>
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
      pattenList: [], // 공격 패턴리스트
      selectPatten: [], // 선택한 공격 패턴
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
      displaynum: 0, // 화면 상태 플레그
      selectedParts: 0, // 선택한 부위.
      playerobj: [],
      isRange: false, // 범위 공격이냐
      attackAppoint: 0, // 공격 확률
      currentStar: 0, // 별 갯수
      isattack: false, // 공격에 성공했나?
      Damage: 0, // 화면에 보여줄 데미지
      msglist: [],
    };
  },
  props: {
    index: 0,
    targetindex: 0,
    main: [],
  },
  created() {
    BattleManager = new bdm.attackPatten(this);

    // BattleManager.runPatten();
  }, // 컴포넌트가 생성되면 실행
  methods: {
    init() {
      this.playerobj = this.main.GetidxPlayer(this.index);
      this.pattenList = this.playerobj.Weapon_PattenList;
      // console.log("attack modal patten: ", this.pattenList);
      this.displaynum = this.displayenum.state.start;
      this.msglist = [];
      this.selectPatten = [];
      this.selectedParts = 0;
      this.attackAppoint = 0;
    },
    showModal() {
      this.init();
      let w_type = this.playerobj.Weapon_type;
      switch (w_type) {
        case "ad":
          this.displaynum = this.displayenum.state.selector;
          break;
        case "rd":
          if (this.playerobj.isBullet)
            this.displaynum = this.displayenum.state.selector;
          else this.displaynum = this.displayenum.state.rdSelector;
          break;
        case "md":
          this.displaynum = this.displaynum.state.magicSelector;
          break;
        default:
          break;
      }
      this.$refs["attackModal"].show();
    },
    ReShow() {
      this.$refs.attackModal.show();
    },
    onSelect(val) {
      //선택한 페턴 저장
      this.selectPatten = this.pattenList[val];
      if (this.selectPatten.patten_range == 1) {
        this.displaynum = this.displayenum.state.appointselect;
        this.isRange = false;
      } else {
        this.selectedParts = 99;
        this.displaynum = this.displayenum.state.appointPercent;
        this.getRangePlayer(this.selectPatten.patten_range);
        this.isRange = true;
      }
    },
    //불렛 장전.
    onBulletReload() {
      this.playerobj.isBullet = true;
      this.$refs.attackModal.hide();
      this.main.onTurn();
    },
    onAppointSelect(val) {
      this.displaynum = this.displayenum.state.appointPercent;
      if (val == 1) this.attackAppoint = -30;
      else if (val == 3) this.selectedParts = 99;
    },
    getRangePlayer(val) {
      this.main.onRangeAttack(val);
      this.$refs.attackModal.hide();
    },

    randPartSelect() {
      let rand = Math.floor(Math.random() * 5) + 1;
      this.selectedParts = rand;
    },
    onResultPage() {
      this.displaynum = this.displayenum.state.result;
      let appoint = 100 + parseInt(this.attackAppoint);
      let rand = Math.random() * 100;
      this.currentStar = Math.floor(
        Math.random() * parseInt(this.selectPatten.patten_ea) + 1
      );
      //부위 랜덤 선택시. 실행
      if (this.selectedParts == 99) this.randPartSelect();

      this.isattack = appoint >= rand ? true : false;
      if (this.isRange) {
        this.isattack = false;
        let appointList = [];
        //범위 선택된 만큼, 확률을 돌아주면서 하나라도 공격 성공시, isattack 을
        // true로 만들어주고 appointList에 결과값(ture or false )를 저장해줌
        this.main.rangetargedata.forEach((element) => {
          let ap = 100 + parseInt(this.attackAppoint);
          let rd = Math.random() * 100;
          if (ap >= rand) {
            appointList.push(true);
            this.isattack = true;
          } else appointList.push(false);
        });
      }

      if (this.isattack) BattleManager.runPatten(this.selectPatten);
      else BattleManager.runFaild(this.selectPatten);
    },
    addMsg(arg) {
      this.msglist.push({ msg: arg });
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
.resultMsgHUD {
  display: flex;
  flex-direction: column;
  height: 200px;
  background-color: blanchedalmond;
  overflow: scroll;
}
</style>