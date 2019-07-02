function signupPageReder() {
    return('<div class="modal fade" id="modalAlert">'+
        '<div class="modal-dialog" role="document">'+
        '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<p class="align-middle" id="alertMessage"></p> '+
        '</div>'+
        '</div><!-- /.модальное окно-Содержание -->'+
        '</div><!-- /.модальное окно-диалог -->'+
        '</div><!-- /.модальное окно -->  ' +
        ' <div class="login px-4 py-3">' +
        '    <div class="form-group">' +
        '      <input type="" class="form-control" id="regLogin" placeholder="Login">' +
        '    </div>' +
        '    <div class="form-group">' +
        '      <input type="password" class="form-control" id="regPassword" placeholder="Password">' +
        '    </div>' +
        '    <div class="form-group">' +
        '      <input type="" class="form-control" id="regEmail" placeholder="example@gmail.com">' +
        '    </div>' +
        '    <div class="form-group">' +
        '      <input type="text" class="form-control" id="regPhone" placeholder="phone number">' +
        '    </div>' +
        '    <div class="form-group">' +
        '      <input type="text" class="form-control" id="regAdress" placeholder="adress">' +
        '    </div>' +
        '    <div class="form-group">' +
        '      <input type="text" class="form-control" id="regIndex" placeholder="post index">' +
        '    </div>' +
        '    <button onclick="regUser()" class="btn btn-primary">Регистрация</button>' +
        '</div>');
}