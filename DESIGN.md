# XPlan - Diseño de Aplicación de Finanzas Personales

## Visión General

XPlan es una PWA colaborativa para gestión de finanzas personales que permite a usuarios crear espacios de planificación financiera, invitar colaboradores, y llevar control completo de su situación económica.

---

## Conceptos Fundamentales

### Planificación (Workspace)
Es el contenedor principal de toda la información financiera. Un usuario puede tener múltiples planificaciones (ej: "Finanzas Personales", "Negocio Familiar", "Proyecto Casa"). Al cambiar de planificación, todo el contexto cambia.

### Colaborador
Persona invitada a participar en una planificación con un rol específico.

---

## Módulo 1: Autenticación y Usuarios

### Descripción
Gestiona la identidad de los usuarios y su acceso al sistema.

### Entidades

```
Usuario
├── id
├── email
├── nombre
├── avatar (opcional)
├── fecha_registro
├── configuracion_personal
│   ├── moneda_preferida
│   ├── formato_fecha
│   ├── idioma
│   └── tema (claro/oscuro)
└── planificacion_activa_id
```

### Funcionalidades
- Registro con email/contraseña
- Inicio de sesión
- Recuperación de contraseña
- Edición de perfil
- Cambio de planificación activa
- Cierre de sesión

### Pantallas
1. **Login** - Formulario de acceso
2. **Registro** - Formulario de creación de cuenta
3. **Recuperar Contraseña** - Solicitud de reset
4. **Perfil** - Edición de datos personales y preferencias

---

## Módulo 2: Planificaciones (Workspaces)

### Descripción
Permite crear y gestionar espacios de planificación independientes. Cada planificación es un universo financiero separado.

### Entidades

```
Planificacion
├── id
├── nombre
├── descripcion
├── moneda_principal
├── icono
├── color
├── creador_id
├── fecha_creacion
└── configuracion
    ├── inicio_mes (día del mes: 1-28)
    ├── mostrar_centavos
    └── formato_numerico
```

```
MiembroPlanificacion
├── id
├── planificacion_id
├── usuario_id
├── rol (propietario | administrador | editor | visor)
├── fecha_union
└── invitado_por_id
```

### Roles y Permisos

| Acción | Propietario | Administrador | Editor | Visor |
|--------|-------------|---------------|--------|-------|
| Ver datos | ✓ | ✓ | ✓ | ✓ |
| Crear transacciones | ✓ | ✓ | ✓ | ✗ |
| Editar transacciones | ✓ | ✓ | ✓ | ✗ |
| Gestionar categorías | ✓ | ✓ | ✗ | ✗ |
| Gestionar cuentas | ✓ | ✓ | ✗ | ✗ |
| Invitar miembros | ✓ | ✓ | ✗ | ✗ |
| Editar planificación | ✓ | ✓ | ✗ | ✗ |
| Eliminar planificación | ✓ | ✗ | ✗ | ✗ |
| Transferir propiedad | ✓ | ✗ | ✗ | ✗ |

### Funcionalidades
- Crear nueva planificación
- Editar planificación
- Eliminar planificación (solo propietario)
- Cambiar entre planificaciones
- Ver lista de planificaciones propias y compartidas
- Abandonar planificación (si no es propietario)

### Pantallas
1. **Lista de Planificaciones** - Selector con todas las planificaciones
2. **Crear/Editar Planificación** - Formulario de configuración
3. **Configuración de Planificación** - Ajustes avanzados

---

## Módulo 3: Invitaciones y Colaboración

### Descripción
Sistema para invitar personas a colaborar en una planificación.

### Entidades

```
Invitacion
├── id
├── planificacion_id
├── email_invitado
├── rol_asignado
├── token (único, para el link)
├── estado (pendiente | aceptada | rechazada | expirada)
├── creada_por_id
├── fecha_creacion
├── fecha_expiracion
└── fecha_respuesta
```

