class attackPatten {
  constructor(here) {
    this.here = here;
    this.pattenlist = [
      this.daggerattack1,
      this.daggerattack2
    ];
    this.cardidx = 0;
    this.costST = 0;
    this.selectParts = 0;
    this.PattenEA = 0;
  }

  runPatten(patten) {
    let Pid = patten.patten_id;
    this.costST = patten.patten_stemina;
    this.PattenEA = parseInt(patten.patten_ea);
    this.cardidx = this.here.getPlayerindex();
    this.selectParts = parseInt(this.here.selectedParts);
    this.pattenlist[Pid - 1](this);
  }

  getMainIdxP(idx) {
    return this.here.main.GetidxPlayer(idx);
  }

  getWeapon() {
    return this.here.weaponObj;
  }
  getAppointParts(parts) {
    const _parts = parts;
    switch (this.selectParts) {
      case 1:
        return _parts.head;
        break;
      case 2:
        return _parts.shoulders;
        break;
      case 3:
        return _parts.chest;
        break;
      case 4:
        return _parts.waist;
        break;
      case 5:
        return _parts.legs;
        break;
      default:
        return null;
        break;
    }
  }

  damageResult(dmg) {
    let appoint = this.here.currentAppoint;
    let sumDmg = dmg * ((appoint * 100 / this.PattenEA) / 100);
    return sumDmg;
  }
  daggerattack1(args) {
    let here = args.here;
    //Player.
    let Weapon = args.getWeapon()[0];
    let characterCard = args.getMainIdxP(args.cardidx);
    let characterStataus = characterCard.arr[0];
    //Target.
    let TargetCard = args.getMainIdxP(here.targetindex);
    let TargetStatus = TargetCard.arr[0];
    // 스테미나 차감.
    characterCard.currentStemina -= args.costST;
    // charater atk + weapon atk 만큼 target에게 데미지 주기.
    // 따로 함수화 하겠음.( 데미지 공식이 달라질 수 있으므로)
    let sumAtk = args.damageResult(parseInt(characterStataus.atk + Weapon.atk));
    const parts = JSON.parse(TargetStatus.ammor);
    let sumDef = parseInt(args.getAppointParts(parts));
    //데미지 계산
    if (sumAtk > sumDef)
      TargetCard.currentHP -= (sumAtk - sumDef);

    here.Damage = (sumAtk - sumDef);

  }

  daggerattack2() {
    console.log("dagger ATK2");
    return 2;
  }
}

const bdm = { attackPatten }
export default bdm