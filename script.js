// let gameFinished = false;
// let why = -1;

let gameFinished = false;
let gameStarted = false;
let gameBusy = false;

let statusInterval;
let mischiefInterval;

let why = -1;

function startGame() {

    gameStarted = true;

    document.getElementById("start-screen").style.display = "none";

    // 상태 감소
    statusInterval = setInterval(() => {

        if (gameFinished) return;

        changeStat("fullness", -2);
        changeStat("thirst", -2);
        changeStat("interest", -5);
        changeStat("mood", -3);

        updateUI();

    }, 5000);


    // 사고치기 검사
    mischiefInterval = setInterval(() => {

        if (gameFinished) return;
        if (gameBusy) return;

        if (cat.interest >= 80 || cat.mood >= 90) return;

        let probability;

        if (cat.interest === 0) {
            probability = 100;
        }
        else {
            probability = (90 - cat.interest) * 0.75;
        }

        const random = Math.random() * 100;

        if (random < probability) {
            mischief();
        }

    }, 10000);
}

const cat = {
    fullness: 30,
    thirst: 30,
    interest: 30,
    mood: 30,
    heart: 0
};

// 상태 최대최소값
function clamp(value) {
    return Math.max(0, Math.min(100, value));
}

// UI 업데이트
function updateUI() {
    document.getElementById("fullness").textContent = cat.fullness;
    document.getElementById("thirst").textContent = cat.thirst;
    document.getElementById("interest").textContent = cat.interest;
    document.getElementById("mood").textContent = cat.mood;

    document.getElementById("fullness-bar").style.width =
        cat.fullness + "%";

    document.getElementById("thirst-bar").style.width =
        cat.thirst + "%";

    document.getElementById("interest-bar").style.width =
        cat.interest + "%";

    document.getElementById("mood-bar").style.width =
        cat.mood + "%";

    document.getElementById("heart-fill").style.width =
        cat.heart + "%";
}

// 상태 변경
function changeStat(stat, amount) {
    const before = cat[stat];

    cat[stat] = clamp(cat[stat] + amount);

    const actualChange = cat[stat] - before;

    if (actualChange !== 0) {
        showStatChange(stat, actualChange);
    }

    checkGameOver();

    if (gameFinished) return;
}

// 상태변경 애니메이션
function showStatChange(stat, amount) {
    const element = document.getElementById(stat + "-change");

    element.textContent = amount > 0 ? `+${amount}` : `${amount}`;

    element.classList.remove("plus", "minus");

    if (amount > 0) {
        element.classList.add("plus");
    } else {
        element.classList.add("minus");
    }

    element.style.animation = "none";
    void element.offsetWidth;
    element.style.animation = "statChange 1s ease-out forwards";
}

// 메시지 표시
function message(text) {
    document.getElementById("message").textContent = text;
}

// 하트 증가
function gainHeart() {
    const amount = Math.floor(Math.random() * 5) + 1;

    cat.heart += amount;

    if (cat.heart >= 100) {
        cat.heart = 100;
        gameEnd();
    }

    updateUI();
}

// 게임 클리어
function gameEnd() {
    gameFinished = true;

    message("고양이와 완전히 친해졌다!");

    document.getElementById("cat-image").src = "images/따봉냥이.png";

    clearInterval(statusInterval);
    clearInterval(mischiefInterval);

    document.querySelectorAll("button").forEach(button => {
        button.disabled = true;
    });
}

// 게임 오버
function checkGameOver() {    
    if (
        (cat.fullness <= 10 ||
        cat.thirst <= 10 ||
        cat.interest <= 10 ||
        cat.mood <= 10)){
        let zeroCount = 0;

        if (cat.fullness <= 10) zeroCount++;
        if (cat.thirst <= 10) zeroCount++;
        if (cat.interest <= 10) zeroCount++;
        if (cat.mood <= 10) zeroCount++;

        if (zeroCount >= 2) {
            why = -1;
        }
        else if(cat.fullness <= 10) why=0;
        else if(cat.thirst <= 10) why=1;
        else if(cat.interest <= 10) why=2;
        else if(cat.mood <= 10) why=3;
        
        clearInterval(statusInterval);
        clearInterval(mischiefInterval);

        gameOver();
    }
}
function gameOver() {
    gameFinished = true;

    if(why==0) message("고양이는 배가 고픕니다...");
    else if(why==1) message("고양이는 목이 마릅니다...");
    else if(why==2) message("고양이는 심심합니다...");
    else if(why==3) message("고양이는 기분이 나쁩니다...");
    else message("고양이는 당신을 싫어합니다...");

    document.getElementById("cat-image").src = "images/화난 고양이.png";

    clearInterval(statusInterval);
    clearInterval(mischiefInterval);

    document.querySelectorAll("button").forEach(button => {
        button.disabled = true;
    });
}

//버튼 잠금
function lockButtons(time) {

    gameBusy = true;

    const buttons = document.querySelectorAll("button");

    buttons.forEach(button => {
        button.disabled = true;
    });

    setTimeout(() => {

        if (gameFinished) return;

        gameBusy = false;

        buttons.forEach(button => {
            button.disabled = false;
        });

    }, time);
}



// === 행동 함수 ===