### Funcionalidades
- Enviar invitación por email
- Generar link de invitación
- Aceptar invitación
- Rechazar invitación
- Cancelar invitación pendiente
- Ver invitaciones enviadas
- Ver invitaciones recibidas
- Cambiar rol de miembro
- Expulsar miembro

### Flujo de Invitación
1. Usuario A invita a email@ejemplo.com con rol "Editor"
2. Sistema genera token único y envía email
3. Usuario B (con ese email) recibe notificación
4. Usuario B acepta → se crea MiembroPlanificacion
5. Usuario B puede ahora ver la planificación en su lista

### Pantallas
1. **Miembros** - Lista de colaboradores actuales
2. **Invitar** - Formulario de invitación
3. **Invitaciones Pendientes** - Gestión de invitaciones enviadas
4. **Mis Invitaciones** - Invitaciones recibidas por el usuario

---

## Módulo 4: Cuentas / Carteras

### Descripción
Representa dónde está el dinero: bancos, efectivo, billeteras digitales, etc.

### Entidades

```
Cuenta
├── id
├── planificacion_id
├── nombre
├── tipo (efectivo | banco | tarjeta_debito | billetera_digital | inversion | otro)
├── saldo_inicial
├── saldo_actual (calculado)
├── moneda
├── color
├── icono
├── incluir_en_total (boolean)
├── activa (boolean)
├── orden
├── notas
├── creada_por_id
└── fecha_creacion
```

### Tipos de Cuenta
- **Efectivo**: Dinero físico en mano
- **Banco**: Cuenta corriente o de ahorro
- **Tarjeta Débito**: Asociada a cuenta bancaria
- **Billetera Digital**: PayPal, Mercado Pago, etc.
- **Inversión**: Fondos, acciones, crypto (solo para tracking de saldo)
- **Otro**: Cualquier otro tipo

### Funcionalidades
- Crear cuenta
- Editar cuenta
- Archivar/Desarchivar cuenta
- Ajustar saldo manualmente (genera transacción de ajuste)
- Transferir entre cuentas
- Ver historial de movimientos de una cuenta
- Reordenar cuentas

### Pantallas
1. **Lista de Cuentas** - Todas las cuentas con saldos
2. **Detalle de Cuenta** - Información y movimientos
3. **Crear/Editar Cuenta** - Formulario
4. **Transferencia** - Entre cuentas

---

## Módulo 5: Categorías

### Descripción
Clasificación de ingresos y gastos para análisis y presupuestos.

### Entidades

```
Categoria
├── id
├── planificacion_id
├── nombre
├── tipo (ingreso | egreso)
├── icono
├── color
├── categoria_padre_id (para subcategorías)
├── orden
├── activa (boolean)
└── creada_por_id
```

### Estructura Jerárquica
```
Ejemplo de Egresos:
├── Hogar
│   ├── Arriendo/Hipoteca
│   ├── Servicios
│   ├── Mantenimiento
│   └── Seguros
├── Alimentación
│   ├── Supermercado
│   ├── Restaurantes
│   └── Delivery
├── Transporte
│   ├── Combustible
│   ├── Transporte público
│   └── Mantenimiento vehículo
└── ...

Ejemplo de Ingresos:
├── Salario
├── Freelance
├── Inversiones
├── Ventas
└── Otros
```

### Funcionalidades
- Crear categoría
- Crear subcategoría
- Editar categoría
- Archivar categoría
- Reordenar categorías
- Categorías por defecto al crear planificación
- Mover subcategorías entre categorías padre

### Pantallas
1. **Lista de Categorías** - Árbol de categorías por tipo
2. **Crear/Editar Categoría** - Formulario
3. **Gestionar Categorías** - Reordenar y organizar

---

## Módulo 6: Transacciones (Ingresos / Egresos)

### Descripción
Registro de todos los movimientos de dinero.

### Entidades

