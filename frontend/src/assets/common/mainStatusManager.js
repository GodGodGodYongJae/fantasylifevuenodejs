// console.log(name);
// name.onTest();
// console.log(this.currentstatusflag == this.statusflag.atk);


//1 . 변수, 함수 정의

class status {
  constructor(mains) {
    this.statusflag = { none: 0, atk: 1, del: 2, range: 3, magic: 4 };
    this.crtstatusflag = 0;
    this.attackflag = { atk: 0, def: 1, option: 2 };
    this.crtattackflag = 0;
    this.mains = mains;
    this.rangePlayerNum = 0;

  }
  getFlag() { return this.statusflag; }

  onRangeAttack(val) {
    this.crtstatusflag = 3;
    this.rangePlayerNum = val;
    alert("공격할 대상을 선택하세요.");
    //모달 다시 켜주기
    // this.mains.onShowAttackModal();
  }
  onAttack() {
    this.crtstatusflag = 1;
    this.crtattackflag = 0;
    this.SelectStatus()
  }
  onMagic() {
    this.crtstatusflag = 4;
    this.crtattackflag = 0;
    this.SelectStatus()
  }
  onDeleted() {
    this.crtstatusflag = 2;
    this.crtattackflag = 0;
  }
  SelectStatus(value, idx) {
    if (this.crtstatusflag == this.statusflag.atk)
      this.attackFlagMethods(value, idx);
    else if (this.crtstatusflag == this.statusflag.del)
      this.deleteFlagMethods(idx);
    else if (this.crtstatusflag == this.statusflag.range)
      this.rangeAttackFlagMethods(idx);
    else if (this.crtstatusflag == this.statusflag.magic)
      this.ArcanerunicMethods(idx);

  }
  ArcanerunicMethods(idx) {
    if (this.crtattackflag == this.attackflag.atk)
      alert("룬어를 영창할 대상을 선택해주세요.");
    else if (this.crtattackflag == this.attackflag.def) {
      this.mains.onShowMagicModal();
    }
    else return;
    this.crtattackflag++;

  }
  rangeAttackFlagMethods(idx) {
    if (this.rangePlayerNum != 0) {
      this.mains.rangetargedata.push(idx);
      this.rangePlayerNum--;
      alert("공격할 대상을 선택하세요. 남은 횟수" + this.rangePlayerNum);
    }
    else {
      this.mains.onReShowAttackModal();
    }

  }
  attackFlagMethods(value, idx) {
    if (this.crtattackflag == this.attackflag.atk)
      alert("공격자를 선택하세요.");
    else if (this.crtattackflag == this.attackflag.def) {
      this.mains.targetdataP = value;
      this.mains.targetindex = idx;
      alert("방어자를 선택하세요.");
    }
    else if (this.crtattackflag == this.attackflag.option) {
      this.mains.defencedataP = value;
      this.mains.defenceindex = idx;
      this.mains.onShowAttackModal();
    }
    else return;
    this.crtattackflag++;
  }

  deleteFlagMethods(idx) {
    this.mains.deleted(idx);
    console.log(idx);
  }


}

//2. 변수, 함수를 하나의 변수에 담기!
const msm = { status }

//3. 이 변수 내보내기! (반드시 해야함!)
export default msm