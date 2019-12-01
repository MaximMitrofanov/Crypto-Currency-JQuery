

window.onload = function () {
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/list", success: function (result) {
            console.log(result)
            buildCard(result);
        }
    });
}



buildCard = (result) => {
    for (let i = 0; i < 100; i++) {
        $('.content').append(`
        <div class='col-md-3'>
            <div class="card text-white bg-dark mb-1 mt-1 pl-1 pr-1">
                <div class="card-header">
                    <span>${result[i].symbol}</span>
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider round"></span>
                    </label>
                </div>

                <div class="card-body">
                    <h5 class="card-title">${result[i].name}</h5>
                </div>
                <div class='${result[i].id} moreinfo'></div>
                <button type="button" class="${result[i].id} btn card-button btn-secondary" onclick='showInfo("${result[i].id}")'>Show more</button>
            </div>
        </div>
    `)
    }
}

showInfo = (id) => {
    if ($(`.${id}.btn`).html() == 'Show less') {
        $(`.${id}.btn`).html('Show more')
        $(`.${id}.moreinfo`).html('')
    }
    else {
        $(`.${id}.moreinfo`).html('<img src="assets/loading.gif" class="loadimg" alt="">')
        $(`.${id}.btn`).addClass('disabled')
        $.ajax({
            url: `https://api.coingecko.com/api/v3/coins/${id}`, success: function (result) {
                $(`.${id}.moreinfo`).html(
                `
                <img src="${result.image.large}" class="coin-icon mb-3" alt="">
                <div class='ml-1 mt-2' >USD Worth: ${result.market_data.current_price.usd}$</div>
                <div class='ml-1 mt-2'>EUR Worth: ${result.market_data.current_price.eur}$</div>
                <div class='ml-1 mt-2 mb-2'>ILS Worth: ${result.market_data.current_price.ils}$</div>
                `
                )
                $(`.${id}.btn`).removeClass('disabled')
                $(`.${id}.btn`).html('Show less');
            }
        });
    }
    

}
