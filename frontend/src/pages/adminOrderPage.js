function aOrderPageRender() {
    var content = $('#content');
    content.html('<div id="order" ></div>');
    orderListRender();
}

function orderListRender() {
    var orderContent = document.createElement('div'),
        orderTable = document.createElement('table'),
        orderThead = document.createElement('thead'),
        orderTbody = document.createElement('tbody'),
        modalDiv = document.createElement('div'),
        modalDialogDiv = document.createElement('div'),
        modalContentDiv = document.createElement('div'),
        modalHeadDiv = document.createElement('div'),
        modalBodyDiv = document.createElement('div'),
        modalFooterDiv = document.createElement('div'),
        modalCloseButton = document.createElement('button');

    modalDiv.className = "modal fade bd-example-modal-lg";
    modalDiv.id = "orderCartModal";
    modalDiv.setAttribute('tabindex', '-1');
    modalDiv.setAttribute('role', 'dialog');
    modalDiv.setAttribute('aria-labelledby', 'myLargeModalLabel');
    modalDiv.setAttribute('aria-hidden', 'true');
    modalDialogDiv.className = "modal-dialog modal-lg";
    modalContentDiv.className = "modal-content";
    modalHeadDiv.className = "modal-header orderCartHead";
    modalBodyDiv.className = "modal-body orderCartBody";
    modalFooterDiv.className = "modal-footer orderCartFooter";
    modalCloseButton.onclick = function () {
        $('#orderCartModal').modal('hide');
    };
    modalCloseButton.innerText = 'Закрыть';
    modalCloseButton.className = 'align-middle';

    modalFooterDiv.append(modalCloseButton);
    modalContentDiv.append(modalHeadDiv);
    modalContentDiv.append(modalBodyDiv);
    modalContentDiv.append(modalFooterDiv);
    modalDialogDiv.append(modalContentDiv);
    modalDiv.append(modalDialogDiv);

    orderThead.innerHTML = '<tr><th scope="col">#</th><th scope="col">Пользователь</th><th scope="col">Заказ</th><th scope="col">Статус</th><th scope="col">Удалить</th><th scope="col">Изменение статуса</th></tr>';

    orders.forEach(function (items, index) {
        var orderTr = document.createElement('tr'),
            orderNumber = document.createElement('th'),
            orderUser = document.createElement('td'),
            orderItems = document.createElement('td'),
            orderStatus = document.createElement('td'),
            orderRemove = document.createElement('td'),
            orderChangeStatus = document.createElement('td'),
            userInfo = document.createElement('button'),
            orderInfo = document.createElement('button'),
            deleteOrder = document.createElement('button'),
            statusInProcess = document.createElement('button'),
            statusCompleate = document.createElement('button'),
            statusNEW = document.createElement('button');

        orderNumber.innerText = index;
        userInfo.innerText = 'Пользователь';
        userInfo.onclick = function () {
            $('.orderCartHead').html('<h4>Пользователь</h4>');
            $('.orderCartBody').html('');
            var userOrder = users.find(function (item, index, self) {
                if (item._id == items.userId) {
                    return users;
                }
            });
            userOrder.username ? $('.orderCartBody').append("<b>Имя пользователя:</b> " + userOrder.username, '<br />') : null;
            userOrder.email ? $('.orderCartBody').append("<b>Email пользователя:</b> " + userOrder.email, '<br />') : null;
            userOrder.number ? $('.orderCartBody').append("<b>Номер телефона:</b> " + userOrder.number, '<br />') : null;
            if (userOrder.otherOptions[0]) {$('.orderCartBody').append("<b>Адрес:</b> " + userOrder.otherOptions[0])}
            if (userOrder.otherOptions[1]) {$('.orderCartBody').append(" | " + userOrder.otherOptions[0])}
            $('#orderCartModal').modal('show');
        };
        orderUser.append(userInfo);
        orderInfo.innerText = 'Заказ';
        orderInfo.onclick = function () {
            $('.orderCartHead').html('<h4>Заказ</h4>');
            $('.orderCartBody').html('');

            var productList = document.createElement('div');

            productList.className = 'product-list-cart';
            if (items.items.length > 0) {
                var orderItems = items.items;
                orderItems.forEach(function (item, index, self) {
                    var product = document.createElement('div'),
                        img = document.createElement('img'),
                        productBody = document.createElement('div'),
                        productName = document.createElement('h5'),
                        productPrice = document.createElement('p'),
                        buyButton = document.createElement('button');

                    product.className = 'card';

                    img.src = IMAGE_URL + item.img + '.jpg';
                    img.className = 'card-img-top';

                    productBody.className = 'card-body';

                    productName.innerText = item.name + ' x' + item.count;
                    productName.className = 'card-title';

                    productPrice.innerHTML = 'Цена: ' + item.price * item.count;
                    productPrice.className = 'card-text';

                    product.appendChild(img);
                    product.appendChild(productBody);
                    product.appendChild(productName);
                    product.appendChild(productPrice);
                    productList.append(product);
                })
            }
            $('.orderCartBody').append(productList);
            $('#orderCartModal').modal('show');
        };
        orderItems.append(orderInfo);
        switch (items.status) {
            case "NEW": orderStatus.innerText = "Новый"; break;
            case "FINISH": orderStatus.innerText = "Выполнено"; break;
            case "INPROCESS": orderStatus.innerText = "В процессе"; break;
        }
        deleteOrder.innerHTML = 'Удалить';
           deleteOrder.onclick = function(){
            removeOrder(items._id);
        };
        orderRemove.append(deleteOrder);
        statusInProcess.innerText = "В процессе";
        statusInProcess.onclick = function() {
            updateOrder(items._id, "INPROCESS")
        };
        statusCompleate.innerText = "Выполнено";
        statusCompleate.onclick = function() {
            updateOrder(items._id, "FINISH")
        };
        statusNEW.innerText = "Новый";
        statusNEW.onclick = function() {
            updateOrder(items._id, "NEW")
        };
        orderChangeStatus.append(statusNEW,statusInProcess,statusCompleate);

        orderTr.append(orderNumber);
        orderTr.append(orderUser);
        orderTr.append(orderItems);
        orderTr.append(orderStatus);
        orderTr.append(orderRemove);
        orderTr.append(orderChangeStatus);
        orderTbody.append(orderTr);
    });


    orderTable.className = "table table-striped";
    orderTable.append(orderThead);
    orderTable.append(orderTbody);
    orderContent.append(modalDiv);
    orderContent.append(orderTable);

    $('#order').html(orderContent);
}