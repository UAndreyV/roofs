window.addEventListener('DOMContentLoaded', () => {

    function slider(sliderParent, siderWrapper, track, slideItems, prevBtn, nextBtn) {

        let slider = document.querySelector(sliderParent),
            sliderList = slider.querySelector(siderWrapper),
            sliderTrack = slider.querySelector(track),
            slides = slider.querySelectorAll(slideItems),
            prev = document.querySelector(prevBtn),
            next = document.querySelector(nextBtn),
            slideWidth = slides[0].offsetWidth,
            slideIndex = 0,
            posInit = 0,
            posX1 = 0,
            posX2 = 0,
            posY1 = 0,
            posY2 = 0,
            posFinal = 0,
            isSwipe = false,
            isScroll = false,
            allowSwipe = true,
            transition = true,
            nextTrf = 0,
            prevTrf = 0,
            lastTrf = --slides.length * slideWidth,
            posThreshold = slides[0].offsetWidth * 0.35,
            trfRegExp = /([-0-9.]+(?=px))/,
            swipeStartTime,
            swipeEndTime,
            getEvent = function () {
                return (event.type.search('touch') !== -1) ? event.touches[0] : event;
            },
            slide = function () {
                if (transition) {
                    sliderTrack.style.transition = 'transform .2s';
                }
                sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;

                prev.classList.toggle('disabled', slideIndex === 0);
                next.classList.toggle('disabled', slideIndex === --slides.length);
            },
            swipeStart = function () {
                let evt = getEvent();

                if (allowSwipe) {

                    swipeStartTime = Date.now();

                    transition = true;

                    nextTrf = (slideIndex + 1) * -slideWidth;
                    prevTrf = (slideIndex - 1) * -slideWidth;

                    posInit = posX1 = evt.clientX;
                    posY1 = evt.clientY;

                    sliderTrack.style.transition = '';

                    document.addEventListener('touchmove', swipeAction);
                    document.addEventListener('mousemove', swipeAction);
                    document.addEventListener('touchend', swipeEnd);
                    document.addEventListener('mouseup', swipeEnd);
                }
            },
            swipeAction = function () {

                let evt = getEvent(),
                    style = sliderTrack.style.transform,
                    transform = +style.match(trfRegExp)[0];

                posX2 = posX1 - evt.clientX;
                posX1 = evt.clientX;

                posY2 = posY1 - evt.clientY;
                posY1 = evt.clientY;

                if (!isSwipe && !isScroll) {
                    let posY = Math.abs(posY2);
                    if (posY > 7 || posX2 === 0) {
                        isScroll = true;
                        allowSwipe = false;
                    } else if (posY < 7) {
                        isSwipe = true;
                    }
                }

                if (isSwipe) {
                    if (slideIndex === 0) {
                        if (posInit < posX1) {
                            setTransform(transform, 0);
                            return;
                        } else {
                            allowSwipe = true;
                        }
                    }


                    if (slideIndex === --slides.length) {
                        if (posInit > posX1) {
                            setTransform(transform, lastTrf);
                            return;
                        } else {
                            allowSwipe = true;
                        }
                    }

                    if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
                        reachEdge();
                        return;
                    }

                    sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
                }

            },
            swipeEnd = function () {
                posFinal = posInit - posX1;

                isScroll = false;
                isSwipe = false;

                document.removeEventListener('touchmove', swipeAction);
                document.removeEventListener('mousemove', swipeAction);
                document.removeEventListener('touchend', swipeEnd);
                document.removeEventListener('mouseup', swipeEnd);

                if (allowSwipe) {
                    swipeEndTime = Date.now();
                    if (Math.abs(posFinal) > posThreshold || swipeEndTime - swipeStartTime < 300) {
                        if (posInit < posX1) {
                            slideIndex--;
                        } else if (posInit > posX1) {
                            slideIndex++;
                        }
                    }

                    if (posInit !== posX1) {
                        allowSwipe = false;
                        slide();
                    } else {
                        allowSwipe = true;
                    }

                } else {
                    allowSwipe = true;
                }

            },
            setTransform = function (transform, comapreTransform) {
                if (transform >= comapreTransform) {
                    if (transform > comapreTransform) {
                        sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
                    }
                }
                allowSwipe = false;
            },
            reachEdge = function () {
                transition = false;
                swipeEnd();
                allowSwipe = true;
            };

        sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';


        function getElementWidth() {
            window.addEventListener('resize', () => {
                let width = slides[0].offsetWidth;
                slideWidth = width;
            });
        }

        getElementWidth();


        sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
        slider.addEventListener('touchstart', swipeStart);
        slider.addEventListener('mousedown', swipeStart);

        next.addEventListener('click', () => {
            if (slideIndex == slides.length - 1) {
                return;
            } else {
                slideIndex++;
                slide();
            }
        });
        prev.addEventListener('click', () => {
            if (slideIndex == 0) {
                return;
            } else {
                slideIndex--;
                slide();
            }
        });
    }

    //переключение слайдов

    function switchingItems(bodyItem, parentItems) {
        const parent = document.querySelector(parentItems);
        const items = parent.querySelectorAll(bodyItem);
        const btnNext = parent.querySelector('.form-content__control-btn-next');
        const btnPrev = parent.querySelector('.form-content__control-btn-prev');
        let current = 1;
        let itemsCurrent = parent.querySelector('.form-content__control-scale > div');
        let controlPercent = parent.querySelector('.form-content__control-percent');
        let btnSubmit = parent.querySelector('.form-content__item-last-contact > button');

        function hiddenItem(items) {
            items.forEach(item => {
                item.classList.add('hidden');
            });
        }

        function showItem(i = 0) {
            items[i].classList.add('show');
        }

        hiddenItem(items);
        showItem();

        function btnPrevDisable(trigger) {
            if (trigger == 1) {
                btnPrev.setAttribute('disabled', 'disabled');
            } else {
                btnPrev.removeAttribute('disabled');
            }
        }
        btnPrevDisable(current);

        function showBtnSubmit(t) {
            if (t == items.length) {
                btnNext.classList.add('hidden');
                btnNext.classList.remove('show');
            } else {
                btnNext.classList.add('show');
                btnNext.classList.remove('hidden');
            }
        }

        showBtnSubmit(current);

        function itemsCurrentUload(current) {
            const currentExecution = current / items.length * 100;
            itemsCurrent.style.width = `${currentExecution}%`;
            controlPercent.innerText = `${currentExecution}%`;
        }
        itemsCurrentUload(current);

        btnNext.addEventListener('click', (e) => {
            e.preventDefault();
            items[current - 1].classList.add('hidden');
            items[current - 1].classList.remove('show');
            items[current].classList.add('show', 'emergence');
            current += 1;
            btnPrevDisable(current);
            showBtnSubmit(current);
            itemsCurrentUload(current);
        });

        btnPrev.addEventListener('click', (e) => {
            e.preventDefault();
            items[current - 1].classList.add('hidden');
            items[current - 1].classList.remove('show');
            items[current - 2].classList.add('show');
            current -= 1;
            btnPrevDisable(current);
            showBtnSubmit(current);
            itemsCurrentUload(current);
        });



        btnSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            const calc = document.querySelector('.form-content');
            const items = document.querySelector('.form-content__items');
            const control = document.querySelector('.form-content__control');
            items.classList.add('hidden');
            control.classList.add('hidden');
            const final = document.createElement('div');
            final.classList.add('calc__thanks', 'emergence');
            final.innerHTML = `               
                    <span class="calc__body-thanks">
                        Спасибо!
                    </span>
                `;
            calc.append(final);
            //delFinal(parent, final);
        });

        function delFinal(parent, finalDiv) {
            setTimeout(() => {
                parent.removeChild(finalDiv);
            },
                2000);
        }

    }

    //calc
    function setImageTypeRoof() {
        const parent = document.querySelector('.form-content');
        const inputCheckboxRoof = parent.querySelectorAll('.form-content__item-type-roof-item > input');
        const imageRoofLength = parent.querySelector('.form-content__item-roof-length-img > img');
        const imageItem = parent.querySelectorAll('[data-img]');

        inputCheckboxRoof.forEach((item, i) => {
            item.addEventListener('click', function () {
                switch (i) {
                    case 0:
                        imageRoofLength.setAttribute('src', 'img/length1.png');
                        imageItem.forEach(item => {
                            item.setAttribute('src', 'img/type-roof1-hole.png');
                        });
                        break;
                    case 1:
                        imageRoofLength.setAttribute('src', 'img/length2.png');
                        imageItem.forEach(item => {
                            item.setAttribute('src', 'img/type-roof2-hole.png');
                        });
                        break;
                    case 2:
                        imageRoofLength.setAttribute('src', 'img/length3.png');
                        imageItem.forEach(item => {
                            item.setAttribute('src', 'img/type-roof3-hole.png');
                        });
                        break;
                    case 3:
                        imageRoofLength.setAttribute('src', 'img/length4.png');
                        imageItem.forEach(item => {
                            item.setAttribute('src', 'img/type-roof4-hole.png');
                        });
                        break;
                    case 4:
                        imageRoofLength.setAttribute('src', 'img/length5.png');
                        imageItem.forEach(item => {
                            item.setAttribute('src', 'img/type-roof5-hole.png');
                        });
                        break;

                }
            });
        });
    }

    function setColorRoof() {
        const label = document.querySelectorAll('.form-content__item-coating-color-var-group > label');
        const backCoating = document.querySelector('.form-content__item-coating-color-img-back');
        const backLast = document.querySelector('.form-content__item-last-img-back');

        label.forEach(item => {
            item.addEventListener('click', () => {
                const colorLable = item.style.backgroundColor;
                backCoating.style.backgroundColor = colorLable;
                backLast.style.backgroundColor = colorLable;
            });
        });
    }

    slider('.slider1',
        '.slider-wrapper',
        '.form-content__item-type-roof',
        '.form-content__item-type-roof-item',
        '.swiper-button-prev1',
        '.swiper-button-next1');

    slider('.slider2',
        '.slider-wrapper',
        '.form-content__item-coating-color-var',
        '.form-content__item-coating-color-group',
        '.swiper-button-prev2',
        '.swiper-button-next2');

    setImageTypeRoof();

    setColorRoof();

    switchingItems('.form-content__item', '.form-content');

});
