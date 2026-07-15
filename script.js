// ==========================================
// DOM
// ==========================================

const elements = {
    svg: document.getElementById("overlay"),
    mainMap: document.getElementById("mainMap"),
    modal: document.getElementById("modal"),
    modalImage: document.getElementById("modalImage"),
    modalTitle: document.getElementById("modalTitle"),
    closeBtn: document.getElementById("closeBtn"),
    mapViewport: document.getElementById("mapViewport"),
    mapContainer: document.querySelector(".map-container"),
    zoomInBtn: document.getElementById("zoomInBtn"),
    zoomOutBtn: document.getElementById("zoomOutBtn"),
    resetBtn: document.getElementById("resetBtn"),
    modalSubtitle: document.getElementById("modalSubtitle"),
    backgroundEmblems: document.querySelector(".background-emblems"),
    // militaryUnitsBtn: document.getElementById("militaryUnitsBtn"),
    militaryOfficesBtn: document.getElementById("militaryOfficesBtn"),
    fireStationsBtn: document.getElementById("fireStationsBtn"),
    leftObjectPanel: document.getElementById("leftObjectPanel"),
    rightObjectPanel: document.getElementById("rightObjectPanel"),
};

// ==========================================
// CONFIG
// ==========================================

const CONFIG = {

    minScale: 1,

    maxScale: 5,

    zoomStep: 0.15,
    doubleClickZoomStep: 0.75,
    buttonZoomStep: 0.25,

    panStep: 120,

    storageKey: "Map4VO.view",

    fitPaddingTop: 5,
    
    fitPaddingBottom: 5,

};

// ==========================================
// STATE
// ==========================================

const state = {

    activeSegment: null,

    bottomPadding: 20,

    activePolygon: null,

    imageCache: new Map(),

    view: {

        scale: CONFIG.minScale,

        x: 0,
        y: 0,

        dragging: false,

        lastX: 0,
        lastY: 0

    },

    objects: {

        activeGroup: null,

        visible: false

    },

};

// ==========================================
// DATA
// ==========================================

const segments = [
    {
        id: "route52",

        title: "Маршрут 52 - Ватутинки",

        subtitle:
            "Маршрут в посёлке Ватутинки: от Калужского шоссе через ул. Офицерскую (КПП в/ч 48428) к ул. Дмитрия Рябинкина.",

        points:"577,2962 577,3649 1315,3649 1315,2962",

        file:"segments/route52.jpg"
    },
    {
        id: "route57",
        title: "Маршрут 57 - Аэропорт Внуково",
        subtitle:
            "Патрулирование залов ожидания терминалов A, D и B в аэропорту Внуково.",
        points: "1356,2962 1356,3649 2087,3649 2087,2962",
        file: "segments/route57.jpg"
    },
    {
        id: "route50",
        title: "Маршрут 50 - Склады в/ч 61899",
        
        subtitle:
            "От Проектируемого проезда 133 через склады (Проектируемый проезд 134) к ул. Адмирала Корнилова.",
        points: "2131,2962 2131,3649 2860,3649 2866,2962",
        file: "segments/route50.jpg"
    },
    {
        id: "route56",
        title: "Маршрут 56 - Ул. Рузская – Военная академия ГШ",
        
        subtitle:
            "Соединяет ул. Рузскую (д. 102 и 96) с КПП Военной академии Генерального штаба ВС РФ на проспекте Вернадского, д. 100.",
        points: "2939,2962 2939,3639 3670,3649 3670,2962",
        file: "segments/route56.jpg"
    },
    {
        id: "route55",
        title: "Маршрут 55 - Ул. Академика Анохина",
        
        subtitle:
            "Маршрут вдоль ул. Академика Анохина между домами 50, 60 и 66.",
        points: "2939,2141 2939,2822 3672,2822 3672,2141",
        file: "segments/route55.jpg"
    },
    {
        id: "route51",
        title: "Маршрут 51 - Рублёвское шоссе – ул. Крылатская",
        
        subtitle:
            "От КПП №1 войсковой части 83466 на Рублёвском шоссе до КТП и жилых/служебных зданий на ул. Крылатской (д. 68/28 и д. 40 стр. 74).",
        points: "2939,1323 2939,2001 3672,2001 3672,1323",
        file: "segments/route51.jpg"
    },
    {
        id: "route54",
        title: "Маршрут 54 - Поклонная гора",
        
        subtitle:
            "Маршрут по главной аллее Поклонной горы: Аллея Связистов – Музей Великой Отечественной войны – Аллея Артиллеристов.",
        points: "5850,1168 5850,1846 6579,1846 6579,1168",
        file: "segments/route54.jpg"
    },
    {
        id: "route53",
        title: "Маршрут 53 - Киевский вокзал",
        
        subtitle:
            "Маршрут по территории вокзала: от площади Киевского вокзала через залы ожидания №1, 2, 3 к платформам поездов дальнего следования.",
        points: "6617,1168 6617,1846 7347,1846 7347,1168",
        file: "segments/route53.jpg"
    },
    {
        id: "route48",
        title: "Маршрут 48 - Автопарк в/ч 61899",
        
        subtitle:
            "От автопарка (Проектируемый проезд 133) в направлении КПП №1 (Проектируемый проезд 139) к ул. Героя РФ Соломатина.",
        points: "7375,1168 7375,1846 8102,1846 8102,1168",
        file: "segments/route48.jpg"
    },
    {
        id: "route47",
        title: "Маршрут 47 - Улица Обручева – Штаб ВКС",
        
        subtitle:
            "Соединяет ул. Обручева с ул. Профсоюзной (Штаб ВКС) и заканчивается на ул. Бутлерова.",
        points: "7375,1981 8101,1981 8101,2660 7375,2660",
        file: "segments/route47.jpg"
    },
    {
        id: "route49",
        title: "Маршрут 49 - КПП №2 в/ч 61899",
        
        subtitle:
            "От Проектируемого проезда 139 в направлении КПП №2 войсковой части 61899 к Музыкальному проезду.",
        points: "7375,2793 8101,2792 8101,3471 7375,3471",
        file: "segments/route49.jpg"
    }
];


