$(document).ready(function () {
    $("#CEP").keyup(function () {
        var codigoCep = $(this).cleanVal();
        console.log(codigoCep);
        if (codigoCep.length == 8)
            EnviaCep(codigoCep);
    });

    function EnviaCep(cepCliente) {
        if (!cepCliente.length < 8 && cepCliente != '') {
            var baseUrl = 'http://viacep.com.br/ws/' + cepCliente + '/json/';

            $.ajax({
                url: baseUrl,
                method: "GET",
                error:
                    function (r) {
                        //if (r.status == 400)
                        //    ModalDialog("Ocorreu um erro", r.responseJSON);
                        //else if (r.status == 500)
                        //    ModalDialog("Ocorreu um erro", "Cep não encontrado ou incorreto, favor inserir seu endereço manualmente.");
                    },
                success:
                    function (retornoCep) {
                        if (retornoCep.erro) {
                            $('#cepTooltip').tooltip('enable')
                            $('#cepTooltip').tooltip('show')
                        } else {
                            $('#cepTooltip').tooltip('disable')
                            $('#formCadastro #CEP').val(retornoCep.cep);
                            $('#formCadastro #Cidade').val(retornoCep.localidade);
                            $('#formCadastro #Logradouro').val(retornoCep.logradouro);
                        }
                    }
            });
        }
    }
})