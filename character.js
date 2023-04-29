



const privateKey = '81416cbfce90698cd10408110bdd05c796e07894'
const publicKey = '2f83107e6e3a9c6dbff2bb1d276bf49b'
let store = []




const getData = async () => {

    const params = new URLSearchParams(window.location.search)
    const ts = Date.now()
    const k = ts + privateKey + publicKey
    const hash = CryptoJS.MD5(k).toString()
    const response = await fetch(`http://gateway.marvel.com/v1/public/characters/${params.get('id')}?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
    const comics = await fetch(`http://gateway.marvel.com/v1/public/characters/${params.get('id')}/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
    const series = await fetch(`http://gateway.marvel.com/v1/public/characters/${params.get('id')}/series?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
    const data = await Promise.all([await response.json(),await comics.json(),await series.json()])
    return data
}



getData().then((data) => {
    document.getElementById('loading').style.display='none';
    const nodes = document.querySelectorAll('.container > p')
    nodes[0].style.display='block'
    nodes[1].style.display= 'block'
    createDOM(data[0].data.results[0],data[1].data.results,data[2].data.results)
    
    
}).catch((err) => console.log(err))


const getRandomColor = ()=> {
    var letters = 'FFFF456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

const createDOM = (character,comics,series) => {
   
    console.log(character,"T")

    const characterDesign = `<div>
    <img src=${character.thumbnail.path + '/portrait_incredible.' + character.thumbnail.extension}></img>
    <h1> ${character.name} </h1>
    </div>
    <p> ${character.description} </p>`

    document.getElementById('character').innerHTML = characterDesign

    let seriesDesign =''
    series.forEach(serie=> {
        if(serie.thumbnail.path){
            const color = getRandomColor()
        seriesDesign += `<div style="border-color:${color}">
        <img src=${serie.thumbnail.path + '/portrait_incredible.' + serie.thumbnail.extension} alt=''></img> </div>`
        }
    });
    document.getElementById('series').innerHTML= seriesDesign
   

    let comicDesign = ''
    comics.forEach(comic=> {
        if(comic.images[0]?.path){
            const color = getRandomColor()
        comicDesign += `<div style = "border-color:${color}">
        <img src=${comic.images[0]?.path + '/portrait_incredible.' + comic.images[0]?.extension} alt=''></img> </div>`
        }
    });
    document.getElementById("comics").innerHTML= comicDesign
 



}