const objectGroups = {

    militaryUnits: [],

    militaryOffices: [

            {
                id: "militaryOffices1",
                title: "ВК ЗАО",
                description: "",
                image: "objects/заоВК.jpg"
            },

            {
                id: "militaryOffices2",
                title: "ВК ТИНАО",
                description: "",
                image: "objects/тинаоВК.jpg"
            },

            {
                id: "militaryOffices3",
                title: "ВК ЮЗАО",
                description: "",
                image: "objects/юзаоВК.jpg"
            },
    ],

    fireStations: [
            {
                id: "fireStations1",
                title: "МВД ЗАО",
                description: "",
                image: "objects/заоМВД.jpg"
            },

            {
                id: "fireStations2",
                title: "МВД НАО",
                description: "",
                image: "objects/наоМВД.jpg"
            },

            {
                id: "fireStations3",
                title: "МВД ЮЗАО",
                description: "",
                image: "objects/юзаоМВД.jpg"
            },
    ]

};

Object.freeze(segments);
segments.forEach(Object.freeze);

// ==========================================
// UTILS
// ==========================================

function getMapCenter() {

    const rect = elements.mapContainer.getBoundingClientRect();

    return {

        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2

    };

}

function calculateFitView() {

    const container = elements.mapContainer.getBoundingClientRect();

    const mapWidth = elements.mainMap.naturalWidth;
    const mapHeight = elements.mainMap.naturalHeight;


    const topPadding = 5;
    const bottomPadding = 20;


    const availableHeight =
        container.height - topPadding - bottomPadding;


    const fitScale = availableHeight / mapHeight ;


    CONFIG.minScale = fitScale;


    return {

        scale: fitScale,

        x: (container.width - mapWidth * fitScale) / 2,

        y: topPadding +
           (availableHeight - mapHeight * fitScale) / 2

    };

}

// ==========================================
// PRELOAD
// ==========================================

function preloadImage(file) {

    return new Promise(resolve => {

        const img = new Image();

        img.onload = () => resolve({
            success: true,
            image: img
        });

        img.onerror = () => {

            const fallback = new Image();

            fallback.onload = () => resolve({
                success: false,
                image: fallback
            });

            fallback.src = "segments/not_found.webp";

        };

        img.src = file;

    });

}

async function preloadAllImages() {

    const results = await Promise.all([

        preloadImage("main_map.webp"),

        ...segments.map(seg => preloadImage(seg.file))

    ]);

    const mainMap = results.shift();

    if (!mainMap.success) {

        console.error("Не удалось загрузить основную карту.");

        return;

    }

    results.forEach((result, index) => {

        state.imageCache.set(
            segments[index].id,
            result.image
        );

        if (!result.success) {

            console.warn(
                `${segments[index].title}: изображение отсутствует`
            );

        }

    });

    console.log("Все изображения готовы.");

    init();

}

