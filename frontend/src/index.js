var cart = [],
    finalPrice = 0,
    activeUser,
    orders,
    users;

$(document).ready(function () {
    var root = $('#root');
    root.html('<div id="menu"></div><div id="content"></div>');
});

function renderMenu() {
    var menu = $('#menu'),
        nav = document.createElement('nav'),
        brandLink = document.createElement('a'),
        burgerButton = document.createElement('button'),
        burgerSpan = document.createElement('span'),
        menuLink = document.createElement('div'),
        menuUl = document.createElement('ul'),
        menuLi1 = document.createElement('li'),
        menuA1 = document.createElement('a'),
        menuLi2 = document.createElement('li'),
        menuA2 = document.createElement('a'),
        menuLi3 = document.createElement('li'),
        menuA3 = document.createElement('a'),
        menuLi4 = document.createElement('li'),
        menuA4 = document.createElement('a'),
        menuLi5 = document.createElement('li'),
        menuLi6 = document.createElement('li'),
        menuA6 = document.createElement('a'),
        menuLi7 = document.createElement('li'),
        menuA7 = document.createElement('a'),
        menuLi8 = document.createElement('li'),
        menuA8 = document.createElement('a'),
        menuLi9 = document.createElement('li'),
        menuA9 = document.createElement('a'),
        menuLi10 = document.createElement('li'),
        menuA10 = document.createElement('a');

    nav.className = 'navbar navbar-expand-lg navbar-light bg-light';

    brandLink.className = 'navbar-brand';
    brandLink.href = "#main";
    brandLink.innerText = "Мечталия";

    burgerButton.className = 'navbar-toggler';
    burgerButton.type = "button";
    burgerButton.setAttribute('data-toggle', 'collapse');
    burgerButton.setAttribute('data-target', '#navbarNav');
    burgerButton.setAttribute('aria-controls', 'navbarNav');
    burgerButton.setAttribute('aria-expanded', 'false');
    burgerButton.setAttribute('aria-label', 'Toggle navigation');
    burgerSpan.className = "navbar-toggler-icon";
    burgerButton.appendChild(burgerSpan);

    menuLink.className = 'collapse navbar-collapse';
    menuLink.id = 'navbarNav';

    menuUl.className = 'navbar-nav';

    menuLi1.className = 'nav-item';
    menuA1.className = 'nav-link';
    menuA1.href = '#about';
    menuA1.innerText = 'О нас';
    menuLi1.appendChild(menuA1);
    menuUl.appendChild(menuLi1);

    menuLi2.className = 'nav-item';
    menuA2.className = 'nav-link';
    menuA2.href = '#contact';
    menuA2.innerText = 'Контакты';
    menuLi2.appendChild(menuA2);
    menuUl.appendChild(menuLi2);

    menuLi3.className = 'nav-item';
    menuA3.className = 'nav-link';
    menuA3.href = '#shop';
    menuA3.innerText = 'Каталог';
    menuLi3.appendChild(menuA3);
    menuUl.appendChild(menuLi3);

    if (activeUser && activeUser.result != "false") {
        if (activeUser.role == "ADMIN") {
            menuLi9.className = 'nav-item';
            menuA9.className = 'nav-link';
            menuA9.href = '#order';
            menuA9.innerText = 'Заказы';
            menuLi9.appendChild(menuA9);
            menuUl.appendChild(menuLi9);
        } else if (activeUser.role == "USER") {
            menuLi10.className = 'nav-item';
            menuA10.className = 'nav-link';
            menuA10.href = '#myorder';
            menuA10.innerText = 'Мои заказы';
            menuLi10.appendChild(menuA10);
            menuUl.appendChild(menuLi10);
        }
    }

    menuLi4.className = 'nav-item marginIt';
    menuLi4.id = 'final-price';
    menuA4.className = 'nav-link';
    menuA4.innerText = 'Итого: ' + sessionStorage.getItem('PRICE') * 1 + ' руб';
    menuLi4.appendChild(menuA4);
    menuUl.appendChild(menuLi4);

    menuLi5.className = 'nav-item';
    menuLi5.innerHTML = ('<span onclick="cartRender()"  class="nav-link" data-toggle="modal" data-target=".bd-example-modal-lg" >Корзина</span>' +
        '                  <div id="myCartModal" class="modal fade bd-example-modal-lg cart" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">' +
        '                     <div class="modal-dialog modal-lg">' +
        '                         <div class="modal-content">' +
        '                             <div class="modal-header">' +
        '                                 <h4>Корзина</h4>' +
        '                              </div>' +
        '                             <div class="modal-body">' +
        '                              </div>' +
        '                          <div class="modal-footer">' +
        '                             </div>' +
        '                      </div>' +
        '                    </div>' +
        '             </div>');
    menuUl.appendChild(menuLi5);

    if (activeUser === undefined) {
        menuLi6.className = 'nav-item';
        menuA6.className = 'nav-link';
        menuA6.href = '#login';
        menuA6.innerText = 'Авторизация';
        menuLi6.appendChild(menuA6);
        menuUl.appendChild(menuLi6);

        menuLi7.className = 'nav-item';
        menuA7.className = 'nav-link';
        menuA7.href = '#signup';
        menuA7.innerText = 'Регистрация';
        menuLi7.appendChild(menuA7);
        menuUl.appendChild(menuLi7);
    } else {
        menuLi8.className = 'nav-item';
        menuA8.className = 'nav-link';
        menuA8.href = '#main';
        menuA8.addEventListener('click', function () {
            logOut();
        });
        menuA8.innerText = 'Выход';
        menuLi8.appendChild(menuA8);
        menuUl.appendChild(menuLi8);
    }

    menuLink.appendChild(menuUl);
    nav.append(brandLink);
    nav.append(burgerButton);
    nav.append(menuLink);
    menu.html(nav);
}

