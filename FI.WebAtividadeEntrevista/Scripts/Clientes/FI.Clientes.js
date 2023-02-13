$(document).ready(function () {
   
    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "Cpf": $(this).find("#CpfCliente").val(),
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
                function (resultId) {
                    InsereBeneficiarios(resultId, beneficiariosList)
                    ModalDialog("Sucesso!")
                    //$("#formCadastro")[0].reset();
            }
        });
    })        
})

function alteraBeneficiario(cpf) {
    if (cpf != null) {
        const beneficiarioEditar = beneficiariosList.filter(beneficiario => beneficiario.CPF == cpf);
        $("#CPFBeneficiario").val(beneficiarioEditar[0].CPF);
        $("#NomeBeneficiario").val(beneficiarioEditar[0].NOME);
        $(".CPF").mask("999.999.999-99");
    }
    
}

function removeBeneficiario(cpf) {
    $("#tableBeneficiarios").children().find("td").remove()
    if (cpf != null) {
        var result = beneficiariosList.filter(beneficiario => beneficiario.CPF != cpf);
        
        beneficiariosList = result;
        var tblFuncionario = $("#tableBeneficiarios").find("#" + cpf).parent().parent();
        tblFuncionario.remove();
        FillTableBeneficiarios(beneficiariosList);
      
    }
    $(".CPF").mask("999.999.999-99");
}

function FillTableBeneficiarios(beneficiariosList) {
    var tblFuncionario = $("#tableBeneficiarios");
    $.each(beneficiariosList, function (index, item) {
        var tr = $("<tr></tr>");
        tr.html(
            + " " + ('<td><p class="CPF" id='+item.CPF+'>' + item.CPF + "</p></td>")
            + " " + ("<td>" + item.NOME + "</td>")
            + " " + ('<td><button class="btn btn-primary btn-sm" onclick="alteraBeneficiario(' + item.CPF + ')">Alterar</button></td>')
            + " " + ('<td><button class="btn btn-primary btn-sm" onclick="removeBeneficiario(' + item.CPF + ')">Excluir</button></td>'));
        tblFuncionario.append(tr);
    });

    $(".CPF").mask("999.999.999-99");
}

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}


function InsereBeneficiarios(idCliente, beneficiariosList) {
    $.ajax({
        url: urlPostBeneficiarios,
        method: "POST",
        data: {
            "modelList": beneficiariosList,
            "idCliente": idCliente
        },
        error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
        success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
            }
    });
}






