// FRONT-END (CLIENT) JAVASCRIPT

let currentData = []

const formTitle  = document.querySelector( '#form-title' )
const form       = document.querySelector( '#car-form' )
const submitBtn  = document.querySelector( '#submit-btn' )
const cancelBtn  = document.querySelector( '#cancel-btn' )
const editIdInput = document.querySelector( '#edit-id' )
const tbody      = document.querySelector( '#inventory-body' )
const emptyMsg   = document.querySelector( '#empty-msg' )

// ── Helpers ──────────────────────────────────────────────

const postJSON = async function( url, body ) {
  const response = await fetch( url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( body )
  })
  return response.json()
}

const resetForm = function() {
  form.reset()
  editIdInput.value = ''
  formTitle.textContent = 'Add a Car'
  submitBtn.textContent = 'Add Car'
  cancelBtn.classList.add( 'hidden' )
}

// ── Table Renderer ────────────────────────────────────────

const renderTable = function( data ) {
  tbody.innerHTML = ''

  if ( data.length === 0 ) {
    emptyMsg.classList.remove( 'hidden' )
    return
  }
  emptyMsg.classList.add( 'hidden' )

  data.forEach( function( car ) {
    const ratingClass = 'rating-' + car.valueRating.replace( /\s+/g, '-' ).toLowerCase()
    const tr = document.createElement( 'tr' )
    tr.innerHTML =
      '<td>' + car.make + '</td>' +
      '<td>' + car.model + '</td>' +
      '<td>' + car.year + '</td>' +
      '<td>$' + car.price.toLocaleString() + '</td>' +
      '<td>' + car.mpg + '</td>' +
      '<td><span class="rating ' + ratingClass + '">' + car.valueRating + '</span></td>' +
      '<td class="action-cell">' +
        '<button class="edit-btn" data-id="' + car.id + '">Edit</button>' +
        '<button class="delete-btn" data-id="' + car.id + '">Delete</button>' +
      '</td>'
    tbody.appendChild( tr )
  })

  tbody.querySelectorAll( '.edit-btn' ).forEach( function( btn ) {
    btn.addEventListener( 'click', function() {
      const car = currentData.find( c => c.id === parseInt( btn.dataset.id ) )
      if ( !car ) return

      editIdInput.value = car.id
      document.querySelector( '#make' ).value  = car.make
      document.querySelector( '#model' ).value = car.model
      document.querySelector( '#year' ).value  = car.year
      document.querySelector( '#price' ).value = car.price
      document.querySelector( '#mpg' ).value   = car.mpg

      formTitle.textContent = 'Edit Car'
      submitBtn.textContent = 'Update Car'
      cancelBtn.classList.remove( 'hidden' )
      document.querySelector( '#form-section' ).scrollIntoView({ behavior: 'smooth' })
    })
  })

  tbody.querySelectorAll( '.delete-btn' ).forEach( function( btn ) {
    btn.addEventListener( 'click', async function() {
      if ( !confirm( 'Are you sure you want to delete this car?' ) ) return
      const data = await postJSON( '/delete', { id: parseInt( btn.dataset.id ) } )
      currentData = data
      renderTable( data )
    })
  })
}

// ── Form Submit ───────────────────────────────────────────

form.addEventListener( 'submit', async function( event ) {
  event.preventDefault()

  const body = {
    make:  document.querySelector( '#make' ).value,
    model: document.querySelector( '#model' ).value,
    year:  document.querySelector( '#year' ).value,
    price: document.querySelector( '#price' ).value,
    mpg:   document.querySelector( '#mpg' ).value
  }

  const isEditing = editIdInput.value !== ''
  if ( isEditing ) body.id = editIdInput.value

  const url = isEditing ? '/update' : '/submit'
  const data = await postJSON( url, body )
  currentData = data
  renderTable( data )
  resetForm()
})

cancelBtn.addEventListener( 'click', resetForm )

// ── Initial Load ──────────────────────────────────────────

window.onload = async function() {
  const response = await fetch( '/data' )
  currentData = await response.json()
  renderTable( currentData )
}
