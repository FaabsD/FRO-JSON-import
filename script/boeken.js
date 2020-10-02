const uitvoer = document.getElementById('boeken');
const request = new XMLHttpRequest();

request.onreadystatechange = () => {
    if(request.readyState === 4 && request.status === 200) {
        let result = JSON.parse(request.responseText);
        console.log(result);
    } else {
        console.log("readystate: " + request.readyState);
        console.log("status: " + request.status);
    }
}
request.open('GET', 'boeken.json', true);
request.send();
