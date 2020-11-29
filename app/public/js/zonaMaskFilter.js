document.addEventListener("DOMContentLoaded", function () {

    const selectGenero = $('select[name="genero"]');
    selectGenero.change(function () {
        switch ($(this).val()) {
            case 'Ambos':
                $(".venda-form").removeClass("hidden");
                $(".venda-form").addClass("visible");
                $(".aluguel-form").removeClass("hidden");
                $(".aluguel-form").addClass("visible");
                break;

            case 'Aluguel':
                $(".aluguel-form").removeClass("hidden");
                $(".aluguel-form").addClass("visible");
                $(".venda-form").removeClass("visible");
                $(".venda-form").addClass("hidden");
                break;

            case 'Venda':
                $(".venda-form").removeClass("hidden");
                $(".venda-form").addClass("visible");
                $(".aluguel-form").removeClass("visible");
                $(".aluguel-form").addClass("hidden");
                break;
        }
    });
    selectGenero.change();

    if (document.querySelector('input[name="selectedTipo"]')) {
        const disableTodos = document.querySelector('#selectTipo').getAttribute('data-disableTipo');
        const tipoSelecionado = document.querySelector('input[name="selectedTipo"]').value,
            tiposUrbanos = `<optgroup label="Tipos Urbanos" id="selectUrbano">
                                ${!disableTodos ? '<option value="">Todos</option>' : ''}
                                <option ${"Casa" == tipoSelecionado ? "selected" : ""} value="Casa">Casa</option>
                                <option ${"Apartamento" == tipoSelecionado ? "selected" : ""} value="Apartamento">Apartamento</option>
                                <option ${"Kitnet" == tipoSelecionado ? "selected" : ""} value="Kitnet">Kitnet</option>   
                                <option ${"Salão Comercial" == tipoSelecionado ? "selected" : ""} value="Salão Comercial">Prédio Comercial</option>
                                <option ${"Escritório" == tipoSelecionado ? "selected" : ""} value="Escritório">Escritório</option>
                                <option ${"Terreno" == tipoSelecionado ? "selected" : ""} value="Terreno">Terreno</option>
                                <option ${"Chácara" == tipoSelecionado ? "selected" : ""} value="Chácara">Chácara</option>
                            </optgroup>`,

            tiposRurais = `<optgroup label="Tipos Rurais" id="selectRural">
                                ${!disableTodos ? '<option value="">Todos</option>' : ''}
                                <option ${"Chácara" == tipoSelecionado ? "selected" : ""} value="Chácara">Chácara</option>
                                <option ${"Sítio" == tipoSelecionado ? "selected" : ""} value="Sítio">Sítio</option>  
                                <option ${"Campo" == tipoSelecionado ? "selected" : ""} value="Campo">Campo</option>
                                <option ${"Terreno" == tipoSelecionado ? "selected" : ""} value="Terreno">Terreno</option>
                                <option ${"Lavoura" == tipoSelecionado ? "selected" : ""} value="Lavoura">Lavoura</option>
                            </optgroup>`,

            tiposVazio = `<option disabled selected  label="Zona não selecionada"> Tipo de imóvel </option>
                            <optgroup label="Zona não selecionada">
                            <option></option>
                          </optgroup>`;

        setForm = () => {
            switch ($("#inputFiltrando") && $("#inputFiltrando").val($("#selectZona").val()), $("#selectZona").val()) {
                case "todos":
                    $("#selectTipo").html(tiposVazio);
                    break;
                case "Urbana":
                    $("#selectTipo").html(tiposUrbanos), $(".urbano-form").removeClass("hidden"), $(".urbano-form").addClass("visible"), $(".rural-form").removeClass("visible"), $(".rural-form").addClass("hidden");
                    break;
                case "Rural":
                    $("#selectTipo").html(tiposRurais), $(".rural-form").removeClass("hidden"), $(".rural-form").addClass("visible"), $(".urbano-form").removeClass("visible"), $(".urbano-form").addClass("hidden")
            }
            $(".selectpicker").selectpicker("refresh")
        };

        setForm(), $("#selectZona").change(setForm)
    }


    $("#selectMunicipio").change(function () {
        if ($(this).val() == "Bagé") {
            $("#bageLocalidades").removeClass("hidden");
            $("#bageLocalidades").addClass("visible");

            $("#outrasLocalidades").addClass("hidden");
            $("#outrasLocalidades").removeClass("visible");

            $("#defaultLocalidades").addClass("hidden");
            $("#defaultLocalidades").removeClass("visible");
        }
        if ($(this).val() != "Bagé") {
            $("#outrasLocalidades").removeClass("hidden");
            $("#outrasLocalidades").addClass("visible");

            $("#bageLocalidades").addClass("hidden");
            $("#bageLocalidades").removeClass("visible");

            $("#defaultLocalidades").addClass("hidden");
            $("#defaultLocalidades").removeClass("visible");
        }
    });


    // $("#selectMunicipio").change(function () {
    //     "Bagé" == $(this).val() ?
    //         ($("#bageLocalidades").removeClass("hidden"), $("#bageLocalidades").addClass("visible"),
    //             $("$defaultLocalidades").addClass("hidden"), $("#defaultLocalidades").removeClass("visible")) :
    //         ($("#bageLocalidades").addClass("hidden"), $("defaultLocalidades").addClass("hidden"))

    // });
    // $("#selectMunicipio").change(function () {
    //     "Bagé" != $(this).val() ?
    //         ($("#outrasLocalidades").removeClass("hidden"), $("#outrasLocalidades").addClass("visible"),
    //             $("$defaultLocalidades").addClass("hidden"), $("#defaultLocalidades").removeClass("visible")) :
    //         ($("#outrasLocalidades").addClass("hidden"), $("#defaultLocalidades").addClass("hidden"))

    // });

});