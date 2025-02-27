document.addEventListener("DOMContentLoaded", () => {
    const sceneEl = document.querySelector('a-scene');
    let arSystem;
    sceneEl.addEventListener('loaded', () => {
      arSystem = sceneEl.systems["mindar-image-system"];
      arSystem.start();
    });
    let marker2SequenceDone = false;
    let marker2FormActive = false;
    const markers = ["marker0", "marker1", "marker2"];
    const playVideo = (video, planeEl, idx) => {
      planeEl.setAttribute("material", "src: #video" + idx + "; transparent: true; opacity: 0");
      planeEl.removeAttribute("animation__fadein");
      planeEl.removeAttribute("animation__fadeout");
      video.currentTime = 0;
      video.play();
      planeEl.setAttribute("animation__fadein", "property: material.opacity; from: 0; to: 1; dur: 2000; easing: linear");
    };
    const fadeOut = (planeEl, duration) => {
      planeEl.setAttribute("animation__fadeout", `property: material.opacity; from: 1; to: 0; dur: ${duration}; easing: linear`);
      setTimeout(() => {
        planeEl.removeAttribute("material");
        planeEl.removeAttribute("animation__fadeout");
        planeEl.setAttribute("visible", "false");
      }, duration);
    };
    markers.forEach((markerId, idx) => {
      const markerEl = document.getElementById(markerId);
      const planeEl = markerEl.querySelector("a-plane");
      const video = document.getElementById("video" + idx);
      markerEl.addEventListener("targetFound", () => {
        console.log(markerId + " target found");
        if(idx === 2 && !marker2SequenceDone && marker2FormActive) {
          planeEl.setAttribute("visible", "true");
          planeEl.setAttribute("material", "src: url(target2.png); transparent: true; opacity: 1");
          return;
        }
        planeEl.setAttribute("visible", "true");
        if(video.paused) playVideo(video, planeEl, idx);
      });
      markerEl.addEventListener("targetLost", () => {
        console.log(markerId + " target lost");
        video.pause();
        video.currentTime = 0;
        fadeOut(planeEl, 500);
      });
      planeEl.addEventListener("click", (e) => {
        console.log(markerId + " plane clicked");
        e.stopPropagation();
        if(idx === 2 && !marker2SequenceDone && marker2FormActive) return;
        if(video.paused) {
          planeEl.setAttribute("visible", "true");
          playVideo(video, planeEl, idx);
        }
      });
      if(idx === 2) {
        video.addEventListener("ended", () => {
          if(!marker2SequenceDone) {
            fadeOut(planeEl, 2000);
            setTimeout(() => {
              marker2FormActive = true;
              const form = document.createElement("form");
              form.style.position = "absolute";
              form.style.top = "50%";
              form.style.left = "50%";
              form.style.transform = "translate(-50%, -50%)";
              form.style.zIndex = "9999";
              form.style.background = "rgba(255,255,255,0.8)";
              form.style.padding = "20px";
              form.style.borderRadius = "8px";
              form.style.textAlign = "center";
              const input = document.createElement("input");
              input.type = "text";
              input.placeholder = "合言葉を入力";
              input.style.fontSize = "16px";
              input.style.padding = "8px";
              input.style.marginBottom = "10px";
              input.style.textAlign = "center";
              const button = document.createElement("button");
              button.type = "submit";
              button.textContent = "送信";
              button.style.fontSize = "16px";
              button.style.padding = "8px 16px";
              button.style.cursor = "pointer";
              form.appendChild(input);
              form.appendChild(document.createElement("br"));
              form.appendChild(button);
              document.body.appendChild(form);
              form.addEventListener("submit", (e) => {
                e.preventDefault();
                const pass = input.value.trim();
                if(pass === "dentsu") {
                  console.log("正解の合言葉です！");
                  video.src = "target2-2.mp4";
                } else {
                  console.log("合言葉が違います！");
                  video.src = "target2-3.mp4";
                }
                marker2SequenceDone = true;
                marker2FormActive = false;
                video.currentTime = 0;
                video.play();
                planeEl.setAttribute("visible", "true");
                planeEl.setAttribute("material", "src: #video2; transparent: true; opacity: 0");
                planeEl.removeAttribute("animation__fadein");
                planeEl.setAttribute("animation__fadein", "property: material.opacity; from: 0; to: 1; dur: 2000; easing: linear");
                document.body.removeChild(form);
              });
            }, 2000);
          } else {
            fadeOut(planeEl, 2000);
          }
        });
      } else {
        video.addEventListener("ended", () => {
          fadeOut(planeEl, 2000);
        });
      }
    });
  });