const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const revealTargets = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealTargets.forEach((target) => revealObserver.observe(target));

const footprintData = {
  zhaotong: {
    kicker: "Footprint Detail",
    title: "昭通｜鲁甸灾后重建与精准扶贫",
    meta: "2015 年 1 月 19 日 · 昭通鲁甸",
    label: "昭通",
    coords: [103.717216, 27.336999],
    text:
      "2015 年云南考察期间，总书记首先到昭通鲁甸地震灾区，看望受灾群众并调研灾后恢复重建工作，强调扶贫开发要扶到点上、扶到根上。这一节点更适合作为云南考察中的民生与脱贫关怀坐标来呈现。",
    links: [
      {
        label: "查看人民网报道",
        href: "https://politics.people.com.cn/n/2015/0122/c1024-26432956.html",
      },
      {
        label: "查看云南考察回顾",
        href: "https://cpc.people.com.cn/n1/2020/0123/c419242-31561031.html",
      },
    ],
  },
  kunming: {
    kicker: "Footprint Detail",
    title: "昆明｜滇池生态治理与高质量发展",
    meta: "2020 年 1 月 20 日 · 昆明滇池星海半岛生态湿地",
    label: "昆明",
    coords: [102.712251, 25.040609],
    text:
      "2020 年云南考察期间，总书记到昆明滇池星海半岛生态湿地察看滇池保护治理情况，强调要按照山水林田湖草是一个生命共同体的理念，加强综合治理、系统治理、源头治理。",
    links: [
      {
        label: "查看中国政府网",
        href: "https://www.gov.cn/xinwen/2020-01/20/content_5471046.htm",
      },
      {
        label: "查看回访报道",
        href: "https://lcj.yn.gov.cn/html/2025/guonei_0321/73529.html",
      },
    ],
  },
  dali: {
    kicker: "Footprint Detail",
    title: "大理｜洱海保护与生态文明建设",
    meta: "2015 年 1 月 20 日 · 大理古生村",
    label: "大理",
    coords: [100.225668, 25.589449],
    text:
      "2015 年考察云南时，总书记来到大理洱海边的古生村了解生态保护情况，并留下“一定要把洱海保护好”的殷殷嘱托。大理节点适合用于展示云南生态文明建设与乡村保护之间的关系。",
    links: [
      {
        label: "查看洱海回访",
        href: "https://www.ynrd.gov.cn/html/2021/gedirenda_0318/11931.html",
      },
      {
        label: "查看大理新进展",
        href: "https://www.ynxc.gov.cn/html/2025/jicengjichugongzuochuangxin_0120/3019222.html",
      },
    ],
  },
  lijiang: {
    kicker: "Footprint Detail",
    title: "丽江｜特色产业与古城保护",
    meta: "2025 年 3 月 19 日 · 丽江现代花卉产业园 / 丽江古城",
    label: "丽江",
    coords: [100.233026, 26.872108],
    text:
      "2025 年考察云南期间，总书记在丽江考察现代花卉产业园并走进丽江古城，关注特色农业、文化遗产保护与文旅高质量发展。这个节点适合体现云南在新阶段的发展议题。",
    links: [
      {
        label: "查看花卉产业园报道",
        href: "https://politics.people.com.cn/n1/2025/0320/c1001-40442999.html",
      },
      {
        label: "查看古城回访",
        href: "https://www.ynxc.gov.cn/html/2025/focus_0325/3021754.html",
      },
    ],
  },
  simola: {
    kicker: "Key Highlight",
    title: "腾冲司莫拉｜让幸福的佤族村更加幸福",
    meta: "2020 年 1 月 19 日 · 腾冲市清水乡三家村中寨司莫拉佤族村",
    label: "腾冲司莫拉",
    coords: [98.49, 25.02],
    text:
      "司莫拉是整个项目最关键的展示节点。总书记在这里同村民围坐交流，指出要在全面建成小康社会基础上大力推进乡村振兴，不断增加收入、改善民生，让幸福的佤族村更加幸福。",
    links: [
      {
        label: "查看中国政府网",
        href: "https://www.gov.cn/xinwen/2020-01/20/content_5470929.htm",
      },
      {
        label: "查看案例回访",
        href: "https://cpc.people.com.cn/n1/2023/0831/c64387-40067839.html",
      },
    ],
  },
};

const mapDetailKicker = document.getElementById("mapDetailKicker");
const mapDetailTitle = document.getElementById("mapDetailTitle");
const mapDetailMeta = document.getElementById("mapDetailMeta");
const mapDetailText = document.getElementById("mapDetailText");
const mapDetailLinkA = document.getElementById("mapDetailLinkA");
const mapDetailLinkB = document.getElementById("mapDetailLinkB");
const footprintMapChart = document.getElementById("footprintMapChart");
let activeFootprintKey = "simola";
let footprintChart = null;

