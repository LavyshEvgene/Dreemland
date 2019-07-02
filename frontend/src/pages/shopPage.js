var activeFilter = [],
    activeSortMode = "",
    searchWord = "",
    activePage = 1,
    subCatStore = [];

function shopPageRender() {
    var content = $('#content'),
        modalDiv = document.createElement('div'),
        modalDialogDiv = document.createElement('div'),
        modalContentDiv = document.createElement('div'),
        modalHeadDiv = document.createElement('div'),
        modalBodyDiv = document.createElement('div'),
        modalFooterDiv = document.createElement('div');

    modalDiv.className = "modal fade bd-example-modal-lg";
    modalDiv.id = "Adminmodal";
    modalDiv.setAttribute('tabindex', '-1');
    modalDiv.setAttribute('role', 'dialog');
    modalDiv.setAttribute('aria-labelledby', 'myLargeModalLabel');
    modalDiv.setAttribute('aria-hidden', 'true');
    modalDialogDiv.className = "modal-dialog modal-lg";
    modalContentDiv.className = "modal-content";
    modalHeadDiv.className = "modal-header adminmodalHead";
    modalBodyDiv.className = "modal-body adminmodalBody";
    modalFooterDiv.className = "modal-footer adminmodalFooter";

    modalContentDiv.append(modalHeadDiv);
    modalContentDiv.append(modalBodyDiv);
    modalContentDiv.append(modalFooterDiv);
    modalDialogDiv.append(modalContentDiv);
    modalDiv.append(modalDialogDiv);
    content.html('<div id="sort"></div><div id="category-list"></div><div id="product-list"></div>');
    content.append(modalDiv);
    sortRender();
    categoryRender();
    productRender(itemStorage, activeFilter, searchWord, activeSortMode, activePage);
}

function sortRender() {
    var sort = $('#sort');
    sort.html('<nav class="navbar navbar-expand-lg navbar-light bg-light">' +
        '  <div class="collapse navbar-collapse" id="navbarNav">' +
        '    <ul class="navbar-nav">' +
        '      <li class="nav-item">' +
        '        <a class="nav-link" onclick="allSortModeClick()">Все</a>' +
        '      </li>' +
        '      <li class="nav-item">' +
        '        <a class="nav-link" onclick="waneSortModeClick()">Цена(Дорогие)</a>' +
        '      </li>' +
        '      <li class="nav-item">' +
        '        <a class="nav-link" onclick="increaseSortModeClick()">Цена(Дешевые)</a>' +
        '      </li>' +
        '    </ul>' +
        '      <input onchange="searchByName(value)"  id="search-input" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">' +
        '  </div>' +
        '</nav>');
    $("input:checkbox:checked").prop('checked', false);
};