// ==========================================
// OVERLAY
// ==========================================

function renderOverlay() {

    const fragment = document.createDocumentFragment();

    segments.forEach(seg => {
        fragment.appendChild(createPolygon(seg));
    });

    elements.svg.appendChild(fragment);

}

function createPolygon(seg) {

    const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
    );

    polygon.dataset.id = seg.id;

    polygon.setAttribute("points", seg.points);

    polygon.setAttribute("aria-label", seg.title);

    polygon.addEventListener(
    "click",
    () => onPolygonClick(seg, polygon)
);

    return polygon;

}

function initOverlay() {

    if (!elements.mainMap.naturalWidth || !elements.mainMap.naturalHeight) {
        console.error("Изображение карты не загружено.");
        return;
    }

    elements.svg.setAttribute(
        "viewBox",
        `0 0 ${elements.mainMap.naturalWidth} ${elements.mainMap.naturalHeight}`
    );

    elements.svg.setAttribute(
    "width",
    elements.mainMap.naturalWidth
);

elements.svg.setAttribute(
    "height",
    elements.mainMap.naturalHeight
);

}

function onPolygonClick(seg, polygon) {

    openSegment(seg, polygon);

}

// ==========================================
// MODAL
// ==========================================

function openSegment(seg, polygon) {

    if (state.activeSegment === seg.id) {
        closeModal();
        return;
    }

    elements.modalTitle.textContent = seg.title;

    elements.modalSubtitle.textContent = seg.subtitle;

    const image = state.imageCache.get(seg.id);

    elements.modalImage.src = image.src;

    state.activeSegment = seg;

    highlightPolygon(polygon);
}

function closeModal() {

    elements.modal.classList.remove("open");

    highlightPolygon(null);

    state.activeSegment = null;

    elements.modalTitle.textContent = "";
    elements.modalSubtitle.textContent = "";

}

function onModalClick(event) {

    if (event.target === elements.modal) {
        closeModal();
    }

}

// ==========================================
// ZOOM
// ==========================================

function zoom(delta, clientX, clientY) {

    zoomAt(
        clientX,
        clientY,
        state.view.scale + delta
    );

}

function zoomAt(clientX, clientY, newScale) {

    newScale = Math.max(
        CONFIG.minScale,
        Math.min(CONFIG.maxScale, newScale)
    );

    if (newScale === state.view.scale) {
        return;
    }

    const rect = elements.mapContainer.getBoundingClientRect();

    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const factor = newScale / state.view.scale;

    state.view.x = mouseX - (mouseX - state.view.x) * factor;
    state.view.y = mouseY - (mouseY - state.view.y) * factor;

    state.view.scale = newScale;


    constrainPosition();

    updateCursor();

    updateView();

    saveViewState();

}

function zoomIn() {

    const center = getMapCenter();

    zoom(
        CONFIG.buttonZoomStep,
        center.x,
        center.y
    );

}

function zoomOut() {

    const center = getMapCenter();

    zoom(
        -CONFIG.buttonZoomStep,
        center.x,
        center.y
    );

}


function updateView() {

    elements.mapViewport.style.transform =
        `translate3d(${state.view.x}px, ${state.view.y}px, 0)
         scale(${state.view.scale})`;
}

// ==========================================
// DRAG
// ==========================================

function endDrag() {

    state.view.dragging = false;

    updateCursor();

    saveViewState();

}

function drag(event) {

    if (!state.view.dragging) {
        return;
    }


    const deltaX = event.clientX - state.view.lastX;
    const deltaY = event.clientY - state.view.lastY;


    state.view.x += deltaX;
    state.view.y += deltaY;


    constrainPosition();


    state.view.lastX = event.clientX;
    state.view.lastY = event.clientY;


    updateView();

}

function startDrag(event) {

    if (event.button !== 0) {
        return;
    }

    event.preventDefault();

    state.view.dragging = true;

    state.view.lastX = event.clientX;
    state.view.lastY = event.clientY;

    updateCursor();

}

// ==========================================
// NAVIGATION
// ==========================================

