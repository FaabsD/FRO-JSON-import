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
// en methods: addBook, getData, run
const shoppingCart = {
    order: [

    ],
    // Boek toevoegen
    addBook(obj) {
        let found = this.order.filter(b => b.ean == obj.ean);
        if (found.length == 0) {
            obj.orderCount++;
            shoppingCart.order.push(obj);
        } else {
            found[0].orderCount++;
        }
        localStorage.cartOrder = JSON.stringify(this.order);
        this.run();

    },
    //data uit localstorage halen
    getOrder() {
        if (localStorage.cartOrder) {
            this.order = JSON.parse(localStorage.cartOrder);
        }
        this.run();
    },
    run() {
        let html = "<table>";
        let total = 0;
        let totalOrdered = 0;
        this.order.forEach(book => {
            let completeTitle = "";
            if (book.voortitel) {
                completeTitle += book.voortitel + " ";
            }
            completeTitle += book.titel;
            html += "<tr>";
            html += `<td><img class="order-form__cover" src="${book.cover}" alt="${completeTitle}"></td>`;
            html +=`<td>${completeTitle}</td>`;
            html += `<td class="order-form__order-count">
            <i class="order-form__down fas fa-arrow-down" data-role="${book.ean}"></i>
            ${book.orderCount}
            <i class="order-form__up fas fa-arrow-up" data-role="${book.ean}"></i></td>`
            html += `<td>${book.prijs.toLocaleString("nl-NL", {currency: 'EUR', style: 'currency'})}</td>`
            html += `<td><i class="fas fa-trash order-form__trash" data-role="${book.ean}"></i></td>`;
            html += "</tr>";
            total += book.prijs * book.orderCount;
            totalOrdered += book.orderCount;
        });
        html += `<tr><td colspan="3">Totaal:</td>
        <td>${total.toLocaleString("nl-NL", {currency: 'EUR', style: 'currency'})}</td>
        </tr>`;
        html += "</table>";
        document.getElementById("output").innerHTML = html;
        amountCart.innerHTML = totalOrdered;
        this.removeOrder();
        this.increaseDecrease();
    },
    increaseDecrease() {
        // verhoog het aantal
        let increase = document.querySelectorAll('.order-form__up');
        increase.forEach(button => {
            button.addEventListener('click', e => {
                let increaseID = e.target.getAttribute('data-role');
                let increaseBook = this.order.filter(book => book.ean == increaseID);
                increaseBook[0].orderCount++;
                localStorage.cartOrder = JSON.stringify(this.order);
                this.run();
            })
        })
        // verlaag het aantal
        let decrease = document.querySelectorAll('.order-form__down');
        decrease.forEach(button => {
            button.addEventListener('click', e => {
                let decreaseID = e.target.getAttribute('data-role');
                let decreaseBook = this.order.filter(book => book.ean == decreaseID);
                if (decreaseBook[0].orderCount > 1){
                    decreaseBook[0].orderCount--;
                } else {
                    //boek verwijderen
                    this.order = this.order.filter(bk =>bk.ean != decreaseID);
                }
                localStorage.cartOrder = JSON.stringify(this.order);
                this.run();
            })
        })
    },
    removeOrder() {
        document.querySelectorAll('.order-form__trash').forEach(trash => {
            trash.addEventListener('click', e =>{
                let bookToRemoveID = e.target.getAttribute('data-role');
                this.order = this.order.filter(bk =>bk.ean != bookToRemoveID);
                // localstorage bijwerken
                localStorage.cartOrder = JSON.stringify(this.order);
                this.run();
            })
        })
    }

}
// data uit localstorage halen
shoppingCart.getOrder();



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
            //een eigenschap aantalBesteld meegeven
            book.orderCount = 0;
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
                shoppingCart.addBook(clickedBook[0]);


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