const renderFootprintDetail = (key) => {
  const item = footprintData[key];
  if (!item) return;

  mapDetailKicker.textContent = item.kicker;
  mapDetailTitle.textContent = item.title;
  mapDetailMeta.textContent = item.meta;
  mapDetailText.textContent = item.text;
  mapDetailLinkA.textContent = item.links[0].label;
  mapDetailLinkA.href = item.links[0].href;
  mapDetailLinkB.textContent = item.links[1].label;
  mapDetailLinkB.href = item.links[1].href;
};

const getFootprintSeriesData = () =>
  Object.entries(footprintData).map(([key, item]) => ({
    name: item.label,
    value: item.coords,
    key,
    meta: item.meta,
    itemStyle: {
      color: key === "simola" ? "#a23b2a" : "#c5923f",
      borderColor: key === activeFootprintKey ? "#fff9f1" : "rgba(255, 248, 240, 0.85)",
      borderWidth: key === activeFootprintKey ? 2.6 : 1.4,
      shadowBlur: key === activeFootprintKey ? 26 : 14,
      shadowColor: key === "simola" ? "rgba(162, 59, 42, 0.34)" : "rgba(112, 76, 38, 0.18)",
    },
    label: {
      color: key === activeFootprintKey ? "#7a2519" : "#4e3a31",
      fontWeight: key === activeFootprintKey ? 700 : 600,
    },
  }));

const renderFootprintMap = () => {
  if (!footprintMapChart || !window.echarts) return;

  if (!footprintChart) {
    footprintChart = window.echarts.init(footprintMapChart, null, { renderer: "svg" });
    footprintChart.on("click", (params) => {
      if (!params.data || !params.data.key) return;
      activeFootprintKey = params.data.key;
      renderFootprintDetail(activeFootprintKey);
      renderFootprintMap();
    });
  }

  const activeItem = footprintData[activeFootprintKey];
  const baseSeriesData = getFootprintSeriesData();

  footprintChart.setOption(
    {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(43, 28, 20, 0.9)",
        borderWidth: 0,
        textStyle: {
          color: "#fff8f1",
          fontSize: 13,
        },
        formatter: (params) => {
          if (!params.data) return "";
          return `${params.data.name}<br/>${params.data.meta}`;
        },
      },
      geo: {
        map: "云南",
        roam: false,
        zoom: 1.08,
        layoutCenter: ["50%", "54%"],
        layoutSize: "100%",
        itemStyle: {
          areaColor: "#ead1ad",
          borderColor: "#8f6846",
          borderWidth: 1.3,
          shadowBlur: 24,
          shadowColor: "rgba(99, 62, 34, 0.12)",
        },
        emphasis: {
          itemStyle: {
            areaColor: "#f3ddbd",
          },
          label: {
            show: false,
          },
        },
      },
      series: [
        {
          type: "scatter",
          coordinateSystem: "geo",
          zlevel: 3,
          symbol: "circle",
          symbolSize: (value, params) => (params.data.key === "simola" ? 18 : 13),
          label: {
            show: true,
            position: "right",
            distance: 10,
            formatter: "{b}",
            fontSize: 13,
            backgroundColor: "rgba(255, 250, 244, 0.88)",
            padding: [5, 8],
            borderRadius: 999,
          },
          emphasis: {
            scale: 1.15,
          },
          data: baseSeriesData,
        },
        {
          type: "effectScatter",
          coordinateSystem: "geo",
          zlevel: 4,
          rippleEffect: {
            scale: activeFootprintKey === "simola" ? 5.2 : 4.4,
            brushType: "stroke",
          },
          symbolSize: activeFootprintKey === "simola" ? 22 : 18,
          itemStyle: {
            color: activeFootprintKey === "simola" ? "#a23b2a" : "#c5923f",
            shadowBlur: 22,
            shadowColor: "rgba(162, 59, 42, 0.35)",
          },
          data: [
            {
              name: activeItem.label,
              value: activeItem.coords,
              key: activeFootprintKey,
              meta: activeItem.meta,
            },
          ],
        },
      ],
    },
    true
  );
};

if (footprintMapChart && window.echarts) {
  renderFootprintMap();
  window.addEventListener("resize", () => {
    if (footprintChart) {
      footprintChart.resize();
    }
  });
} else if (footprintMapChart) {
  footprintMapChart.textContent = "地图组件加载失败，请检查网络后刷新页面。";
  footprintMapChart.style.display = "grid";
  footprintMapChart.style.placeItems = "center";
  footprintMapChart.style.color = "#6f594f";
  footprintMapChart.style.padding = "24px";
}

renderFootprintDetail("simola");