function categoryRender() {
    var categoryList = $('#category-list');
    var subCatCount = 0;
    var checkBoxCount = 0;
    var categoryContainer = document.createElement('div');
    categoryStorage.forEach(function (categoryItem) {
        var categoryList = document.createElement('p'),
            categoryListItem = document.createElement('button'),
            subCategoryItem = document.createElement('div'),
            subCategoryItemName = document.createElement('div');

        categoryListItem.className = "btn btn-primary";
        categoryListItem.type = "button";
        categoryListItem.setAttribute("data-toggle", "collapse");
        categoryListItem.setAttribute("data-target", "#collapseExample" + subCatCount);
        categoryListItem.setAttribute("aria-expanded", "false");
        categoryListItem.setAttribute("aria-controls", "collapseExample");
        categoryListItem.innerText = categoryItem.name;

        subCategoryItem.className = "collapse";
        subCategoryItem.id = "collapseExample" + subCatCount++;

        subCategoryItemName.className = "card card-body checkboxcontainer";
        if (categoryItem.categories) {
            categoryItem.categories.forEach(function (subCategoryName) {
                var item = document.createElement('div');
                item.setAttribute('class', 'custom-control custom-checkbox');
                item.innerHTML = '<input onchange="filterChange()" value="' + subCategoryName.name + '" type="checkbox" class="custom-control-input" id="defaultChecked' + checkBoxCount + '">' +
                    '<label class="custom-control-label" for="defaultChecked' + checkBoxCount++ + '">' + subCategoryName.name + '</label>';
                subCatStore.push({
                    category: categoryItem.name,
                    name: subCategoryName.name,
                    isChecked: false
                });
                subCategoryItemName.appendChild(item);
            });
        }
        categoryList.appendChild(categoryListItem);
        subCategoryItem.appendChild(subCategoryItemName);
        categoryContainer.appendChild(categoryList);
        categoryContainer.appendChild(subCategoryItem);
    });

    if (activeUser && activeUser.role === "ADMIN") {
        var head = $('.adminmodalHead'),
            body = $('.adminmodalBody'),
            footer = $('.adminmodalFooter'),
            addItem = document.createElement('button'),
            addCategory = document.createElement('button'),
            removeCategory = document.createElement('button'),
            updateCategory = document.createElement('button'),
            addSubCategory = document.createElement('button'),
            removeSubCategory = document.createElement('button'),
            updateSubCategory = document.createElement('button');

        addItem.innerText = 'Добавить товар';
        addCategory.innerText = 'Добавить категорию';
        removeCategory.innerText = 'Удалить категорию';
        updateCategory.innerText = 'Изменить категорию';
        addSubCategory.innerText = 'Добавить подкатегорию';
        removeSubCategory.innerText = 'Удалить подкатегорию';
        updateSubCategory.innerText = 'Изменить категорию';

        addItem.onclick = function () {
            var itemName = document.createElement('input'),
                itemCategory = document.createElement('select'),
                itemSubCategory = document.createElement('select'),
                itemPrice = document.createElement('input'),
                itemImg = document.createElement('input'),
                itemDescription = document.createElement('textarea'),
                addButton = document.createElement('button'),
                option = document.createElement('option'),
                subCatlist;

            itemName.id = 'itemName';
            itemCategory.id = 'itemCategory';
            itemSubCategory.id = 'itemSubCategory';
            itemPrice.id = 'itemPrice';
            itemImg.id = 'itemImg';
            itemDescription.id = 'itemDescription';
            addButton.id = 'addButton';
            addButton.className = 'align-middle';
            addButton.innerText = 'Добавить товар';
            addButton.onclick = function () {
                $.ajax({
                    type: 'POST',
                    url: API_URL + API_ADD_PRODUCT,
                    data: {
                        name: $('#itemName').val(),
                        img: $('#itemImg')[0].files[0].name.slice(0, ($('#itemImg')[0].files[0].name.length) - 4),
                        description: $('#itemDescription').val(),
                        category: $('#itemSubCategory').val(),
                        price: $('#itemPrice').val(),
                    },
                    success: function () {
                        getProduct();
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            };

            itemCategory.append(option);
            categoryStorage.forEach(function (item, index, self) {
                var option = document.createElement('option');
                option.value = item.name;
                option.innerText = item.name;
                itemCategory.append(option);
            });

            itemCategory.onchange = function () {
                itemSubCategory.innerHTML = '';
                subCatlist = categoryStorage.find(function (item) {
                    if (item.name === itemCategory.value) {
                        return item
                    }
                });
                subCatlist.categories.forEach(function (item, index, self) {
                    var option = document.createElement('option');
                    option.value = item.name;
                    option.innerText = item.name;
                    itemSubCategory.append(option);
                });
            };

            itemPrice.type = 'number';
            itemImg.type = 'file';

            head.html('<h4>Добавление товара</h4>');
            body.html('');
            body.append('Название товара: ', itemName, '<p></p>', 'Категория товара: ', itemCategory, '<p></p>', 'Подкатегория товара: ', itemSubCategory, '<p></p>', 'Цена товара: ', itemPrice, '<p></p>', itemImg, '<p></p>', 'Описание:', '<p></p>', itemDescription);

            $('#itemImg').on("change", function (e) {
                var file = $('#itemImg')[0].files[0];
                var Upload = function (file) {
                    this.file = file;
                };
                Upload.prototype.getType = function () {
                    return this.file.type;
                };
                Upload.prototype.getSize = function () {
                    return this.file.size;
                };
                Upload.prototype.getName = function () {
                    return this.file.name;
                };
                Upload.prototype.doUpload = function () {
                    var formData = new FormData();
                    formData.append("file", this.file, this.getName());
                    formData.append("upload_file", true);
                    $.ajax({
                        type: 'POST',
                        url: API_URL + API_SAVE_IMG,
                        data: formData,
                        processData: false,
                        contentType: false,
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    })
                };
                var upload = new Upload(file);
                upload.doUpload();
            });

            footer.html(addButton);
            $('#Adminmodal').modal('show');
        };
        addCategory.onclick = function () {
            var categoryName = document.createElement('input'),
                addCategoryButton = document.createElement('button');

            categoryName.id = 'categoryName';
            addCategoryButton.innerText = 'Добавить';
            addCategoryButton.className = 'align-middle';
            addCategoryButton.onclick = function () {
                $.ajax({
                    type: 'POST',
                    url: API_URL + API_ADD_CATEGORY,
                    data: {
                        name: $('#categoryName').val(),
                        categories: []
                    },
                    success: function () {
                        getCategories();
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            };

            body.html('');
            body.append('Название категории: ', categoryName);
            head.html('<h4>Добавление категории</h4>');
            footer.html(addCategoryButton);
            $('#Adminmodal').modal('show');
        };
        removeCategory.onclick = function () {
            var categoryName = document.createElement('select'),
                delCategoryButton = document.createElement('button');

            categoryStorage.forEach(function (item, index, self) {
                var option = document.createElement('option');
                option.value = item._id;
                option.innerText = item.name;
                categoryName.append(option);
            });

            categoryName.id = 'categoryName';
            delCategoryButton.innerText = 'Удалить';
            delCategoryButton.className = 'align-middle';
            delCategoryButton.onclick = function () {
                $.ajax({
                    type: 'POST',
                    url: API_URL + API_DEL_CATEGORY,
                    data: {
                        id: $('#categoryName').val(),
                    },
                    success: function () {
                        getCategories($('#categoryName'));
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            };

            body.html('');
            body.append('Название категории: ', categoryName);
            head.html('<h4>Удаление категории</h4>');
            footer.html(delCategoryButton);
            $('#Adminmodal').modal('show');
        };
        updateCategory.onclick = function () {
            var categorySelect = document.createElement('select'),
                categoryName = document.createElement('input'),
                updCategoryButton = document.createElement('button');

            categoryStorage.forEach(function (item, index, self) {
                var option = document.createElement('option');
                option.value = item._id;
                option.innerText = item.name;
                categorySelect.append(option);
            });

            categoryName.id = 'categoryName';
            categorySelect.id = 'categorySelect';
            updCategoryButton.innerText = 'Обновить';
            updCategoryButton.className = 'align-middle';
            updCategoryButton.onclick = function () {
                $.ajax({
                    type: 'POST',
                    url: API_URL + API_UPD_CATEGORY,
                    data: {
                        id: $('#categorySelect').val(),
                        name: $('#categoryName').val(),
                    },
                    success: function () {
                        getCategories($('#categorySelect'));
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            };

            body.html('');
            body.append('Название категории: ', categorySelect, '<p></p>', 'Новое название: ', categoryName);
            head.html('<h4>Обновление категории</h4>');
            footer.html(updCategoryButton);
            $('#Adminmodal').modal('show');
        };
        addSubCategory.onclick = function () {
            var categorySelect = document.createElement('select'),
                subCategoryName = document.createElement('input'),
                addSubCategoryButton = document.createElement('button');

            categoryStorage.forEach(function (item, index, self) {
                var option = document.createElement('option');
                option.value = item._id;
                option.innerText = item.name;
                categorySelect.append(option);
            });

            subCategoryName.id = 'subCategoryName';
            categorySelect.id = 'categorySelect';
            addSubCategoryButton.innerText = 'Добавить';
            addSubCategoryButton.className = 'align-middle';
            addSubCategoryButton.onclick = function () {
                var rootCategory = categoryStorage.find(function (item, index, self) {
                    if (item._id == $('#categorySelect').val()) {
                        return item;
                    }
                });
                if (rootCategory.categories == null) {
                    rootCategory.categories = [];
                }
                rootCategory.categories.push({
                    name: $('#subCategoryName').val()
                });
                var categories = rootCategory.categories;
                $.ajax({
                    type: 'POST',
                    url: API_URL + API_SUBCATEGORY,
                    data: {
                        id: $('#categorySelect').val(),
                        categories: categories,
                    },
                    success: function () {
                        getCategories();
                        $('#subCategoryName').val('');
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            };

            body.html('');
            body.append('Название категории: ', categorySelect, '<p></p>', 'Название подкатегории: ', subCategoryName);
            footer.html(addSubCategoryButton);
            head.html('<h4>Добавление подкатегории</h4>');
            $('#Adminmodal').modal('show');
        };

        removeSubCategory.onclick = function () {
            var categorySelect = document.createElement('select'),
                itemSubCategory = document.createElement('select'),
                option = document.createElement('option'),
                addSubCategoryButton = document.createElement('button'),
                subCatlist;

            categorySelect.append(option);
            categoryStorage.forEach(function (item, index, self) {
                var option = document.createElement('option');
                option.value = item._id;
                option.innerText = item.name;
                categorySelect.append(option);
            });

            categorySelect.onchange = function () {
                itemSubCategory.innerHTML = '';
                subCatlist = categoryStorage.find(function (item) {
                    if (item._id === categorySelect.value) {
                        return item
                    }
                });
                subCatlist.categories.forEach(function (item, index, self) {
                    var option = document.createElement('option');
                    option.value = item.name;
                    option.innerText = item.name;

                    itemSubCategory.append(option);
                });
            };

            itemSubCategory.id = 'itemSubCategory';
            categorySelect.id = 'categorySelect';
            addSubCategoryButton.innerText = 'Удалить';
            addSubCategoryButton.className = 'align-middle';
            addSubCategoryButton.onclick = function () {
                var rootCategory = categoryStorage.find(function (item, index, self) {
                    if (item._id === $('#categorySelect').val()) return item;
                });
                var searchIndex = rootCategory.categories.findIndex(function (item, index, self) {
                    if (item.name == $('#itemSubCategory').val()) {
                        return item;
                    }
                });
                rootCategory.categories.splice(searchIndex, 1);

                var categories = rootCategory.categories;
                console.log(categories);
                $.ajax({
                    type: 'POST',
                    url: API_URL + API_SUBCATEGORY,
                    data: {
                        id: $('#categorySelect').val(),
                        categories: categories,
                    },
                    success: function () {
                        getCategories($('#categorySelect'));
                        $('#itemSubCategory').html('');

                    },
                    error: function (err) {
                        console.log(err);
                    }
                })

            };

            body.html('');
            body.append('Название категории: ', categorySelect, '<p></p>', 'Название подкатегории: ', itemSubCategory);
            footer.html(addSubCategoryButton);
            head.html('<h4>Удаление подкатегории</h4>');
            $('#Adminmodal').modal('show');
        };
        updateSubCategory.onclick = function () {
            var categorySelect = document.createElement('select'),
                itemSubCategory = document.createElement('select'),
                option = document.createElement('option'),
                subcatName = document.createElement('input'),
                addSubCategoryButton = document.createElement('button'),
                subCatlist;

            categorySelect.append(option);
            categoryStorage.forEach(function (item, index, self) {
                var option = document.createElement('option');
                option.value = item._id;
                option.innerText = item.name;
                categorySelect.append(option);
            });

            categorySelect.onchange = function () {
                itemSubCategory.innerHTML = '';
                subCatlist = categoryStorage.find(function (item) {
                    if (item._id === categorySelect.value) {
                        return item
                    }
                });
                subCatlist.categories.forEach(function (item, index, self) {
                    var option = document.createElement('option');
                    option.value = item.name;
                    option.innerText = item.name;

                    itemSubCategory.append(option);
                });
            };
            subcatName.id = 'subcatName';
            itemSubCategory.id = 'itemSubCategory';
            categorySelect.id = 'categorySelect';
            addSubCategoryButton.innerText = 'Изменить';
            addSubCategoryButton.className = 'align-middle';
            addSubCategoryButton.onclick = function () {
                var rootCategory = categoryStorage.find(function (item, index, self) {
                    if (item._id === $('#categorySelect').val()) return item;
                });

                var searchIndex = rootCategory.categories.findIndex(function (item, index, self) {
                    if (item.name == $('#itemSubCategory').val()) {
                        return item;
                    }
                });
                rootCategory.categories.splice(searchIndex, 1, {name: $('#subcatName').val()});

                var categories = rootCategory.categories;
                console.log(categories);
                $.ajax({
                    type: 'POST',
                    url: API_URL + API_SUBCATEGORY,
                    data: {
                        id: $('#categorySelect').val(),
                        categories: categories,
                    },
                    success: function () {
                        getCategories($('#categorySelect'));
                        $('#itemSubCategory').html('');

                    },
                    error: function (err) {
                        console.log(err);
                    }
                })

            };

            body.html('');
            body.append('Название категории: ', categorySelect, '<p></p>', 'Название подкатегории: ', itemSubCategory, '<p></p>', 'Новое имя: ', subcatName);
            footer.html(addSubCategoryButton);
            head.html('<h4>Обновление подкатегории</h4>');
            $('#Adminmodal').modal('show');
        };

        categoryContainer.append(addItem, addCategory, removeCategory, updateCategory, addSubCategory, removeSubCategory, updateSubCategory)
    }

    categoryList.html(categoryContainer);
}

function filterChange() {
    activeFilter = [];
    var checkedBox = $("input:checkbox:checked");
    for (var i = 0; i < checkedBox.length; i++) {
        activeFilter.push(checkedBox[i].value);
    }
    productRender(itemStorage, activeFilter, searchWord, activeSortMode, activePage);
}

function productRender(massItem, massFilter, srchWord, filterMod, curentPage) {
    if (arguments[1] != undefined && arguments[1].length > 0) {
        massItem = massItem.filter(function (element, index, mass) {
            for (key in massFilter) {
                if (element.category == massFilter[key]) return element
            }
        });
    }
    if (arguments[2] != undefined && arguments[2].length > 0) {
        massItem = massItem.filter(function (element, index, mass) {
            if (element.name.toLowerCase().indexOf(srchWord.toLowerCase()) > -1) {
                return element;
            }
        });
    }
    if (arguments[3] != undefined && arguments[3].length > 0) {
        switch (filterMod) {
            case "all":
                break;
            case "wane":
                massItem = massItem.sort(function (a, b) {
                    return parseInt(b.price) - parseInt(a.price);
                });
                break;
            case "increase":
                massItem = massItem.sort(function (a, b) {
                    return parseInt(a.price) - parseInt(b.price);
                });
                break;
        }
    }
    if (curentPage > Math.ceil(massItem.length / 12)) {
        curentPage = 1;
    }
    var contentList = $('#product-list');
    var productList = document.createElement('div'),
        paginationItem = document.createElement('div');
    paginationItem.id = "paginationItem";
    productList.className = 'product-list';
    if (massItem.length > 0) {
        massItem.slice(curentPage * 12 - 12, curentPage * 12).forEach(function (items) {
            var product = document.createElement('div'),
                img = document.createElement('img'),
                productBody = document.createElement('div'),
                productName = document.createElement('h5'),
                productPrice = document.createElement('p'),
                buyButton = document.createElement('button'),
                removeButton = document.createElement('button'),
                updateButton = document.createElement('button'),
                count = 0;

            product.className = 'card';

            img.src = IMAGE_URL + items.img + '.jpg';
            img.className = 'card-img-top';

            productBody.className = 'card-body';

            productName.innerText = items.name;
            productName.className = 'card-title';

            productPrice.innerHTML = 'Цена: ' + items.price;
            productPrice.className = 'card-text';

            buyButton.addEventListener('click', function (event) {
                var ItemStorage = JSON.parse(sessionStorage.getItem('PRODUCTS'));
                if (isEmpty(ItemStorage)) {
                    cart = [];
                    count = 0;
                }
                if (!isEmpty(ItemStorage)) {
                    if (ItemStorage.find(function (item, index, self) {
                        if (item.name == items.name) {
                            return true
                        } else {
                            return false
                        }
                    }) === undefined) {
                        count = 0;
                    }
                }
                cart.push(items);
                items.count = ++count;
                sessionStorage.setItem('PRODUCTS', JSON.stringify(cart.filter(function (value, index, self) {
                    return self.indexOf(value) === index;
                })));

                sessionStorage.setItem('PRICE', JSON.parse(sessionStorage.getItem('PRICE')) + parseInt(items.price));
                finalCostRender();
            });
            buyButton.innerText = 'Купить';
            removeButton.onclick = function () {
                $.ajax({
                    type: 'POST',
                    url: API_URL + API_REMOVE_PRODUCT,
                    data: {
                        id: items._id
                    },
                    success: function () {
                        getProduct();
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            };
            removeButton.innerText = 'Удалить';

            updateButton.onclick = function () {
                var head = $('.adminmodalHead'),
                    body = $('.adminmodalBody'),
                    footer = $('.adminmodalFooter'),
                    itemName = document.createElement('input'),
                    price = document.createElement('input'),
                    category = document.createElement('select'),
                    subcategory = document.createElement('select'),
                    description = document.createElement('textarea'),
                    file = document.createElement('input'),
                    button = document.createElement('button'),
                    option = document.createElement('otion'),
                    subCatlist;

                itemName.id = 'itemName';
                price.id = 'price';
                category.id = 'category';
                subcategory.id = 'subcategory';
                description.id = 'description';
                file.type = 'file';
                file.id = 'file';
                button.id = 'button';
                button.className = 'align-middle';
                button.innerText = 'Изменить';

                itemName.value = items.name;
                price.value = items.price;

                category.append(option);
                categoryStorage.forEach(function (item, index, self) {
                    var option = document.createElement('option');
                    option.value = item.name;
                    option.innerText = item.name;
                    category.append(option);
                });

                category.onchange = function () {
                    subcategory.innerHTML = '';
                    subCatlist = categoryStorage.find(function (item) {
                        if (item.name === category.value) {
                            return item
                        }
                    });
                    subCatlist.categories.forEach(function (item, index, self) {
                        var option = document.createElement('option');
                        option.value = item.name;
                        option.innerText = item.name;
                        subcategory.append(option);
                    });
                };

                description.value = items.description;

                $('#file').on("change", function (e) {
                    var file = $('#file')[0].files[0];
                    var Upload = function (file) {
                        this.file = file;
                    };
                    Upload.prototype.getType = function () {
                        return this.file.type;
                    };
                    Upload.prototype.getSize = function () {
                        return this.file.size;
                    };
                    Upload.prototype.getName = function () {
                        return this.file.name;
                    };
                    Upload.prototype.doUpload = function () {
                        var formData = new FormData();
                        formData.append("file", this.file, this.getName());
                        formData.append("upload_file", true);
                        $.ajax({
                            type: 'POST',
                            url: API_URL + API_SAVE_IMG,
                            data: formData,
                            processData: false,
                            contentType: false,
                            dataType: "json",
                            success: function (data) {
                                console.log(data);
                            },
                            error: function (err) {
                                console.log(err);
                            }
                        })
                    };
                    var upload = new Upload(file);
                    upload.doUpload();
                });
                button.onclick = function(){
                    var product = {
                        name: $('#itemName').val(),
                        category: $('#subcategory').val(),
                        characters: [],
                        description: $('#description').val(),
                        img: $('#file')[0].files[0].name ? $('#file')[0].files[0].name.slice(0,-4) : items.img,
                        price: $('#price').val()
                    };
                  $.ajax({
                      type: 'POST',
                      url: API_URL+API_UPD_PRODUCT,
                      data: product,
                      success: function (data) {
                          getProduct();
                      },
                      error: function (err) {
                          console.log(err);
                      }
                  })
                };

                footer.html(button);
                body.html('');
                body.append('Цена: ', price, '<br />', 'Категория: ', category, '<br />', 'Подкатегория: ', subcategory, '<br />', 'Описание: ','<br />', description, '<br />', 'Изменить изображение', '<br />', file);
                head.html(itemName);
                $('#Adminmodal').modal('show');
            };
            updateButton.innerText = 'Обновить';

            product.appendChild(img);
            product.appendChild(productBody);
            product.appendChild(productName);
            product.appendChild(productPrice);
            product.appendChild(buyButton);
            if (activeUser && activeUser.role =="ADMIN") {
               // product.appendChild(updateButton);
                product.appendChild(removeButton);
            }
            productList.append(product);

        }, this);
        contentList.html(productList);
        contentList.append(paginationItem);
    } else {
        contentList.html('<span>Нет подходящих товаров</span>');
    }
    paginationRender(massItem.length);
}

function searchByName(value) {
    searchWord = value;
    productRender(itemStorage, activeFilter, searchWord, activeSortMode, activePage);
}

function allSortModeClick() {
    activeSortMode = "all";
    $("input:checkbox:checked").prop('checked', false);
    $('#search-input').val("");
    searchWord = [];
    activeFilter = [];
    productRender(itemStorage, null, null, activeSortMode, activePage);
}

function waneSortModeClick() {
    activeSortMode = "wane";
    productRender(itemStorage, activeFilter, searchWord, activeSortMode, activePage);
}

function increaseSortModeClick() {
    activeSortMode = "increase";
    productRender(itemStorage, activeFilter, searchWord, activeSortMode, activePage);
}

function paginationRender(itemCount) {
    var totalPage = Math.ceil(itemCount / 12);
    var paginationItem = $('#paginationItem');
    var nav = document.createElement('nav'),
        pagination = document.createElement('ul');

    nav.setAttribute("aria-label", "items");

    pagination.className = "pagination";


    for (var i = 0; i < totalPage; i++) {
        var pageLink = document.createElement('span'),
            page = document.createElement('li');

        page.className = "page-item";
        page.setAttribute("aria-current", "page");

        pageLink.className = "page-link";
        pageLink.innerText = i + 1;
        pageLink.setAttribute("page", "" + (i + 1));

        page.appendChild(pageLink);
        pagination.appendChild(page);
    }

    nav.append(pagination);
    paginationItem.html(nav);

    $('.page-link').each(function (i, elem) {
        elem.onclick = function () {
            activePage = parseInt(elem.getAttribute('page'));
            productRender(itemStorage, activeFilter, searchWord, activeSortMode, activePage);
        }
    });
}

function finalCostRender() {
    $('#final-price').html('<span class="nav-link"  >Итого: ' + sessionStorage.getItem('PRICE') + ' руб</span>');
}


function optionLoad(select) {
    select.html('');
    var option = document.createElement('option');
    select.append(option);
    categoryStorage.forEach(function (item, index, self) {
        var option = document.createElement('option');
        option.value = item._id;
        option.innerText = item.name;
        select.append(option);
    });
}
