<template>
  <div>
    <b-modal ref="magicModal" title="Runic Arcane">
      <div class="start" v-if="displaynum == displayenum.start">
        <h1>NOT FOUND YOUR RUNIC</h1>
      </div>
      <div class="select" v-else-if="displaynum == displayenum.select">
        <button
          type="button"
          v-for="(item, key) in runicRand"
          :key="key"
          @click="OnselectRunic(key)"
        >
          <p>{{ item.runic_name }}</p>
          cost : {{ item.runic_cost + research * 2 }}
        </button>
      </div>
      <div class="patten" v-else-if="displaynum == displayenum.patten">
        <button type="button" v-for="(item, key) in MagicPatten" :key="key">
          {{ item.ap_name }}
          <p class="pattenicons">
            <font-awesome-icon
              v-for="icon in item.ap_stella"
              icon="fa-solid fa-star"
            />
          </p>

          <p>
            {{ item.ap_description }}
          </p>
        </button>
      </div>
      <!-- 푸터영역 -->
      <div
        v-if="displaynum == displayenum.select"
        slot="modal-footer"
        class="foot"
      >
        <b-btn variant="primary" @click="randRunicRand(1)">ReMind</b-btn>
        <b-btn variant="success " @click="OncombineRunic()">OK</b-btn>
      </div>
    </b-modal>
  </div>
</template>
<script>
import mdm from "../assets/common/magicdamageManager";
let MagicManager = "";
export default {
  name: "magic-modal", //컴포넌트 이름
  components: {}, //다른 컴포넌트 사용시 import하고, 배열로 저장
  data() {
    // html과 자바스크립트 코드에서 사용할 데이터 변수 선언
    return {
      charaterObj: "",
      runicData: "",
      runicRand: [],
      index: "",
      displayenum: {
        start: 0,
        select: 1,
        arcane: 2,
        patten: 3,
      },
      displaynum: 0,
      research: 0,
      resultArcane: [],
      resultArcanePatten: [],
      AracaneList: [],
      MagicPatten: [],
    };
  },
  props: {
    main: 0,
  },
  setup() {}, //컴포지션 API
  created() {
    MagicManager = new mdm.magicPatten(this);
  }, // 컴포넌트가 생성되면 실행
  mounted() {}, // template에 정의된 html 코드가 랜더링된 후 실행
  unmounted() {}, // ummount가 완료된 후 실행
  methods: {
    showModal() {
      this.research = 0;
      this.runicRand = [];
      this.displaynum = this.displayenum.start;
      this.runicDataLoad();
      this.$refs["magicModal"].show();
    },
    closeModal() {},

    runicDataLoad() {
      this.index = this.main.targetindex;
      this.charaterObj = this.main.GetidxPlayer(this.index);
      console.log(this.charaterObj.arr[0].pid);
      this.SearchArcane();
      // console.log(this.charaterObj);
      if (this.charaterObj.Runic.length == 0) return;
      this.$http
        .post("/api/magical/playerRunicSearch", {
          arr: this.charaterObj.Runic[0],
        })
        .then((res) => {
          this.runicData = res.data;
          this.randRunicRand(0);
        });
    },
    OnselectRunic(num) {
      if (MagicManager.useCurrentMP(num)) {
        alert("마나가 부족합니다.");
        return;
      }

      this.charaterObj.selectRunic.push(this.runicRand[num]);
      MagicManager.setCurrenMp(num);
      this.randRunicRand(1);
    },
    randRunicRand(search) {
      this.research += search;
      let len = this.runicData.length;
      this.runicRand = [];
      let _int = this.charaterObj.arr[0].int;
      let _randint = Math.floor(_int / 10 + 1) * 3;
      let _randlist = [];
      // console.log(_randint);
      for (let index = 0; index < _randint; index++) {
        let rand = Math.floor(Math.random() * len);
        // console.log(rand);
        _randlist.push(this.runicData[rand]);
      }
      _randlist = new Set(_randlist);
      _randlist.forEach((element) => {
        this.runicRand.push(element);
      });

      // console.log(this.runicRand);
      this.displaynum = this.displayenum.select;
    },
    //조합 관련 메서드
    OncombineRunic() {
      MagicManager.OncombineRunic();
    },
    SearchArcane() {
      this.$http
        .post("/api/magical/playerArcaneSearch", {
          arr: this.charaterObj.arr[0].pid,
        })
        .then((res) => {
          this.AracaneList = res.data;
        });
    },
    SearchArcanePatten(id, runic) {
      this.$http
        .post("/api/magical/SearchPatten", {
          aid: id,
          con: runic[1],
        })
        .then((res) => {
          this.MagicPatten = [];
          this.MagicPatten = res.data;
          MagicManager.PattenStrReplace(runic);
        });
    },
    SerachArcane2(active, controll, form, Temper) {
      this.displaynum = this.displayenum.arcane;
    },
  }, // 컴포넌트 내에서 사용할 메소드 정의
};
</script> 
<style scoped>
@import "https://fontlibrary.org//face/runic";

.select {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.select button p {
  font-family: "RunicSansPlainPlain" !important;
  font-weight: normal;
  font-style: normal;
}
.patten {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.patten button {
  width: 100%;
}

.pattenicons {
  font-size: 20px;
  color: lightskyblue;
  margin-bottom: 0px !important;
}
.foot {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>>

