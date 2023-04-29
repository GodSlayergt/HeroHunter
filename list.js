
let store = []


const getRandomColor = ()=> {
    var letters = 'FFFF456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


const createDOM = (characters) => {
    let html = ''
    characters.forEach((character)=>{
        const color = getRandomColor()
        html += `
        <div class="cardcontainer" style="position:relative">
        <button style="background-color:${color}" class="additem" id=${character.id} style="position:absolute"> Remove </button>
        <a class="card" href="/character.html?id=${character.id}"><div style="border-color:${color}">    
        <img src=${character.thumbnail.path + '/portrait_incredible.' + character.thumbnail.extension}></img>
        <p style="color:${color}">${character.name}</p></div></a>
        </div>`
    })

    document.getElementsByClassName('characters')[0].innerHTML=  html
}

store = JSON.parse(window.localStorage.getItem('heroeslist'))
createDOM(store)

window.addEventListener('click',(e)=>{
    if(e.target.getAttribute('class')=="additem"){
        const id = e.target.id
        let index = -1
        for(let i=0;i<store.length;i++){
            if(store[i].id==id){
                index = i
                break
            }
        }
        store.splice(index,1)
        window.localStorage.setItem('heroeslist',JSON.stringify(Array.from(store)))
        createDOM(store)
    }
})


const inputField = document.getElementById('searchfield')


inputField.addEventListener('input',(e)=>{
    const search = e.target.value
    const filterData = store.filter((val)=>{
        const temp = val.name.toLowerCase()
        return temp.startsWith(search.toLowerCase())
    })
   createDOM(filterData)

})