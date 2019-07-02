function loginPageReder() {
    return('<div class="modal fade" id="modalAlert">'+
        '<div class="modal-dialog" role="document">'+
        '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<p class="align-middle" id="alertMessage"></p> '+
    '</div>'+
    '</div><!-- /.модальное окно-Содержание -->'+
    '</div><!-- /.модальное окно-диалог -->'+
    '</div><!-- /.модальное окно -->  ' +
        '<div class="login px-4 py-3"">' +
        '    <div class="form-group">' +
        '      <label for="exampleDropdownFormEmail1">Login</label>' +
        '      <input type="email" class="form-control" id="login" placeholder="Login">' +
        '    </div>' +
        '    <div class="form-group">' +
        '      <label for="exampleDropdownFormPassword1">Password</label>' +
        '      <input type="password" class="form-control" id="password" placeholder="Password">' +
        '    </div>' +
        '    <button onclick="loginUser()" class="btn btn-primary">Login</button>' +
        '</div>');
}