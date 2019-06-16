import { months, dogs } from './data';

const date = {
    day: false,
    month: false
};

let targetWeek = false;

const daysWrapper = document.querySelector('.days');
const monthsWrapper = document.querySelector('.months');

function dateHandler(el, type) {
    el.addEventListener('click', e => {
        if (e.target.tagName == 'BUTTON') {
            e.preventDefault();

            if (type == 'day') {
                date.day = e.target.innerText;
            } else {
                date.month = String(months.findIndex(m => m.label == e.target.innerText.toLowerCase()) + 1).padStart(2, '0');
            }

            updateEls();

            if (date.day && date.month) {
                calculateDate();
                removeDatePicker();
            }
        }
    });
}

function updateEls() {
    const daysBtns = daysWrapper.querySelectorAll('button');
    const monthsBtns = monthsWrapper.querySelectorAll('button');

    let _day = date.day ? parseInt(date.day) : 0;
    let _month = date.month ? parseInt(date.month) - 1 : 0;
    let _allowedDays = months[_month].days;

    for (let i = 0; i < daysBtns.length; i++) {
        if (date.day) {
            daysBtns[i].classList.toggle('active', i == _day - 1);
        }
        daysBtns[i].disabled = i >= _allowedDays;
    }

    for (let i = 0; i < monthsBtns.length; i++) {
        if (date.month) {
            monthsBtns[i].classList.toggle('active', i == _month);
        }
        monthsBtns[i].disabled = _day > months[i].days;
    }
}

function calculateDate() {
    const now = new Date();
    const d = new Date(`${now.getFullYear()}-${date.month || '01'}-${date.day || '01'}`);
    targetWeek = getWeek(d);
}

function getWeek(d) {
    var start = new Date(d.getFullYear(), 0, 0);
    var diff = (d - start) + ((start.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    var week = Math.floor(day / 7);
    
    return week;
}

dateHandler(daysWrapper, 'day');
dateHandler(monthsWrapper, 'months');

function removeDatePicker() {
    const viewer = document.getElementById('viewer');
    document.getElementById('date-picker').classList.add('hide');
    setTimeout(() => viewer.classList.remove('hide'), 500);
    setTimeout(() => {
        viewer.querySelector('nav').classList.remove('hide');
        document.getElementById('about').classList.add('appear');
    }, 1500);

    const dog = getDog(dogs, targetWeek);

    setViewer(dog, true);
}

function getDog(images, index) {
    return images[index];
}

function setViewer(dog, full) {
    viewer.querySelector('img').src = full ? dog.img : dog.smallImg;
    viewer.querySelector('figcaption').innerText = dog.label;
}

function roulette() {
    let total = 25;
    const updater = (index) => {
        const d = dogs[Math.floor(Math.random() * dogs.length)];

        if (index > 0) {
            setViewer(d, false);
            setTimeout(() => updater(index - 1), (250 - ((250 / total) * index)));
        } else {
            setViewer(d, true);
        }
    };

    updater(total);
}

document.getElementById('random-btn').addEventListener('click', e => {
    e.preventDefault();
    roulette();
});

if (navigator.share) {
    document.getElementById('share-btn').style.display = 'block';
}

const ImageLoader = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = err => reject(err);
      img.src = src;
    })
  };

function loadSmallImages() {
    const updater = (index) => {
        if (index < dogs.length) {
            ImageLoader(dogs[index].smallImg)
                .then(() => updater(index + 1));
        }
    }
    updater(0);
}
loadSmallImages();