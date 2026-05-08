const navPanel = document.getElementById("navPanel");
const navToggle = document.querySelector(".nav-toggle");
const scrollTopButtons = document.querySelectorAll("[data-scroll-top]");
const prefersReducedMotion =
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (navToggle && navPanel) {
  const closeNavPanel = () => {
    navPanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navPanel.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeNavPanel();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) {
      closeNavPanel();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navPanel.classList.contains("is-open")) {
      closeNavPanel();
      navToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 1080 || !navPanel.classList.contains("is-open")) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (navPanel.contains(target) || navToggle.contains(target)) return;
    closeNavPanel();
  });
}

scrollTopButtons.forEach((button) => {
  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

document.querySelectorAll('a[data-pending-link="true"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  const targetId = link.getAttribute("href");
  if (!targetId || targetId === "#") return;

  link.addEventListener("click", () => {
    const target = document.querySelector(targetId);
    if (!(target instanceof HTMLElement)) return;
    window.setTimeout(() => {
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }
      target.focus({ preventScroll: true });
    }, 120);
  });
});

document.querySelectorAll(".nav-links a[data-page]").forEach((link) => {
  if (link.dataset.page === document.body.dataset.page) {
    link.classList.add("is-current");
    link.setAttribute("aria-current", "page");
  }
});

const syncHeaderState = () => {
  document.body.classList.toggle("is-scrolled", window.scrollY > 18);
};

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

const revealTargets = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

const carouselRoots = document.querySelectorAll("[data-carousel]");

carouselRoots.forEach((root) => {
  const slides = Array.from(root.querySelectorAll("[data-slide]"));
  const dots = Array.from(root.querySelectorAll("[data-carousel-dot]"));
  const prevButton = root.querySelector("[data-carousel-prev]");
  const nextButton = root.querySelector("[data-carousel-next]");

  if (!slides.length) return;

  let activeIndex = 0;
  let timer = null;
  const interval = Number(root.dataset.interval || 6000);

  const setActiveSlide = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
      slide.setAttribute("aria-hidden", index === activeIndex ? "false" : "true");
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
      dot.setAttribute("aria-current", index === activeIndex ? "true" : "false");
    });
  };

  const stopAutoplay = () => {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  };

  const startAutoplay = () => {
    if (prefersReducedMotion || slides.length <= 1) return;
    stopAutoplay();
    timer = window.setInterval(() => {
      setActiveSlide(activeIndex + 1);
    }, interval);
  };

  prevButton?.addEventListener("click", () => {
    setActiveSlide(activeIndex - 1);
    startAutoplay();
  });

  nextButton?.addEventListener("click", () => {
    setActiveSlide(activeIndex + 1);
    startAutoplay();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      setActiveSlide(Number(dot.dataset.carouselDot));
      startAutoplay();
    });
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      setActiveSlide(activeIndex - 1);
      startAutoplay();
    }

    if (event.key === "ArrowRight") {
      setActiveSlide(activeIndex + 1);
      startAutoplay();
    }
  });

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("focusout", startAutoplay);

  setActiveSlide(0);
  startAutoplay();
});

const footprintMapChart = document.getElementById("footprintMapChart");
const routeButtons = document.querySelectorAll("[data-route-filter]");
const footprintKeyButtons = document.querySelectorAll("[data-footprint-key]");

const mapDetailKicker = document.getElementById("mapDetailKicker");
const mapDetailTitle = document.getElementById("mapDetailTitle");
const mapDetailMeta = document.getElementById("mapDetailMeta");
const mapDetailText = document.getElementById("mapDetailText");
const mapDetailActivity = document.getElementById("mapDetailActivity");
const mapStatA = document.getElementById("mapStatA");
const mapStatB = document.getElementById("mapStatB");
const mapStatC = document.getElementById("mapStatC");
const mapThumbA = document.getElementById("mapThumbA");
const mapThumbB = document.getElementById("mapThumbB");
const mapThumbACaption = document.getElementById("mapThumbACaption");
const mapThumbBCaption = document.getElementById("mapThumbBCaption");
const mapActionButton = document.getElementById("mapActionButton");
const mapSourceNote = document.getElementById("mapSourceNote");
const mapRouteNote = document.getElementById("mapRouteNote");
const mapLegendPrimary = document.getElementById("mapLegendPrimary");
const mapLegendSecondary = document.getElementById("mapLegendSecondary");

const footprintViews = {
  all: {
    label: "全景路线",
    note: "以时间为线索浏览云南足迹，点击地图节点可切换右侧案例说明。未确认的外链统一保留为占位。",
    legendPrimary: "云南足迹节点",
    legendSecondary: "当前聚焦节点",
    lineColor: "rgba(140, 70, 53, 0.46)",
    activeColor: "#9b4a38",
    secondaryColor: "#cba06b",
    areaColor: "#efe3d1",
  },
  y2008: {
    label: "2008 年",
    note: "以 2008 年 11 月的云南足迹为一组，呈现基层走访、村寨交流与民生关切的现场线索。",
    legendPrimary: "2008 年节点",
    legendSecondary: "当前聚焦节点",
    lineColor: "rgba(172, 119, 58, 0.46)",
    activeColor: "#b57536",
    secondaryColor: "#d7b27d",
    areaColor: "#f0e4d2",
  },
  y2015: {
    label: "2015 年",
    note: "2015 年的路线更强调灾后重建、生态保护与产业转型，是理解云南实践的重要补充。",
    legendPrimary: "2015 年节点",
    legendSecondary: "当前聚焦节点",
    lineColor: "rgba(88, 111, 89, 0.44)",
    activeColor: "#5e735f",
    secondaryColor: "#b8c5b2",
    areaColor: "#ece0ce",
  },
  y2020: {
    label: "2020 年",
    note: "2020 年腾冲司莫拉是当前专题站的核心案例，村寨、火塘会与共同体叙事在这里汇聚。",
    legendPrimary: "2020 年节点",
    legendSecondary: "当前聚焦节点",
    lineColor: "rgba(140, 70, 53, 0.48)",
    activeColor: "#8c4635",
    secondaryColor: "#cfac82",
    areaColor: "#efe2ce",
  },
  y2025: {
    label: "2025 年",
    note: "2025 年的路线补入丽江与昆明，延伸出文旅融合、特色产业与高质量发展的观察视角。",
    legendPrimary: "2025 年节点",
    legendSecondary: "当前聚焦节点",
    lineColor: "rgba(99, 116, 86, 0.46)",
    activeColor: "#55694f",
    secondaryColor: "#b9c4b0",
    areaColor: "#eee3d4",
  },
};