function constrainPosition() {

    if (state.view.scale <= CONFIG.minScale) {

        const fit = calculateFitView();

        state.view.x = fit.x;

        state.view.y = fit.y;

        return;

    }

    const containerRect = elements.mapContainer.getBoundingClientRect();

    // Используем реальные размеры изображения,
    // а не размеры контейнера mapViewport
    const mapWidth = elements.mainMap.naturalWidth;
    const mapHeight = elements.mainMap.naturalHeight;

    const scaledWidth = mapWidth * state.view.scale;
    const scaledHeight = mapHeight * state.view.scale;

    const viewportWidth = containerRect.width;
    const viewportHeight = containerRect.height;

    const minX = viewportWidth - scaledWidth;
    const minY = viewportHeight - scaledHeight;

    const maxX = 0;
    const maxY = 0;

    state.view.x = Math.min(
        maxX,
        Math.max(minX, state.view.x)
    );

    state.view.y = Math.min(
        maxY,
        Math.max(minY, state.view.y)
    );

}

function pan(dx, dy) {

    state.view.x += dx;
    state.view.y += dy;

    constrainPosition();

    updateCursor();
    
    updateView();

    saveViewState();

}

function resetView() {

    const fit = calculateFitView();

    state.view.scale = fit.scale;

    state.view.x = fit.x;

    state.view.y = fit.y;

    updateView();

    updateCursor();

    saveViewState();

}

// ==========================================
// UI
// ==========================================

function updateCursor() {

    let cursor = "default";

    if (state.view.scale > CONFIG.minScale) {
        cursor = "grab";
    }

    if (state.view.dragging) {
        cursor = "grabbing";
    }

    elements.mapViewport.style.cursor = cursor;

}

function highlightPolygon(polygon) {

    if (state.activePolygon) {

        state.activePolygon.classList.remove("active");

    }

    state.activePolygon = polygon;

    if (state.activePolygon) {

        state.activePolygon.classList.add("active");

    }

}

// ==========================================
// OBJECT GROUPS
// ==========================================

function toggleObjectGroup(groupName, button) {

    // Если нажали на уже открытую группу
    if (
        state.objects.visible &&
        state.objects.activeGroup === groupName
    ) {

        closeObjectGroup();

        return;

    }

    // Закрываем предыдущую группу
    closeObjectGroup();

    // Запоминаем новую
    state.objects.visible = true;

    state.objects.activeGroup = groupName;

    // Подсвечиваем кнопку
    button.classList.add("active");

    elements.leftObjectPanel.classList.add("open");

    renderObjectCards(groupName);

    //elements.rightObjectPanel.classList.add("open");

    // Делаем гербы прозрачными
    // elements.backgroundEmblems.classList.add("dimmed");

}

function closeObjectGroup() {

    state.objects.visible = false;

    state.objects.activeGroup = null;

    // elements.militaryUnitsBtn.classList.remove("active");

    elements.militaryOfficesBtn.classList.remove("active");

    elements.fireStationsBtn.classList.remove("active");

    elements.leftObjectPanel.classList.remove("open");

    elements.rightObjectPanel.classList.remove("open");

    elements.leftObjectPanel.innerHTML = "";

    // elements.backgroundEmblems.classList.remove("dimmed");

}

// ==========================================
// OBJECT CARDS
// ==========================================

function createObjectCard(object) {

    const card = document.createElement("div");

    card.className = "object-card";

    card.innerHTML = `
        <img src="${object.image}" alt="${object.title}">
        <h3>${object.title}</h3>
        <p>${object.description}</p>
    `;

    card.addEventListener(

        "click",

        () => openObjectCard(object)

    );

    return card;

}

function openObjectCard(object) {

    elements.modalImage.src = object.image;

    elements.modalTitle.textContent = object.title;

    elements.modalSubtitle.textContent = object.description;

    elements.modal.classList.add("open");

}

function renderObjectCards(groupName) {

    elements.leftObjectPanel.innerHTML = "";

    elements.rightObjectPanel.innerHTML = "";

    const objects = objectGroups[groupName];

    objects.forEach((object, index) => {

        const card = createObjectCard(object);

        elements.leftObjectPanel.appendChild(card);
        
        // if (index % 2 === 0) {

        //     elements.leftObjectPanel.appendChild(card);

        // } else {

        //     elements.rightObjectPanel.appendChild(card);

        // }

    });

}

// ==========================================
// EVENTS
// ==========================================