// 사료주기
function feed() {
    if (gameFinished) return;
    lockButtons(800);
    const before = cat.fullness;

    if (cat.fullness >= 80) {
        message("배가 부른 것 같다...");
        setTimeout(() => {
            message("냐옹");
        }, 800);
        changeStat("fullness", 5);
        gainHeart();
    }
    else{
        message("맛있게 먹었다!");

        document.getElementById("cat-image").src = "images/사료.png";

        changeStat("fullness", 5);
        gainHeart();

        setTimeout(() => {
            if (gameFinished) return;

            document.getElementById("cat-image").src =
                "images/오이이아.png";

            message("냐옹");
        }, 800);
    }
    if (before + 5 > 100) {
        message("우웩...");

        changeStat("fullness", -20);
        changeStat("mood", -20);

        document.getElementById("cat-image").src = "images/우웩.png";

        setTimeout(() => {
            if (gameFinished) return;

            document.getElementById("cat-image").src =
                "images/오이이아.png";

            message("냐옹");
        }, 800);

        updateUI();
        return;
    }

    updateUI();
}

// 물마시기
function drink() {
    if (gameFinished) return;
    lockButtons(800);

    if (cat.thirst >= 80) {
        message("목이 안 마른 것 같다...")
        document.getElementById("cat-image").src = "images/물배부름1.png";
        setTimeout(() => {
            document.getElementById("cat-image").src = "images/물배부름.png";
        }, 500); 
        setTimeout(() => {
            if (gameFinished) return;

            document.getElementById("cat-image").src =
                "images/오이이아.png";

            message("냐옹");
        }, 800);
    }
    else {
        message("맛있게 마셨다!");
        document.getElementById("cat-image").src = "images/물.png";

        updateUI();
        changeStat("thirst", 5);

        setTimeout(() => {
            if (gameFinished) return;

            document.getElementById("cat-image").src =
                "images/오이이아.png";

            message("냐옹");
        }, 800);
        gainHeart();
    }

    updateUI();
}

// 쓰다듬기
function pet() {
    if (gameFinished) return;
    lockButtons(1600);

    if (cat.mood >= 100) {
        message("충분히 기분 좋은 것 같다.");
        return;
    }

    changeStat("mood", 5);
    message("쓰담쓰담...");
    gainHeart();

    const catImage = document.getElementById("cat-image");
    const handImage = document.getElementById("hand-image");

    catImage.src = "images/오이이아2.png";
    handImage.classList.add("pet-hand");
    catImage.classList.add("pet-cat");

    setTimeout(() => {
        if (gameFinished) return;

        handImage.classList.remove("pet-hand");
        catImage.classList.remove("pet-cat");

        catImage.src = "images/오이이아.png";
        message("냐옹");
    }, 1600);

    updateUI();
}

// 산책가기
function walk() {
    if (gameFinished) return;
    lockButtons(800);

    if (cat.interest >= 80) {
        document.getElementById("cat-image").src = "images/화난 고양이.png";
        message("산책 가기 싫은 것 같다...");
        changeStat("mood", -10);

        setTimeout(() => {
            if (gameFinished) return;

            document.getElementById("cat-image").src =
                "images/오이이아.png";

            message("냐옹");
        }, 800);
    }
    else {
        document.getElementById("cat-image").src = "images/산책.png";
        message("재밌는 산책이었다!");

        document.body.style.backgroundImage = 'url("images/산책배경.png")';
        document.body.style.backgroundColor = '#9fd57a';

        setTimeout(() => {
            if (gameFinished) return;

            document.getElementById("cat-image").src =
                "images/오이이아.png";
            document.body.style.backgroundImage = 'url("images/배경.jpg")';
            document.body.style.backgroundColor = '#d4a36c';
            message("냐옹");
        }, 800);

        changeStat("interest", 10);
        changeStat("mood", 3);
        changeStat("fullness", -5);
        changeStat("thirst", -5);
        
        gainHeart();
    }

    updateUI();
}

// 사고치기
// const mischiefInterval = setInterval(() => {
//     if (gameFinished) return;

//     const buttons = document.querySelectorAll("button");
//     const isIdle = [...buttons].every(button => !button.disabled);

//     if (!isIdle) return;

//     if (cat.interest >= 80 || cat.mood >= 90) return;

//     let probability;

//     if (cat.interest === 0) {
//         probability = 100;
//     }
//     else {
//         probability = (90 - cat.interest) * 0.75;
//     }

//     const random = Math.random() * 100;

//     if (random < probability) {
//         mischief();
//     }

// }, 10000);

function mischief() {
    if (gameFinished) return;
    if (gameBusy) return;

    // 사고 종류 3개 중 하나 랜덤 선택
    const mischiefImages = [
        "images/사고 1.png",
        "images/사고 2.png",
        "images/사고 3.png"
    ];

    const randomIndex =
        Math.floor(Math.random() * mischiefImages.length);

    const catImage = document.getElementById("cat-image");

    changeStat("interest", 20);
    changeStat("mood", 10);

    message("고양이가 너무 심심한 나머지 사고를 쳤다!");

    catImage.src = mischiefImages[randomIndex];

    const buttons = document.querySelectorAll("button");

    buttons.forEach(button => {
        button.disabled = true;
    });

    setTimeout(() => {
        if (gameFinished) return;

        catImage.src = "images/오이이아.png";
        message("냐옹");

        gameBusy = false;

        buttons.forEach(button => {
            button.disabled = false;
        });

    }, 2400);

    updateUI();
}
