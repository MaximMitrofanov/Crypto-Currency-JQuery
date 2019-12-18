var result_arr = [];
var coin_sub = 0;
var subbed_arr = [];
var new_subbed_arr = [];

$('body').append('<div class="popout"><div class="loadimg-wrapper"><img src="assets/loading.gif" class="loadimg-popout" alt=""></div></div>')

$(document).ready(function () {
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/list", success: (result) => {
            result_arr = result;
            buildCard(result, 100);
            $('.popout').remove();
        }
    });
});



buildCard = (result, amount) => {
    $('.content').html('')
    for (let i = 0; i < amount; i++) {
        $('.content').append(`
        <div class='col-md-3'>
            <div class="card text-white bg-dark mb-1 mt-1 pl-1 pr-1">
                <div class="card-header">
                    <span>${result[i].symbol}</span>
                    <label class="switch">
                        <input class='toggle ${result[i].id}' type="checkbox" value='false' onchange='subToCoin("${result[i].id}")'>
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
    let result_obj = [];
    let today = new Date();
    if ($(`.${id}.btn`).html() == 'Show less') {
        $(`.${id}.btn`).html('Show more')
        $(`.${id}.moreinfo`).html('')
    }
    else {
        $(`.${id}.moreinfo`).html('<img src="assets/loading.gif" class="loadimg" alt="">')
        $(`.${id}.btn`).addClass('disabled')
        result_obj = JSON.parse(sessionStorage.getItem(id));
        if (result_obj && (today.getTime() - result_obj.date) <= 120000) {
            buildMoreInfo(result_obj, id);
        } else {
            sessionStorage.removeItem(id);
            $.ajax({
                url: `https://api.coingecko.com/api/v3/coins/${id}`, success: function (result) {
                    result_obj = {
                        id: result.id,
                        usd_price: result.market_data.current_price.usd,
                        eur_price: result.market_data.current_price.eur,
                        ils_price: result.market_data.current_price.ils,
                        img: result.image.large,
                        date: today.getTime(),
                    }

                    sessionStorage.setItem(result_obj.id, JSON.stringify(result_obj));
                    buildMoreInfo(result_obj, id);
                }
            });
        }
    }

}

buildMoreInfo = (item, id) => {
    $(`.${id}.moreinfo`).html(
        `
    <img src="${item.img}" class="coin-icon mb-3" alt="">
    <div class='ml-1 mt-2' >USD Worth: ${item.usd_price}$</div>
    <div class='ml-1 mt-2'>EUR Worth: ${item.eur_price}$</div>
    <div class='ml-1 mt-2 mb-2'>ILS Worth: ${item.ils_price}$</div>
    `
    )
    $(`.${id}.btn`).removeClass('disabled')
    $(`.${id}.btn`).html('Show less');
}


searchCoin = () => {
    event.preventDefault()
    let searched = $('#search_input').val();
    let found = [];
    if (searched == '') { buildCard(result_arr, 100); return }
    for (let i = 0; i < result_arr.length; i++) {
        if (result_arr[i].symbol == searched) {
            found.push(result_arr[i])
            buildCard(found, 1)
            return
        }
    }
    alert(`Couldn't find ${searched}`)
}


subToCoin = (id) => {
    let toggle_btn = $(`.${id}.toggle`);
    if (toggle_btn[0].checked) {
        if (coin_sub == 5) {
            toggle_btn[0].checked = false;
            $('#myModal').modal('show')
            let modal = $('.modal-body');
            modal.html('')

            for (i = 0; i < subbed_arr.length; i++) {
                new_subbed_arr.push(subbed_arr[i]);
                modal.append(`
                    <div class='row modal-style'>
                    <div class='col-md-3 in-modal'>${subbed_arr[i].symbol}</div>
                    <label class="switch in-modal">
                        <input class='toggle-in-modal' checked type="checkbox" value='false' onchange='modalSub("${subbed_arr[i].id}")'>
                        <span class="slider round"></span>
                    </label>
                    </div>
                `)
            }
            $('#modalBtn').on('click', () => {
                modal.html = '';
                $('#myModal').modal('hide')
                let filterout = subbed_arr.filter(function (item) {
                    return !new_subbed_arr.includes(item);
                });
                filterout.map(item =>{
                    $(`.${item.id}.toggle`)[0].checked = false;
                })
                subbed_arr = new_subbed_arr;
                new_subbed_arr = [];
            })
            return
        } else {
            for (let i = 0; i < result_arr.length; i++) {
                if (result_arr[i].id == id) {
                    subbed_arr.push(result_arr[i])

                }
            }
            ++coin_sub
        }

    } else {
        for (let i = 0; i < subbed_arr.length; i++) {
            if (subbed_arr[i].id == id) {
                subbed_arr.splice(i, 1)
            }
        }
        --coin_sub
        console.log(coin_sub)
    }
}

modalSub = (id) => {
    let found = false;
    for (let i = 0; i < new_subbed_arr.length; i++) {
        if (new_subbed_arr[i].id == id) {
            new_subbed_arr.splice(i, 1);
            found = true;
            break
        }
    }
    if (!found) {
        for (let i = 0; i < subbed_arr.length; i++) {
            if (subbed_arr[i].id == id) new_subbed_arr.push(subbed_arr[i])
        }
    }

}

goTo = (where) => {
    where == 'home' ? buildCard(result_arr, 100) : null;
    where == 'graphs' ? buildGraph() : null;
    where == 'about' ? buildAbout() : null;
}


buildGraph = () => {
    console.log('Graphs')
}


buildAbout = () => {
    console.log('About')
}
