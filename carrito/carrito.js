

const cards=document.getElementById('cards')
const items =document.getElementById('items')
const  footer=document.getElementById('footer')
const  templateCard=document.getElementById('template-card').content
const templateFooter=document.getElementById('template-footer').content
const templateCarrito=document.getElementById('template-carrito').content
const fragment =document.createDocumentFragment()
let carrito={}

document.addEventListener('DOMContentLoaded',()=>{
    fetchData()
    if(localStorage.getItem('carrito')){
      carrito=JSON.parce(localStorage.getItem('carrito'))
      pintarCarrito()
    }
})

cards.addEventListener('click',e=>{
  addCarrito(e)
})
items.addEventListener('click',e=>{
  btnAccion(e)//aumentr y disminuir
  
})
const  fetchData =async()=>{
    try{
       const res=await fetch('api.json')
       const data= await res.json()
       //console.log(data)
       pintarCards(data)
      // esto pinta los elementos
      //console pinta
    } catch(error){
       console.log(error)

    }
}    
const pintarCards=data=> {
  // console.log(data)
  data.forEach(producto => {
   //siquisiera pintar en consola
   templateCard.querySelector('h5').textContent=producto.title
   templateCard.querySelector('p').textContent=producto.precio
   templateCard.querySelector('img').setAttribute("src",producto.thumbnailUrl)
   templateCard.querySelector('.btn-dark').dataset.id=producto.id
   const clone=templateCard.cloneNode(true)
   fragment.appendChild(clone)
  })
cards.appendChild(fragment)
}

const addCarrito=e=>{
  //console.log(e.target)
  //console.log.(target.classList.constains('btn-dark'))
 if (e.target.classList.contains('btn-dark')){
     setCarrito( e.target.parentElement)// objeto cPTURA LOS EVEMTOS
    }
    e.stopPropagation()
}
const setCarrito=objeto=>{
  //console.log(objeto)
  const producto={
    id:objeto.querySelector('.btn-dark').dataset.id, //ID OBJETO DEL BOTON  O LA CLASE DARKTITLE
    title:objeto.querySelector('h5').textContent,//nombre producto
    precio:objeto.querySelector('p').textContent,//precio
    cantidad:1
  }
    if(carrito.hasOwnProperty(producto.id)){
      producto.cantidad=carrito[producto.id].cantidad + 1 //entro if cantidad aumenta suma 1
    }
    carrito[producto.id]={...producto}//empujamos al carrito
  //console.log(producto)
     pintarCarrito()
}
const pintarCarrito=()=>{
 //console.log(carrito)
 items.innerHTML=''
  Object.values(carrito).forEach(producto=>{
    templateCarrito.querySelector('th').textContent=producto.id
    templateCarrito.querySelectorAll('td')[0].textContent=producto.title//arrays
    templateCarrito.querySelectorAll('td')[1].textContent=producto.cantidad
    templateCarrito.querySelector('.btn-info').dataset.id=producto.id
    templateCarrito.querySelector('.btn-danger').dataset.id=producto.id
    templateCarrito.querySelector('span').textContent=producto.cantidad*producto.precio
    const clone=templateCarrito.cloneNode(true)
    fragment.appendChild(clone)
  }  )//items
  items.appendChild(fragment)
  pintarFooter()
  localStorage.setItem('carrito',JSON.stringify(carrito))
}
const pintarFooter=()=>{
  footer.innerHTML=''
  if(Object.keys(carrito).length===0){
    footer.innerHTML = `
    <th scope="row" colspan="5">Carrito vac??o - comience a comprar!</th>
     ` 
     return
  }
  const nCantidad=Object.values(carrito).reduce((acc,{cantidad})=>acc+cantidad,0)
  const nPrecio =Object.values(carrito).reduce((acc,{cantidad,precio})=>acc+cantidad*precio,0) 
   //console.log(nPrecio)
   templateFooter.querySelectorAll('td')[0].textContent=nCantidad
   templateFooter.querySelector('span').textContent=nPrecio

   const clone=templateFooter.cloneNode(true)
   fragment.appendChild(clone)
   footer.appendChild(fragment)

   const btnVaciar=document.getElementById('vaciar-carrito')
   btnVaciar.addEventListener('click',()=>{
    carrito={}
    pintarCarrito()
   })


  }

const btnAccion=e=>{
//console.log(e.target)
//accion de aumentar
if(e.target.classList.contains('btn-info')){
 // console.log(carrito[e.target.dataset.id])
  //carrito[e.target.dataset.id]
  const producto=carrito[e.target.dataset.id]
  producto.cantidad++
  carrito[e.target.dataset.id]={...producto}
  pintarCarrito()
}

if(e.target.classList.contains('btn-danger')){
  const producto=carrito[e.target.dataset.id]
  producto.cantidad--
  carrito[e.target.dataset.id]={...producto}
  if(producto.cantidad===0){
    delete carrito[e.target.dataset.id]
  }
  pintarCarrito()
}
e.stopPropagation()
}