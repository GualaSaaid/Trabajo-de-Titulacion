-- Tabla para Roles
CREATE TABLE roles (
    id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
    rol_usuario TEXT NOT NULL,
    descripcion TEXT
);

-- Tabla para Usuarios
CREATE TABLE usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    id_rol INTEGER NOT NULL,
    nickname TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL,
    nombre_completo TEXT NOT NULL,
    estado INTEGER NOT NULL,
    cedula TEXT UNIQUE,
    FOREIGN KEY (id_rol) REFERENCES roles (id_rol)
);

-- Tabla para Categorías de Productos
CREATE TABLE categorias (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla para Productos
CREATE TABLE productos (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    id_categoria INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    unidad_medida TEXT,
    stock_minimo INTEGER,
    stock_actual INTEGER,
    precio_venta REAL NOT NULL,
    precio_compra REAL NOT NULL,
    fecha_vencimiento DATE,
    FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
);

-- Tabla para Proveedores
CREATE TABLE proveedores (
    id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    direccion TEXT,
    telefono TEXT,
    correo_electronico TEXT,
    representante_proveedor TEXT
);

-- Tabla para Compras
CREATE TABLE compras (
    id_compra INTEGER PRIMARY KEY AUTOINCREMENT,
    id_proveedor INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    fecha DATE NOT NULL,
    total REAL NOT NULL,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores (id_proveedor),
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

-- Tabla para Detalle de Compras
CREATE TABLE detalle_compras (
    id_detalle_compras INTEGER PRIMARY KEY AUTOINCREMENT,
    id_compra INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (id_compra) REFERENCES compras (id_compra),
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
);

-- Tabla para Clientes
CREATE TABLE clientes (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_completo TEXT NOT NULL,
    direccion TEXT,
    telefono TEXT,
    correo_electronico TEXT UNIQUE,
    fecha_registro DATE NOT NULL,
    estado INTEGER NOT NULL DEFAULT 1
);

-- Tabla para Ventas
CREATE TABLE ventas (
    id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    id_cliente INTEGER,
    fecha_hora DATETIME NOT NULL,
    total REAL NOT NULL,
    estado INTEGER NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
    FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
);

-- Tabla para Detalle de Ventas
CREATE TABLE detalle_ventas (
    id_detalle_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES ventas (id_venta),
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
);

-- Tabla para Historial de Ventas
CREATE TABLE historico_ventas (
    id_historico INTEGER PRIMARY KEY AUTOINCREMENT,
    id_producto INTEGER NOT NULL,
    fecha DATE NOT NULL,
    cantidad_vendida INTEGER NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
);

-- Tabla para Predicciones de Demanda
CREATE TABLE predicciones_demanda (
    id_prediccion INTEGER PRIMARY KEY AUTOINCREMENT,
    id_producto INTEGER NOT NULL,
    fecha DATE NOT NULL,
    cantidad_prevista INTEGER NOT NULL,
    modelo_usado TEXT,
    fecha_registro DATE,
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
);

-- Tabla para Parámetros del Modelo de Machine Learning
CREATE TABLE parametros_modelo (
    id_parametro INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_parametro TEXT NOT NULL,
    valor_parametro TEXT NOT NULL,
    fecha_registro DATE NOT NULL
);

-- Tabla para Comprobantes de Venta
CREATE TABLE comprobantes (
    id_comprobante INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NOT NULL,
    tipo TEXT NOT NULL,
    numero TEXT NOT NULL,
    fecha_emision DATE NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES ventas (id_venta)
);