```
Transaccion
├── id
├── planificacion_id
├── tipo (ingreso | egreso | transferencia | ajuste)
├── monto
├── cuenta_id
├── cuenta_destino_id (solo transferencias)
├── categoria_id
├── descripcion
├── fecha
├── hora (opcional)
├── es_recurrente (boolean)
├── recurrencia_id (si aplica)
├── etiquetas[]
├── adjuntos[] (fotos de recibos)
├── ubicacion (opcional)
├── creada_por_id
├── fecha_creacion
└── fecha_modificacion
```

```
TransaccionRecurrente
├── id
├── planificacion_id
├── tipo (ingreso | egreso)
├── monto
├── cuenta_id
├── categoria_id
├── descripcion
├── frecuencia (diaria | semanal | quincenal | mensual | anual)
├── dia_ejecucion
├── fecha_inicio
├── fecha_fin (opcional)
├── activa (boolean)
├── ultima_ejecucion
├── proxima_ejecucion
└── creada_por_id
```

### Funcionalidades
- Registrar ingreso
- Registrar egreso
- Realizar transferencia entre cuentas
- Editar transacción
- Eliminar transacción
- Duplicar transacción
- Buscar transacciones
- Filtrar por: fecha, cuenta, categoría, monto, etiquetas
- Crear transacción recurrente
- Gestionar recurrencias
- Adjuntar comprobantes (fotos)
- Exportar transacciones

### Pantallas
1. **Lista de Transacciones** - Timeline con filtros
2. **Crear/Editar Transacción** - Formulario completo
3. **Detalle de Transacción** - Vista con adjuntos
4. **Transacciones Recurrentes** - Gestión de automatizaciones
5. **Búsqueda Avanzada** - Filtros múltiples

---

## Módulo 7: Cuentas por Cobrar / Pagar

### Descripción
Seguimiento de deudas: dinero que te deben y dinero que debes.

### Entidades

```
CuentaPendiente
├── id
├── planificacion_id
├── tipo (por_cobrar | por_pagar)
├── persona_nombre
├── persona_contacto (teléfono/email opcional)
├── monto_original
├── monto_pendiente (calculado)
├── moneda
├── concepto
├── fecha_creacion
├── fecha_vencimiento (opcional)
├── estado (pendiente | parcial | pagada | cancelada)
├── notas
├── creada_por_id
└── recordatorios[]
```

```
PagoCuentaPendiente
├── id
├── cuenta_pendiente_id
├── monto
├── fecha
├── cuenta_id (de dónde salió/entró el dinero)
├── transaccion_id (transacción generada)
├── notas
└── registrado_por_id
```

```
Recordatorio
├── id
├── cuenta_pendiente_id
├── fecha_recordatorio
├── mensaje
├── enviado (boolean)
└── fecha_envio
```

### Funcionalidades
- Crear cuenta por cobrar
- Crear cuenta por pagar
- Registrar pago (total o parcial)
- Marcar como cancelada/perdonada
- Configurar recordatorios
- Ver historial de pagos
- Filtrar por estado, persona, fecha
- Resumen de totales por cobrar/pagar

### Pantallas
1. **Dashboard Cuentas Pendientes** - Resumen por cobrar vs por pagar
2. **Lista Por Cobrar** - Deudas a tu favor
3. **Lista Por Pagar** - Tus deudas
4. **Detalle Cuenta Pendiente** - Historia y pagos
5. **Registrar Pago** - Formulario de abono
6. **Crear Cuenta Pendiente** - Formulario

---

## Módulo 8: Presupuestos

### Descripción
Planificación de gastos mensuales por categoría con seguimiento en tiempo real.

### Entidades

```
Presupuesto
├── id
├── planificacion_id
├── nombre (ej: "Presupuesto Mensual", "Presupuesto Vacaciones")
├── tipo (mensual | personalizado)
├── fecha_inicio (para personalizados)
├── fecha_fin (para personalizados)
├── activo (boolean)
└── creado_por_id
```

