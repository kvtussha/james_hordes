let config = {

    backgroundIntro: "",
    containerColorBG: "",
    contentColorBG: "#525053",

    countRows: 11,
    countCols: 14,

    offsetBorder: 10,
    borderRadius: 8,

    cellSize: 64,

    imageCells: [
        "img/bomb.png",
        "img/cup.png",
        "img/heart.png",
        "img/chest.png",
        "img/pink_bottle.png",
        "img/green_bottle.png",
        "img/money.png",
        "img/crystal.png"
    ],

    cellClass: "gem",
    prefixIdCell: "gem",
    gameStates: ["pick", "switch", "revert", "remove", "refill"],
    gameState: "",

    movingItems: 0,

    countScore: 0
}

let backgroundPicture = new Image();
backgroundPicture.src = "./img/background2.jpg";

backgroundPicture.onload = () => {
    config.containerColorBG = backgroundPicture;
}

let player = {
    selectedRow: -1,
    selectedCol: -1,
    posX: "",
    posY: ""
}

let components = {
    container: document.createElement("div"),
    content: document.createElement("div"),
    wrapper: document.createElement("div"),
    cursor: document.createElement("div"),
    score: document.createElement("div"),
    cells: [],
}

let time = 119;
let countDown = document.getElementById("countdown");


// start Game
initGame();

// Инициализация всех составляющих игры
function initGame() {
    document.body.style.margin = "0px";
    createPage();
    createContentPage();
    createWrapper();
    createCursor();
    createGrid();
    createScore();
    setInterval(updateCountDown, 1000)

    // Переключаем статус игры на "выбор"
    config.gameState = config.gameStates[0];
}

// Настройки для страницы
function createPage() {
    components.container.style.backgroundColor = config.containerColorBG;
    components.container.style.height = "100vh";
    components.container.style.overflow = "hidden";
    components.container.style.display = "flex";
    components.container.style.alignItems = "center";
    components.container.style.justifyContent = "center";

    document.body.append(components.container);
}

// Создание фона, который располагается позади ячеек
function createContentPage() {
    components.content.style.padding = config.offsetBorder + "px";
    components.content.style.width = (config.cellSize * config.countCols) +
        (config.offsetBorder * 2) + "px";
    components.content.style.height = (config.cellSize * config.countRows) +
        (config.offsetBorder * 2) + "px";
    components.content.style.backgroundColor = config.contentColorBG;
    components.content.style.boxShadow = config.offsetBorder + "px";
    components.content.style.borderRadius = config.borderRadius + "px";
    components.content.style.boxSizing = "border-box";

    components.container.append(components.content);
}

// Создание обертки для ячеек и очков
// Расположение ячеек на поле, управление
function createWrapper() {
    components.wrapper.style.position = "relative";
    components.wrapper.style.height = "100%";
    components.wrapper.addEventListener("click", function (event) {
        handlerTab(event, event.target)
    });

    components.content.append(components.wrapper);
}

// Создание курсора для выделения ячеек
function createCursor() {
    components.cursor.id = "marker";
    components.cursor.style.width = config.cellSize - 50 + "px";
    components.cursor.style.height = config.cellSize - 50 + "px";
    components.cursor.style.border = "5px 525053FF";
    components.cursor.style.borderRadius = "20px";
    components.cursor.style.position = "absolute";
    components.cursor.style.display = "none";

    components.wrapper.append(components.cursor);
}

// Показать курсор
function cursorShow() {
    components.cursor.style.display = "block";
}

// Скрыть курсор
function cursorHide() {
    components.cursor.style.display = "none";
}

// Создание блока для очков
function createScore() {
    components.score.style.width = 200 + "px";
    components.score.style.height = 50 + "px";
    components.score.style.display = "flex";
    components.score.style.justifyContent = "center";
    components.score.style.alignItems = "center";
    components.score.style.borderRadius = config.borderRadius + "px";
    components.score.style.backgroundColor = config.contentColorBG;
    components.score.style.position = "absolute";
    components.score.style.bottom = "calc(100% + " - 24 + "px)";
    components.score.style.left = "calc(50% - " + (parseInt(components.score.style.width) - 690) + "px)";

    components.score.style.fontFamily = "sans-serif";
    components.score.style.fontSize = "16px";
    components.score.style.color = "#ffffff";


    updateScore();
}

