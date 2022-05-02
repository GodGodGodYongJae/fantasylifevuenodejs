class attackPatten {
  constructor(here) {
    this.here = here;
    this.pattenlist = [
      this.daggerattack1,
      this.daggerattack2,
      this.shotbowattack1,
      this.shotbowattack2,
      this.shotbowattack3
    ];
    this.costST = 0;
    this.selectParts = 0;
    this.PattenEA = 0;

    this.characterCard = '';
    this.characterStataus = '';
    this.TargetCard = '';
    this.TargetStatus = '';
    this.TargetAmmor = '';
    this.appointAmmor = 0;
  }
  getBullet() {
    let char = this.getMainIdxP(this.here.getPlayerindex());
    console.log(char);
    let isbullet = char.isBullet;
    console.log(isbullet);
    return isbullet;
  }
  setBullet(arg) {
    let char = this.getMainIdxP(this.here.getPlayerindex());
    char.isBullet = arg;
  }
  runFaild(patten) {
    this.costST = patten.patten_stemina * this.here.main.turn;
    this.characterCard = this.getMainIdxP(this.here.getPlayerindex());
    this.characterCard.currentStemina -= this.costST;
    this.setBullet(false);
    //카운터 무기가 있음 아래에 작성.
  }

  runPatten(patten) {
    //패턴 관련 동기화
    let Pid = patten.patten_id;
    this.costST = patten.patten_stemina * this.here.main.turn;
    this.PattenEA = parseInt(patten.patten_ea);
    // Player 캐릭터 카드 셋팅
    this.characterCard = this.getMainIdxP(this.here.getPlayerindex());
    this.characterStataus = this.characterCard.arr[0];
    // Target 캐릭터 카드 셋팅
    this.TargetCard = this.getMainIdxP(this.here.targetindex);
    this.TargetStatus = this.TargetCard.arr[0];
    this.TargetAmmor = JSON.parse(this.TargetStatus.ammor);
    this.appointAmmor = this.here.targetEquipment;
    console.log('appoint' + this.appointAmmor);
    this.selectParts = parseInt(this.here.selectedParts);
    //패턴 실행
    this.pattenlist[Pid - 1](this);
    this.here.main.turn += 1;
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
    //Weapon.
    let Weapon = args.getWeapon()[0];
    // 스테미나 차감.
    args.characterCard.currentStemina -= args.costST;
    // charater atk + weapon atk 만큼 target에게 데미지 주기.
    // 따로 함수화 하겠음.( 데미지 공식이 달라질 수 있으므로)
    let sumAtk = args.damageResult(parseInt(args.characterStataus.atk + Weapon.atk));
    let sumDef = parseInt(args.getAppointParts(args.TargetAmmor) + args.appointAmmor.def);
    //데미지 계산
    if (sumAtk > sumDef)
      args.TargetCard.currentHP -= (sumAtk - sumDef);
    here.Damage = (sumAtk - sumDef);

  }

  daggerattack2(args) {
    let here = args.here;
    let Weapon = args.getWeapon()[0];
    //ability - 3성 이상 떴을 때 st 소모 없이 한 번더 공격 가능 (st 소모 중첩 초기화). 
    console.log("cur" + here.currentAppoint)
    if (here.currentAppoint < 3) {
      args.characterCard.currentStemina -= args.costST;
    }
    //데미지 계산
    let sumAtk = args.damageResult(parseInt(args.characterStataus.atk + Weapon.atk));
    let sumDef = parseInt(args.getAppointParts(args.TargetAmmor) + args.appointAmmor.def);
    if (sumAtk > sumDef)
      args.TargetCard.currentHP -= (sumAtk - sumDef);
    here.Damage = (sumAtk - sumDef);

  }

  shotbowattack1(args) {
    let here = args.here;
    //Weapon.
    let Weapon = args.getWeapon()[0];
    // 스테미나 차감.
    args.characterCard.currentStemina -= args.costST;
    // charater atk + weapon atk 만큼 target에게 데미지 주기.
    // 따로 함수화 하겠음.( 데미지 공식이 달라질 수 있으므로)
    let sumAtk = args.damageResult(parseInt(args.characterStataus.atk + Weapon.atk));
    let sumDef = parseInt(args.getAppointParts(args.TargetAmmor) + args.appointAmmor.def);
    //데미지 계산
    if (sumAtk > sumDef)
      args.TargetCard.currentHP -= (sumAtk - sumDef);
    here.Damage = (sumAtk - sumDef);
    args.setBullet(false);
  }

  shotbowattack2(args) {
    let here = args.here;
    //Weapon.
    let Weapon = args.getWeapon()[0];
    args.characterCard.currentStemina -= args.costST;
    
  }

  shotbowattack3(args)
  {
    let here = args.here;
    let Weapon = args.getWeapon()[0];
    
    //데미지 계산
    let sumAtk = args.damageResult(parseInt(args.characterStataus.atk + Weapon.atk));
    let sumDef = parseInt(args.getAppointParts(args.TargetAmmor) + args.appointAmmor.def);
    if (sumAtk > sumDef)
      args.TargetCard.currentHP -= (sumAtk - sumDef);
    here.Damage = (sumAtk - sumDef);

     //ability - 3성 이상 떴을 때 장전 
     if (here.currentAppoint < 3) {
      grgs.setBullet(false);
    }
  }
}

const bdm = { attackPatten }
export default bdm