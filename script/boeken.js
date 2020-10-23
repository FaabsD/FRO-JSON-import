const output = document.getElementById('boeken');
const request = new XMLHttpRequest();
// checkboxes voor taal filters
const taalfilters = document.querySelectorAll('.controls__checkbox');
// select voor keuze sorteren
const selectSort = document.querySelector('.controls__select');
// het aantal in winkelwagen
const amountCart = document.querySelector('.shopping-cart__amount');
request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
        let result = JSON.parse(request.responseText);
        books.filter(result);
        books.run();
    } else {
        console.log("readystate: " + request.readyState);
        console.log("status: " + request.status);
    }
}
request.open('GET', 'boeken.json', true);
request.send();

// object winkelwagen
// met properties: (bestelde boeken)
// en methods:
const shoppingCart = {
    order: [

    ]
}

// object boeken
// met properties: taalfilter, data, es
// en methods: filteren, sorteren, uitvoeren
const books = {
    langFilter: ["Nederlands", "Duits", "Engels"],
    propertySort: "titel", //de eigenschap waar de boeken op gesorteerd worden
    oplopend: 1, // volgorde sorteren oplopend
    // filter taal
    filter(data) {
        // this.data = data.filter((book) => {return true});
        this.data = data.filter((book) => {
            let bool = false;
            this.langFilter.forEach((taal) => {
                if (book.taal === taal) {
                    bool = true
                }
            })
            return bool
        })
    },
    // de sorteer functie
    sorting() {
        if (this.propertySort === "titel") {
            this.data.sort((a, b) => (a.titel.toUpperCase() > b.titel.toUpperCase()) ? this.oplopend : -1*this.oplopend);
        } else if (this.propertySort === "paginas") {
            this.data.sort((a, b) => (a.paginas > b.paginas) ? this.oplopend : -1*this.oplopend);
        } else if (this.propertySort === "uitgave") {
            this.data.sort((a, b) => (a.uitgave > b.uitgave) ? this.oplopend : -1*this.oplopend);
        } else if (this.propertySort === "prijs") {
            this.data.sort((a, b) => (a.prijs > b.prijs) ? this.oplopend : -1*this.oplopend);
        } else if (this.propertySort === "auteur") {
            this.data.sort((a, b) => (a.auteurs[0].achternaam > b.auteurs[0].achternaam) ? this.oplopend : -1*this.oplopend);
        }
    },
    // Hier wordt een eigenschap data gemaakt
    run() {
        // eerst even sorteren
        this.sorting();
        let html = "";
        this.data.forEach(book => {
            // Als er een voortitel is moet deze voor de titel worden geplaatst
            let title = "";
            if (book.voortitel) {
                title += book.voortitel + " ";
            }
            title += book.titel
            // maak een lijst met auteurs
            let auteurs = "";
            book.auteurs.forEach((auteur, index) => {
                let tussenvoegsel = auteur.tussenvoegsel ? auteur.tussenvoegsel + " " : "";
                // scheidingsteken tussen auteurs
                let separator = ", ";
                if (index >= book.auteurs.length - 2) {
                    separator = " & ";
                }
                if (index >= book.auteurs.length - 1) {
                    separator = "";
                }
                auteurs += auteur.voornaam + " " + tussenvoegsel + auteur.achternaam + separator;
            });

            html += `<section class="book">`;
            html += `<img class ="book__cover" src ="${book.cover}" alt"${title}">`;
            html += `<div class="book__info">`;
            html += `<h3 class="book__head">${title}</h3>`;
            html += `<p class="book__authors">${auteurs}</p>`;
            html += `<span class="book__edition">${this.changeDate(book.uitgave)}</span>`;
            html += `<span class="book__ean">ean: ${book.ean}</span>`;
            html += `<span class="book__pages">${book.paginas} pagina's</span>`;
            html += `<span class="book__lang">${book.taal}</span>`;
            html += `<div class="book__price">${book.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}
                <a href="#" class="book__order-button" data-role="${book.ean}">bestellen</a></div>`
            html += `</div></section>`;
        });
        output.innerHTML = html;
        // de knoppen voorzien van EventListener
        document.querySelectorAll('.book__order-button').forEach(knop => {
            knop.addEventListener('click', e => {
                e.preventDefault();
                let bookID = e.target.getAttribute('data-role');
                // console.log(bookID);
                let clickedBook = this.data.filter(book => book.ean == bookID);
                shoppingCart.order.push(clickedBook[0]);
                amountCart.innerHTML = shoppingCart.order.length;
            })
        });
    },
    changeDate(dateString) {
        let date = new Date(dateString);
        let year = date.getFullYear();
        let month = this.giveMonthName(date.getMonth());
        return `${month} ${year}`;
    },
    giveMonthName(m) {
        let month = "";
        switch (m) {
            case 0:
                month = "januari";
                break;
            case 1:
                month = "februari";
                break;
            case 2:
                month = "maart";
                break;
            case 3:
                month = "april";
                break;
            case 4:
                month = "mei";
                break;
            case 5:
                month = "juni";
                break;
            case 6:
                month = "juli";
                break;
            case 7:
                month = "augustus";
                break;
            case 8:
                month = "september";
                break;
            case 9:
                month = "oktober";
                break;
            case 10:
                month = "november";
                break;
            case 11:
                month = "december";
                break;
            default:
                month = m;
        }
        return month;
    }
}

const applyFilter = () => {
    let checkedLang = [];
    taalfilters.forEach(cb => {
        if (cb.checked) checkedLang.push(cb.value);
    })
    books.langFilter = checkedLang;
    books.filter(JSON.parse(request.responseText));
    books.run();
}

const changeSortProperty = () => {
    books.propertySort = selectSort.value;
    books.run();
}

taalfilters.forEach(cb => cb.addEventListener('change', applyFilter));
selectSort.addEventListener('change', changeSortProperty);
document.querySelectorAll('.controls__radio-button').forEach(rb => rb.addEventListener('change', () => {
    books.oplopend = rb.value;
    books.run();
}));

