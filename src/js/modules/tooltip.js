const tooltip = {
  nodes: null,
  el: null,

  init() {
    this.nodes = document.querySelectorAll("[data-tooltip]");
    if (!this.nodes.length) return;

    // 툴팁 상자 생성 -> 하나로 재사용
    this.el = document.createElement("div");
    this.el.setAttribute("role", "tooltip");
    document.querySelector("#wrap").appendChild(this.el);

    // this.nodes.forEach((target, index) => {
    //   target.addEventListener("mouseenter", () => this.show(target));
    //   target.addEventListener("mouseleave", () => this.hide());
    // });

  },
  createToolTip() {

  },

  show(target) {
    // reference가 되는 html이 없다면 data 그대로 사용
    const ref = target.dataset.reference;
    const txt = target.dataset.tooltip;

    if(ref) {
      const refEl = document.querySelector(ref)
      if(!refEl) return;
      this.el.innerHTML = refEl.innerHTML;
    } else {
      if(!txt) return;
      this.el.innerText = txt;
    }
  }
};

export default tooltip;