const footprintData = [
  {
    key: "menghai",
    filter: "y2008",
    sequence: 1,
    label: "勐海",
    title: "西双版纳州勐海县曼恩村",
    kicker: "2008 年云南足迹",
    meta: ["2008 年 11 月 17—19 日", "西双版纳州", "村寨走访"],
    summary:
      "围绕傣族村寨走访与村民交谈展开，关注生产生活与民族文化传承的具体现场，是云南足迹的起点之一。",
    activity: "活动摘要：走访傣族村寨，与村民交流，了解生产生活与民族文化传承情况。",
    source: "来源占位：中国共产党新闻网原文链接待补",
    coords: [100.45, 21.97],
    labelPosition: "left",
    stats: [
      ["观察主题", "文化传承"],
      ["节点年份", "2008"],
      ["链接状态", "待补原文"],
    ],
    thumbs: [
      { src: "assets/hero-simola.png", alt: "云南山地村寨景观", caption: "云南边地村寨的地理与生活场景" },
      { src: "assets/interview.png", alt: "田野访谈照片", caption: "以口述与交流进入现场" },
    ],
  },
  {
    key: "ninger",
    filter: "y2008",
    sequence: 2,
    label: "宁洱",
    title: "普洱市宁洱县同心乡那柯里村",
    kicker: "2008 年云南足迹",
    meta: ["2008 年 11 月 17—19 日", "普洱市", "恢复重建"],
    summary:
      "这一节点对应灾后恢复重建与民生关切，足迹不只停留在文化展示，更连接现实生活改善与基层治理。",
    activity: "活动摘要：察看地震灾后恢复重建，看望彝族村民，关注灾区民生。",
    source: "来源占位：中国共产党新闻网原文链接待补",
    coords: [101.05, 23.05],
    labelPosition: "top",
    stats: [
      ["观察主题", "民生关切"],
      ["节点年份", "2008"],
      ["链接状态", "待补原文"],
    ],
    thumbs: [
      { src: "assets/interview.png", alt: "走访交流照片", caption: "基层走访与面对面交流" },
      { src: "assets/simola-overview.png", alt: "现有案例网页截图", caption: "案例叙事最终会转化为页面表达" },
    ],
  },
  {
    key: "kunming2008",
    filter: "y2008",
    sequence: 3,
    label: "昆明",
    title: "昆明市鼓楼街道桃源社区",
    kicker: "2008 年云南足迹",
    meta: ["2008 年 11 月 17—19 日", "昆明市", "社区走访"],
    summary:
      "从村寨进入城市社区，云南足迹呈现出更广阔的民生保障与基层社会观察视角。",
    activity: "活动摘要：慰问困难退休职工，了解城市低保与民生保障。",
    source: "来源占位：中国共产党新闻网原文链接待补",
    coords: [102.84, 24.89],
    labelPosition: "right",
    stats: [
      ["观察主题", "社区民生"],
      ["节点年份", "2008"],
      ["链接状态", "待补原文"],
    ],
    thumbs: [
      { src: "assets/interview.png", alt: "社区交流照片", caption: "从日常生活场景进入叙事" },
      { src: "assets/hero-simola.png", alt: "云南远景照片", caption: "从点位延展至整体云南脉络" },
    ],
  },
  {
    key: "shilin",
    filter: "y2008",
    sequence: 4,
    label: "石林",
    title: "昆明市石林县石林镇小糯黑村",
    kicker: "2008 年云南足迹",
    meta: ["2008 年 11 月 17—19 日", "昆明市石林县", "民族团结"],
    summary:
      "这一节点强调民族地区发展与民族团结，构成云南足迹早期叙事中非常关键的一层。",
    activity: "活动摘要：看望彝族群众，考察民族地区发展与民族团结。",
    source: "来源占位：中国共产党新闻网原文链接待补",
    coords: [103.33, 24.81],
    labelPosition: "bottom",
    stats: [
      ["观察主题", "民族团结"],
      ["节点年份", "2008"],
      ["链接状态", "待补原文"],
    ],
    thumbs: [
      { src: "assets/hero-simola.png", alt: "山地村寨景观", caption: "边地村寨与发展叙事互相嵌合" },
      { src: "assets/huotang-meeting.jpeg", alt: "火塘会照片", caption: "为司莫拉核心案例预留的叙事回响" },
    ],
  },
  {
    key: "ludian",
    filter: "y2015",
    sequence: 5,
    label: "鲁甸",
    title: "昭通市鲁甸县龙头山镇、甘家寨",
    kicker: "2015 年云南足迹",
    meta: ["2015 年 1 月 19—21 日", "昭通市", "灾后重建"],
    summary:
      "2015 年的云南路线把灾后重建、安居建设与基层关怀并置在一起，补足了案例价值中的现实发展维度。",
    activity: "活动摘要：视察灾后安置与重建，慰问受灾群众，关注抗震安居房建设。",
    source: "来源占位：中国政府网原文链接待补",
    coords: [103.55, 27.21],
    labelPosition: "right",
    stats: [
      ["观察主题", "灾后重建"],
      ["节点年份", "2015"],
      ["链接状态", "待补原文"],
    ],
    thumbs: [
      { src: "assets/hero-simola.png", alt: "云南山地景观", caption: "云南不同区域共享的发展议题" },
      { src: "assets/interview.png", alt: "基层交流照片", caption: "叙事依然从人与现场展开" },
    ],
  },
  {
    key: "dali",
    filter: "y2015",
    sequence: 6,
    label: "大理",
    title: "大理市湾桥镇古生村（洱海畔）",
    kicker: "2015 年云南足迹",
    meta: ["2015 年 1 月 19—21 日", "大理市", "生态保护"],
    summary:
      "生态保护与村民生活的关系在这一站被凸显出来，为文化专题站提供了生态、民生与共同发展的叙事切面。",
    activity: "活动摘要：考察洱海生态保护湿地、白族民居，与村民共话生态与民生。",
    source: "来源占位：人民日报原文链接待补",
    coords: [100.16, 25.79],
    labelPosition: "left",
    stats: [
      ["观察主题", "生态保护"],
      ["节点年份", "2015"],
      ["链接状态", "待补原文"],
    ],
    thumbs: [
      { src: "assets/hero-simola.png", alt: "云南山水照片", caption: "自然景观与村寨叙事并行出现" },
      { src: "assets/simola-overview.png", alt: "案例参考截图", caption: "页面中保留事实与案例的双重入口" },
    ],
  },
  {
    key: "daliedz",
    filter: "y2015",
    sequence: 7,
    label: "经开区",
    title: "大理国家级经开区（力帆骏马公司）",
    kicker: "2015 年云南足迹",
    meta: ["2015 年 1 月 19—21 日", "大理市", "产业发展"],
    summary:
      "这一节点把园区企业与产业转型带入云南叙事，使案例不仅关乎文化，也能回应实体经济、就业带动与区域发展。 ",
    activity: "活动摘要：走访园区企业，了解装备制造、产业发展与就业带动情况。",
    source: "来源占位：中国政府网原文链接待补",
    coords: [100.28, 25.64],
    labelPosition: "right",
    stats: [
      ["观察主题", "产业发展"],
      ["节点年份", "2015"],
      ["链接状态", "待补原文"],
    ],
    thumbs: [
      { src: "assets/simola-overview.png", alt: "网页案例概览截图", caption: "产业与案例价值可以在专题中并置呈现" },
      { src: "assets/framework.png", alt: "研究框架图", caption: "现实发展维度会继续回到项目框架中" },
    ],
  },
  {
    key: "kunming2015",
    filter: "y2015",
    sequence: 8,
    label: "昆明",
    title: "昆明市企业、工地、驻昆部队相关点位",
    kicker: "2015 年云南足迹",
    meta: ["2015 年 1 月 19—21 日", "昆明市", "一线保障"],
    summary:
      "这一组昆明点位把企业、工地与驻昆部队串在一起，使 2015 年的云南足迹同时具备产业、建设与保障层面的观察。 ",
    activity: "活动摘要：走进企业和工地，并看望驻昆部队，把产业、建设与一线保障纳入同一条线索中。",
    source: "来源占位：中国政府网原文链接待补",
    coords: [102.96, 24.86],
    labelPosition: "bottom",
    stats: [
      ["观察主题", "一线保障"],
      ["节点年份", "2015"],
      ["链接状态", "待补原文"],
    ],
    thumbs: [
      { src: "assets/interview.png", alt: "基层访谈照片", caption: "把现实场景与公共叙事连接起来" },
      { src: "assets/hero-simola.png", alt: "云南城市与山地远景示意", caption: "昆明节点为整条路线提供收束与延展" },
    ],
  },
  {
    key: "simola",
    filter: "y2020",
    sequence: 9,
    label: "司莫拉",
    title: "保山市腾冲市清水乡三家村中寨司莫拉佤族村",
    kicker: "2020 年核心案例",
    meta: ["2020 年 1 月 19—21 日", "腾冲市", "核心案例"],
    summary:
      "司莫拉是当前专题站的叙事中心。火塘会、村寨更新、民族团结与乡村振兴在这里交织，构成“从司莫拉读懂共同体意识”的核心现场。",
    activity: "活动摘要：走进佤族村寨，同村民围坐聊家常，考察脱贫攻坚、乡村振兴与民族团结。",
    source: "来源占位：中国政府网原文链接待补",
    coords: [98.68, 24.95],
    labelPosition: "right",
    stats: [
      ["观察主题", "共同体叙事"],
      ["节点年份", "2020"],
      ["链接状态", "待补原文"],
    ],
    thumbs: [
      { src: "assets/huotang-meeting.jpeg", alt: "司莫拉火塘会照片", caption: "火塘会是文化、情感与参与的现场" },
      { src: "assets/interview.png", alt: "实地访谈照片", caption: "从口述与家常进入共同体经验" },
    ],
  },
  {
    key: "heshun",
    filter: "y2020",
    sequence: 10,
    label: "和顺",
    title: "腾冲市和顺古镇",
    kicker: "2020 年云南足迹",
    meta: ["2020 年 1 月 19—21 日", "腾冲市", "文化交流"],
    summary:
      "和顺古镇作为历史文化名镇，为司莫拉之外的文化交流、侨乡记忆与多元交往史提供了补充视角。",
    activity: "活动摘要：考察历史文化名镇，了解侨乡文化与民族交流交融史。",
    source: "来源占位：中国政府网原文链接待补",
    coords: [98.45, 25.01],
    labelPosition: "top",
    stats: [
      ["观察主题", "交流交融"],
      ["节点年份", "2020"],
      ["链接状态", "待补原文"],
    ],
    thumbs: [
      { src: "assets/hero-simola.png", alt: "山地村寨与古镇景观示意", caption: "文化交流史作为案例背景层" },
      { src: "assets/huotang-meeting.jpeg", alt: "火塘会照片", caption: "与司莫拉主案例形成呼应" },
    ],
  },
  {
    key: "kunming2020",
    filter: "y2020",
    sequence: 11,
    label: "滇池",
    title: "昆明市滇池星海半岛生态湿地等点位",
    kicker: "2020 年云南足迹",
    meta: ["2020 年 1 月 19—21 日", "昆明市", "生态治理"],
    summary:
      "2020 年的昆明节点强调生态治理、民生保障与爱国主义教育，为专题站增加更广阔的治理背景。",
    activity: "活动摘要：察看滇池治理成效，了解民生保障与历史文化传承相关场景。",
    source: "来源占位：中国政府网原文链接待补",
    coords: [102.66, 24.94],
    labelPosition: "left",
    stats: [
      ["观察主题", "生态治理"],
      ["节点年份", "2020"],
      ["链接状态", "待补原文"],
    ],
    thumbs: [
      { src: "assets/hero-simola.png", alt: "云南远景照片", caption: "从边地案例延展到全省治理语境" },
      { src: "assets/simola-overview.png", alt: "页面参考截图", caption: "为后续报道链接和视频位预留接口" },
    ],
  },
  {
    key: "lijiangpark",
    filter: "y2025",
    sequence: 12,
    label: "丽江",
    title: "丽江现代花卉产业园",
    kicker: "2025 年云南足迹",
    meta: ["2025 年 3 月 19—20 日", "丽江市", "特色产业"],
    summary:
      "这一站把云南高原特色农业与产业链观察纳入专题，为“幸福产业”“高质量发展”等叙事打开新的入口。",
    activity: "活动摘要：调研高原特色农业与花卉全产业链，关注特色产业发展。",
    source: "来源占位：求是网原文链接待补",
    coords: [100.23, 26.88],
    labelPosition: "right",
    stats: [
      ["观察主题", "特色产业"],
      ["节点年份", "2025"],
      ["链接状态", "待补原文"],
    ],
    thumbs: [
      { src: "assets/hero-simola.png", alt: "云南村寨风景", caption: "产业发展与乡村叙事可并置呈现" },
      { src: "assets/interview.png", alt: "访谈照片", caption: "项目后续可继续补入一手调研" },
    ],
  },
  {
    key: "lijiangtown",
    filter: "y2025",
    sequence: 13,
    label: "古城",
    title: "丽江古城（含木府）",
    kicker: "2025 年云南足迹",
    meta: ["2025 年 3 月 19—20 日", "丽江市", "文旅融合"],
    summary:
      "文旅融合与传统文化保护在这一节点被强调，它与司莫拉案例中的文化传承、共同体意识教育形成互文关系。",
    activity: "活动摘要：考察世界文化遗产保护、文旅融合与纳西族东巴文化。",
    source: "来源占位：中国政府网原文链接待补",
    coords: [100.23, 26.87],
    labelPosition: "bottom",
    stats: [
      ["观察主题", "文旅融合"],
      ["节点年份", "2025"],
      ["链接状态", "待补原文"],
    ],
    thumbs: [
      { src: "assets/hero-simola.png", alt: "丽江与云南风景示意", caption: "传统文化保护与专题叙事连接" },
      { src: "assets/framework.png", alt: "研究框架图", caption: "后续可与项目框架和成果页联动" },
    ],
  },
  {
    key: "kunming2025",
    filter: "y2025",
    sequence: 14,
    label: "昆明",
    title: "昆明市听取云南省委、省政府工作汇报相关节点",
    kicker: "2025 年云南足迹",
    meta: ["2025 年 3 月 19—20 日", "昆明市", "边疆治理"],
    summary:
      "这一节点为 2025 年路线提供整体层面的收束，把产业、文旅之外的边疆治理、高质量发展与民族团结工作重新带回视野。 ",
    activity: "活动摘要：听取云南省委、省政府工作汇报，聚焦边疆治理、高质量发展与民族团结进步工作。",
    source: "来源占位：中国政府网原文链接待补",
    coords: [102.74, 24.97],
    labelPosition: "left",
    stats: [
      ["观察主题", "边疆治理"],
      ["节点年份", "2025"],
      ["链接状态", "待补原文"],
    ],
    thumbs: [
      { src: "assets/framework.png", alt: "研究框架图", caption: "把全局层面的工作要求与专题站逻辑重新对齐" },
      { src: "assets/hero-simola.png", alt: "云南远景照片", caption: "案例与区域治理语境始终需要相互照应" },
    ],
  },
];

