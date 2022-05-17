import rep from "./replacePatten";
class magicPatten {
  constructor(here) {
    this.repatten = new rep.replace();
    this.here = here;
    this.magiclist = [
      this.magicArrow,
      this.test,
    ]
    this.magicPatten = [];
  }
  //Costs MP modify
  setCurrenMp(num) {
    this.here.charaterObj.currentMP -=
      this.here.runicRand[num].runic_cost + this.here.research * 2;

  }
  // this player cost Mp true or false
  useCurrentMP(num) {
    let cost = this.here.runicRand[num].runic_cost + this.here.research * 2;
    let isture = cost > this.here.charaterObj.currentMP ? true : false;
    return isture;
  }
  Nodetree(elementlist, idx, num) {
    if (idx + 1 > elementlist.length) return "idx";
    if (parseInt(num) < 4) {
      if (parseInt(elementlist[idx + 1]) == parseInt(num) + 1) return true;
      else {
        return false;
      }
    }
    else {
      if (parseInt(elementlist[idx + 1]) == 1) return "row";
      if (parseInt(elementlist[idx + 1]) == parseInt(num) + 1) return true;
      else if (elementlist[idx + 1] == undefined) return "no"
      else {
        return false;
      }
    }

  }
  //조합.
  OncombineRunic() {
    let result = false;
    let combineRunic = [0, 0, 0, 0];
    let combineList = this.here.charaterObj.selectRunic;
    let arr = '';
    let elementlist = [];

    this.here.charaterObj.selectRunic = [];

    for (let i = 0; i < combineList.length; i++) {
      arr += "," + combineList[i].runic_reck
    }
    elementlist.push(arr.split(","))
    for (let i = 1; i < elementlist[0].length; i++) {

      let isM = this.Nodetree(elementlist[0], i, elementlist[0][i]);
      console.log(isM);
      if (isM == false) {
        alert("x");
        return;
      }

      else if (isM == "no") {
        console.log("끝");
      }

    }
    console.log(combineList);

    combineList.forEach((element) => {
      if (parseInt(element.runic_reck) < 5) {
        combineRunic[0] = (element.runic_active <= 0) ? combineRunic[0] + element.runic_active : element.runic_active;
        combineRunic[1] = (element.runic_controll <= 0) ? combineRunic[1] + element.runic_controll : element.runic_controll;
        combineRunic[2] = (element.runic_form <= 0) ? combineRunic[2] + element.runic_form : element.runic_form;
        combineRunic[3] = (element.runic_temper <= 0) ? combineRunic[3] + element.runic_temper : element.runic_temper;
      }
      else if (parseInt(element.runic_reck) == 5) {
        combineRunic[0] += element.runic_active;
        combineRunic[1] += element.runic_controll;
        combineRunic[2] += element.runic_form;
        combineRunic[3] += element.runic_temper;
      }
      else if (parseInt(element.runic_reck) == 6) {
        combineRunic[0] *= (element.runic_active == 0) ? 1 : element.runic_active;
        combineRunic[1] *= (element.runic_controll == 0) ? 1 : element.runic_controll;
        combineRunic[2] *= (element.runic_form == 0) ? 1 : element.runic_form;
        combineRunic[3] *= (element.runic_temper == 0) ? 1 : element.runic_temper;
      }
    });
    if (combineRunic[0] <= 0 || combineRunic[1] <= 0 || combineRunic[2] <= 0 || combineRunic[3] <= 0) {
      alert("x");
      return;
    }

    this.SearchArcane(combineRunic)
    // console.log(combineRunic);
  }

  SearchArcane(Runic) {
    let arcane = this.here.AracaneList;
    arcane.forEach((element) => {
      if (element.arcane_id == Runic[2]) this.here.SearchArcanePatten(element.arcane_id, Runic);
      // this.magiclist[Runic[2] - 1](Runic, element, this.here);

    });
  }

  PattenStrReplace(runic) {
    this.here.MagicPatten.forEach(element => {
      this.repatten.runReplacePatten(element.ap_id, element, runic);
    });
    this.here.displaynum = this.here.displayenum.patten;
    // console.log(this.here.MagicPatten);
  }

  magicArrow(Runic, magic, here) {
    let str = magic.arcane_description; // 패턴을 바꿔줘야함 
    // this.here.SearchArcanePatten(magic.arcane_id);
    here.SearchArcanePatten(magic.arcane_id);
    console.log("str", str);
    let replaced_str = str.replace(`(1)`, "굳");
    console.log("replaced", replaced_str);
  }




}
const mdm = { magicPatten }
export default mdm