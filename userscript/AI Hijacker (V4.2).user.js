// ==UserScript==
// @name         全平台 AI 劫持者 (V4.2 修复版)
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  抓取 LLM 中的图片和文本，可在 match 中添加需要支持的网站
// @match        *://*.grok.com/*
// @match        *://chatgpt.com/*
// @match        *://gemini.google.com/*
// @match        *://kimi.moonshot.cn/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // 任务一：劫持复制操作 (保持不变)
    if (navigator.clipboard) {
        const originalWriteText = navigator.clipboard.writeText;
        navigator.clipboard.writeText = async function(text) {
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://127.0.0.1:5000/receive",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ "html_content": text })
            });
            return originalWriteText.apply(this, arguments);
        };

        const originalWrite = navigator.clipboard.write;
        navigator.clipboard.write = async function(dataArray) {
            try {
                for (let item of dataArray) {
                    if (item.types.includes('text/plain')) {
                        const blob = await item.getType('text/plain');
                        const text = await blob.text();
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: "http://127.0.0.1:5000/receive",
                            headers: { "Content-Type": "application/json" },
                            data: JSON.stringify({ "html_content": text })
                        });
                        break;
                    }
                }
            } catch (e) {}
            return originalWrite.apply(this, arguments);
        };
    }

    // 任务二：图片投屏按钮 (修复状态黏连 Bug)
    window.addEventListener('DOMContentLoaded', () => {
        let hoverBtn = document.createElement("button");
        hoverBtn.innerHTML = "📺 投屏到渲染舱";
        hoverBtn.style.cssText = "position:fixed; display:none; z-index:999999; background:rgba(155, 89, 182, 0.9); color:white; border:none; padding:8px 14px; border-radius:6px; cursor:pointer; font-weight:bold; box-shadow:0 4px 10px rgba(0,0,0,0.3); backdrop-filter: blur(4px); transition: 0.2s;";
        document.body.appendChild(hoverBtn);

        let currentImgSrc = "";

        document.addEventListener('mousemove', function(e) {
            const elementsUnderCursor = document.elementsFromPoint(e.clientX, e.clientY);
            const targetImg = elementsUnderCursor.find(el => el.tagName === 'IMG' && el.width > 80);

            if (targetImg) {
                let rect = targetImg.getBoundingClientRect();
                hoverBtn.style.top = (rect.top + 10) + 'px';
                hoverBtn.style.left = (rect.right - 140) + 'px';
                hoverBtn.style.display = 'block';
                currentImgSrc = targetImg.src;
            } else if (e.target !== hoverBtn) {
                hoverBtn.style.display = 'none';
            }
        });

        hoverBtn.onclick = function() {
            if (!currentImgSrc) return;
            hoverBtn.innerHTML = "⏳ 抓取中...";
            hoverBtn.style.background = "#e67e22";

            GM_xmlhttpRequest({
                method: "GET",
                url: currentImgSrc,
                responseType: "blob",
                onload: function(res) {
                    let reader = new FileReader();
                    reader.onloadend = function() {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: "http://127.0.0.1:5000/receive_image",
                            headers: { "Content-Type": "application/json" },
                            data: JSON.stringify({ "image_base64": reader.result }),
                            onload: function() {
                                hoverBtn.innerHTML = "✅ 已投屏！";
                                hoverBtn.style.background = "#2ecc71";
                                setTimeout(() => {
                                    // 💡 修复核心：在隐藏前，强制把文字和颜色洗回原样
                                    hoverBtn.innerHTML = "📺 投屏到渲染舱";
                                    hoverBtn.style.background = "rgba(155, 89, 182, 0.9)";
                                    hoverBtn.style.display = 'none';
                                }, 1500);
                            }
                        });
                    }
                    reader.readAsDataURL(res.response);
                }
            });
        };
    });
})();