function initEventListeners() {

    elements.closeBtn.addEventListener(
        "click",
        closeModal
    );

    elements.modal.addEventListener(
        "click",
        onModalClick
    );

    document.addEventListener(
        "keydown",
        onKeyDown
    );

    elements.mapContainer.addEventListener(
        "mousedown",
        startDrag
    );

    elements.mapContainer.addEventListener(
        "wheel",
        onWheel,
        { passive: false }
    );

    window.addEventListener(
        "mousemove",
        drag
    );

    window.addEventListener(
        "mouseup",
        endDrag
    );

    elements.zoomInBtn.addEventListener(
        "click",
        zoomIn
    );


    elements.zoomOutBtn.addEventListener(
        "click",
        zoomOut
    );


    elements.resetBtn.addEventListener(
        "click",
        resetView
    );

    elements.mapContainer.addEventListener(
        "dblclick",
        onDoubleClick
    );

    window.addEventListener(
        "resize",
        onResize
    );

    elements.mapViewport.addEventListener(
        "mouseenter",
        () => {
            elements.backgroundEmblems.classList.remove("dimmed");
        }
    );

    elements.mapViewport.addEventListener(
        "mouseleave",
        () => {
            elements.backgroundEmblems.classList.add("dimmed");
        }
    );

    // elements.militaryUnitsBtn.addEventListener(
    //     "click",
    //     () => toggleObjectGroup(
    //         "militaryUnits",
    //         elements.militaryUnitsBtn
    //     )
    // );

    elements.militaryOfficesBtn.addEventListener(
        "click",
        () => toggleObjectGroup(
            "militaryOffices",
            elements.militaryOfficesBtn
        )
    );

    elements.fireStationsBtn.addEventListener(
        "click",
        () => toggleObjectGroup(
            "fireStations",
            elements.fireStationsBtn
        )
    );

}

function onResize() {

    if (state.view.scale <= CONFIG.minScale + 0.001) {

        resetView();

    } else {

        constrainPosition();

        updateView();

    }

}

function onKeyDown(event) {

    switch (event.key) {

        case "Escape":

            closeModal();

            break;

        case "+":
        case "=":

            event.preventDefault();

            zoomIn();

            break;

        case "-":

            event.preventDefault();

            zoomOut();

            break;

        case "0":

            event.preventDefault();

            resetView();

            break;

    }

}

function onWheel(event) {

    event.preventDefault();

    if (event.shiftKey && event.ctrlKey) {

        pan(
            -Math.sign(event.deltaY) * CONFIG.panStep,
            -Math.sign(event.deltaY) * CONFIG.panStep
        );

        return;
    }

    if (event.shiftKey) {

        pan(
            0,
            -Math.sign(event.deltaY) * CONFIG.panStep
        );

        return;
    }

    if (event.ctrlKey) {

        pan(
            -Math.sign(event.deltaY) * CONFIG.panStep,
            0
        );

        return;
    }

    zoom(
        event.deltaY < 0
            ? CONFIG.zoomStep
            : -CONFIG.zoomStep,

        event.clientX,
        event.clientY
    );

}

function onDoubleClick(event) {

    const target = event.target;

    // Разрешаем двойной клик только по карте и полигонам
    if (
        target !== elements.mainMap &&
        target !== elements.svg &&
        target.tagName.toLowerCase() !== "polygon"
    ) {
        return;
    }

    event.preventDefault();

    zoomAt(
        event.clientX,
        event.clientY,
        state.view.scale + CONFIG.doubleClickZoomStep
    );

}

// ==========================================
// STORAGE
// ==========================================

function saveViewState() {

    const view = {

        scale: state.view.scale,

        x: state.view.x,

        y: state.view.y

    };

    localStorage.setItem(
        CONFIG.storageKey,
        JSON.stringify(view)
    );

}

function loadViewState() {
    
    const saved =
        localStorage.getItem(CONFIG.storageKey);

    if (!saved) {
        return;
    }

    const view = JSON.parse(saved);

if (
    typeof view.scale !== "number" ||
    typeof view.x !== "number" ||
    typeof view.y !== "number"
) {
    return;
}

    state.view.scale = view.scale;

    if (state.view.scale < CONFIG.minScale) {

        state.view.scale = CONFIG.minScale;

    }

    state.view.x = view.x;

    state.view.y = view.y;

}

// ==========================================
// INITIALIZATION
// ==========================================

function initModalEvents(){

    elements.modalImage.onload = () => {

        elements.modal.classList.add("open");

    };

}

function initMapSize() {

    elements.mainMap.style.width =
        elements.mainMap.naturalWidth + "px";

    elements.mainMap.style.height =
        elements.mainMap.naturalHeight + "px";

}

function init(){

    initOverlay();

    initMapSize();

    renderOverlay();

    initModalEvents();

    initEventListeners();

    resetView();

    loadViewState();

    constrainPosition();

    updateView();

    updateCursor();

}

preloadAllImages();