```
LineaPresupuesto
├── id
├── presupuesto_id
├── categoria_id
├── monto_asignado
├── monto_gastado (calculado)
├── porcentaje_usado (calculado)
├── alertas
│   ├── al_50 (boolean)
│   ├── al_80 (boolean)
│   └── al_100 (boolean)
└── notas
```

```
HistorialPresupuesto
├── id
├── presupuesto_id
├── periodo (YYYY-MM)
├── total_presupuestado
├── total_gastado
├── lineas_snapshot[] (copia de líneas con montos)
└── fecha_cierre
```

### Funcionalidades
- Crear presupuesto mensual
- Asignar montos por categoría
- Ver progreso en tiempo real
- Recibir alertas al alcanzar umbrales
- Copiar presupuesto del mes anterior
- Comparar presupuesto vs real
- Ver histórico de presupuestos
- Ajustar presupuesto durante el mes
- Presupuestos para períodos especiales (vacaciones, proyecto)

### Reglas de Negocio
- El presupuesto mensual se reinicia según el `inicio_mes` de la planificación
- Se puede crear un presupuesto antes de que inicie el período
- Al cerrar un mes, se guarda snapshot en historial

### Pantallas
1. **Dashboard Presupuesto** - Vista general del mes
2. **Detalle por Categoría** - Progreso individual
3. **Configurar Presupuesto** - Asignación de montos
4. **Histórico** - Comparación mensual
5. **Alertas de Presupuesto** - Notificaciones configuradas

---

## Módulo 9: Créditos y Préstamos

### Descripción
Seguimiento detallado de créditos de consumo, hipotecarios, automotriz, tarjetas de crédito, etc.

### Entidades

```
Credito
├── id
├── planificacion_id
├── nombre
├── tipo (consumo | hipotecario | automotriz | tarjeta_credito | personal | otro)
├── entidad (banco/financiera)
├── monto_original
├── monto_pendiente (calculado)
├── moneda
├── tasa_interes (anual)
├── tipo_tasa (fija | variable)
├── plazo_meses
├── fecha_inicio
├── fecha_termino_estimada
├── dia_pago
├── cuota_mensual
├── estado (vigente | pagado | refinanciado | moroso)
├── numero_credito (referencia)
├── notas
├── cuenta_cargo_id (de dónde se descuenta)
└── creado_por_id
```

```
CuotaCredito
├── id
├── credito_id
├── numero_cuota
├── fecha_vencimiento
├── monto_cuota
├── monto_capital
├── monto_interes
├── monto_seguros (opcional)
├── otros_cargos (opcional)
├── estado (pendiente | pagada | vencida | pagada_parcial)
├── fecha_pago
├── monto_pagado
├── transaccion_id
└── notas
```

```
PagoExtraordinario
├── id
├── credito_id
├── fecha
├── monto
├── tipo (abono_capital | pago_anticipado_cuotas | prepago_total)
├── cuotas_aplicadas[] (si aplica)
├── transaccion_id
└── notas
```

### Tipos de Crédito

**Consumo**
- Créditos de libre inversión
- Compras en cuotas
- Créditos rotativos

**Hipotecario**
- Crédito de vivienda
- Leasing habitacional
- Seguimiento de UVR/UF si aplica

**Automotriz**
- Crédito para vehículo
- Leasing vehicular

**Tarjeta de Crédito**
- Cupo total
- Cupo utilizado
- Fecha de corte
- Fecha de pago
- Pago mínimo
- Pago total

**Personal**
- Préstamos de familiares/amigos
- Préstamos informales

### Funcionalidades
- Registrar nuevo crédito
- Generar tabla de amortización automática
- Registrar pago de cuota
- Registrar pago extraordinario (abono a capital)
- Ver proyección de saldos
- Alertas de vencimiento
- Simular prepago (cuánto ahorro si pago X extra)
- Refinanciar crédito (cerrar actual, crear nuevo)
- Dashboard de deudas totales
- Comparar créditos (cuál conviene pagar primero)

