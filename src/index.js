import './sass/style.scss';

// Tabs
const tabs = document.querySelectorAll('.catalog__tab'),
      tabsContent = document.querySelectorAll('.catalog__content'),
      tabsParent = document.querySelector('.catalog__tabs');

function hideTabContent() {
    tabsContent.forEach(item => {
        item.classList.remove('catalog__content_active');
    });
}

function resetTabs() {
    tabs.forEach(item => {
        item.classList.remove('catalog__tab_active');
    });
}

function showTabContent(i = 0) {
    tabsContent[i].classList.add('catalog__content_active');
    const catalogItems = tabsContent[i].children;

    for (let item of catalogItems) {
        item.querySelector('.catalog-item__content').classList.add('catalog-item__content_active');
        item.querySelector('.catalog-item__list').classList.remove('catalog-item__list_active');
    }
}

tabsParent.addEventListener('click', (event) => {
    let target = event.target;

    if (target && (target.classList.contains('catalog__tab') || target.parentNode.classList.contains('catalog__tab'))) {
        let tabId = target.id;

        if (target.parentNode.classList.contains('catalog__tab')) {
            tabId = target.parentNode.id;
            target = target.parentNode;
        }

        resetTabs();
        hideTabContent();

        target.classList.add('catalog__tab_active');

        tabs.forEach ((item, i) => {
            if (item.id === tabId) {
                showTabContent(i);
                return true;
            }
        });
    }
});

//Modal consultation
const modalConsultTrigger = document.querySelectorAll('[data-modalconsult]'),
    modalConsult = document.querySelector('.modal.consultation'),
    overlay = document.querySelector('.overlay'),
    modalClose = document.querySelectorAll('.modal__close'),
    modalThanks = document.querySelector('.thanks');

function modalOpened () {
    modalConsult.classList.add('modal_active');
    overlay.classList.add('overlay_active');
}

modalConsultTrigger.forEach((btn) => {
    btn.addEventListener('click', modalOpened);
});

//Modal consultation send(clear)
document.querySelector('#consultation').addEventListener('click', (e) => {
    e.preventDefault();

    const cosultForm = e.target.parentNode; //feed-form

    if ((cosultForm.elements.name.value !== '' && cosultForm.elements.phone.value !== '') || 
        (cosultForm.elements.name.value !== '' && cosultForm.elements.email.value !== '')) {
        modalConsult.classList.remove('modal_active');
        modalThanks.classList.add('modal_active');

        cosultForm.reset();
    } else {
        alert("Заполните данные");
    }   
});

//Modal Pay
const buttonPay = document.querySelectorAll('.button.button_mini'),
    modalPay = document.querySelector('.modal.pay'),
    modalPayItemsList = document.querySelector('.modal.pay .modal__descr ul');

function renderCart(productId, name, price, num, isRestoreCart = false) {
    const totalPriceEl = document.querySelector('.modal__price');
    const totalNumEl = document.querySelector('.header__cart_total');
    let totalPrice = parseInt(totalPriceEl.innerText.replace(/[^0-9]/ig, ''));
    
    if (isNaN(totalPrice)) {
        totalPrice = 0;
    }

    totalPrice += price;
    totalPriceEl.innerText = `${new Intl.NumberFormat().format(totalPrice)} руб`;

    let storedItems = JSON.parse(localStorage.getItem('selected-items'));
        
    if (storedItems === null) {
        storedItems = [];
    }

    const existingItem = document.querySelector(`#${productId}`);

    if (existingItem) {
        const existingItemPriceElement = existingItem.querySelector('.item_price');
        const existingItemNumElement = existingItem.querySelector('.item_num');
        
        price += parseInt(existingItemPriceElement.innerText.replace(/[^0-9]/ig, ''));
        
        existingItemPriceElement.innerText = `${new Intl.NumberFormat().format(price)} руб`;

        const savedItem = storedItems.find(({ id }) => id === productId);

        if (savedItem) {
            savedItem.price = price;
            savedItem.num += 1;
        }

        existingItemNumElement.innerText = savedItem.num;
    } else {
        // Add new item into the cart
        const itemSelected = document.createElement('li');
        itemSelected.id = productId;
    
        const itemName = document.createElement('span');
        itemName.classList = 'item_name';
        itemName.innerText = name;

        const itemNum = document.createElement('span');
        itemNum.classList = 'item_num';
        itemNum.innerText = num;
    
        const itemPrice = document.createElement('span');
        itemPrice.classList = 'item_price';
        itemPrice.innerText = `${new Intl.NumberFormat().format(price)} руб`;
    
        const itemRemove = document.createElement('span');
        itemRemove.classList = 'item_remove';
        itemRemove.innerHTML = "&times;";
    
        itemRemove.addEventListener('click', e => {
            const productId = e.target.parentNode.id;
            
            e.target.parentNode.remove();
            
            let storedItems = JSON.parse(localStorage.getItem('selected-items'));
            
            if (storedItems !== null && storedItems.length) {
                const removeIndex = storedItems
                    .map(({ id }) => id)
                    .indexOf(productId);

                if (removeIndex !== -1) {
                    const totalPriceEl = document.querySelector('.modal__price');
                    let totalPrice = parseInt(totalPriceEl.innerText.replace(/[^0-9]/ig, ''));
                    
                    totalPrice -= storedItems[removeIndex].price;
                    
                    totalPriceEl.innerText = `${new Intl.NumberFormat().format(totalPrice)} руб`;

                    storedItems.splice(removeIndex, 1);
                    localStorage.setItem('selected-items', JSON.stringify(storedItems));
                }
            }
        });
    
        itemSelected.append(itemName, itemRemove, itemPrice, itemNum);
        modalPayItemsList.append(itemSelected);

        const product = {
            name: name,
            price: price,
            num: num,
            id: productId
        };

        storedItems.push(product);
    } 
    
    if (!isRestoreCart) {
        // add/update selected product in the localStorage
        localStorage.setItem('selected-items', JSON.stringify(storedItems));

        const totalNum = storedItems.reduce((sum, i) => sum += i.num, 0);
        totalNumEl.innerText = totalNum;
    }
}
      
