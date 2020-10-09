const output = document.getElementById('boeken');
const request = new XMLHttpRequest();

request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
        let result = JSON.parse(request.responseText);
        books.data = result;
        books.run();
    } else {
        console.log("readystate: " + request.readyState);
        console.log("status: " + request.status);
    }
}
request.open('GET', 'boeken.json', true);
request.send();

const books = {
    // Hier wordt een eigenschap data gemaakt
    run() {
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
            book.auteurs.forEach((auteur,index) => {
                let tussenvoegsel = auteur.tussenvoegsel ? auteur.tussenvoegsel + " " : "";
                // scheidingsteken tussen auteurs
                let separator = ", ";
                if (index >= book.auteurs.length -2) { separator = " & ";}
                if (index >= book.auteurs.length -1) { separator = "";}
                auteurs += auteur.voornaam + " " + tussenvoegsel + auteur.achternaam + separator;
            })

            html += `<section class="book">`;
            html += `<img class ="book__cover" src ="${book.cover}" alt"${title}">`;
            html += `<h3 class="book__head">${title}</h3>`;
            html += `<p class="book__authors">${auteurs}</p>`;
            html += `<span class="book__edition">${book.uitgave}</span>`;
            html += `<span class="book__ean">ean: ${book.ean}</span>`;
            html += `<span class="book__pages">${book.paginas} pagina's</span>`;
            html += `<span class="book__lang">${book.taal}</span>`;
            html += `<div class="book__price">&euro; ${book.prijs}</div>`
            html += `</section>`;
        });
        output.innerHTML = html;
    }
}
