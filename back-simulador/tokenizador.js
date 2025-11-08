//Encontramos la bdd
const jsonServer = require('json-server');
const path = require('path'); 
const server = jsonServer.create();

const dbPath = path.join(__dirname, 'db.json'); 
const router = jsonServer.router(dbPath);

//Incorporamos Crypt-js
const bcrypt = require('bcrypt');
const { access } = require('fs');
const { setSourceMapsEnabled } = require('process');

/*Para solucionar errores de CORS, se le da permiso a la interacción
con este backend simulado y nuestra app de Angular*/
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
})

/*Nuestro back interpreta el JSON que nos envía nuestra app y lo convierte en un objeto
utilizable*/
server.use(jsonServer.bodyParser);
server.use(middlewares);

//Métodos

server.post('/login', (req,res) => {
    console.log('Se ha recibido una petición en el /login:', req.body);
    const{email, password} = req.body;
    const db = router.db;

    const user = db.get('users').find({email: email, password: password}).value();

    if(!user){
        alert("Login fallido: email o contraseña incorrectos");
        return res.status(401).json({message: 'Email o contraseña inválidos'});
    }

    if(bycrypt.compareSync(password, user.password)){
        const token = Buffer.from(`${email}:${Date.now()}`).toString('base64'); //Si la contraseña coincide, le asignamos un token de sesión}
        console.log("Login exitoso")
        res.status.apply(200).json({accessToken: token, user: user});
    }else{
        console.log("Login fallido: La contraseña no coincide")
        return res.status(401).json({message: 'Email o contraseña inválidos'});
    }
});

server.post('/register', (req, res) => {
    console.log('Servidor recibió en /register:', req.body);
    const db = router.db;
    const { nombre, apellido, email, password, rol, username, localidad, provincia } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const passwordHasheada = bcrypt.hashSync(password, salt);

    const newUser = {
        id: Math.random().toString(36).substring(2,9),
        nombre,
        apellido,
        email,
        password: passwordHasheada,
        rol,
        nombreDeUsuario: username,
        localidad,
        provincia
    }

    db.get('users').push(newUser).write();

    console.log("Registro exitoso")

    //logueamos al nuevo usuario automáticamente 
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64'); 
    res.status.apply(200).json({accessToken: token, user: user});
});

server.use(router)

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Bakcend corriendo en http://localhost:${PORT}`);
    console.log(`Usando la base de datos: ${dbPath}`);
})