// Обновление очки на странице
function updateScore() {
    components.score.innerHTML = config.countScore;
    components.wrapper.append(components.score);
}

// Добавление очков
function scoreInc(count) {
    if (count >= 4) {
        count *= 2;
    } else if (count >= 5) {
        count = (count + 1) * 2;
    } else if (count >= 6) {
        count *= (count + 2) * 2;
    }

    config.countScore += count;
    updateScore();
}

// Обратный отсчёт
function updateCountDown() {
    if (time === -1) {
        time = 0
    }
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? "0"+ seconds:
        seconds;
    countDown.innerHTML = `${minutes}:${seconds}`;
    time --;
}

// Создание монеты
function createCell(t, l, row, col, img) {
    let cell = document.createElement("div");

    cell.classList.add(config.cellClass);
    cell.id = config.prefixIdCell + '_' + row + '_' + col;
    cell.style.boxSizing = "border-box";
    cell.style.cursor = "pointer";
    cell.style.position = "absolute";
    cell.style.top = t + "px";
    cell.style.left = l + "px";
    cell.style.width = config.cellSize + "px";
    cell.style.height = config.cellSize + "px";
    cell.style.border = "1p solid transparent";
    cell.style.backgroundImage = "url(" + img + ")";
    cell.style.backgroundSize = "100%";

    components.wrapper.append(cell);
}

// Создание и наполнение сетки для монет
function createGrid() {
    // Создание пустой сетки
    for (let i = 0; i < config.countRows; i++) {
        components.cells[i] = [];
        for (let j = 0; j < config.countCols; j++) {
            components.cells[i][j] = -1;
        }
    }

    // Заполняем сетку
    for (let i = 0; i < config.countRows; i++) {
        for (let j = 0; j < config.countCols; j++) {

            do {
                components.cells[i][j] = Math.floor(Math.random() * 8);
            } while (isStreak(i, j));

            createCell(i * config.cellSize, j * config.cellSize, i, j, config.imageCells[components.cells[i][j]]);
        }
    }
}

// Проверка на собранный набор одинаковых ячеек
function isStreak(row, col) {
    return isVerticalStreak(row, col) || isHorizontalStreak(row, col);
}

// Проверка на собранный набор одинаковых ячеек по колонкам
function isVerticalStreak(row, col) {
    let cellValue = components.cells[row][col];
    let streak = 0;
    let tmp = row;

    while (tmp > 0 && components.cells[tmp - 1][col] === cellValue) {
        streak++;
        tmp--;
    }

    tmp = row;

    while (tmp < config.countRows - 1 && components.cells[tmp + 1][col] === cellValue) {
        streak++;
        tmp++;
    }

    return streak > 1;
}

// Проверка на собранный набор одинаковых ячеек по строкам
function isHorizontalStreak(row, col) {
    let cellValue = components.cells[row][col];
    let streak = 0;
    let tmp = col;

    while (tmp > 0 && components.cells[row][tmp - 1] === cellValue) {
        streak++;
        tmp--;
    }

    tmp = col;

    while (tmp < config.countCols - 1 && components.cells[row][tmp + 1] === cellValue) {
        streak++;
        tmp++;
    }

    return streak > 1;
}

// Обработчик клика
function handlerTab(event, target) {
    // Если это элемент с классом config.gameClass
    // и
    // Если подходящее состояние игры
    if (target.classList.contains(config.cellClass) && config.gameStates[0]) {
        // определить строку и столбец
        let row = parseInt(target.getAttribute("id").split("_")[1]);
        let col = parseInt(target.getAttribute("id").split("_")[2]);

        // Выделяем ячейку курсором
        cursorShow();
        components.cursor.style.top = parseInt(target.style.top) + "px";
        components.cursor.style.left = parseInt(target.style.left) + "px";

        // Если это первый выбор, то сохраняем выбор
        if (player.selectedRow === -1) {
            player.selectedRow = row;
            player.selectedCol = col;
        } else {
            // Если ячейка находится радом с первым выбором - то меняем их местами
            if ((Math.abs(player.selectedRow - row) === 1 && player.selectedCol === col) ||
                (Math.abs(player.selectedCol - col) === 1 && player.selectedRow === row)) {
                cursorHide();

                // После выбора меняем состояние игры
                config.gameState = config.gameStates[1];

                // сохранить позицию второго выбранного гема
                player.posX = col;
                player.posY = row;

                // поменять их местами
                cellSwitch();
            } else {
                // Если второй выбор произошел не рядом,
                // то делаем его первым выбором.
                player.selectedRow = row;
                player.selectedCol = col;
            }
        }
    }
}