const allKeys = footprintData.map((item) => item.key);
let activeRouteFilter = "all";
let activeFootprintKey = "simola";
let footprintChart = null;

const getVisibleItems = () =>
  activeRouteFilter === "all"
    ? footprintData
    : footprintData.filter((item) => item.filter === activeRouteFilter);

const ensureActiveKey = () => {
  const visibleItems = getVisibleItems();
  if (!visibleItems.some((item) => item.key === activeFootprintKey)) {
    activeFootprintKey = visibleItems[0]?.key || footprintData[0]?.key;
  }
};

const setButtonState = (button, label, disabled = false) => {
  if (!button) return;
  button.textContent = label;
  button.classList.toggle("is-disabled", disabled);
  button.setAttribute("aria-disabled", disabled ? "true" : "false");
  if (disabled) {
    button.removeAttribute("href");
  }
};

const syncRouteButtons = () => {
  routeButtons.forEach((button) => {
    const isActive = button.dataset.routeFilter === activeRouteFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
};

const syncFootprintButtons = () => {
  footprintKeyButtons.forEach((button) => {
    const isActive = button.dataset.footprintKey === activeFootprintKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
};

const renderFootprintDetail = () => {
  const item = footprintData.find((entry) => entry.key === activeFootprintKey);
  if (!item) return;

  if (mapDetailKicker) mapDetailKicker.textContent = item.kicker;
  if (mapDetailTitle) mapDetailTitle.textContent = item.title;
  if (mapDetailMeta) mapDetailMeta.textContent = item.meta.join(" · ");
  if (mapDetailText) mapDetailText.textContent = item.summary;
  if (mapDetailActivity) mapDetailActivity.textContent = item.activity;

  [mapStatA, mapStatB, mapStatC].forEach((statNode, index) => {
    const stat = item.stats[index];
    if (!statNode || !stat) return;
    statNode.querySelector("strong").textContent = stat[1];
    statNode.querySelector("span").textContent = stat[0];
  });

  if (mapThumbA && mapThumbACaption && item.thumbs[0]) {
    mapThumbA.src = item.thumbs[0].src;
    mapThumbA.alt = item.thumbs[0].alt;
    mapThumbACaption.textContent = item.thumbs[0].caption;
  }

  if (mapThumbB && mapThumbBCaption && item.thumbs[1]) {
    mapThumbB.src = item.thumbs[1].src;
    mapThumbB.alt = item.thumbs[1].alt;
    mapThumbBCaption.textContent = item.thumbs[1].caption;
  }

  if (mapSourceNote) mapSourceNote.textContent = item.source;
  setButtonState(mapActionButton, "原文链接待补", true);
  syncFootprintButtons();
};

const renderRouteCopy = () => {
  const view = footprintViews[activeRouteFilter];
  if (!view) return;
  if (mapRouteNote) mapRouteNote.textContent = view.note;
  if (mapLegendPrimary) mapLegendPrimary.textContent = view.legendPrimary;
  if (mapLegendSecondary) mapLegendSecondary.textContent = view.legendSecondary;
};

const getScatterData = () => {
  const view = footprintViews[activeRouteFilter];
  return getVisibleItems().map((item) => {
    const isActive = item.key === activeFootprintKey;
    return {
      key: item.key,
      name: item.label,
      meta: item.meta.join(" · "),
      value: item.coords,
      itemStyle: {
        color: isActive ? view.activeColor : view.secondaryColor,
        borderColor: isActive ? "#fff8f1" : "rgba(255, 248, 241, 0.94)",
        borderWidth: isActive ? 2.8 : 1.5,
        shadowBlur: isActive ? 22 : 10,
        shadowColor: isActive ? "rgba(90, 57, 34, 0.2)" : "rgba(90, 57, 34, 0.08)",
      },
      label: {
        show: true,
        position: item.labelPosition,
        distance: 10,
        color: isActive ? view.activeColor : "#5c4b3e",
        fontWeight: isActive ? 700 : 600,
        backgroundColor: "rgba(255, 251, 245, 0.92)",
        borderRadius: 999,
        padding: [6, 10],
        fontSize: 12,
      },
    };
  });
};

const getLineData = () => {
  const visibleItems = getVisibleItems();
  if (visibleItems.length < 2) return [];

  return visibleItems.slice(0, -1).map((item, index) => ({
    coords: [item.coords, visibleItems[index + 1].coords],
  }));
};

const renderFootprintMap = () => {
  if (!footprintMapChart || !window.echarts) return;

  ensureActiveKey();

  if (!footprintChart) {
    footprintChart = window.echarts.init(footprintMapChart, null, { renderer: "svg" });
    footprintChart.on("click", (params) => {
      if (!params.data || !params.data.key) return;
      activeFootprintKey = params.data.key;
      renderFootprintDetail();
      renderFootprintMap();
    });
  }

  const view = footprintViews[activeRouteFilter];
  const activeItem = footprintData.find((item) => item.key === activeFootprintKey);

  footprintChart.setOption(
    {
      backgroundColor: "transparent",
      animationDuration: 480,
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(42, 31, 24, 0.94)",
        borderColor: "rgba(255, 245, 235, 0.18)",
        borderWidth: 1,
        textStyle: {
          color: "#fff7ef",
          fontSize: 13,
          lineHeight: 20,
        },
        formatter: (params) => {
          if (!params.data) return "";
          return `${params.data.name}<br/>${params.data.meta}`;
        },
      },
      geo: {
        map: "云南",
        roam: false,
        zoom: 1.14,
        layoutCenter: ["48%", "54%"],
        layoutSize: "104%",
        itemStyle: {
          areaColor: view.areaColor,
          borderColor: "#9d7a59",
          borderWidth: 1.1,
          shadowBlur: 18,
          shadowColor: "rgba(99, 62, 34, 0.08)",
        },
        emphasis: {
          itemStyle: {
            areaColor: "#f6ebd8",
          },
          label: {
            show: false,
          },
        },
      },
      series: [
        {
          type: "lines",
          coordinateSystem: "geo",
          zlevel: 2,
          data: getLineData(),
          lineStyle: {
            color: view.lineColor,
            width: 2.1,
            curveness: 0.12,
            type: activeRouteFilter === "all" || activeRouteFilter === "y2020" ? "solid" : "dashed",
          },
          effect: {
            show: true,
            constantSpeed: 20,
            trailLength: 0.12,
            symbol: "circle",
            symbolSize: 6,
            color: view.activeColor,
          },
        },
        {
          type: "scatter",
          coordinateSystem: "geo",
          zlevel: 3,
          symbol: "circle",
          symbolSize: (value, params) => (params.data.key === "simola" ? 18 : 13),
          label: {
            show: true,
            formatter: "{b}",
          },
          emphasis: {
            scale: 1.14,
          },
          data: getScatterData(),
        },
        activeItem
          ? {
              type: "effectScatter",
              coordinateSystem: "geo",
              zlevel: 4,
              rippleEffect: {
                scale: 4.8,
                brushType: "stroke",
              },
              symbolSize: activeFootprintKey === "simola" ? 24 : 20,
              itemStyle: {
                color: view.activeColor,
                shadowBlur: 24,
                shadowColor: "rgba(93, 65, 39, 0.2)",
              },
              data: [
                {
                  name: activeItem.label,
                  value: activeItem.coords,
                  key: activeItem.key,
                  meta: activeItem.meta.join(" · "),
                },
              ],
            }
          : {},
      ],
    },
    true
  );
};

const activateRouteFilter = (nextFilter) => {
  if (!nextFilter || nextFilter === activeRouteFilter) return;
  activeRouteFilter = nextFilter;
  ensureActiveKey();
  syncRouteButtons();
  renderRouteCopy();
  renderFootprintDetail();
  renderFootprintMap();
};

const activateFootprintKey = (nextKey) => {
  const target = footprintData.find((item) => item.key === nextKey);
  if (!target) return;
  activeRouteFilter = target.filter;
  activeFootprintKey = target.key;
  syncRouteButtons();
  renderRouteCopy();
  renderFootprintDetail();
  renderFootprintMap();
};

if (footprintMapChart && window.echarts) {
  syncRouteButtons();
  renderRouteCopy();
  renderFootprintDetail();
  renderFootprintMap();

  routeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextFilter = button.dataset.routeFilter;
      activateRouteFilter(nextFilter);
    });
  });

  footprintKeyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateFootprintKey(button.dataset.footprintKey);
      if (window.innerWidth <= 1080) {
        document.querySelector(".map-layout")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  window.addEventListener("resize", () => {
    if (footprintChart) footprintChart.resize();
  });
} else if (footprintMapChart) {
  footprintMapChart.textContent = "地图组件加载失败，请检查本地脚本或网络后刷新。";
  footprintMapChart.style.display = "grid";
  footprintMapChart.style.placeItems = "center";
  footprintMapChart.style.padding = "24px";
  footprintMapChart.style.color = "#5f4f42";
}

