class replace {
  constructor() {
    this.pattenList = [
      this.magicArrow1,
      this.magicArrow2,
    ]
    this.runic = "";
    this.mp = "";
  }
  runReplacePatten(id, mp, runic) {
    // console.log(this.pattenList.length, id);
    if (id > this.pattenList.length) {
      return;
    }
    else {
      this.mp = mp;
      this.runic = runic;
      this.pattenList[id - 1](this);
    }
  }

  magicArrow1(_here) {
    let here = _here;
    let str = here.mp.ap_description;
    let apRange = (here.runic[0] * 2 % 2 === 0) ? parseInt(here.runic[0] * 2 + 1) : parseInt(here.runic[0] * 2);
    let apRange2 = (here.runic[0] % 2 === 0) ? parseInt(here.runic[0] + 1) : parseInt(here.runic[0]);
    let replace_str = str
      .replace(/(1)/g, apRange)
      .replace(/(2)/g, apRange2);
    here.mp.ap_description = replace_str;

    console.log("m1")
  }
  magicArrow2(mp) {
    console.log("m2");
  }
}
const replacePatten = { replace }
export default replacePatten