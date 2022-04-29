<template>
  <div class="container">
    <header>
      <!-- <button>Create</button> -->
      <!-- <button>Select</button>
      
      <button>Skil</button>
      <button>Delete</button> -->

      <button @click="onAttack">a</button>
      <button v-b-modal.modal-1>b</button>
      <button @click="onDelete">c</button>
      <button @click="onTurn">Turn</button>
    </header>
    <okok-modal @CreatePlayer="CreatePlayer"></okok-modal>
    <div class="playerc">
      <div class="character">
        <li v-for="(item, key) in players" :key="key">
          <charactercard-component
            ref="items"
            v-model="players"
            :type="'player'"
            :index="key"
            :playerobj="item"
            @SelectCard="SelectCard"
          ></charactercard-component>
          <!-- <button @click="deleted(key)">remove</button> -->
        </li>
      </div>
    </div>
    <div class="enemyc">
      <div class="character">
        <!-- <charactercard-component
          ref="test"
          :playerobj="[{ name: 'e', hp: 3, atk: 7, def: 2 }]"
          @SelectCard="SelectCard"
        ></charactercard-component> -->
      </div>
    </div>
    <footer>
      hello world
      <attack-modal
        ref="attackmodals"
        :playerobj="targetdataP"
        :index="targetindex"
        :targetobj="defencedataP"
        :targetindex="defenceindex"
        :main="this"
      ></attack-modal>
    </footer>
  </div>
</template>

<script>
import msm from "../assets/common/mainStatusManager";
let stage_stemina = 0;
let StatusManager = "";

export default {
  created() {
    // this.$http.post("/api/regist").then((response) => {
    //   console.log(response.data);
    // });
    // console.log(msm.atk_status);
    // msm.method("안녕");
    // console.log(msm.atk_status);
    StatusManager = new msm.status(this);
    // StatusManager.sayHi();
    this.CreatePlayer(1);

    this.CreatePlayer(2);
  },

  data() {
    return {
      players: [],
      targetdataP: [],
      targetindex: 0,
      defencedataP: [],
      defenceindex: 0,
    };
  },
  methods: {
    onAttack() {
      StatusManager.onAttack();
    },
    onDelete() {
      alert("삭제할 대상을 선택해주세용.");
      StatusManager.onDeleted();
      // status = "del";
      // alert("삭제할 대상을 선택하세요.");
    },
    onTurn() {
      let temp_stemina = 0;
      let _index = [];
      this.players.forEach((element) => {
        // console.log(element);
        element.forEach((element) => {
          // console.log(element.stemina);
          temp_stemina += parseInt(element.stemina);
        });
      });
      stage_stemina = temp_stemina;

      for (let i = 0; i < this.players.length; i++) {
        this.$refs.items[i].turnCp(stage_stemina);
        let _isturn = this.$refs.items[i].getCurrentTurn();

        if (_isturn) _index.push(i);
      }
      if (_index.length > 0) {
        let _currentidx = Math.floor(Math.random() * _index.length);
        console.log("index:" + _index[_currentidx]);
        alert(
          this.$refs.items[_index[_currentidx]].myTurn() + "님 차례입니다."
        );
        for (let i = 0; i < this.players.length; i++) {
          if (i == _index) continue;
          this.$refs.items[i].setSetCurrentStemina();
        }
      } else {
        this.onTurn();
      }

      // console.log(stage_stemina);
    },
    onShowAttackModal() {
      this.$refs.attackmodals.showModal();
    },
    SelectCard(value, idx) {
      StatusManager.SelectStatus(value, idx);
    },
    CreatePlayer(value) {
      this.$http
        .post("/api/users/search", { pid: value })
        .then((res) => {
          this.players.push(res.data);
          // console.log(res.data);
        })
        .catch(function (error) {
          console.log("서치에러" + error);
        });
      // this.players.push([{ name: "테스트", hp: 12, atk: 5, def: 3 }]);
      // console.log(this.players);
    },
    GetidxPlayer(idx) {
      return this.$refs.items[idx].getThisCard();
    },
    deleted(index) {
      this.players.splice(index, 1);
      for (let i = 0; i < this.players.length; i++) {
        this.$refs.items[i].setCp(this.players[i]);
      }
    },
  },
};
</script>

<style scoped>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}
.container {
  width: 100% !important;
  max-width: 100% !important;
  padding: 0 1px !important;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
header {
  width: 100%;
  height: 80px;
  background-color: #0e185f;
  color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
header button {
  width: 80px;
  height: 70px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background-color: #2fa4ff;
  list-style: none;
}
footer {
  flex: 1;
  width: 100%;
  background-color: #e8ffc2;
}
.character {
  min-height: 450px;
  width: 100%;
  /* background: black; */
  overflow: scroll;
  display: flex;
}
li {
  list-style: none;
}
</style>