const proposalUpload = document.getElementById("proposalUpload");
const proposalUploadStatus = document.getElementById("proposalUploadStatus");
const proposalCurrentName = document.getElementById("proposalCurrentName");
const proposalCurrentSize = document.getElementById("proposalCurrentSize");
const proposalViewLink = document.getElementById("proposalViewLink");
const proposalDownloadLink = document.getElementById("proposalDownloadLink");

if (proposalUpload && proposalUploadStatus) {
  const defaultUploadStatus = proposalUploadStatus.textContent;
  const defaultCurrentName = proposalCurrentName ? proposalCurrentName.textContent : "";
  const defaultCurrentSize = proposalCurrentSize ? proposalCurrentSize.textContent : "";
  let proposalObjectUrl = "";

  const formatProposalSize = (size) => {
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }

    if (size >= 1024) {
      return `${(size / 1024).toFixed(0)} KB`;
    }

    return `${size} B`;
  };

  const setProposalAction = (link, href, label, disabled = false, downloadName = "") => {
    if (!link) return;

    link.textContent = label;
    link.href = disabled ? "#" : href;
    link.classList.toggle("is-pending", disabled);
    link.setAttribute("aria-disabled", String(disabled));

    if (disabled) {
      link.dataset.pendingLink = "true";
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.removeAttribute("download");
    } else {
      delete link.dataset.pendingLink;
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");

      if (downloadName) {
        link.setAttribute("download", downloadName);
      } else {
        link.removeAttribute("download");
      }
    }
  };

  const resetProposalPreview = () => {
    if (proposalObjectUrl) {
      URL.revokeObjectURL(proposalObjectUrl);
      proposalObjectUrl = "";
    }

    proposalUploadStatus.textContent = defaultUploadStatus;

    if (proposalCurrentName) proposalCurrentName.textContent = defaultCurrentName;
    if (proposalCurrentSize) proposalCurrentSize.textContent = defaultCurrentSize;

    setProposalAction(proposalViewLink, "#", "查看", true);
    setProposalAction(proposalDownloadLink, "#", "下载", true);
  };

  proposalUpload.addEventListener("change", () => {
    const file = proposalUpload.files && proposalUpload.files[0];
    if (!file) {
      resetProposalPreview();
      return;
    }

    if (proposalObjectUrl) {
      URL.revokeObjectURL(proposalObjectUrl);
    }

    proposalObjectUrl = URL.createObjectURL(file);

    proposalUploadStatus.textContent = `已选择文件：${file.name}。当前为本地预览状态，未上传到服务器。`;

    if (proposalCurrentName) proposalCurrentName.textContent = file.name;
    if (proposalCurrentSize) proposalCurrentSize.textContent = formatProposalSize(file.size);

    setProposalAction(proposalViewLink, proposalObjectUrl, "查看", false);
    setProposalAction(proposalDownloadLink, proposalObjectUrl, "下载", false, file.name);
  });

  resetProposalPreview();
}

