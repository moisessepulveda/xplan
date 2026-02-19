# Plan: Migración de Categorías por Defecto

## Objetivo
Mover las categorías por defecto del Seeder a una migración, con un catálogo amplio de categorías en 2 niveles (padre → hijos).

---

## Catálogo Propuesto

### INGRESOS

| Categoría Padre | Subcategorías |
|-----------------|---------------|
| **Salario** | Sueldo, Bonos, Horas Extra, Aguinaldo |
| **Trabajo Independiente** | Freelance, Honorarios, Comisiones, Consultorías |
| **Inversiones** | Dividendos, Intereses, Ganancias de Capital, Arriendos |
| **Ventas** | Venta de Artículos, Marketplace, Negocio Propio |
| **Gobierno** | Subsidios, Devolución de Impuestos, Pensión, Bonos Estatales |
| **Otros Ingresos** | Regalos Recibidos, Reembolsos, Premios, Herencias |
| **Préstamos Recibidos** | Préstamos Personales, Préstamos Familiares |

---

### GASTOS

| Categoría Padre | Subcategorías |
|-----------------|---------------|
| **Vivienda** | Arriendo/Hipoteca, Gastos Comunes, Contribuciones, Seguros de Hogar, Reparaciones, Muebles y Decoración |
| **Servicios Básicos** | Electricidad, Agua, Gas, Internet, Telefonía, TV Cable/Streaming |
| **Alimentación** | Supermercado, Feria/Mercado, Restaurantes, Delivery, Cafetería, Snacks |
| **Transporte** | Combustible, Transporte Público, Taxi/Uber, Estacionamiento, Peajes, Mantención Vehículo, Seguro Vehículo, Patente/Permiso |
| **Salud** | Médico General, Especialistas, Dentista, Oftalmólogo, Farmacia, Exámenes, Seguro de Salud, Gimnasio/Deporte |
| **Educación** | Colegiatura/Matrícula, Útiles Escolares, Cursos y Talleres, Libros, Certificaciones |
| **Entretenimiento** | Cine/Teatro, Conciertos/Eventos, Suscripciones Digitales, Videojuegos, Salidas/Fiestas, Viajes/Vacaciones, Hobbies |
| **Vestuario** | Ropa, Calzado, Accesorios, Ropa Deportiva, Lavandería/Tintorería |
| **Cuidado Personal** | Peluquería/Barbería, Cosméticos, Spa/Tratamientos, Productos de Higiene |
| **Mascotas** | Alimento Mascotas, Veterinario, Accesorios Mascotas, Peluquería Mascotas |
| **Tecnología** | Equipos Electrónicos, Software/Apps, Accesorios Tech, Reparaciones Tech |
| **Hogar** | Artículos de Limpieza, Menaje, Jardinería, Servicio Doméstico |
| **Financiero** | Comisiones Bancarias, Intereses de Créditos, Seguros de Vida, Inversiones/Ahorro |
| **Impuestos** | Impuesto a la Renta, IVA, Otros Impuestos |
| **Préstamos Otorgados** | Préstamos a Familiares, Préstamos a Amigos |
| **Cuotas de Créditos** | *(categoría sistema - ya existe)* |
| **Donaciones** | Caridad, Iglesia/Religión, Propinas |
| **Otros Gastos** | Regalos, Imprevistos, Varios |

---

## Cambios Técnicos

### 1. Nueva Migración
**Archivo:** `database/migrations/XXXX_seed_default_categories.php`

- Se ejecutará después de crear la tabla `categories`
- Creará las categorías para cada Planning existente
- Usará `is_system = true` para marcarlas como categorías del sistema

### 2. Modificar CreatePlanningAction
- Llamará a un nuevo servicio `DefaultCategoriesService::createForPlanning()`
- Este servicio usará el mismo catálogo definido en un archivo de configuración

### 3. Archivo de Configuración (opcional)
**Archivo:** `config/categories.php`
- Centraliza el catálogo de categorías
- Facilita modificaciones futuras

### 4. Eliminar Seeder
- `DefaultCategoriesSeeder.php` se eliminará o quedará vacío

---

## Iconos y Colores Propuestos

### Paleta de Colores
| Tipo | Color Principal |
|------|-----------------|
| Ingresos | Verdes (#52c41a, #73d13d, #95de64) |
| Gastos Esenciales | Azules (#1677ff, #4096ff, #69b1ff) |
| Gastos Variables | Naranjas/Amarillos (#fa8c16, #faad14, #ffc53d) |
| Gastos Discrecionales | Morados/Rosas (#722ed1, #eb2f96, #f759ab) |
| Financiero/Deudas | Rojos (#ff4d4f, #ff7875) |
| Otros | Grises (#8c8c8c, #bfbfbf) |

---

## Preguntas de Confirmación

1. ¿El catálogo de categorías está completo o falta alguna?
2. ¿Quieres que las categorías tengan iconos específicos de Ant Design?
3. ¿Las subcategorías de "Cuotas de Créditos" deben mantenerse como categoría especial del sistema (`system_type = 'credits'`)?
4. ¿Debo crear el archivo de configuración `config/categories.php` para centralizar el catálogo?

---

## Archivos a Crear/Modificar

| Archivo | Acción |
|---------|--------|
| `database/migrations/XXXX_seed_default_categories.php` | Crear |
| `config/categories.php` | Crear (opcional) |
| `app/Services/DefaultCategoriesService.php` | Crear |
| `app/Actions/Planning/CreatePlanningAction.php` | Modificar |
| `database/seeders/DefaultCategoriesSeeder.php` | Eliminar o vaciar |