// Меняем ячейки местами
function cellSwitch() {
    let yOffset = player.selectedRow - player.posY;
    let xOffset = player.selectedCol - player.posX;

    // Метка для ячеек, которые нужно двигать
    document.querySelector("#" + config.prefixIdCell + "_" + player.selectedRow + "_" + player.selectedCol).classList.add("switch");
    document.querySelector("#" + config.prefixIdCell + "_" + player.selectedRow + "_" + player.selectedCol).setAttribute("dir", "-1");

    document.querySelector("#" + config.prefixIdCell + "_" + player.posY + "_" + player.posX).classList.add("switch");
    document.querySelector("#" + config.prefixIdCell + "_" + player.posY + "_" + player.posX).setAttribute("dir", "1");

    // меняем местами ячейки
    $(".switch").each(function () {
        config.movingItems++;

        $(this).animate({
                left: "+=" + xOffset * config.cellSize * $(this).attr("dir"),
                top: "+=" + yOffset * config.cellSize * $(this).attr("dir")
            },
            {
                duration: 250,
                complete: function () {
                    //Проверяем доступность данного хода
                    checkMoving();
                }
            }
        );

        $(this).removeClass("switch");
    });


    // поменять идентификаторы ячеек
    document.querySelector("#" + config.prefixIdCell + "_" + player.selectedRow + "_" + player.selectedCol).setAttribute("id", "temp");
    document.querySelector("#" + config.prefixIdCell + "_" + player.posY + "_" + player.posX).setAttribute("id", config.prefixIdCell + "_" + player.selectedRow + "_" + player.selectedCol);
    document.querySelector("#temp").setAttribute("id", config.prefixIdCell + "_" + player.posY + "_" + player.posX);

    // поменять ячейки в сетке
    let temp = components.cells[player.selectedRow][player.selectedCol];
    components.cells[player.selectedRow][player.selectedCol] = components.cells[player.posY][player.posX];
    components.cells[player.posY][player.posX] = temp;
}

// Проверка перемещенных ячеек
function checkMoving() {
    config.movingItems--;

    // Действуем только после всех перемещений
    if (config.movingItems === 0) {

        // Действия в зависимости от состояния игры
        switch (config.gameState) {

            // После передвижения ячеек проверяем на появление групп сбора
            case config.gameStates[1]:
            case config.gameStates[2]:
                // проверяем, появились ли группы сбора
                if (!isStreak(player.selectedRow, player.selectedCol) && !isStreak(player.posY, player.posX)) {
                    // Если групп сбора нет, нужно отменить совершенное движение.
                    // А если действие уже отменяется, то вернуться к исходному состоянию ожидания выбора
                    if (config.gameState !== config.gameStates[2]) {
                        config.gameState = config.gameStates[2];
                        cellSwitch();
                    } else {
                        config.gameState = config.gameStates[0];
                        player.selectedRow = -1;
                        player.selectedCol = -1;
                    }
                } else {
                    // Если группы сбора есть, нужно их удалить
                    config.gameState = config.gameStates[3]

                    // Отметим все удаляемые ячейки
                    if (isStreak(player.selectedRow, player.selectedCol)) {
                        removecells(player.selectedRow, player.selectedCol);
                    }

                    if (isStreak(player.posY, player.posX)) {
                        removecells(player.posY, player.posX);
                    }

                    // Убираем с поля
                    cellFade();
                }
                break;
            // После удаления нужно заполнить пустоту
            case config.gameStates[3]:
                checkFalling();
                break;
            case config.gameStates[4]:
                placeNewcells();
                break;
        }

    }

}