const suggestionForm = document.getElementById("suggestionForm");
const suggestionMessage = document.getElementById("suggestionMessage");
const errataForm = document.getElementById("errataForm");
const errataMessage = document.getElementById("errataMessage");

const setFeedbackMessage = (element, message, type) => {
  if (!element) return;

  element.textContent = message;
  element.classList.add("is-visible");
  element.classList.toggle("is-success", type === "success");
  element.classList.toggle("is-error", type === "error");
};

if (suggestionForm && suggestionMessage) {
  suggestionForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(suggestionForm);
    const content = String(formData.get("suggestionContent") || "").trim();

    if (!content) {
      setFeedbackMessage(suggestionMessage, "请先填写建议内容", "error");
      return;
    }

    setFeedbackMessage(
      suggestionMessage,
      "建议已记录在本地预览中，正式提交功能待后续接入。",
      "success"
    );
  });
}

if (errataForm && errataMessage) {
  errataForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(errataForm);
    const content = String(formData.get("errataContent") || "").trim();

    if (!content) {
      setFeedbackMessage(errataMessage, "请先填写错误说明", "error");
      return;
    }

    setFeedbackMessage(
      errataMessage,
      "纠错信息已记录在本地预览中，正式提交功能待后续接入。",
      "success"
    );
  });
}

