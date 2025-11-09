//Encontramos la bdd
const jsonServer = require('json-server');
const path = require('path'); 
const server = jsonServer.create();

const dbPath = path.join(__dirname, 'db.json'); 
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

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

    if(req.method === 'OPTIONS'){
        res.sendStatus(200);
    };

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

    const user = db.get('users').find({email: email}).value();

    if(!user){
        return res.status(401).json({message: 'Email o contraseña inválidos'});
    }

    if(bcrypt.compareSync(password, user.password)){
        const token = Buffer.from(`${email}:${Date.now()}`).toString('base64'); //Si la contraseña coincide, le asignamos un token de sesión}
        console.log("Login exitoso")
        res.status(200).json({accessToken: token, user: user});
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

    try {
        // Ensure the 'users' collection exists
        if (!db.get('users').value()) {
            db.set('users', []).write();
        }

        // Push and write, then verify it was saved
        db.get('users').push(newUser).write();
        const saved = db.get('users').find({ id: newUser.id }).value();

        if (!saved) {
            console.error('Error guardando usuario en la base de datos:', newUser);
            return res.status(500).json({ message: 'Error al guardar usuario' });
        }

        console.log('Registro exitoso')

        // logueamos al nuevo usuario automáticamente 
        const token = Buffer.from(`${email}:${Date.now()}`).toString('base64'); 
        return res.status(201).json({ accessToken: token, user: newUser });
    } catch (err) {
        console.error('Error al procesar /register:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});


server.use(router)

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Bakcend corriendo en http://localhost:${PORT}`);
    console.log(`Usando la base de datos: ${dbPath}`);
})