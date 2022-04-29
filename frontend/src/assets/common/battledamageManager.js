class attackPatten {
  constructor(here) {
    this.here = here;
    this.pattenlist = [
      this.daggerattack1,
      this.daggerattack2
    ];
    this.cardidx = 0;
    this.costST = 0;
  }

  runPatten(patten) {
    let Pid = patten.patten_id;
    this.costST = patten.patten_stemina;
    console.log("runp");
    this.cardidx = this.here.getPlayerindex();
    // console.log(this.cardidx);
    this.pattenlist[Pid - 1](this);
  }

  getMainIdxP(idx) {
    return this.here.main.GetidxPlayer(idx);
  }

  getCostST() {
    return this.costST;
  }
  getWeapon() {
    return this.here.weaponObj;
  }

  // 중요 배열로 저장되었기 때문에 this here 등, 동기화가 안되어있음 할려면 here을 this로 넘기고
  // here의 함수를 불러와야 함. here에서 곧바로 main으로 접근시 언디파인드가 나옴 .
  daggerattack1(heres) {
    console.log(heres.here.getPlayerindex());
    let idx = heres.cardidx;
    let Weapon = heres.getWeapon()[0];
    this.characterCard = heres.getMainIdxP(idx);
    this.characterCard.currentStemina -= heres.getCostST();
    console.log(Weapon.atk);
    // console.log(this.hM.test2());
  }

  daggerattack2() {
    console.log("dagger ATK2");
    return 2;
  }
}

const bdm = { attackPatten }
export default bdm