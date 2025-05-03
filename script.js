window.addEventListener("DOMContentLoaded", () => {
    const band = document.getElementById("blackBand");
    const teeContainer = document.querySelector(".tee-container");
    const button = document.getElementById("actionBtn");
    const message = document.getElementById("message");
    const heartsEl = document.getElementById("hearts");
    const stageEl = document.getElementById("stage");
    const popup = document.getElementById("popup");
    const clearPopup = document.getElementById("clearPopup");
    const rewardBtn = document.getElementById("rewardBtn");
    const introScreen = document.getElementById("introScreen");
    const gameScreen = document.getElementById("gameScreen");
    const startChallengeBtn = document.getElementById("startChallengeBtn");
    // const shareBtn = document.getElementById("shareBtn");
    const shareBtn1 = document.querySelector("#shareBtn"); //인트로
    const shareBtn2 = document.querySelector("#popup #shareBtn"); // 팝업 내부
  
  
    let isIntro = true;
  
    let animationId;
    let depth = 0;
    let isRunning = false;
    let isReadyForNextStage = false;
    // let currentBottom = 120;
    let currentTop = -30;
    let maxDistanceFromStart;
  
  
    let stage = 1;
    let hearts = 3;
    const MAX_STAGE = 5;
    const titleEl = document.querySelector(".intro-title");
  
  
  
    shareBtn1?.addEventListener("click", () => {
      console.log("📤 인트로 공유 버튼 클릭됨");
    });
  
    shareBtn2?.addEventListener("click", () => {
      console.log("📤 팝업 공유 버튼 클릭됨");
      hearts = 3;
      resetGame();
      popup.classList.add("hidden");
    });
  
    rewardBtn?.addEventListener("click", () => {
      resetGame();
      clearPopup.classList.add("hidden");
    });
  
  
    startChallengeBtn?.addEventListener("click", () => {
      console.log("🎯 게임시작버튼 클릭됨!");
  
      // 화면 전환
      introScreen?.classList.add("hidden");
      gameScreen?.classList.remove("hidden");
  
      // 상태 초기화
      isIntro = false;
      stage = 1;
      prepareStage();
    });
    
    // 버튼 클릭했을 때 실행할 함수 따로 정의
    function handleButtonClick() {
      console.log("[handleButtonClick] 실행됨");
      console.log("현재 버튼 텍스트:", button.textContent);
      console.log("stage:", stage, "isRunning:", isRunning);
      console.log("lightGreenScreen visible?", !document.getElementById("lightGreenScreen").classList.contains("hidden"));
  
      if (isIntro) {
        isIntro = false;
        stage = 1;
        prepareStage();
        return;
      }
  
      if (button.classList.contains("retry")) {
        if (hearts <= 0) hearts = 3;
        resetGame();
        return;
      }
  
      if (isReadyForNextStage) {
        stage++;
        prepareStage();
        return;
      }
      
      // ✅ [중요] '할인 쿠폰 5천원 받기' 상태일 때 처리
      if (button.textContent === "할인 쿠폰 5천원 받기") {
        console.log("✅ 할인 쿠폰 버튼 클릭됨");
  
        document.getElementById("gameField")?.classList.add("hidden");
        // document.getElementById("message")?.classList.add("hidden");
        document.getElementById("lightGreenScreen")?.classList.remove("hidden");
        message.classList.remove("hidden");
        message.innerHTML = "김캐디 앱에서<br>예약하고 결제할때 사용할 수 있어요";
        button.textContent = "처음부터 시작하기"; // 이후 눌렀을 때 게임 재시작하도록 설정
        return;
      }
  
      // ✅ 보상 화면에서 '처음부터 시작하기' 눌렀을 경우 → 초기화
      if (button.textContent === "처음부터 시작하기") {
        document.getElementById("gameField")?.classList.remove("hidden");
        document.getElementById("message")?.classList.remove("hidden");
        document.getElementById("lightGreenScreen")?.classList.add("hidden");
        button.textContent = "START";
        resetGame();
        return;
      }
  
      if (!isRunning) {
        startGame();
      } else {
        stopGame();
      }
    }
    
  
    // 버튼 클릭할 때 이 함수만 연결
    button.addEventListener("click", handleButtonClick);
  
    function updateStatus() {
      heartsEl.innerHTML = ''; // 기존 하트 지우고
  
      for (let i = 0; i < hearts; i++) {
        const img = document.createElement('img');
        img.src = 'https://i.ibb.co/sdv9SBnV/image.png'; // 빨간 하트
        img.alt = 'red heart';
        img.className = 'heart-img'; // css로 크기 통일
        heartsEl.appendChild(img);
      }
  
      for (let i = hearts; i < 3; i++) {
        const img = document.createElement('img');
        img.src = 'https://i.ibb.co/Y7spyDBR/2.png'; // 회색 하트
        img.alt = 'gray heart';
        img.className = 'heart-img';
        heartsEl.appendChild(img);
      }
  
      stageEl.textContent = `${stage}단계 진행 중`;
    }
  
    function getSpeed(stage) {
      switch (stage) {
        case 1: return 0.6;
        case 2: return 0.6;
        case 3: return 0.6;
        case 4: return 0.6;
        case 5: return 0.6;
        default: return 1.0;
      }
    }
  
  
    // 티 높이 대비 검정 띠 높이 비율
    function getBandHeightRatio(stage) {
      switch (stage) {
        case 1: return 0.12;
        case 2: return 0.11;
        case 3: return 0.11;
        case 4: return 0.11;
        case 5: return 0.11;
        default: return 0.03;
      }
    }
  
  
  
    function prepareStage() {
      depth = 0;
      currentTop = -30;
      isRunning = false;
      isReadyForNextStage = false;
      teeContainer.style.top = currentTop + "%";
  
  
      const teeHeight = teeContainer.offsetHeight;
      const bandHeight = teeHeight * getBandHeightRatio(stage);
  
      band.style.height = `${bandHeight}px`;
  
  
      // intro일 때: 메시지만 보여주고 stage 숨기기
      if (isIntro) {
        stageEl.style.display = "none";  // stage 숨기기
        // typeMessage("내 골프티를<br>검정색 선까지만 꽂아줘");
        document.getElementById("message").innerHTML = "내 골프티를 검정색 선까지만 꽂아줘";
  
        button.textContent = "티꽂기 게임 시작하기";
        button.classList.remove("stop", "retry");
        return;
      }
  
      // 일반 단계 시작 시
      stageEl.style.display = "block"; // 다시 보여주기
      button.textContent = "START";
      button.classList.remove("stop", "retry");
  
      updateStatus(); // stage 텍스트 등 갱신
      setMessage(getStageMessage(stage));
  
      setTimeout(() => {
        const bandRect = band.getBoundingClientRect();
        const bandCenter = (bandRect.top + bandRect.bottom) / 2;
        const frameRect = document.querySelector(".mobile-frame").getBoundingClientRect();
        const grassTop = frameRect.top + frameRect.height * 0.6;
        maxDistanceFromStart = Math.abs(bandCenter - grassTop);
        console.log(`📏 maxDistanceFromStart = ${maxDistanceFromStart}px`);
      }, 100); // DOM 렌더링 후 측정 위해 약간 지연
    }
  
  
  
    function startGame() {
      isRunning = true;
      isReadyForNextStage = false;
      button.textContent = "STOP";
      button.classList.add("stop");
  
      if (stage === 1) {
        setMessage(`stage1내 골프티를 검정색 선까지만 꽂아줘`);
      } else {
        setMessage(getStageMessage(stage));
      }
  
      animateTee();
    }
  
    function getSuccessMessage(stage, score, feedback) {
      switch (stage) {
        case 1:
          return `1단계는 ${score}점으로 통과!<br>${feedback}좋아 끝까지 이렇게 하면 돼!`;
        case 2:
          return `2단계는 ${score}점으로 통과!<br>${feedback}이제부터는 속도가 빨라질거야`;
        case 3:
          return `3단계는 ${score}점으로 통과!<br>${feedback}이제 두 번밖에 안 남았어`;
        case 4:
          return `4단계는 ${score}점으로 통과!<br>${feedback}이번에 통과하면 1만원 할인 쿠폰 바로 지급`;
        default:
          return `${stage}단계는 ${score}점으로 통과!<br>${feedback}${stage + 1}단계도 통과할 수 있을거야!`;
      }
    }
  
    function getFailMessage(stage, score, feedback) {
      switch (stage) {
        case 1:
          return `1단계는 ${score}점으로 실패!<br>${feedback}<다시 하면 잘할 수 있을 거야`;
        case 2:
          return `2단계는 ${score}점으로 실패!<br>${feedback}아깝다, 한 번 더 도전해봐`;
        case 3:
          return `3단계는 ${score}점으로 실패!<br>${feedback}집중해서 다시 해보자`;
        case 4:
          return `4단계는 ${score}점으로 실패!<br>${feedback}조금만 더!`;
        case 5:
          return `5단계는 ${score}점으로 실패!<br>${feedback}아쉽다! 하지만 다시 하면 분명 성공할 수 있어`;
        default:
          return `${stage}단계는 ${score}점으로 실패!<br>${feedback}다시 도전해봐`;
      }
    }
  
    function getStageMessage(stage) {
      switch (stage) {
        case 1:
          return "내 골프티를<br>검정색 선까지만 꽂아줘";
        case 2:
          return "내 골프티를<br>검정색 선까지만 꽂아줘";
        case 3:
          return "내 골프티를<br>검정색 선까지만 꽂아줘";
        case 4:
          return "내 골프티를<br>검정색 선까지만 꽂아줘";
        case 5:
          return "지금 5단계 통과하면<br>1만원 할인쿠폰 바로 지급!";
        default:
          return "시작해볼까?";
      }
    }
    
    function setMessage(text) {
      message.innerHTML = text;
      message.style.animation = "none";
    }
  
    
    function animateTee() {
      if (!isRunning) return;
  
      // depth += getSpeed(stage);
      // currentBottom = 120 - depth;
      // teeContainer.style.bottom = currentBottom + "px";
      depth += getSpeed(stage);           // top은 점점 내려와야 하므로 증가
      currentTop = -30 + depth;
      teeContainer.style.top = currentTop + "%";
  
      const ballRect = teeContainer.querySelector(".ball").getBoundingClientRect();
      const ballBottom = ballRect.bottom;
      const fieldRect = document.querySelector(".field").getBoundingClientRect();
      const grassTop = fieldRect.top + fieldRect.height * 0.7; // mobile-frame에서 70%,30% 기준으로 하늘/잔디 경계 구분함
      // const grassRect = document.querySelector(".grass").getBoundingClientRect();
      // const grassTop = grassRect.top;
  
      if (ballBottom >= grassTop) {
        cancelAnimationFrame(animationId);
        isRunning = false;
        setMessage("으악! 티가 땅에 파묻혔어<br>처음부터 다시 꽂아줘");
        handleFail();
        return;
      }
  
      animationId = requestAnimationFrame(animateTee);
    }
  
  
    function calculateScoreAndFeedback(bandTop, bandBottom, grassTop) {
      const bandCenter = (bandTop + bandBottom) / 2;
      const distance = Math.abs(bandCenter - grassTop);
  
      let score = 0;
  
      if (distance.toFixed(2) === "0.00") {
        score = 100;
      } else if (maxDistanceFromStart && maxDistanceFromStart > 0) {
        // 1점 단위 정밀 계산
        const percent = 1 - (distance / maxDistanceFromStart);
        score = Math.max(0, Math.round(percent * 100));
      }
  
      let feedback = "";
      if (bandBottom < grassTop) {
        feedback = "너무 빨리 멈췄어요";
      } else if (bandTop > grassTop) {
        feedback = "조금 늦게 멈췄어요";
      } else {
        feedback = "잘 멈췄어요.";
      }
  
      return { score, feedback };
    }
  
  
  
    function stopGame() {
      cancelAnimationFrame(animationId);
      isRunning = false;
      button.classList.remove("stop");
  
      // 다음 프레임에서 위치 측정
      requestAnimationFrame(() => {
        const bandRect = band.getBoundingClientRect();
        const bandTop = bandRect.top;
        const bandBottom = bandRect.bottom;
  
        const frameRect = document.querySelector(".mobile-frame").getBoundingClientRect();
        const grassTop = frameRect.top + frameRect.height * 0.6;
  
        const isSuccess = grassTop >= bandTop && grassTop <= bandBottom;
  
        const bandCenter = (bandTop + bandBottom) / 2;
        const distance = Math.abs(bandCenter - grassTop);
        console.log(`📏 maxDistanceFromStart = ${maxDistanceFromStart}px`);
        console.log(`📏 현재 distance = ${distance}px`);
        console.log(`📏 bandCenter = ${bandCenter}, bandTop = ${bandTop}, bandBottom = ${bandBottom}, grassTop = ${grassTop}`);
  
  
        const { score, feedback } = calculateScoreAndFeedback(bandTop, bandBottom, grassTop);
        console.log(`[stopGame] stage: ${stage}, score: ${score}, feedback: ${feedback}`);
  
        if (isSuccess) {
          if (stage === MAX_STAGE) {
            setMessage(`5단계는 ${score}점으로 통과!<br>${feedback}<br>완벽한 티샷을 날릴 수 있겠어!`);
            button.textContent = "할인 쿠폰 5천원 받기";
            button.disabled = false;
            // clearPopup.classList.remove("hidden");
          } else {
            setMessage(getSuccessMessage(stage, score, feedback));
            isReadyForNextStage = true;
            // button.textContent = `${stage + 1}단계 도전하기`;
            button.textContent = `다음 티 꽂기`
          }
        } else {
          const failText = getFailMessage(stage, score, feedback);
          setMessage(failText);
          teeContainer.style.top = currentTop + "%";
          handleFail();
        }
  
        updateStatus();
        drawDebugLines();
      });
    }
  
  
  
  
  
    function handleFail() {
      hearts--;
      console.log(`❌ [handleFail] 실패 당시 스테이지: ${stage}`);
  
      updateStatus();
      button.classList.add("retry");
      button.textContent = hearts > 0 ? "다시 도전하기" : "게임 공유하고 하트 받기";
    }
  
    function resetGame() {
      stage = 1;
      button.disabled = false;
      prepareStage();
    }
  
  
  
    shareBtn2?.addEventListener("click", () => {
      hearts = 3;
      resetGame();
      popup.classList.add("hidden");
    });
  
    rewardBtn?.addEventListener("click", () => {
      resetGame();
      clearPopup.classList.add("hidden");
    });
  
    function drawDebugLines() {
      const debugContainer = document.getElementById("debugLines");
      debugContainer.innerHTML = "";
  
      const bandRect = band.getBoundingClientRect();
      const fieldRect = document.querySelector(".field").getBoundingClientRect();
  
      const bandTop = bandRect.top;
      const bandBottom = bandRect.bottom;
      const bandCenter = (bandTop + bandBottom) / 2;
      const frameRect = document.querySelector(".mobile-frame").getBoundingClientRect();
      const grassTop = frameRect.top + frameRect.height * 0.6; 
  
      const makeLine = (y, color, label) => {
        const line = document.createElement("div");
        line.className = "debug-line";
        line.style.position = "fixed";
        line.style.top = `${y}px`;
        line.style.left = "0";
        line.style.width = "100%";
        line.style.height = "1px";
        line.style.backgroundColor = color;
        line.style.zIndex = "9999";
  
        const tag = document.createElement("div");
        tag.textContent = label;
        tag.style.position = "fixed";
        tag.style.left = "4px";
        tag.style.top = `${y - 10}px`;
        tag.style.fontSize = "12px";
        tag.style.color = color;
        tag.style.fontWeight = "bold";
        tag.style.zIndex = "10000";
        tag.style.pointerEvents = "none";
  
        debugContainer.appendChild(line);
        debugContainer.appendChild(tag);
      };
  
      makeLine(bandTop, "blue", "띠 상단");
      makeLine(bandBottom, "blue", "띠 하단");
      makeLine(bandCenter, "red", "띠 중심");   // ✅ 추가된 중심선
      makeLine(grassTop, "green", "잔디 경계");
    }
  
  });