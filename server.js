const http = require( 'http' ),
      fs   = require( 'fs' ),
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

let nextId = 4
const appdata = [
  { id: 1, make: 'Toyota', model: 'Camry',  year: 2020, price: 18000, mpg: 32, valueRating: 'Good Value' },
  { id: 2, make: 'Honda',  model: 'Civic',  year: 2019, price: 14500, mpg: 36, valueRating: 'Great Deal' },
  { id: 3, make: 'Ford',   model: 'F-150',  year: 2022, price: 32000, mpg: 20, valueRating: 'Fair Price' }
]

const deriveValueRating = function( year, price ) {
  if ( year >= 2015 && price < 15000 ) return 'Great Deal'
  if ( price < 25000 ) return 'Good Value'
  if ( price < 45000 ) return 'Fair Price'
  return 'Premium'
}

const server = http.createServer( function( request, response ) {
  if ( request.method === 'GET' ) {
    handleGet( request, response )
  } else if ( request.method === 'POST' ) {
    handlePost( request, response )
  }
})

const handleGet = function( request, response ) {
  if ( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  } else if ( request.url === '/data' ) {
    response.writeHead( 200, { 'Content-Type': 'application/json' })
    response.end( JSON.stringify( appdata ) )
  } else {
    const filename = dir + request.url.slice( 1 )
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {
    const body = JSON.parse( dataString )

    if ( request.url === '/submit' ) {
      const car = {
        id: nextId++,
        make: body.make,
        model: body.model,
        year: parseInt( body.year ),
        price: parseFloat( body.price ),
        mpg: parseFloat( body.mpg ),
        valueRating: deriveValueRating( parseInt( body.year ), parseFloat( body.price ) )
      }
      appdata.push( car )

    } else if ( request.url === '/update' ) {
      const idx = appdata.findIndex( c => c.id === parseInt( body.id ) )
      if ( idx !== -1 ) {
        appdata[ idx ] = {
          id: parseInt( body.id ),
          make: body.make,
          model: body.model,
          year: parseInt( body.year ),
          price: parseFloat( body.price ),
          mpg: parseFloat( body.mpg ),
          valueRating: deriveValueRating( parseInt( body.year ), parseFloat( body.price ) )
        }
      }

    } else if ( request.url === '/delete' ) {
      const idx = appdata.findIndex( c => c.id === parseInt( body.id ) )
      if ( idx !== -1 ) appdata.splice( idx, 1 )
    }

    response.writeHead( 200, { 'Content-Type': 'application/json' })
    response.end( JSON.stringify( appdata ) )
  })
}

const sendFile = function( response, filename ) {
  const type = mime.getType( filename )

  fs.readFile( filename, function( err, content ) {
    if ( err === null ) {
      response.writeHeader( 200, { 'Content-Type': type })
      response.end( content )
    } else {
      response.writeHeader( 404 )
      response.end( '404 Error: File Not Found' )
    }
  })
}

server.listen( process.env.PORT || port )
