let beneficiariosList = [];
let idCliente = 0;
$(document).ready(function () {
    $('#beneficiarios').click(function () {
        $('#modalBeneficiarios').modal('show');
    });

    const idCliente = PegaIdClientePorURL();

    if (idCliente != null) {
        $.ajax({
            url: urlPostBeneficiario,
            method: "POST",
            data: {
                "IdCliente": idCliente,
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
                    console.log(r)
                    beneficiariosList = r.Records;
                    FillTableBeneficiarios(beneficiariosList);
                    //ModalDialog("Sucesso!", r)
                    //$("#formBeneficiario")[0].reset();
                }
        });
    }

    $('#btninclurBeneficiario').click(function () {
        $("#tableBeneficiarios").children().find("td").remove()
        var cpfBeneficiario = $('#CPFBeneficiario').cleanVal();
        var nomeBeneficiario = $('#NomeBeneficiario').val();

        var result = beneficiariosList.filter(b => b.CPF == cpfBeneficiario);

        if (result != '') {
            alert("Não é possivel inserir dois Beneficiarios com o mesmo CPF");
            FillTableBeneficiarios(beneficiariosList);
        } else {
            beneficiariosList.push({ "Nome": nomeBeneficiario, "CPF": cpfBeneficiario });
            FillTableBeneficiarios(beneficiariosList);
        }
    })

    function GetDadosBeneficiarios() {
        $.ajax({
            url: '/Beneficiario/BeneficiarioList',
            method: "POST",
            data: {
                "sorting": "Id ASC",
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
                    console.log(r);
                }
        });
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

    
    
        

    function PegaIdClientePorURL() {
        let pathURL = window.location.pathname;
        var pathSplited = pathURL.split("/");
        if (parseInt(pathSplited[3])) {
            return pathSplited[3];
        }
        return null;
    }
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
            + " " + ('<td><p class="CPF" id=' + item.CPF + '>' + item.CPF + "</p></td>")
            + " " + ("<td>" + item.Nome + "</td>")
            + " " + ('<td><button class="btn btn-primary btn-sm" onclick="alteraBeneficiario(' + item.CPF + ')">Alterar</button></td>')
            + " " + ('<td><button class="btn btn-primary btn-sm" onclick="removeBeneficiario(' + item.CPF + ')">Excluir</button></td>'));
        tblFuncionario.append(tr);
    });

    $(".CPF").mask("999.999.999-99");
}