### Para Tarjetas de Crédito (específico)
- Registrar compras diferidas
- Calcular próximo estado de cuenta
- Avance en efectivo
- Tracking de cupo disponible

### Pantallas
1. **Dashboard de Créditos** - Resumen total de deudas
2. **Lista de Créditos** - Todos los créditos activos
3. **Detalle de Crédito** - Información completa
4. **Tabla de Amortización** - Cuotas pasadas y futuras
5. **Registrar Crédito** - Formulario completo
6. **Pagar Cuota** - Registro de pago
7. **Simulador de Prepago** - Proyecciones
8. **Tarjetas de Crédito** - Vista especializada

---

## Módulo 10: Dashboard y Reportes

### Descripción
Visualización consolidada de la situación financiera.

### Componentes del Dashboard

```
Dashboard Principal
├── Balance General
│   ├── Total en cuentas
│   ├── Total deudas (créditos)
│   ├── Por cobrar
│   └── Por pagar
├── Resumen del Mes
│   ├── Ingresos del mes
│   ├── Egresos del mes
│   ├── Balance del mes
│   └── Comparación con mes anterior
├── Presupuesto del Mes
│   ├── Progreso general
│   └── Categorías críticas
├── Próximos Vencimientos
│   ├── Cuotas de créditos
│   ├── Cuentas por pagar
│   └── Recurrencias
└── Acciones Rápidas
    ├── + Ingreso
    ├── + Egreso
    └── + Transferencia
```

### Reportes Disponibles

1. **Flujo de Efectivo**
   - Por período (semana, mes, año)
   - Por cuenta
   - Proyección futura

2. **Gastos por Categoría**
   - Gráfico de torta/barras
   - Comparación entre períodos
   - Tendencias

3. **Ingresos vs Egresos**
   - Evolución mensual
   - Balance histórico

4. **Estado de Cuentas**
   - Saldos históricos
   - Movimientos por cuenta

5. **Reporte de Deudas**
   - Total adeudado
   - Proyección de pagos
   - Intereses a pagar

6. **Presupuesto vs Real**
   - Por categoría
   - Histórico

7. **Patrimonio Neto**
   - Activos - Pasivos
   - Evolución temporal

### Funcionalidades
- Filtros por rango de fechas
- Exportar a PDF
- Exportar a Excel/CSV
- Gráficos interactivos
- Comparaciones período a período
- Widgets personalizables en dashboard

### Pantallas
1. **Dashboard** - Vista principal
2. **Reportes** - Lista de reportes disponibles
3. **Visor de Reporte** - Reporte específico con filtros
4. **Exportar** - Opciones de exportación

---

## Módulo 11: Notificaciones y Alertas

### Descripción
Sistema de notificaciones push y alertas internas.

### Tipos de Notificaciones

```
Notificacion
├── id
├── usuario_id
├── planificacion_id
├── tipo
├── titulo
├── mensaje
├── datos_adicionales{}
├── leida (boolean)
├── fecha_creacion
└── fecha_lectura
```

### Eventos que Generan Notificaciones

**Créditos**
- Cuota próxima a vencer (X días antes, configurable)
- Cuota vencida
- Crédito pagado completamente

**Presupuesto**
- Alcanzó 50% de una categoría
- Alcanzó 80% de una categoría
- Excedió presupuesto

**Cuentas Pendientes**
- Recordatorio configurado
- Cuenta por cobrar/pagar próxima a vencer

**Colaboración**
- Nueva invitación recibida
- Invitación aceptada
- Nuevo miembro en planificación
- Miembro abandonó planificación

**Transacciones**
- Transacción recurrente ejecutada
- Transacción grande inusual (opcional)

### Funcionalidades
- Configurar preferencias de notificación
- Activar/desactivar por tipo
- Horario de no molestar
- Ver historial de notificaciones
- Marcar como leída
- Marcar todas como leídas

