//Encontramos la bdd
const jsonServer = require('json-server');
const path = require('path'); 
const server = jsonServer.create();

const dbPath = path.join(__dirname, 'db.json'); 
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();
const axios = require('axios');
const fileUpload = require('express-fileupload');
const FormDataClass = require('form-data');

//Incorporamos Crypt-js
const bcrypt = require('bcrypt');

/*Para solucionar errores de CORS, se le da permiso a la interacción
con este backend simulado y nuestra app de Angular*/
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Credentials', 'true');

    if(req.method === 'OPTIONS'){
        return res.sendStatus(200); // ← AGREGADO return aquí
    }

    next();
});

/*Nuestro back interpreta el JSON que nos envía nuestra app y lo convierte en un objeto
utilizable*/
server.use(fileUpload());
server.use(jsonServer.bodyParser);

//Métodos
server.post('/login', (req,res) => {
    console.log('Se ha recibido una petición en el /login:', req.body);
    const{email, password} = req.body;
    const db = router.db;

    const user = db.get('users').find({email: email}).value();

    if(!user){
        return res.status(404).json({message: 'El email ingresado es incorrecto'});
    }

    if(bcrypt.compareSync(password, user.password)){
        const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
        console.log("Login exitoso")
        return res.status(200).json({accessToken: token, user: user});
    }else{
        console.log("Login fallido: La contraseña no coincide")
        return res.status(401).json({message: 'La contraseña ingresada no coincide'});
    }
});

server.patch('/usuarios/:id/favoritos', (req, res) => {
    const { id } = req.params;
    const { marcadoresGuardadosID } = req.body;
    
    const db = router.db;
    const user = db.get('users').find({ id: id }).value();
    
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Actualizamos solo el campo de favoritos
    user.marcadoresGuardadosID = marcadoresGuardadosID;
    db.get('users').find({ id: id }).assign(user).write();
    
    return res.status(200).json(user);
});

server.post('/register', (req, res) => {
    console.log('Servidor recibió en /register:', req.body);
    const db = router.db;
    const { nombre, apellido, email, password, rol, nombreDeUsuario, localidad, provincia } = req.body;

    const emailExistente = db.get('users').find({ email: email }).value();
    if (emailExistente) {
        console.error('Error al procesar /register: El email ya está registrado');
        return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const usernameExistente = db.get('users').find({ nombreDeUsuario: nombreDeUsuario }).value();
    if (usernameExistente) {
        console.error('Error al procesar /register: El nombre de usuario ya está en uso');
        return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHasheada = bcrypt.hashSync(password, salt);

    const newUser = {
        id: Math.random().toString(36).substring(2,9),
        nombre,
        apellido,
        email,
        password: passwordHasheada,
        rol,
        nombreDeUsuario: nombreDeUsuario.toLowerCase(),
        localidad,
        provincia,
        posteosFavoritosID: [],
        marcadoresGuardadosID: []
    }

    try {
        if (!db.get('users').value()) {
            db.set('users', []).write();
        }

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

server.post('/api/subir-imagen', async (req, res) => {
    try {
        console.log('POST /api/subir-imagen recibido');
        console.log('Files recibidos:', req.files);

        if (!req.files || !req.files.image) {
            console.error('No image file provided');
            return res.status(400).json({ message: 'No image file provided' });
        }

        const imageFile = req.files.image;
        const ImgbbKey = '4390cb6e2c63ec5ee08f85d837463e50';

        console.log('Archivo recibido:', imageFile.name);

        // Crear FormData para enviar a ImgBB
        const form = new FormDataClass();
        form.append('image', imageFile.data, { filename: imageFile.name });

        // Enviar a ImgBB desde el backend (sin problemas de CORS)
        console.log('Enviando a ImgBB...');
        const imgbbResponse = await axios.post(
            `https://api.imgbb.com/1/upload?key=${ImgbbKey}`,
            form,
            { headers: form.getHeaders() }
        );

        if (imgbbResponse.data.success) {
            const imageUrl = imgbbResponse.data.data.url;
            console.log('Imagen subida a ImgBB:', imageUrl);
            return res.status(200).json({
                success: true,
                url: imageUrl
            });
        } else {
            throw new Error('ImgBB reported failure');
        }

    } catch (error) {
        console.error('Error en /api/subir-imagen:', error.message);
        return res.status(500).json({
            message: 'Error uploading image',
            error: error.message
        });
    }
});

// Router al final
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
    console.log(`Usando la base de datos: ${dbPath}`);
});