const footprintNodes = [
  {
    id: "tengchong",
    order: 6,
    year: "2020",
    city: "腾冲",
    regionName: "保山市",
    coords: [98.68, 24.95],
    title: "保山市腾冲市清水乡三家村中寨司莫拉佤族村",
    date: "2020 年 1 月 19 日",
    tags: ["云南考察行程（1 月 19—21 日）", "腾冲市", "核心案例"],
    summary: "司莫拉是本平台的核心场景，连接村寨焕新、火塘会、民族团结与乡村振兴的生动实践。",
    activity: "走进佤族村寨，同村民围坐聊家常，考察脱贫攻坚、乡村振兴与民族团结。",
    theme: "共同体叙事",
    source: "中国政府网 / 新华社",
    image: "assets/hero-simola.png",
    imageAlt: "司莫拉佤族村山地村寨全景",
    imageCaption: "司莫拉佤族村全景",
    secondaryImage: "assets/simola-overview.png",
    secondaryAlt: "清水乡田园与村寨空间",
    secondaryCaption: "清水乡田园风光与村寨空间",
    focusTitle: "当前聚焦：腾冲 · 司莫拉",
    link: "https://www.gov.cn/xinwen/2020-01/20/content_5470929.htm",
    linkLabel: "查看原文报道",
    linkStatus: "可跳转原文",
    reports: [
      {
        date: "2020-01-20",
        title: "深入佤寨，习近平祝“幸福的地方”更加幸福",
        source: "中国政府网 / 新华社",
        summary: "直接对应司莫拉考察现场，记录了同村民围坐交流与“让幸福的佤族村更加幸福”的原话。",
        link: "https://www.gov.cn/xinwen/2020-01/20/content_5470929.htm",
        label: "查看原文",
      },
      {
        date: "2021-10-07",
        title: "焦点访谈：幸福的司莫拉",
        source: "人民网",
        summary: "从后续发展角度回看司莫拉的乡村振兴、民族团结与幸福生活变化。",
        link: "http://politics.people.com.cn/n1/2021/1007/c1001-32246388.html",
        label: "查看报道",
      },
      {
        date: "2025-12-08",
        title: "清水乡司莫拉佤族村景区（3A级）",
        source: "腾冲市人民政府官网",
        summary: "用于核验村寨概况、区位交通、人口构成和景区等级等基础信息。",
        link: "https://www.tengchong.gov.cn/info/1732/34978.htm",
        label: "查看依据",
      },
    ],
  },
  {
    id: "menghai",
    order: 1,
    year: "2008",
    city: "勐海",
    regionName: "西双版纳傣族自治州",
    coords: [100.45, 21.97],
    title: "西双版纳州勐海县勐遮镇曼恩村",
    date: "2008 年 11 月 17—19 日",
    tags: ["边疆民族地区走访", "西双版纳州", "村寨现场"],
    summary: "围绕民族地区生产生活与文化传承展开走访，是云南足迹中较早的基层村寨观察点。",
    activity: "走访傣族村寨，与村民交流，了解生产生活与民族文化传承情况。",
    theme: "边疆民族地区走访",
    source: "中国共产党新闻网",
    image: "assets/huotang-meeting.jpeg",
    imageAlt: "围坐交流的火塘会现场",
    imageCaption: "围坐交流与村寨观察的现场感",
    secondaryImage: "assets/framework.png",
    secondaryAlt: "专题框架与资料结构图",
    secondaryCaption: "从基层走访重新进入云南足迹的起点",
    focusTitle: "当前聚焦：勐海 · 曼恩村",
    link: "https://cpc.people.com.cn/n1/2016/0120/c64094-28070892.html",
    linkLabel: "查看原文",
    linkStatus: "可跳转原文",
    reports: [
      {
        date: "2016-01-20",
        title: "总书记的云南情",
        source: "中国共产党新闻网",
        summary: "文内回顾 2008 年 11 月在勐海县勐遮镇曼恩村考察的相关行程和现场片段。",
        link: "https://cpc.people.com.cn/n1/2016/0120/c64094-28070892.html",
        label: "查看原文",
      },
    ],
  },
  {
    id: "ninger",
    order: 2,
    year: "2008",
    city: "宁洱",
    regionName: "普洱市",
    coords: [101.05, 23.05],
    title: "普洱市宁洱县同心乡那柯里村",
    date: "2008 年 11 月 17—19 日",
    tags: ["基层民生观察", "普洱市", "灾后恢复与生活改善"],
    summary: "这一节点把云南足迹带向更具体的基层生活与恢复建设场景，补足共同体叙事中的现实尺度。",
    activity: "察看恢复建设和基层群众生活情况，关注道路、生产与村寨更新等现实问题。",
    theme: "民生与恢复",
    source: "中国共产党新闻网",
    image: "assets/interview.png",
    imageAlt: "田野访谈场景",
    imageCaption: "田野访谈与民生观察的进入方式",
    secondaryImage: "assets/simola-overview.png",
    secondaryAlt: "村寨与山地空间画面",
    secondaryCaption: "村寨、道路与恢复建设的空间线索",
    focusTitle: "当前聚焦：宁洱 · 那柯里村",
    link: "https://cpc.people.com.cn/n1/2016/0120/c64094-28070892.html",
    linkLabel: "查看原文",
    linkStatus: "可跳转原文",
    reports: [
      {
        date: "2016-01-20",
        title: "总书记的云南情",
        source: "中国共产党新闻网",
        summary: "文内回顾 2008 年 11 月在宁洱县同心乡那柯里村的行程内容。",
        link: "https://cpc.people.com.cn/n1/2016/0120/c64094-28070892.html",
        label: "查看原文",
      },
    ],
  },
  {
    id: "shilin",
    order: 4,
    year: "2008",
    city: "石林",
    regionName: "昆明市",
    coords: [103.33, 24.81],
    title: "昆明市石林县石林镇小箐村",
    date: "2008 年 11 月 17—19 日",
    tags: ["民族村寨观察", "石林县", "权威行程稿核验点"],
    summary: "这一节点关注民族地区村寨发展与群众生活。当前可核验的权威行程稿载明的地点为石林镇小箐村。",
    activity: "走访民族村寨，了解生产生活和民族地区发展情况，并将其放回更大的云南空间中理解。",
    theme: "民族团结与村寨发展",
    source: "中国共产党新闻网",
    image: "assets/simola-overview.png",
    imageAlt: "村寨与田园空间",
    imageCaption: "从村寨空间进入民族地区发展的日常面向",
    secondaryImage: "assets/framework.png",
    secondaryAlt: "专题结构图",
    secondaryCaption: "行程稿可核验到石林镇小箐村这一表述",
    focusTitle: "当前聚焦：石林 · 村寨节点",
    link: "https://cpc.people.com.cn/n1/2016/0120/c64094-28070892.html",
    linkLabel: "查看原文",
    linkStatus: "可跳转原文",
    reports: [
      {
        date: "2016-01-20",
        title: "总书记的云南情",
        source: "中国共产党新闻网",
        summary: "文内回顾 2008 年 11 月在石林县石林镇小箐村的相关行程。",
        link: "https://cpc.people.com.cn/n1/2016/0120/c64094-28070892.html",
        label: "查看原文",
        note: "当前已核验的权威行程稿使用“小箐村”表述，用户原始需求中的“小糯黑村”仍待进一步核对。",
      },
    ],
  },
  {
    id: "kunming",
    order: 3,
    year: "2008",
    city: "昆明",
    regionName: "昆明市",
    coords: [102.84, 24.89],
    title: "昆明市鼓楼街道桃源社区",
    date: "2008 年 11 月 17—19 日",
    tags: ["城市社区民生", "昆明市", "基层治理"],
    summary: "从村寨进入城市社区，云南足迹在这里转向困难群众生活保障、社区民生与基层治理。",
    activity: "慰问困难退休职工，了解城市低保和社区民生保障情况。",
    theme: "社区民生",
    source: "中国共产党新闻网",
    image: "assets/interview.png",
    imageAlt: "访谈与社区交流场景",
    imageCaption: "从社区走访进入民生与治理议题",
    secondaryImage: "assets/huotang-meeting.jpeg",
    secondaryAlt: "围坐交流的专题图像",
    secondaryCaption: "社区与村寨共同构成云南足迹的基层现场",
    focusTitle: "当前聚焦：昆明 · 桃源社区",
    link: "https://cpc.people.com.cn/n1/2016/0120/c64094-28070892.html",
    linkLabel: "查看原文",
    linkStatus: "可跳转原文",
    reports: [
      {
        date: "2016-01-20",
        title: "总书记的云南情",
        source: "中国共产党新闻网",
        summary: "文内回顾 2008 年 11 月在昆明市鼓楼街道桃源社区的看望慰问场景。",
        link: "https://cpc.people.com.cn/n1/2016/0120/c64094-28070892.html",
        label: "查看原文",
      },
    ],
  },
  {
    id: "ludian",
    order: 5,
    year: "2015",
    city: "鲁甸",
    regionName: "昭通市",
    coords: [103.55, 27.21],
    title: "昭通市鲁甸县龙头山镇、小寨镇灾后恢复重建点",
    date: "2015 年 1 月 19 日",
    tags: ["云南考察行程（1 月 19—21 日）", "昭通市", "灾后重建"],
    summary: "鲁甸节点把云南足迹延伸到灾后恢复重建现场，强调生活恢复、生产恢复和扶贫开发一起抓。",
    activity: "走访灾后恢复重建点，了解群众安置、住房质量、生产生活恢复和温暖过冬情况。",
    theme: "灾后重建",
    source: "中国政府网 / 新华社",
    image: "assets/simola-overview.png",
    imageAlt: "村寨与山地空间画面",
    imageCaption: "从空间重建进入生活恢复与生产恢复",
    secondaryImage: "assets/framework.png",
    secondaryAlt: "专题结构图",
    secondaryCaption: "灾后重建被重新放回云南足迹的时间线中理解",
    focusTitle: "当前聚焦：鲁甸 · 灾后恢复重建",
    link: "https://www.gov.cn/xinwen/2015-01/21/content_2807769.htm",
    linkLabel: "查看原文",
    linkStatus: "可跳转原文",
    reports: [
      {
        date: "2015-01-21",
        title: "习近平在云南考察工作时强调：坚决打好扶贫开发攻坚战",
        source: "中国政府网 / 新华社",
        summary: "文内完整覆盖鲁甸县小寨镇甘家寨红旗社区过渡安置点和龙头山镇恢复重建现场。",
        link: "https://www.gov.cn/xinwen/2015-01/21/content_2807769.htm",
        label: "查看原文",
      },
    ],
  },
  {
    id: "dali",
    order: 7,
    year: "2025",
    city: "大理",
    regionName: "大理白族自治州",
    coords: [100.16, 25.79],
    title: "大理州文旅融合与特色产业观察",
    date: "2025 年 2 月 21 日",
    tags: ["2025 年年度观察", "大理州", "文旅融合"],
    summary: "大理节点使用 2025 年权威文旅融合报道作为补充观察入口，强调文化保护、产业升级与各民族交往交流交融。",
    activity: "从权威公开报道进入文旅产业高质量发展、文物保护和特色产业体系建设的现实观察。",
    theme: "文旅融合",
    source: "云南省民族宗教事务委员会",
    image: "assets/hero-simola.png",
    imageAlt: "山地村寨与文化景观",
    imageCaption: "从村寨景观进入文旅融合与文化传播话题",
    secondaryImage: "assets/huotang-meeting.jpeg",
    secondaryAlt: "围坐交流图像",
    secondaryCaption: "文旅观察同样回到文化记忆与地方生活的现场",
    focusTitle: "当前聚焦：大理 · 文旅融合观察",
    link: "https://mzzj.yn.gov.cn/html/2025/difangdongtai_0221/4058178.html",
    linkLabel: "查看报道",
    linkStatus: "可跳转报道",
    reports: [
      {
        date: "2025-02-21",
        title: "大理州融合创新推进文旅产业高质量发展",
        source: "云南省民族宗教事务委员会",
        summary: "页面披露了大理州在文博事业、文旅产业体系和各民族交往交流交融方面的阶段性进展。",
        link: "https://mzzj.yn.gov.cn/html/2025/difangdongtai_0221/4058178.html",
        label: "查看报道",
        note: "本节点使用 2025 年权威文旅融合报道作为年度补充观察依据，并不冒充总书记实地考察原文。",
      },
    ],
  },
  {
    id: "lijiang",
    order: 8,
    year: "2025",
    city: "丽江",
    regionName: "丽江市",
    coords: [100.23, 26.87],
    title: "丽江市古城区丽江古城",
    date: "2025 年 3 月 19 日",
    tags: ["2025 年 3 月 19—20 日", "丽江市", "文旅发展"],
    summary: "丽江节点对应 2025 年 3 月在云南的实地考察，聚焦文化、风光、民俗与文旅产业的可持续发展。",
    activity: "考察丽江古城，强调文旅融合促进经济发展，文旅产业要走持续、健康的发展之路。",
    theme: "文化保护与发展",
    source: "新华社",
    image: "assets/hero-simola.png",
    imageAlt: "山地村寨与文化景观",
    imageCaption: "从丽江古城议题回看云南文化空间与旅游叙事",
    secondaryImage: "assets/simola-overview.png",
    secondaryAlt: "村寨与田园空间",
    secondaryCaption: "文旅产业议题同样需要回到地方生活与文化肌理",
    focusTitle: "当前聚焦：丽江 · 古城考察",
    link: "https://www.xinhuanet.com/politics/leaders/20250320/888e4c4341914cec84445c46fe769c57/c.html",
    linkLabel: "查看原文",
    linkStatus: "可跳转原文",
    reports: [
      {
        date: "2025-03-20",
        title: "习近平考察丽江古城：文旅产业要走一条持续、健康的发展之路",
        source: "新华社",
        summary: "直接对应 2025 年 3 月 19 日丽江古城考察现场，记录了关于文旅产业发展的原话。",
        link: "https://www.xinhuanet.com/politics/leaders/20250320/888e4c4341914cec84445c46fe769c57/c.html",
        label: "查看原文",
      },
      {
        date: "2025-03-20",
        title: "习近平在云南丽江市考察调研",
        source: "新华社",
        summary: "同页关联新闻入口，可补充阅读丽江考察的整组公开报道。",
        link: "https://www.news.cn/politics/leaders/20250320/dbbc8e58fff34e928cdff8cb8a440ea5/c.html",
        label: "查看报道",
      },
    ],
  },
];

const footprintStage = document.querySelector("[data-footprint-stage='map']");

