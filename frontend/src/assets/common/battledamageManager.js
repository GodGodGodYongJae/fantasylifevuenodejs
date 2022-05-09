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
    this.costST = 0; // 소모되는 stemina turn 혹은, 패턴에 따라 추가 될 수 있으므로
    this.selectParts = 0; // 선택된 부위
    this.PattenEA = 0; // 선택한 패턴의 별 갯수

    this.characterObj = ''; // 캐릭터 카드
    this.characterStataus = ''; // 캐릭터 카드의 스텟
    this.characterWeapon = '';
    this.TargetObj = '';
    this.TargetStatus = '';
    this.TargetStatDef = '';
    this.TargetAmmorList = '';
    this.TargetAmmor = '';
    this.ManyTargets = [];
    this.msg = [];
  }

  runFaild(patten) {
    this.costST = patten.patten_stemina * this.here.main.turn;
    this.characterCard = this.getMainIdxP(this.here.index);
    this.characterCard.currentStemina -= this.costST;
    //카운터 무기가 있음 아래에 작성.
  }
  setBullet(args) {
    this.here.playerobj.isBullet = args;
  }

  runPatten(patten) {
    //패턴 관련 동기화
    let Pid = patten.patten_id;

    this.costST = patten.patten_stemina * this.here.main.turn;
    this.PattenEA = parseInt(patten.patten_ea);
    // Player 캐릭터 카드 셋팅
    this.characterObj = this.getMainIdxP(this.here.index);
    this.characterStataus = this.characterObj.arr[0];
    this.characterWeapon = this.characterObj.Weapon[0];
    // Target 캐릭터 카드 셋팅
    this.TargetObj = this.getMainIdxP(this.here.targetindex);
    this.TargetStatus = this.TargetObj.arr[0];
    this.TargetStatDef = JSON.parse(this.TargetStatus.ammor);
    this.TargetAmmorList = this.TargetObj.Equipment;
    this.TargetAmmor = 0;


    // this.appointAmmor = this.here.targetEquipment;
    this.selectParts = parseInt(this.here.selectedParts);
    this.msg = [];
    //패턴 실행
    this.pattenlist[Pid - 1](this);
    this.here.main.turn += 1;
    this.onMessage();
  }

  onMessage() {
    for (let m = 0; m < this.msg.length; m++) {
      this.here.addMsg(this.msg[m])
    }
  }
  getMainIdxP(idx) {
    return this.here.main.GetidxPlayer(idx);
  }
  getWeapon() {
    return this.here.main.playerobj.Weapon;
  }
  getManyTarget() {
    this.ManyTargets = this.here.main.rangetargedata;
  }
  getAppointParts(parts, selectP) {
    const _parts = parts;
    this.FindTargetEquipment(selectP);
    switch (selectP) {
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
  getAppointPartsString(selectP) {
    switch (selectP) {
      case 1:
        return "머리";
        break;
      case 2:
        return "어깨";
        break;
      case 3:
        return "흉부";
        break;
      case 4:
        return "허리";
        break;
      case 5:
        return "다리";
        break;
      default:
        return null;
        break;
    }
  }
  setCurrentPlayerStemina(val) {
    this.characterObj.currentStemina -= val;
  }
  FindTargetEquipment(type) {
    for (let index = 0; index < this.TargetAmmorList.length; index++) {
      if (this.TargetAmmorList[index].equipment_part == type) {
        this.TargetAmmor = this.TargetAmmorList[index];
      }
    }
  }

  damageResult(dmg) {
    let appoint = this.here.currentStar;
    let sumDmg = dmg * ((appoint * 100 / this.PattenEA) / 100);
    return sumDmg;
  }
  getAtkDmg() {
    return parseInt(this.characterStataus.atk + (this.characterWeapon.atk + this.characterWeapon.weapon_atk));
  }
  getTargetDef(part) {
    let sumDef = parseInt(this.getAppointParts(this.TargetStatDef, part));
    if (this.TargetAmmor != 0)
      sumDef += (this.TargetAmmor.equipment_def + this.TargetAmmor.def);
    return sumDef;
  }
  getManyTargetDef(part, Target) {
    this.TargetAmmor = [];
    this.TargetAmmorList = Target.Equipment;
    let TargetDefs = JSON.parse(Target.arr[0].ammor);
    let sumDef = parseInt(this.getAppointParts(TargetDefs, part));
    if (this.TargetAmmor != 0)
      sumDef += (this.TargetAmmor.equipment_def + this.TargetAmmor.def);
    return sumDef;
  }
  daggerattack1(args) {
    let here = args.here;
    // 스테미나 차감.
    args.setCurrentPlayerStemina(args.costST);
    // charater atk + weapon atk 만큼 target에게 데미지 주기.
    // 따로 함수화 하겠음.( 데미지 공식이 달라질 수 있으므로)
    let sumAtk = args.damageResult(args.getAtkDmg());
    let sumDef = args.getTargetDef(args.selectParts);
    //데미지 계산
    if (sumAtk > sumDef)
      args.TargetObj.currentHP -= (sumAtk - sumDef);
    here.Damage = (sumAtk - sumDef);

    //메세지 전달.
    let msg_part = args.getAppointPartsString(args.selectParts);
    args.msg.push(`${args.characterStataus.name}이가 ${args.TargetStatus.name}의 ${msg_part}를 공격하여`);
    args.msg.push(`최종적으로 ${args.TargetStatus.name} 에게, ${sumAtk - sumDef}만큼 피해를 입혔습니다!`);

  }

  daggerattack2(args) {
    let here = args.here;
    //ability - 3성 이상 떴을 때 st 소모 없이 한 번더 공격 가능 (st 소모 중첩 초기화). 
    if (here.currentStar < 3) {
      args.setCurrentPlayerStemina(args.costST);
      args.msg.push(`${here.currentStar}성 공격을 했기에, 스테미나 ${args.costST}를 소모합니다. `)
    }
    //데미지 계산
    let sumAtk = args.damageResult(args.getAtkDmg());
    let sumDef = args.getTargetDef(args.selectParts);
    //데미지 계산
    if (sumAtk > sumDef)
      args.TargetObj.currentHP -= (sumAtk - sumDef);
    here.Damage = (sumAtk - sumDef);

    //메세지 전달.
    let msg_part = args.getAppointPartsString(args.selectParts);
    args.msg.push(`${args.characterStataus.name}이가 ${args.TargetStatus.name}의 ${msg_part}를 공격하여`);
    args.msg.push(`최종적으로 ${args.TargetStatus.name} 에게, ${sumAtk - sumDef}만큼 피해를 입혔습니다!`);
  }

  shotbowattack1(args) {
    let here = args.here;
    //Weapon.
    let Weapon = args.getWeapon()[0];
    // 스테미나 차감.
    args.characterCard.currentStemina -= args.costST;
    // charater atk + weapon atk 만큼 target에게 데미지 주기.
    // 따로 함수화 하겠음.( 데미지 공식이 달라질 수 있으므로)
    let sumAtk = args.damageResult(parseInt(args.characterStataus.atk + (Weapon.atk + Weapon.weapon_atk)));
    let sumDef = parseInt(args.getAppointParts(args.TargetAmmor) + args.appointAmmor.def);
    //데미지 계산
    if (sumAtk > sumDef)
      args.TargetObj.currentHP -= (sumAtk - sumDef);
    here.Damage = (sumAtk - sumDef);
    args.setBullet(false);

    let msg_part = args.getAppointPartsString(args.selectParts);
    args.msg.push(`${args.characterStataus.name}이가 ${args.TargetStatus.name}의 ${msg_part}를 공격하여`);
    args.msg.push(`최종적으로 ${args.TargetStatus.name} 에게, ${sumAtk - sumDef}만큼 피해를 입혔습니다!`);

  }

  shotbowattack2(args) {
    let here = args.here;
    // // 스테미나 차감.
    args.setCurrentPlayerStemina(args.costST);

    // // 범위 대상 만큼 공격을 준다.

    args.getManyTarget();
    //공격력 어차피 한 번,
    let sumAtk = args.damageResult(args.getAtkDmg());
    let Targets = [];
    for (let index = 0; index < args.ManyTargets.length; index++) {
      Targets.push(args.getMainIdxP(args.ManyTargets[index]));
    }
    for (let i = 0; i < args.ManyTargets.length; i++) {
      let randParts = Math.floor(Math.random() * 5) + 1;
      console.log(Targets[i]);
      let sumDef = args.getManyTargetDef(randParts, Targets[i]);
      console.log(sumDef, "rand", randParts);
      if (sumAtk > sumDef)
        Targets[i].currentHP -= (sumAtk - sumDef);
      // here.Damage = (sumAtk - sumDef);
      let msg_part = args.getAppointPartsString(args.selectParts);
      args.msg.push(`${args.characterStataus.name}이가 ${args.TargetStatus.name}의 ${msg_part}를 공격하여`);
      args.msg.push(`최종적으로 ${args.TargetStatus.name} 에게, ${sumAtk - sumDef}만큼 피해를 입혔습니다!`);
    }

  }

  shotbowattack3(args) {
    let here = args.here;
    // 스테미나 차감.
    args.setCurrentPlayerStemina(args.costST);
    // charater atk + weapon atk 만큼 target에게 데미지 주기.
    // 따로 함수화 하겠음.( 데미지 공식이 달라질 수 있으므로)
    let sumAtk = args.damageResult(args.getAtkDmg());
    let sumDef = args.getTargetDef(args.selectParts);
    //데미지 계산
    if (sumAtk > sumDef)
      args.TargetObj.currentHP -= (sumAtk - sumDef);
    here.Damage = (sumAtk - sumDef);
    args.msg.push(`${args.characterStataus.name}이가 ${args.TargetStatus.name}의 ${msg_part}를 공격하여`);
    args.msg.push(`최종적으로 ${args.TargetStatus.name} 에게, ${sumAtk - sumDef}만큼 피해를 입혔습니다!`);
    //ability - 3성 이상 떴을 때 장전 
    if (here.currentAppoint < 3) {
      grgs.setBullet(false);
    }
    else args.msg.push(`${here.currentStar}성 공격을 성공했기에, 다음 공격은 장전하지 않아도 공격할 수 있습니다. `)
  }
}

const bdm = { attackPatten }
export default bdm