var IMAGE_URL = 'http://91.228.218.15/nginx/dreemland/',
    API_URL = 'http://91.228.218.15:90/',
    ALL_PRODUCTS_URL = 'api/items',
    API_CATEGORIES = 'api/categories',
    API_LOGIN = 'api/login',
    API_REG = 'api/reg',
    API_ADD_ORDER = 'api/add_order',
    API_ORDER = 'api/orders',
    API_USERS = 'api/users',
    API_REMOVE_ORDER = 'api/remove_order',
    API_UPDATE_ORDER = 'api/update_order',
    API_SAVE_IMG = 'api/save_img',
    API_LOGOUT = 'api/logout',
    API_ADD_PRODUCT = 'api/add_product',
    API_UPD_PRODUCT = 'api/update_product',
    API_REMOVE_PRODUCT = 'api/remove_product',
    API_ADD_CATEGORY = 'api/add_category',
    API_DEL_CATEGORY = 'api/remove_category',
    API_UPD_CATEGORY = 'api/update_category',
    API_SUBCATEGORY = 'api/update_subcategories';

var itemStorage = [];
var categoryStorage = [];

function getProduct() {
    $.ajax({
        type: 'GET',
        url: API_URL + ALL_PRODUCTS_URL,
        success: function (data) {
            itemStorage = data;
            productRender(itemStorage, activeFilter, searchWord, activeSortMode, activePage);
        },
        error: function (err) {
        }
    });
}

function getCategories(select) {
    var categoryList = $('#category-list');
    $.ajax({
        type: 'GET',
        url: API_URL + API_CATEGORIES,
        success: function (data) {
            categoryStorage = data;
            categoryRender();
            if (select) {
                optionLoad(select);
            }
        },
        error: function (err) {
            conole.log(err);
        }
    });
}

function loginUser() {
    $.ajax({
        type: 'POST',
        url: API_URL + API_LOGIN,
        data: {
            username: $('#login').val(),
            password: $('#password').val()
        },
        success: function (data) {
            if (data.result !== false) {
                activeUser = data;
                $('#alertMessage').html('Вы успешно авторизовались');
                $('#modalAlert').modal('show');
                setTimeout(function () {
                    $('#modalAlert').modal('hide');

                }, 1500);
                $('#modalAlert').on('hidden.bs.modal', function (e) {
                    window.location.hash = '#main';
                });
                getOrders(activeUser.role, activeUser._id);
                renderMenu();
                getUsers();
            } else {
                $('#alertMessage').html('Вы ввели неверные данные');
                $('#modalAlert').modal('show');
                setTimeout(function () {
                    $('#modalAlert').modal('hide');

                }, 1500);
            }
        },
        error: function (err) {
            conole.log(err);
        }
    });
}

function regUser() {
    $.ajax({
        type: 'POST',
        url: API_URL + API_REG,
        data: {
            username: $('#regLogin').val(),
            password: $('#regPassword').val(),
            email: $('#regEmail').val(),
            number: $('#regNumber').val(),
            role: "USER",
            /*adress: $('#regAdress').val(),
            index: $('#regIndex').val(),*/
            otherOptions: [$("#regAdress").val(), $('#regIndex').val()]
        },
        success: function (data) {
            if (data.result !== false) {
                $('#alertMessage').html('Вы успешно зарегистрировались');
                $('#modalAlert').modal('show');
                setTimeout(function () {
                    $('#modalAlert').modal('hide');

                }, 1500);
            } else {
                $('#alertMessage').html('Что-то пошло не так');
                $('#modalAlert').modal('show');
                setTimeout(function () {
                    $('#modalAlert').modal('hide');

                }, 1500);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function addOrder() {
    $.ajax({
        type: 'POST',
        url: API_URL + API_ADD_ORDER,
        data: {
            userId: activeUser._id,
            items: JSON.parse(sessionStorage.getItem('PRODUCTS'))
        },
        success: function (data) {
            $('#final-price').html('<span class="nav-link"  >Итого: 0 руб</span>');
            $('.modal-body').html('<span class="align-middle">Заказ оформлен</span>');
            $('.modal-footer').html('<span class="align-middle">В корзине пусто</span>');
            sessionStorage.clear();
            setTimeout(function () {
                getOrders(activeUser.role, activeUser._id);
            }, 2000);

        },
        error: function (err) {
            console.log(err);
        }
    })
}

function getOrders(role, id) {
    $.ajax({
        type: 'GET',
        url: API_URL + API_ORDER,
        success: function (data) {
            if (role == "ADMIN") {
                orders = data;
                orderListRender();
                renderMenu();
            } else {
                var userOrder = [];
                orders = data;
                orders.forEach(function (item, index, self) {
                    if (item.userId === id) userOrder.push(item)
                });
                orders = userOrder;
                myOrderListRender();
                renderMenu();
            }
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function checkLogin() {
    $.ajax({
        type: 'GET',
        url: API_URL + API_LOGIN,
        success: function (data) {
            if (data.result !== false) {
                activeUser = data;
                getOrders(activeUser.role, activeUser._id);
            }
            renderMenu();
        },
        error: function (err) {
            console.log(err);
        }
    });

}

function getUsers() {
    $.ajax({
        type: 'GET',
        url: API_URL + API_USERS,
        success: function (data) {
            users = data;
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function removeOrder(orderId) {
    $.ajax({
        type: 'POST',
        url: API_URL + API_REMOVE_ORDER,
        data: {
            id: orderId
        },
        success: function () {
            getOrders(activeUser.role, activeUser._id);
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function updateOrder(orderId, newStatus) {
    $.ajax({
        type: 'POST',
        url: API_URL + API_UPDATE_ORDER,
        data: {
            id: orderId,
            name: newStatus
        },
        success: function () {
            getOrders(activeUser.role, activeUser._id);
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function logOut() {
    $.ajax({
        type: 'POST',
        url: API_URL + API_LOGOUT,
        success: function () {
            activeUser = undefined;
            window.location.hash = '#main'
            renderMenu();
        },
        error: function (err) {
            console.log(err);
        }
    });

}


$(document).ready(function () {
    checkLogin();
    getProduct();
    getCategories();
    renderMenu();
    cartRender();
});