### Pantallas
1. **Centro de Notificaciones** - Lista de notificaciones
2. **Configuración de Notificaciones** - Preferencias

---

## Módulo 12: Configuración y Datos

### Descripción
Ajustes generales y gestión de datos.

### Funcionalidades

**Configuración Personal**
- Tema (claro/oscuro/sistema)
- Idioma
- Formato de moneda
- Formato de fecha
- Moneda por defecto

**Configuración de Planificación**
- Editar nombre y descripción
- Cambiar moneda principal
- Día de inicio del mes
- Gestionar categorías por defecto

**Gestión de Datos**
- Exportar todos los datos (JSON/CSV)
- Importar datos
- Respaldo manual
- Eliminar planificación
- Eliminar cuenta de usuario

**Seguridad**
- Cambiar contraseña
- Cerrar todas las sesiones
- Historial de acceso
- PIN/Biometría para abrir app (opcional)

### Pantallas
1. **Configuración General** - Ajustes personales
2. **Configuración de Planificación** - Ajustes del workspace
3. **Exportar/Importar** - Gestión de datos
4. **Seguridad** - Opciones de seguridad

---

## Navegación y UX

### Estructura de Navegación

```
Bottom Navigation (5 items)
├── Inicio (Dashboard)
├── Transacciones
├── + (Acción rápida)
├── Presupuesto
└── Más

Menú "Más"
├── Cuentas
├── Créditos
├── Cuentas Pendientes
├── Reportes
├── Miembros
├── Configuración
└── Cambiar Planificación
```

### Flujos Principales

**Registro de Gasto Rápido**
1. Tap en botón "+"
2. Seleccionar "Egreso"
3. Ingresar monto
4. Seleccionar categoría
5. (Opcional) Agregar descripción
6. Guardar

**Cambio de Planificación**
1. Tap en nombre de planificación (header) o desde menú
2. Ver lista de planificaciones
3. Seleccionar otra planificación
4. Todo el contexto cambia

### Gestos y Atajos
- Swipe en transacción: Editar / Eliminar
- Pull to refresh en listas
- Long press en cuenta: Ver opciones rápidas
- Shake para deshacer última acción

---

## Sincronización y Offline

### Estrategia
- **Offline First**: La app funciona sin conexión
- Datos se almacenan localmente
- Sincronización cuando hay conexión
- Resolución de conflictos: última escritura gana + historial

### Indicadores
- Estado de sincronización visible
- Ícono de "pendiente de sincronizar"
- Notificación de conflictos si los hay

---

## Consideraciones de PWA

### Instalación
- Prompt de instalación en primera visita
- Ícono en pantalla de inicio
- Splash screen personalizado

### Capacidades
- Notificaciones push
- Acceso a cámara (para recibos)
- Almacenamiento local amplio
- Funcionamiento offline

---

## Resumen de Módulos

| # | Módulo | Descripción |
|---|--------|-------------|
| 1 | Autenticación | Login, registro, perfil |
| 2 | Planificaciones | Workspaces independientes |
| 3 | Colaboración | Invitaciones y roles |
| 4 | Cuentas | Donde está el dinero |
| 5 | Categorías | Clasificación jerárquica |
| 6 | Transacciones | Ingresos, egresos, transferencias |
| 7 | Cuentas Pendientes | Por cobrar y por pagar |
| 8 | Presupuestos | Planificación mensual |
| 9 | Créditos | Préstamos y tarjetas |
| 10 | Dashboard | Reportes y visualización |
| 11 | Notificaciones | Alertas y recordatorios |
| 12 | Configuración | Ajustes y datos |

---

## Próximos Pasos Sugeridos

1. Validar diseño con usuarios potenciales
2. Definir MVP (módulos mínimos para lanzamiento)
3. Diseñar wireframes de pantallas principales
4. Seleccionar stack tecnológico
5. Diseñar arquitectura de datos y API
6. Implementar módulo por módulo
