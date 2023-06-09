const express = require('express');
const morgan = require('morgan');
const cookieparser = require('cookie-parser');

const app = express();

const users = [
  {id: 1, name: 'Franco', email: 'Franco@mail.com', password: '1234'},
  {id: 2, name: 'Toni', email: 'Toni@mail.com', password: '1234'}
]

app.use(morgan('dev'));
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   res.cookie('userId', undefined);
//   next();
// });

app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

const isAuthenticated = (req, res, next) => {
  if(!req.cookies.userId) { 
    res.redirect('/login');
  } else {
    next();
  }
}

const isNotAuthenticated = (req, res, next) => {
  if(req.cookies.userId) { //Si ya hay un userId es porque ya estoy logeado y me manda al home
    res.redirect('/home');
  } else {
    next();
  }
}

app.get('/', (req, res) => {
  res.send(`
    <h1>Bienvenidos a Henry!</h1>
    ${req.cookies.userId ? `
      <a href='/home'>Perfil</a>
      <form method='post' action='/logout'>
        <button>Salir</button>
      </form>
      ` : `
      <a href='/login'>Ingresar</a>
      <a href='/register'>Registrarse</a> 
      `}
  `)
});

app.get('/register', isNotAuthenticated, (req, res) => {
  res.send(`
    <h1>Registrarse</h1>
    <form method='post' action='/register'>
      <input name='name' placeholder='Nombre' required />
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Contraseña' required />
      <input type='submit' value='Registrarse' />
    </form>
    <a href='/login'>Iniciar sesión</a>
  `)
});

app.get('/login', isNotAuthenticated, (req, res) => {
  res.send(`
    <h1>Iniciar sesión</h1>
    <form method='post' action='/login'>
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Contraseña' required />
      <input type='submit' value='Ingresar' />
    </form>
    <a href='/register'>Registrarse</a>
  `)
});

app.post('/login', isNotAuthenticated, (req, res) => {
  const { email, password } = req.body;
  if(email && password){
    const user = users.find(user => user.email === email && user.password === password);
    if(!user) res.redirect('/login');
    res.cookie('userId', user.id);
    res.redirect('/home');
  } else {
    res.redirect('/login');
  };
  
  // 1) Obtener el email y password desde el body del request
  // 2) Verificar que ambos datos hayan sido provistos
  // Si ambos datos fueron provistos:
  //   a) Obtener del listado de usuarios (si existe) el que tenga dicho email y contraseña
  //   b) Guardar los datos del usuario en la cookie: res.cookie('userId', user.id) donde el primer
  //   parámetro es el nombre de la cookie y el segundo su valor
  //   c) Redirigir a /home
  // En el caso de que no exista un usuario con esos datos o directamente no se hayan provisto o
  // el email o la password, redirigir a /login
});

app.get('/home', isAuthenticated, (req, res) => {
  //Completar: obtener el usuario correspondiente del array 'users' tomando como referencia el id de usuario almacenado en la cookie
  const user = users.find(user => user.id === parseInt(req.cookies.userId));
    res.send(`
    <h1>Bienvenido ${user.name}</h1>
    <h4>${user.email}</h4>
    <a href='/'>Inicio</a>
  `)
});

app.post('/register', isNotAuthenticated, (req, res) => {
  // 1) Obtener el name, email y password desde el body del request
  const { name, email, password } = req.body;
  // 2) Verificar que los tres datos hayan sido provistos
  if(name && email && password ){
    const user = users.find(user => user.email === email)
    if(user.email === email) res.redirect('/register');
    const newUser = { id: users.length+1, name, email, password };
    users.push(newUser);
  }
  else res.redirect('/register');
  // Si todos los datos fueron provistos:
  //   a) Buscar dentro del listado de usuarios si existe alguno que tenga dicho email para evitar
  //      que existan dos usuarios con mismo mail
  //   b) Crear un nuevo objeto con los datos del usuario y pushearlo al array de users
  //   c) Redirigir a la pantalla inicial '/'
  // En el caso de que ya exista un usuario con ese email o no se hayan provisto o
  // el name o el email o la password, redirigir a /register
});

app.post('/logout', isAuthenticated, (req, res) => {
  res.clearCookie('userId');
  res.redirect('/');
});

app.listen(3000, (err) => {
  if(err) {
   console.log(err);
 } else {
   console.log('Listening on localhost:3000');
 }
});
