import * as pdfjsLib from "./vendor/pdf.mjs";

const results = document.querySelector("#results");
const status = document.querySelector("#status");
const canvasWrap = document.querySelector("#canvasWrap");

function addResult(label, ok, detail = "") {
  const item = document.createElement("li");
  item.className = ok ? "ok" : "fail";
  item.textContent = `${label}：${ok ? "正常" : detail || "失败"}`;
  results.append(item);
}

function showStatus(text, ok) {
  status.textContent = text;
  status.style.background = ok ? "#e0f0e7" : "#fae6e2";
  status.style.color = ok ? "#244a37" : "#7c3930";
}

function pdfOptions() {
  const root = new URL("./vendor/", import.meta.url).href;
  return {
    cMapUrl: `${root}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${root}standard_fonts/`,
    wasmUrl: `${root}wasm/`,
    iccUrl: `${root}iccs/`,
  };
}

async function run() {
  try {
    addResult("浏览器标识", true, navigator.userAgent);
    addResult(
      "Promise.withResolvers",
      typeof Promise.withResolvers === "function"
    );
    addResult("ReadableStream", typeof ReadableStream === "function");

    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "./vendor/pdf.worker.polyfilled.mjs",
      import.meta.url
    ).href;

    const workerResponse = await fetch(pdfjsLib.GlobalWorkerOptions.workerSrc, {
      cache: "no-store",
    });
    addResult(
      "PDF worker 下载",
      workerResponse.ok,
      `HTTP ${workerResponse.status}`
    );

    const sampleUrl = new URL("./assets/sample-paper.pdf", import.meta.url).href;
    const sampleResponse = await fetch(sampleUrl, { cache: "no-store" });
    addResult("示例 PDF 下载", sampleResponse.ok, `HTTP ${sampleResponse.status}`);

    const doc = await pdfjsLib.getDocument({
      ...pdfOptions(),
      url: sampleUrl,
    }).promise;
    addResult("PDF 文档解析", true, `共 ${doc.numPages} 页`);

    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: 1.2 });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width * 2);
    canvas.height = Math.floor(viewport.height * 2);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    const context = canvas.getContext("2d", { alpha: false });
    await page.render({
      canvasContext: context,
      viewport,
      transform: [2, 0, 0, 2, 0, 0],
    }).promise;
    canvasWrap.hidden = false;
    canvasWrap.append(canvas);
    addResult("页面画布渲染", true);

    const container = document.createElement("div");
    const stream = page.streamTextContent({ includeMarkedContent: true });
    const textLayer = new pdfjsLib.TextLayer({
      textContentSource: stream,
      container,
      viewport,
    });
    await textLayer.render();
    addResult("文字层渲染", true);

    showStatus("检测完成：核心渲染流程正常", true);
  } catch (error) {
    addResult("失败步骤", false, `${error?.message || error}`);
    showStatus(`检测失败：${error?.message || error}`, false);
  }
}

run();
