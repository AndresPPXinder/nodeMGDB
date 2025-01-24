const conexP = require('../config/dbPostgre');

// función para listar los productos
exports.indexProd = async (req, res) =>{
    try{
        const consulta = 'SELECT * FROM listar_productos()';
        
        const resultado = await conexP.query(consulta);


        // Renderizar la información de los productos para la vista productos
        res.render('post/productos', { productos:resultado.rows});
    }catch(error){
        console.error('Error al obtener todos los productos:', error);
        res.status(500).json({
            message: 'Hubo un error al obtener los productos',
            error: error.message
        });
    }
};

// Funcion para mostrar o ir al formulario de registrar un nuevo producto
exports.create = async (req, res) =>{
    res.render('post/create'); // Lo estamos mandando a el folder de post donde se encuentra la vista de create.ejs
};

// función para listar los productos
exports.store = async (req, res) => {
    const { nombre, stock, precio, estado, idcategoria } = req.body;
    try {
        // Llamar a la función insert_prod, pasando el idcategoria
        const consulta = `SELECT insert_prod($1, $2, $3, $4)`;
        const values = [nombre, idcategoria, precio, stock];

        // Ejecutar la consulta para insertar el producto
        await conexP.query(consulta, values);

        // Verificar si la inserción fue exitosa y redirigir a la página de productos después de insertar
        console.log('Producto insertado correctamente');
        res.redirect('/post');
    } catch (error) {
        console.error('Error al insertar el producto:', error);
        res.status(500).json({
            message: 'Hubo un error al insertar el producto.',
            error: error.message
        });
    }
};



// Función de editar que lo que hace es recibir un parametro del id del producto
// seleccionado para poder cargar la vista del edit y mostrar los datos que contiene
exports.edit = async (req, res) => {
    const { id } = req.params;

    try {
        const consulta = `
            SELECT p.idproducto, p.nombre, p.stock, p.precio, p.estado, p.idcategoria, c.nombre AS categoria
            FROM producto p
            JOIN categoria c ON p.idcategoria = c.idcategoria
            WHERE p.idproducto = $1;
        `;

        const resultado = await conexP.query(consulta, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.render('post/edit', { producto: resultado.rows[0] }); // Si usas EJS o un motor de plantillas

    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({
            message: 'Hubo un error al obtener el producto.',
            error: error.message
        });
    }
};

// Función del update que registra los cambios efectuados en el edit
exports.update = async (req, res) => {
    const { id } = req.params;
    const { nombre, stock, precio, estado, idcategoria } = req.body;

    

    try {
        // Llamar a la función edit_prod
        const consulta = `SELECT edits_prod($1, $2, $3, $4, $5, $6)`;
        const values = [id, nombre, precio, stock, estado, idcategoria];
        
        await conexP.query(consulta, values);

        // Redirigir a la página de productos después de actualizar
        res.redirect('/post');
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({
            message: 'Hubo un error al actualizar el producto.',
            error: error.message
        });
    }
};

 
// Eliminar un producto
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        // Llamar a la función delete_prod
        const consulta = `SELECT delete_prod($1)`;
        const values = [id];
        
        await conexP.query(consulta, values);

        // Redirigir a la página de productos después de eliminar
        res.redirect('/post');
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({
            message: 'Hubo un error al eliminar el producto.',
            error: error.message
        });
    }
};