// Отмечаем элементы для удаления и убираем их из сетки
function removecells(row, col) {
    let cellValue = components.cells[row][col];
    let tmp = row;

    document.querySelector("#" + config.prefixIdCell + "_" + row + "_" + col).classList.add("remove");
    let countRemoveGem = document.querySelectorAll(".remove").length;

    if (isVerticalStreak(row, col)) {
        while (tmp > 0 && components.cells[tmp - 1][col] === cellValue) {
            document.querySelector("#" + config.prefixIdCell + "_" + (tmp - 1) + "_" + col).classList.add("remove");
            components.cells[tmp - 1][col] = -1;
            tmp--;
            countRemoveGem++;
        }

        tmp = row;

        while (tmp < config.countRows - 1 && components.cells[tmp + 1][col] === cellValue) {
            document.querySelector("#" + config.prefixIdCell + "_" + (tmp + 1) + "_" + col).classList.add("remove");
            components.cells[tmp + 1][col] = -1;
            tmp++;
            countRemoveGem++;
        }
    }

    if (isHorizontalStreak(row, col)) {
        tmp = col;

        while (tmp > 0 && components.cells[row][tmp - 1] === cellValue) {
            document.querySelector("#" + config.prefixIdCell + "_" + row + "_" + (tmp - 1)).classList.add("remove");
            components.cells[row][tmp - 1] = -1;
            tmp--;
            countRemoveGem++;
        }

        tmp = col;

        while (tmp < config.countCols - 1 && components.cells[row][tmp + 1] === cellValue) {
            document.querySelector("#" + config.prefixIdCell + "_" + row + "_" + (tmp + 1)).classList.add("remove");
            components.cells[row][tmp + 1] = -1;
            tmp++;
            countRemoveGem++;
        }
    }

    components.cells[row][col] = -1;

    scoreInc(countRemoveGem);
}

// Удаляем ячейки
function cellFade() {
    $(".remove").each(function () {
        config.movingItems++;

        $(this).animate({
                opacity: 0
            },
            {
                duration: 200,
                complete: function () {
                    $(this).remove();
                    checkMoving();
                }
            }
        );
    });
}

// Заполняем пустоту
function checkFalling() {
    let fellDown = 0;

    for (let j = 0; j < config.countCols; j++) {
        for (let i = config.countRows - 1; i > 0; i--) {

            if (components.cells[i][j] === -1 && components.cells[i - 1][j] >= 0) {
                document.querySelector("#" + config.prefixIdCell + "_" + (i - 1) + "_" + j).classList.add("fall");
                document.querySelector("#" + config.prefixIdCell + "_" + (i - 1) + "_" + j).setAttribute("id", config.prefixIdCell + "_" + i + "_" + j);
                components.cells[i][j] = components.cells[i - 1][j];
                components.cells[i - 1][j] = -1;
                fellDown++;
            }

        }
    }

    $(".fall").each(function () {
        config.movingItems++;

        $(this).animate({
                top: "+=" + config.cellSize
            },
            {
                duration: 100,
                complete: function () {
                    $(this).removeClass("fall");
                    checkMoving();
                }
            }
        );
    });

    // Если все элементы передвинули,
    // то сменить состояние игры
    if (fellDown === 0) {
        config.gameState = config.gameStates[4];
        config.movingItems = 1;
        checkMoving();
    }
}


// Создание новых ячеек
function placeNewcells() {
    let cellsPlaced = 0;

    // Поиск мест, в которых необходимо создать гем
    for (let i = 0; i < config.countCols; i++) {
        if (components.cells[0][i] === -1) {
            components.cells[0][i] = Math.floor(Math.random() * 8);

            createCell(0, i * config.cellSize, 0, i, config.imageCells[components.cells[0][i]]);
            cellsPlaced++;
        }
    }

    // Если мы создали ячейки, то проверяем необходимость их сдвинуть вниз.
    if (cellsPlaced) {
        config.gameState = config.gameStates[3];
        checkFalling();
    } else {
        // Проверка на группы сбора
        let combo = 0

        for (let i = 0; i < config.countRows; i++) {
            for (let j = 0; j < config.countCols; j++) {

                if (j <= config.countCols - 3 && components.cells[i][j] === components.cells[i][j + 1] && components.cells[i][j] === components.cells[i][j + 2]) {
                    combo++;
                    removecells(i, j);
                }
                if (i <= config.countRows - 3 && components.cells[i][j] === components.cells[i + 1][j] && components.cells[i][j] === components.cells[i + 2][j]) {
                    combo++;
                    removecells(i, j);
                }

            }
        }

        // удаляем найденные группы сбора
        if (combo > 0) {
            config.gameState = config.gameStates[3];
            cellFade();
        } else {
            // Запускаем основное состояние игры
            config.gameState = config.gameStates[0];
            player.selectedRow = -1;
        }
    }
}