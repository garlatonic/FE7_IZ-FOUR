import {
  getAllDocuments,
  postDocument,
  viewDocument,
  deleteDocument,
} from "../modules/api.js";
import { navigateFn } from "../modules/history.js";
import { ICON_FILE, ICON_FILEDATA, ICON_PLUS, ICON_DELETE } from "./icon.js";

const aside = {
  $aside: document.querySelector("#aside"),
  $rootList: document.querySelector("nav.aside-menu .body"),
  data: [],
  async init() {
    const data = await getAllDocuments();
    this.data = data ?? [];
    this.render(this.data);
    this.event();
  },
  render(data) {
    this.$rootList.append(this.buildItems(data));
  },
  buildItems(nodes, depth = 0) {
    const temp = document.createElement("ul");

    for (const node of nodes) {
      const liEl = document.createElement("li");
      liEl.dataset.id = node.id;

      const aEl = document.createElement("a");
      aEl.href = "#none";
      aEl.className = `page-item pl-${2 + depth * 2}`;

      const iconDiv = document.createElement("div");
      iconDiv.className = "icon";
      // iconDiv.innerHTML = ICON_FILE;
      this.hasContent(node.id).then((res) => {
        console.log(res);
        iconDiv.innerHTML = res ? ICON_FILEDATA : ICON_FILE;
      });

      const titleDiv = document.createElement("div");
      titleDiv.className = "title flex-1";
      titleDiv.textContent = node.title || "새 페이지";

      const buttonDiv = document.createElement("div");
      buttonDiv.setAttribute("role", "button");
      buttonDiv.setAttribute("aria-label", "새 페이지 만들기");
      buttonDiv.dataset.action = "addPage";
      buttonDiv.innerHTML = ICON_PLUS;

      const deleteDiv = document.createElement("div");
      deleteDiv.setAttribute("role", "button");
      deleteDiv.setAttribute("aria-label", "페이지 삭제하기");
      deleteDiv.dataset.action = "deletePage";
      deleteDiv.innerHTML = ICON_DELETE;

      const utilDiv = document.createElement("div");
      utilDiv.className = "util flex gap-1";
      utilDiv.append(deleteDiv, buttonDiv);

      aEl.append(iconDiv, titleDiv, utilDiv);
      liEl.append(aEl);

      const children = node.documents || [];

      if (children.length > 0) {
        const temp = document.createDocumentFragment();
        temp.append(this.buildItems(children, depth + 1));
        liEl.appendChild(temp);
      }
      temp.append(liEl);
    }

    return temp;
  },
  event() {
    const addButtons = this.$aside.querySelectorAll(".btn-add");
    addButtons.forEach((button) => {
      const id = null;
      const $target = this.$rootList.childNodes[0];
      button.addEventListener("click", (e) => {
        this.postEvent(id, $target);
      });
    });

    // 어사이드 내부 클릭이벤트만 케치
    this.$aside.addEventListener("click", (e) => {
      const $item = e.target.closest("[data-id]");
      if (!$item) return;
      const id = $item.dataset.id;

      e.preventDefault();
      e.stopPropagation();

      // 페이지 이동 막기
      if (e.target.closest("[role=button]")) {
        const $target = e.target.closest("[role=button]");

        if ($target.dataset.action === "addPage") {
          this.postEvent(id, $target);
          return;
        } else {
          this.deleteEvent(id, $item);

          // 접속한 루트에서 문서 삭제했을 때
          if (location.pathname.slice(1) === id) {
            document.querySelector("#contents .inner").innerHTML =
              `<h2>문서가 삭제되었습니다.</h2>`;
          }

          // 접속한 루트에서 하위 문서를 삭제했을 때
          if(document.querySelector(`#contents .content .page-link [data-id='']`))

          return;
        }
      }

      // id에 해당하는 페이지 내용 불러옴
      const pagePromise = viewDocument(id);

      pagePromise.then((page) => {
        // history API로 주소값 변경하고 편집기 영역 교체하기
        const state = page;
        history.pushState(state, "", state.id);
        navigateFn(state);
      });

      return;
    });
  },
  postEvent(id, $target) {
    // 부모 page-item 찾기
    const parentItem =
      $target.closest(".page-item") || this.$rootList.childNodes[0];

    // 자식 패딩값 결정
    const parentPaddingValue =
      [...parentItem.classList]
        .map((cls) => cls.match(/pl-(\d+)/))
        .filter(Boolean)
        .map((match) => Number(match[1]))[0] || 0;

    let childList = parentItem.parentElement.querySelector("ul");
    if (!childList) {
      childList = document.createElement("ul");
      parentItem.parentElement.appendChild(childList);
    }

    // 새 페이지 li 생성
    const newLi = document.createElement("li");

    const newA = document.createElement("a");
    newA.classList = `page-item pl-${parentPaddingValue + 2}`;
    newA.href = "#none";

    const newIcon = document.createElement("div");
    newIcon.className = "icon";
    newIcon.innerHTML = ICON_FILE;

    const newTitle = document.createElement("div");
    newTitle.className = "title flex-1";
    newTitle.textContent = "새 페이지";

    const buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("role", "button");
    buttonDiv.setAttribute("aria-label", "새 페이지 만들기");
    buttonDiv.dataset.action = "addPage";
    buttonDiv.innerHTML = ICON_PLUS;

    const deleteDiv = document.createElement("div");
    deleteDiv.setAttribute("role", "button");
    deleteDiv.setAttribute("aria-label", "페이지 삭제하기");
    deleteDiv.dataset.action = "deletePage";
    deleteDiv.innerHTML = ICON_DELETE;

    const newUtil = document.createElement("div");
    newUtil.className = "util flex gap-1";

    newUtil.append(deleteDiv, buttonDiv);
    newA.append(newIcon, newTitle, newUtil);
    newLi.appendChild(newA);

    childList.appendChild(newLi);

    let newId = "";
    postDocument(null, {
      parent: id || null,
    }).then((data) => {
      newId = data.id; // 응답값 newId에 저장
      newLi.dataset.id = newId;

      // id에 해당하는 페이지 내용 불러옴
      const pagePromise = viewDocument(newId);
      pagePromise.then((page) => {
        // history API로 주소값 변경하고 편집기 영역 교체하기
        const state = page;
        history.pushState(state, "", state.id);
        navigateFn(state);
      });
    });
  },
  deleteEvent(id, $item) {
    // 삭제 버튼 클릭 시 api 발똥
    viewDocument(id).then((data) => {
      if (data.documents.length > 0) {
        data.documents.map((doc) => {
          const $childItem = document.querySelector(`li[data-id='${doc.id}']`);
          this.deleteEvent(doc.id, $childItem);
        });
      }
      deleteDocument(id);
      if ($item !== null) $item.remove();
    });
  },
  async hasContent(id) {
    const page = await viewDocument(id);
    const temp = document.createElement("div");
    temp.innerHTML = page.content;
    return temp.innerText !== "" ? true : false;
  },
};

export default aside;
