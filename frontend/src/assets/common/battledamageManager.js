class attackPatten {
  constructor(here) {
    this.here = here;
    this.pattenlist = [
      this.daggerattack1,
      this.daggerattack2
    ];
  }

  runPatten(idx) {
    console.log("runp");
    console.log(idx);
    console.log(this.pattenlist[idx]());
  }

  daggerattack1() {
    console.log("dagger ATK1");
    return 1;
  }
  daggerattack2() {
    console.log("dagger ATK2");
    return 2;
  }
}

const bdm = { attackPatten }
export default bdm