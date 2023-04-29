const privateKey = '81416cbfce90698cd10408110bdd05c796e07894'
const publicKey = '2f83107e6e3a9c6dbff2bb1d276bf49b'
let store = []
let bigStore = JSON.parse(window.sessionStorage.getItem('bigStore') || '[]')
let offset = parseInt(window.sessionStorage.getItem('offset') || '0')
let total = 100

const list = window.localStorage.getItem("heroeslist")
const favList = list ? new Set(JSON.parse(list)) : new Set()



const getRandomColor = () => {
    var letters = 'FFFF456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


const getData = async () => {

    const ts = Date.now()
    const k = ts + privateKey + publicKey
    const hash = CryptoJS.MD5(k).toString()
    const response = await fetch(`http://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=100`)
   
    const data = await response.json()
    return data
}

const createDOM = (characters) => {
    let html = ''
    characters.forEach((character) => {
        const color = getRandomColor()
        html += `
        <div class="cardcontainer" style="position:relative">
        <button style="background-color:${color}" class="additem" id=${character.id} style="position:absolute"> Add To List </button>
        <a class="card" href="/character.html?id=${character.id}"><div style="border-color:${color}">    
        <img src=${character.thumbnail.path + '/portrait_incredible.' + character.thumbnail.extension}></img>
        <p style="color:${color}">${character.name}</p></div></a>
        </div>`
    })

    document.getElementsByClassName('characters')[0].innerHTML = html
}


if(bigStore.length===0){
getData().then((data) => {
    document.getElementById('loading').style.display='none';
    document.getElementsByClassName('pagination')[0].style.display='flex';
    bigStore = [...data.data.results]
    window.sessionStorage.setItem('bigStore',JSON.stringify(bigStore))
    for (let i = offset; i < Math.min(total, offset + 20); i++) {
        store.push(bigStore[i])
    }
    createDOM(store)

}).catch((err) => console.log(err))
}
else{
    document.getElementById('loading').style.display='none';
    document.getElementsByClassName('pagination')[0].style.display='flex';
    for (let i = offset; i < Math.min(total, offset + 20); i++) {
        store.push(bigStore[i])
    }
    createDOM(store)    
}




document.getElementById("favHeroPage").innerText = `My favorite superheroes list ${favList.size}`
window.addEventListener('click', (e) => {
    if (e.target.getAttribute('class') == "additem") {
        const id = e.target.id
        const found = store.find((val) => val.id == id)
        favList.add(found)
        document.getElementById("favHeroPage").innerText = `My favorite superheroes list ${favList.size}`
    }
})

document.getElementById('favHeroPage').addEventListener('click', () => {
    window.localStorage.setItem('heroeslist', JSON.stringify(Array.from(favList)))
})

const inputField = document.getElementById('searchfield')


inputField.addEventListener('input', (e) => {
    const search = e.target.value
    const filterData = store.filter((val) => {
        const temp = val.name.toLowerCase()
        return temp.startsWith(search.toLowerCase())
    })
    createDOM(filterData)

})



document.getElementById('next').addEventListener('click', () => {

    offset = Math.min(total, offset + 20)
    if(offset==total){
        return
    }
    window.sessionStorage.setItem('offset', offset)
    for (let i = offset,j=0; i < Math.min(total, offset + 20); i++,j++) {
        store[j] = bigStore[i]
    }
    createDOM(store)
})

document.getElementById('prev').addEventListener('click', () => {


    offset = Math.max(0, offset - 20)
    window.sessionStorage.setItem('offset',offset)
    for (let i = offset,j=0; i < Math.min(total, offset + 20); i++,j++) {
        store[j] = bigStore[i]
    }
    createDOM(store)
})