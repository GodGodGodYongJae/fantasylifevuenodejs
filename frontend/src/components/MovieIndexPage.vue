<template>
  <div class="wrap">
    <h1>5월 마지막주 영화 예매 순위</h1>
    <ul class="movies">
      <li v-for="movie in movies" class="item">
        <span class="rank">{{ movie.id }}</span>
        <router-link :to="{ name: 'show', params: { id: movie.id } }">
          <img v-bind:src="movie.poster" class="poster" />
        </router-link>
        <div class="detail">
          <strong class="tit">{{ movie.name }}</strong>
          <span class="rate"
            >예매율 <span class="num">{{ movie.rate }}</span></span
          >
          <router-link
            :to="{ name: 'show', params: { id: movie.id } }"
            class="link"
            >자세히보기</router-link
          >
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  created() {
    // 컴포넌트가 생성될 때, /api/movies에 요청을 보냅니다.
    this.$http.get("/api/movies").then((response) => {
      this.movies = response.data;
    });
  },
  data() {
    return {
      movies: [],
      statusflag: { none: 0, atk: 1, del: 2 },
      attackflag: { atk: 0, def: 1, option: 2 },
      crtstatusflag: 0,
      crtattackflag: 0,
    };
  },
  methods: {
    SelectStatus() {
      if (this.crtstatusflag == this.statusflag.atk) this.attackFlagMethods();
      else if (this.crtstatusflag == this.statusflag.del)
        this.deleteFlagMethods();
      console.log(this.crtstatusflag);
    },
    attackFlagMethods() {
      if (this.crtattackflag == this.attackflag.atk)
        this.onMessage("공격자를 선택하세요.");
      else if (this.crtattackflag == this.attackflag.def)
        this.onMessage("방어자를 선택하세요.");
      else if (this.crtattackflag == this.attackflag.option) console.log("");
      else return (this.crtattackflag = 3);
      this.crtattackflag++;
      return this.crtattackflag;
    },
    deleteFlagMethods() {},
    onMessage(msg) {
      alert(msg);
    },
  },
};
</script>