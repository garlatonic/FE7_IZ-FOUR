import {
  getAllDocuments,
  viewDocument,
  postDocument,
  editDocument,
  deleteDocument,
} from "./modules/api.js";

lucide.createIcons();

async function rootDouments() {
  const documents = await getAllDocuments();
}

rootDouments(); // 문서 불러오기

document.addEventListener("DOMContentLoaded", () => {
  // tooltip.init();

  const textarea = document.querySelector("textarea");

  // textarea.addEventListener("input", function () {
  //   this.style.height = "auto";
  //   this.style.height = this.scrollHeight + "px";
  // });
});

const home = {
  $rootList: document.querySelector(".recent"),
  data: [],
  updatedList: [],
  async init() {
    const data = await getAllDocuments();
    this.data = data ?? [];
    this.render(this.data);
  },
  render(data) {
    this.getItems(data);
    this.updatedList = this.sortItems(this.updatedList);
    this.$rootList.append(this.showItems(this.updatedList));
  },
  getItems(documents) {
    for (const node of documents) {
      const documentInfo = {
        id: node.id,
        title: node.title,
        updatedAt: node.updatedAt,
      };
      this.updatedList.push(documentInfo);

      const children = node.documents || [];

      if (children.length > 0) {
        this.getItems(children);
      }
    }
    console.log(this.updatedList);
  },

  sortItems(documents) {
    //const result = documents.sort((a,b) => b.updatedAt - a.updatedAt);
    const result = documents.sort(function (a, b) {
      if (b.updatedAt > a.updatedAt) {
        return 1;
      }
      if (b.updatedAt < a.updatedAt) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    console.log(result);
    return result;
  },

  showItems(documents) {
    const list = document.createElement("div");
    list.className = "card-list flex justify-evenly";

    for (let i = 0; i < 5; i++) {
      const cardDiv = document.createElement("div");
      cardDiv.className =
        "card bg-white flex flex-col rounded-2xl shadow-md mr-5 min-w-52 h-80 w-1/5 overflow-hidden cursor-pointer";

      const image = document.createElement("div");
      image.className = "card-image bg-gray-100 mb-4 h-80";

      const infoDiv = document.createElement("div");
      infoDiv.className =
        "info-container px-4 pb-4 flex flex-col justify-between h-full";

      const titleH2 = document.createElement("div");
      titleH2.className = "text-xl font-bold text-gray-800 mb-3";
      titleH2.textContent = documents[i].title || "새 페이지";

      const dateP = document.createElement("p");
      dateP.className = "date text-xs text-gray-400";
      dateP.textContent = documents[i].updatedAt.slice(0, 10);

      infoDiv.append(titleH2, dateP);

      cardDiv.append(image, infoDiv);

      list.append(cardDiv);
    }
    return list;
  },
};

home.init();
