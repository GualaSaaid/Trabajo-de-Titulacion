-- Crear tabla Clientes
CREATE TABLE Clientes (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    direccion TEXT,
    telefono TEXT,
    email TEXT UNIQUE,
    fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla Proveedores
CREATE TABLE Proveedores (
    id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    contacto TEXT,
    telefono TEXT,
    direccion TEXT
);

-- Crear tabla Productos
CREATE TABLE Productos (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    id_proveedor INTEGER,
    FOREIGN KEY (id_proveedor) REFERENCES Proveedores (id_proveedor)
);

-- Crear tabla Ventas
CREATE TABLE Ventas (
    id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER,
    fecha TEXT DEFAULT CURRENT_TIMESTAMP,
    total REAL NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Clientes (id_cliente)
);

-- Crear tabla DetalleVentas
CREATE TABLE DetalleVentas (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER,
    id_producto INTEGER,
    cantidad INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES Ventas (id_venta),
    FOREIGN KEY (id_producto) REFERENCES Productos (id_producto)
);

-- Crear tabla Compras
CREATE TABLE Compras (
    id_compra INTEGER PRIMARY KEY AUTOINCREMENT,
    id_proveedor INTEGER,
    fecha TEXT DEFAULT CURRENT_TIMESTAMP,
    total REAL NOT NULL,
    FOREIGN KEY (id_proveedor) REFERENCES Proveedores (id_proveedor)
);

-- Crear tabla DetalleCompras
CREATE TABLE DetalleCompras (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_compra INTEGER,
    id_producto INTEGER,
    cantidad INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (id_compra) REFERENCES Compras (id_compra),
    FOREIGN KEY (id_producto) REFERENCES Productos (id_producto)
);

-- Crear tabla Roles
CREATE TABLE Roles (
    id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

-- Crear tabla Usuarios
CREATE TABLE Usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    id_rol INTEGER,
    FOREIGN KEY (id_rol) REFERENCES Roles (id_rol)
);

-- Crear tabla Comprobantes de Venta
CREATE TABLE ComprobantesVenta (
    id_comprobante INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER,
    tipo TEXT NOT NULL, -- por ejemplo: 'Factura' o 'Boleta'
    fecha TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_venta) REFERENCES Ventas (id_venta)
);
