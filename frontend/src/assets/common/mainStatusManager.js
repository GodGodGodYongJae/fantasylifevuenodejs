// console.log(name);
// name.onTest();
// console.log(this.currentstatusflag == this.statusflag.atk);


//1 . 변수, 함수 정의

class status {
  constructor(mains) {
    this.statusflag = { none: 0, atk: 1, del: 2 };
    this.crtstatusflag = 0;
    this.attackflag = { atk: 0, def: 1, option: 2 };
    this.crtattackflag = 0;
    this.mains = mains;

  }
  getFlag() { return this.statusflag; }


  onAttack() {
    this.crtstatusflag = 1;
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