if (footprintStage) {
  const footprintYearButtons = [...document.querySelectorAll("[data-footprint-year]")];
  const footprintYearCards = [...document.querySelectorAll("[data-footprint-year-card]")];
  const footprintNodeButtons = [...document.querySelectorAll("[data-footprint-node]")];

  const footprintYearNote = document.getElementById("footprintYearNote");
  const footprintFocusTitle = document.getElementById("footprintFocusTitle");
  const footprintFocusPrimary = document.getElementById("footprintFocusPrimary");
  const footprintFocusPrimaryCaption = document.getElementById("footprintFocusPrimaryCaption");
  const footprintFocusSecondary = document.getElementById("footprintFocusSecondary");
  const footprintFocusSecondaryCaption = document.getElementById("footprintFocusSecondaryCaption");
  const footprintDetailCard = document.getElementById("footprintDetailCard");
  const footprintDetailKicker = document.getElementById("footprintDetailKicker");
  const footprintDetailTitle = document.getElementById("footprintDetailTitle");
  const footprintDetailTags = document.getElementById("footprintDetailTags");
  const footprintDetailSummary = document.getElementById("footprintDetailSummary");
  const footprintDetailActivity = document.getElementById("footprintDetailActivity");
  const footprintDetailTheme = document.getElementById("footprintDetailTheme");
  const footprintDetailYear = document.getElementById("footprintDetailYear");
  const footprintDetailStatus = document.getElementById("footprintDetailStatus");
  const footprintPrimaryLink = document.getElementById("footprintPrimaryLink");
  const footprintSourceNote = document.getElementById("footprintSourceNote");
  const footprintReportsHint = document.getElementById("footprintReportsHint");
  const footprintReportList = document.getElementById("footprintReportList");
  const footprintMapSvg = document.getElementById("footprintMapSvg");
  const footprintMapRegions = document.getElementById("footprintMapRegions");
  const footprintMapRoutePrimary = document.getElementById("footprintMapRoutePrimary");
  const footprintMapRouteSecondary = document.getElementById("footprintMapRouteSecondary");
  const footprintMapRouteTertiary = document.getElementById("footprintMapRouteTertiary");

  const footprintYearViews = {
    all: "ALL 显示 2008、2015、2020、2025 全部节点，便于比较司莫拉与其他云南现场在同一张地图上的位置关系。",
    2008: "2008 年组聚焦 11 月 17—19 日的云南基层走访，覆盖勐海、宁洱、石林与昆明，形成村寨与社区并置的早期观察线索。",
    2015: "2015 年组聚焦 1 月 19—21 日云南考察中的鲁甸灾后恢复重建现场，强调生活恢复、生产恢复和扶贫开发一起抓。",
    2020: "2020 年组默认聚焦司莫拉节点，围绕脱贫攻坚、民族团结、火塘会与乡村振兴展开平台核心叙事。",
    2025: "2025 年组以 3 月 19 日丽江考察为主线，并补入 2025 年大理文旅融合权威报道作为年度观察依据。",
  };

  const footprintState = {
    year: "2020",
    activeId: "tengchong",
  };

  const getFootprintNode = (id) => footprintNodes.find((node) => node.id === id);

  const getVisibleFootprintNodes = () =>
    footprintState.year === "all"
      ? [...footprintNodes].sort((a, b) => a.order - b.order)
      : footprintNodes
          .filter((node) => node.year === footprintState.year)
          .sort((a, b) => a.order - b.order);

  const escapeFootprintHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const buildFootprintLink = (link, label, ariaLabel) => {
    const safeLabel = escapeFootprintHtml(label);
    const safeAria = escapeFootprintHtml(ariaLabel);
    const isPending = !link || link === "#";

    return `<a class="source-link footprint-report-link${isPending ? " is-pending" : ""}" href="${isPending ? "#" : escapeFootprintHtml(link)}"${isPending ? ' data-pending-link="true" aria-disabled="true"' : ' target="_blank" rel="noopener noreferrer"'} aria-label="${safeAria}">
      ${safeLabel}
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 17 17 7"></path>
        <path d="M9 7h8v8"></path>
      </svg>
    </a>`;
  };

  const yunnanBoundaryData =
    typeof window !== "undefined" && window.yunnanBoundaryData && Array.isArray(window.yunnanBoundaryData.features)
      ? window.yunnanBoundaryData
      : null;

  const createFootprintMapModel = () => {
    if (!yunnanBoundaryData || !footprintMapSvg) return null;

    const viewBox = footprintMapSvg.viewBox.baseVal;
    const width = viewBox && viewBox.width ? viewBox.width : 620;
    const height = viewBox && viewBox.height ? viewBox.height : 500;
    const padding = 42;
    const points = [];

    const collectPoints = (coordinates) => {
      coordinates.forEach((entry) => {
        if (typeof entry[0] === "number" && typeof entry[1] === "number") {
          points.push(entry);
          return;
        }
        collectPoints(entry);
      });
    };

    yunnanBoundaryData.features.forEach((feature) => {
      if (feature.geometry?.coordinates) {
        collectPoints(feature.geometry.coordinates);
      }
    });

    if (!points.length) return null;

    const longitudes = points.map((point) => point[0]);
    const latitudes = points.map((point) => point[1]);
    const minLon = Math.min(...longitudes);
    const maxLon = Math.max(...longitudes);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const scaleX = (width - padding * 2) / (maxLon - minLon);
    const scaleY = (height - padding * 2) / (maxLat - minLat);
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (width - (maxLon - minLon) * scale) / 2;
    const offsetY = (height - (maxLat - minLat) * scale) / 2;

    const project = ([lon, lat]) => ({
      x: offsetX + (lon - minLon) * scale,
      y: offsetY + (maxLat - lat) * scale,
    });

    const ringToPath = (ring) =>
      ring
        .map((point, index) => {
          const projected = project(point);
          return `${index === 0 ? "M" : "L"}${projected.x.toFixed(2)} ${projected.y.toFixed(2)}`;
        })
        .join(" ") + " Z";

    const polygonToPath = (polygon) => polygon.map((ring) => ringToPath(ring)).join(" ");

    const featurePaths = yunnanBoundaryData.features.map((feature) => {
      const geometry = feature.geometry;
      const path = geometry.type === "Polygon"
        ? polygonToPath(geometry.coordinates)
        : geometry.coordinates.map((polygon) => polygonToPath(polygon)).join(" ");

      return {
        name: feature.properties?.name || "",
        path,
      };
    });

    return {
      width,
      height,
      project,
      featurePaths,
    };
  };

  const footprintMapModel = createFootprintMapModel();

  const createFootprintSvgNode = (tagName, attributes = {}) => {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    Object.entries(attributes).forEach(([name, value]) => {
      node.setAttribute(name, value);
    });
    return node;
  };

  const renderFootprintRealMap = () => {
    if (!footprintMapModel || !footprintMapRegions) return;

    footprintMapRegions.innerHTML = "";
    footprintMapModel.featurePaths.forEach((feature) => {
      const regionPath = createFootprintSvgNode("path", {
        d: feature.path,
        class: "footprint-map-region",
        "data-region-name": feature.name,
      });
      footprintMapRegions.append(regionPath);
    });
  };

  const buildFootprintRoutePath = (nodes) => {
    if (!footprintMapModel || nodes.length < 2) return "";
    return nodes
      .map((node, index) => {
        const point = footprintMapModel.project(node.coords);
        return `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
      })
      .join(" ");
  };

  const buildFootprintFocusRoute = (nodes, activeId) => {
    if (!nodes.length || !activeId) return "";

    const activeIndex = nodes.findIndex((node) => node.id === activeId);
    if (activeIndex === -1) return "";

    if (nodes.length === 2) {
      return buildFootprintRoutePath(nodes);
    }

    if (activeIndex === 0) {
      return buildFootprintRoutePath(nodes.slice(0, 2));
    }

    if (activeIndex === nodes.length - 1) {
      return buildFootprintRoutePath(nodes.slice(-2));
    }

    return buildFootprintRoutePath(nodes.slice(activeIndex - 1, activeIndex + 2));
  };

  const positionFootprintMapPins = () => {
    if (!footprintMapModel) return;

    document.querySelectorAll(".footprint-map-pin[data-footprint-node]").forEach((button) => {
      const node = getFootprintNode(button.dataset.footprintNode);
      if (!node?.coords) return;
      const point = footprintMapModel.project(node.coords);
      const x = (point.x / footprintMapModel.width) * 100;
      const y = (point.y / footprintMapModel.height) * 100;
      button.style.setProperty("--x", `${x.toFixed(2)}%`);
      button.style.setProperty("--y", `${y.toFixed(2)}%`);
    });
  };

  const syncFootprintRegionHighlight = () => {
    if (!footprintMapRegions) return;
    const activeNode = getFootprintNode(footprintState.activeId);
    const activeRegion = activeNode?.regionName || "";

    footprintMapRegions.querySelectorAll(".footprint-map-region").forEach((region) => {
      region.classList.toggle("is-active", region.getAttribute("data-region-name") === activeRegion);
    });
  };

  const syncFootprintRoutes = () => {
    if (!footprintMapRoutePrimary || !footprintMapRouteSecondary || !footprintMapRouteTertiary) return;

    const allNodes = [...footprintNodes].sort((a, b) => a.order - b.order);
    const visibleNodes = getVisibleFootprintNodes();
    const routePrimary = buildFootprintRoutePath(allNodes);
    const routeSecondary =
      footprintState.year === "all" ? "" : buildFootprintRoutePath(visibleNodes);
    const routeTertiary = buildFootprintFocusRoute(allNodes, footprintState.activeId);

    footprintMapRoutePrimary.setAttribute("d", routePrimary);
    footprintMapRoutePrimary.classList.toggle("is-empty", !routePrimary);
    footprintMapRouteSecondary.setAttribute("d", routeSecondary);
    footprintMapRouteSecondary.classList.toggle("is-empty", !routeSecondary);
    footprintMapRouteTertiary.setAttribute("d", routeTertiary);
    footprintMapRouteTertiary.classList.toggle("is-empty", !routeTertiary);
  };

  const syncFootprintFilters = () => {
    footprintYearButtons.forEach((button) => {
      const isActive = button.dataset.footprintYear === footprintState.year;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    footprintYearCards.forEach((card) => {
      card.classList.toggle("is-active", card.dataset.footprintYearCard === footprintState.year);
    });

    footprintNodeButtons.forEach((button) => {
      const node = getFootprintNode(button.dataset.footprintNode);
      if (!node) return;

      const isActive = node.id === footprintState.activeId;
      const isMapPin = button.classList.contains("footprint-map-pin");
      const isVisible = footprintState.year === "all" || node.year === footprintState.year;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));

      if (isMapPin) {
        button.classList.toggle("is-hidden", !isVisible);
        button.tabIndex = 0;
      }
    });

    if (footprintYearNote) {
      footprintYearNote.textContent = footprintYearViews[footprintState.year] || footprintYearViews.all;
    }

    syncFootprintRegionHighlight();
    syncFootprintRoutes();
  };

  const setFootprintPrimaryLink = (node) => {
    if (!footprintPrimaryLink) return;

    const isPending = !node.link || node.link === "#";
    footprintPrimaryLink.textContent = node.linkLabel;
    footprintPrimaryLink.href = isPending ? "#" : node.link;
    footprintPrimaryLink.classList.toggle("is-disabled", isPending);
    footprintPrimaryLink.setAttribute("aria-disabled", String(isPending));
    footprintPrimaryLink.setAttribute("aria-label", `${node.title}${node.linkLabel}`);

    if (isPending) {
      footprintPrimaryLink.removeAttribute("target");
      footprintPrimaryLink.removeAttribute("rel");
      footprintPrimaryLink.dataset.pendingLink = "true";
    } else {
      footprintPrimaryLink.setAttribute("target", "_blank");
      footprintPrimaryLink.setAttribute("rel", "noopener noreferrer");
      delete footprintPrimaryLink.dataset.pendingLink;
    }
  };

  const renderFootprintReports = (node) => {
    if (!footprintReportList) return;

    if (footprintReportsHint) {
      footprintReportsHint.textContent = `当前节点已核验 ${node.reports.length} 条相关原文或依据入口，可直接跳转至对应发布页面。`;
    }

    footprintReportList.innerHTML = node.reports
      .map((report, index) => {
        const noteMarkup = report.note
          ? `<span class="footprint-report-note">${escapeFootprintHtml(report.note)}</span>`
          : "";

        return `<article class="footprint-report-item${index === 0 ? " is-active" : ""}">
          <div class="footprint-report-index">${String(index + 1).padStart(2, "0")}</div>
          <div class="footprint-report-copy">
            <span class="footprint-report-date">${escapeFootprintHtml(report.date)}</span>
            <h3>${escapeFootprintHtml(report.title)}</h3>
            <p class="footprint-report-summary">${escapeFootprintHtml(report.summary)}</p>
            <span class="footprint-report-source">来源：${escapeFootprintHtml(report.source)}</span>
            ${noteMarkup}
          </div>
          ${buildFootprintLink(report.link, report.label, `在新窗口打开${report.title}`)}
        </article>`;
      })
      .join("");
  };

  const renderFootprintDetail = () => {
    const node = getFootprintNode(footprintState.activeId);
    if (!node) return;

    if (footprintFocusTitle) footprintFocusTitle.textContent = node.focusTitle;

    if (footprintFocusPrimary) {
      footprintFocusPrimary.src = node.image;
      footprintFocusPrimary.alt = node.imageAlt;
    }

    if (footprintFocusPrimaryCaption) footprintFocusPrimaryCaption.textContent = node.imageCaption;

    if (footprintFocusSecondary) {
      footprintFocusSecondary.src = node.secondaryImage;
      footprintFocusSecondary.alt = node.secondaryAlt;
    }

    if (footprintFocusSecondaryCaption) footprintFocusSecondaryCaption.textContent = node.secondaryCaption;

    if (footprintDetailCard) {
      footprintDetailCard.style.setProperty("--footprint-detail-image", `url("${node.image}")`);
    }

    if (footprintDetailKicker) {
      footprintDetailKicker.textContent =
        node.year === "2020" ? "2020 年核心案例" : `${node.year} 年节点档案`;
    }

    if (footprintDetailTitle) footprintDetailTitle.textContent = node.title;

    if (footprintDetailTags) {
      footprintDetailTags.innerHTML = node.tags
        .map((tag) => `<span class="meta-pill">${escapeFootprintHtml(tag)}</span>`)
        .join("");
    }

    if (footprintDetailSummary) footprintDetailSummary.textContent = node.summary;
    if (footprintDetailActivity) footprintDetailActivity.textContent = node.activity;
    if (footprintDetailTheme) footprintDetailTheme.textContent = node.theme;
    if (footprintDetailYear) footprintDetailYear.textContent = node.year;
    if (footprintDetailStatus) footprintDetailStatus.textContent = node.linkStatus;
    if (footprintSourceNote) footprintSourceNote.textContent = `来源：${node.source}`;

    setFootprintPrimaryLink(node);
    renderFootprintReports(node);
    syncFootprintFilters();
  };

  const ensureFootprintActiveNode = () => {
    const visibleNodes = getVisibleFootprintNodes();
    if (!visibleNodes.length) return;

    const stillVisible = visibleNodes.some((node) => node.id === footprintState.activeId);
    if (!stillVisible) {
      footprintState.activeId = footprintState.year === "2020" ? "tengchong" : visibleNodes[0].id;
    }
  };

  const setFootprintYear = (year) => {
    if (!year || footprintState.year === year) return;
    footprintState.year = year;
    ensureFootprintActiveNode();
    renderFootprintDetail();
  };

  const setFootprintNode = (id, shouldScroll = false) => {
    const node = getFootprintNode(id);
    if (!node) return;

    footprintState.activeId = node.id;
    if (footprintState.year !== "all") {
      footprintState.year = node.year;
    }

    renderFootprintDetail();

    if (shouldScroll && window.innerWidth <= 1080) {
      footprintDetailCard?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  footprintYearButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setFootprintYear(button.dataset.footprintYear);
    });
  });

  footprintYearCards.forEach((card) => {
    card.addEventListener("click", () => {
      setFootprintYear(card.dataset.footprintYearCard);
    });
  });

  footprintNodeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setFootprintNode(button.dataset.footprintNode, true);
    });
  });

  renderFootprintRealMap();
  positionFootprintMapPins();
  ensureFootprintActiveNode();
  renderFootprintDetail();
}
