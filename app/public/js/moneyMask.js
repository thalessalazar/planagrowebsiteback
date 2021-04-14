if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", formatPrice());
}
else {
    formatPrice();
}

// document.addEventListener("DOMContentLoaded", function() {
//     $(".tomoney").each(function(index){$(this).html(numeral($(this).html()).format("R$0,0").replace(/,/g,"."))}),$(".moneymask").keyup(function(){const maskInput=$(this),intInput=$($(this).attr("data-realinput"));maskInput.val(maskInput.val().replace(/[^\d]/,""));const maskVal=numeral(maskInput.val()).format("R$0,0");maskInput.val(maskVal);const intVal=parseInt(maskVal.replace(/,/g,""));intInput.val(intVal)}),$(".moneymask").keyup(),$("a.keep-params").click(function(e){if(window.location.search&&!window.location.search.match(/\?page=\d/)){e.preventDefault(),$(this).attr("href",$(this).attr("href").replace("?","&"));var dest=window.location.search.replace(/\&page=\d/g,"")+$(this).attr("href");window.setTimeout(function(){window.location.href=dest},100)}});
// });

function formatMoney() {
    $(".tomoney").each(function (index) {
        $(this).html(numeral($(this).html()).format("R$0,0").replace(/,/g, "."))
    }),
        $(".moneymask").keyup(function () {
            const maskInput = $(this),
                intInput = $($(this).attr("data-realinput"));
            maskInput.val(maskInput.val().replace(/[^\d]/, ""));
            const maskVal = numeral(maskInput.val()).format("R$0,0");
            maskInput.val(maskVal);
            const intVal = parseInt(maskVal.replace(/,/g, ""));
            intInput.val(intVal)
        }), $(".moneymask").keyup(), $("a.keep-params").click(function (e) {
            if (window.location.search && !window.location.search.match(/\?page=\d/)) {
                e.preventDefault(),
                    $(this).attr("href",
                        $(this).attr("href").replace("?", "&"));
                var dest = window.location.search.replace(/\&page=\d/g, "") + $(this).attr("href");
                window.setTimeout(function () {
                    window.location.href = dest
                }, 100)
            }
        });

}

function formatPrice() {
    $('.tomoney').each(function (index) {
        var value = $(this).html()
        value = value.trimStart();
        console.log(value)
        $(this).html(toBRL(value));
    })
}

function toBRL(value) {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}