buttonPay.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        modalPay.classList.add('modal_active');
        overlay.classList.add('overlay_active');

        const productID = e.target.dataset.id.replace(/\s|\./g, '_').toLowerCase();
        let productPrice = parseInt(e.target.previousElementSibling.innerText.replace(/[^0-9]/ig, ''));
        const productName = e.target.dataset.itemname;

        renderCart(productID, productName, productPrice, 1);
    });
});

// render cart on window load
window.addEventListener('load', (e) => {
    let storedItems = JSON.parse(localStorage.getItem('selected-items'));

    if (storedItems !== null && storedItems.length) {
        const totalNumEl = document.querySelector('.header__cart_total');
        const totalNum = storedItems.reduce((sum, i) => sum += i.num, 0);
        totalNumEl.innerText = totalNum;

        storedItems.forEach(({ id, name, price, num }) => renderCart(id, name, price, num, true));
    }
});

function modalClosed(e) {
    e.target.parentNode.classList.remove('modal_active');
    overlay.classList.remove('overlay_active');
}

modalClose.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        modalClosed(e);
    });
});

//Modal close on keydown
document.addEventListener('keydown', (e) => {
    if (e.code === "Escape") {
       modalClosed(e);
    }
});

//Scroll
function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1) {
        setTimeout(modalOpened, 3000);
        window.removeEventListener('scroll', showModalByScroll);
    }
}

window.addEventListener('scroll', showModalByScroll);

//link подробнее
const catalogLinks = document.querySelectorAll('.catalog-item__link');

catalogLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        if (e.target.parentNode.classList.contains('catalog-item__content_active')) {
            e.target.parentNode.classList.remove('catalog-item__content_active');
            document.querySelector(`#${e.target.dataset.target}`).classList.add('catalog-item__list_active');
        } 
    });
});

//link назад
const backLink = document.querySelectorAll('.catalog-item__back');

backLink.forEach((back) => {
    back.addEventListener('click', (e) => {
        e.preventDefault();
        e.target.parentNode.classList.remove('catalog-item__list_active');
        e.target.parentNode.parentNode.querySelector('.catalog-item__content').classList.add('catalog-item__content_active');
    });
});


//Modal Pay clear
document.querySelector('#pay').addEventListener('click', (e) => {
    e.preventDefault();

    const payForm = e.target.parentNode.parentNode; //feed-form
    console.log(e.target.parentNode);
    if ((payForm.elements.name.value !== '' && payForm.elements.phone.value !== '') || 
        (payForm.elements.name.value !== '' && payForm.elements.email.value !== '')) {
        modalPay.classList.remove('modal_active');
        modalThanks.classList.add('modal_active');

        payForm.reset();
        localStorage.removeItem('selected-items');
        modalPayItemsList.replaceChildren();
    } else {
        alert("Заполните данные");
    }   
});

//cart click

document.querySelector('.header__cart').addEventListener('click', (e) => {
    e.preventDefault();

    modalPay.classList.add('modal_active');
    overlay.classList.add('overlay_active');
});
