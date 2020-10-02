const output = document.getElementById('boeken');
const request = new XMLHttpRequest();

request.onreadystatechange = () => {
    if(request.readyState === 4 && request.status === 200) {
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
            html += `<h3>${book.titel}</h3>`
        });
        output.innerHTML = html;
    }
}