$('#content').ready(function () {
    var content = $('#content');

    content.html(mainPageRender());
    window.location.hash = "#main";

});

$(window).on('hashchange', (function () {
    var content = $('#content');
    var hash = window.location.hash;
    switch (hash) {
        case '#main':
            content.html(mainPageRender());
            break;
        case '#about':
            content.html(aboutPageRender());
            break;
        case '#contact':
            content.html(contactPageRender());
            break;
        case '#shop':
            content.html(shopPageRender());
            break;
        case '#login':
            content.html(loginPageReder());
            break;
        case '#signup':
            content.html(signupPageReder());
            break;
        case '#order':
            content.html(aOrderPageRender());
            break;
        case '#myorder':
            content.html(myOrderPageRender());
            break;
        default:
            content.html(mainPageRender());
    }
}));


function cartRender() {
    var cartItem = JSON.parse(sessionStorage.getItem('PRODUCTS')),
    cartContent = $('.modal-body');
    if (cartItem !== null && !isEmpty(cartItem)) {
        var productList = document.createElement('div');
        productList.className = 'product-list-cart';
       /* cartItem = cartItem.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });*/
        cartItem.forEach(function (items, index) {
            var product = document.createElement('div'),
                img = document.createElement('img'),
                productBody = document.createElement('div'),
                productName = document.createElement('h5'),
                productPrice = document.createElement('p'),
                delAllButton = document.createElement('button');

            product.className = 'card';

            img.src = IMAGE_URL + items.img + '.jpg';
            img.className = 'card-img-top';

            productBody.className = 'card-body';

            productName.innerText = items.name + ' x' + items.count;
            productName.className = 'card-title';

            productPrice.innerHTML = 'Общая цена: ' + items.price * items.count;
            productPrice.className = 'card-text';


            delAllButton.onclick = function() {
                cartItem.splice(index, 1);
                sessionStorage.setItem('PRICE', JSON.parse(sessionStorage.getItem('PRICE')) - parseInt(items.price) * items.count);
                sessionStorage.setItem('PRODUCTS', JSON.stringify(cartItem));
                finalCostRender();
                cartRender();
            };
            delAllButton.innerText = 'Удалить все';

            product.appendChild(img);
            product.appendChild(productBody);
            product.appendChild(productName);
            product.appendChild(productPrice);
            product.appendChild(delAllButton);
            productList.append(product);
        });
        cartContent.html(productList);
        if (activeUser && activeUser.result != "false") {
            $('.modal-footer').html('<button onclick="addOrder()" type="button" class="btn btn-primary align-middle"">Оформить заказ</button>');
        } else {
            $('.modal-footer').html('<span class="align-middle">Для оформления заказа необходимо <a onclick="closeModal()" href="#login">авторизоваться</a></button>');
        }
    } else {
        cartContent.html('');
        $('.modal-footer').html('<span class="align-middle">В корзине пусто</span>');
    }
}

function isEmpty(map) {
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function closeModal() {
    $('#myCartModal').modal('hide');
}