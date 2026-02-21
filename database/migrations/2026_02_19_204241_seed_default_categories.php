<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Default categories catalog.
     * Structure: [name, icon, color, children[]]
     */
    private function getIncomeCategories(): array
    {
        return [
            [
                'name' => 'Salario',
                'icon' => 'dollar',
                'color' => '#52c41a',
                'children' => [
                    ['name' => 'Sueldo', 'icon' => 'dollar', 'color' => '#52c41a'],
                    ['name' => 'Bonos', 'icon' => 'gift', 'color' => '#73d13d'],
                    ['name' => 'Horas Extra', 'icon' => 'clock-circle', 'color' => '#95de64'],
                    ['name' => 'Aguinaldo', 'icon' => 'star', 'color' => '#b7eb8f'],
                ],
            ],
            [
                'name' => 'Trabajo Independiente',
                'icon' => 'laptop',
                'color' => '#1677ff',
                'children' => [
                    ['name' => 'Freelance', 'icon' => 'laptop', 'color' => '#1677ff'],
                    ['name' => 'Honorarios', 'icon' => 'file-text', 'color' => '#4096ff'],
                    ['name' => 'Comisiones', 'icon' => 'percentage', 'color' => '#69b1ff'],
                    ['name' => 'Consultorías', 'icon' => 'solution', 'color' => '#91caff'],
                ],
            ],
            [
                'name' => 'Inversiones',
                'icon' => 'line-chart',
                'color' => '#722ed1',
                'children' => [
                    ['name' => 'Dividendos', 'icon' => 'stock', 'color' => '#722ed1'],
                    ['name' => 'Intereses', 'icon' => 'percentage', 'color' => '#9254de'],
                    ['name' => 'Ganancias de Capital', 'icon' => 'rise', 'color' => '#b37feb'],
                    ['name' => 'Arriendos', 'icon' => 'home', 'color' => '#d3adf7'],
                ],
            ],
            [
                'name' => 'Ventas',
                'icon' => 'shop',
                'color' => '#fa8c16',
                'children' => [
                    ['name' => 'Venta de Artículos', 'icon' => 'shopping', 'color' => '#fa8c16'],
                    ['name' => 'Marketplace', 'icon' => 'shop', 'color' => '#ffa940'],
                    ['name' => 'Negocio Propio', 'icon' => 'bank', 'color' => '#ffc069'],
                ],
            ],
            [
                'name' => 'Gobierno',
                'icon' => 'bank',
                'color' => '#13c2c2',
                'children' => [
                    ['name' => 'Subsidios', 'icon' => 'safety', 'color' => '#13c2c2'],
                    ['name' => 'Devolución de Impuestos', 'icon' => 'rollback', 'color' => '#36cfc9'],
                    ['name' => 'Pensión', 'icon' => 'user', 'color' => '#5cdbd3'],
                    ['name' => 'Bonos Estatales', 'icon' => 'file-protect', 'color' => '#87e8de'],
                ],
            ],
            [
                'name' => 'Otros Ingresos',
                'icon' => 'plus-circle',
                'color' => '#8c8c8c',
                'children' => [
                    ['name' => 'Regalos Recibidos', 'icon' => 'gift', 'color' => '#eb2f96'],
                    ['name' => 'Reembolsos', 'icon' => 'rollback', 'color' => '#52c41a'],
                    ['name' => 'Premios', 'icon' => 'trophy', 'color' => '#faad14'],
                    ['name' => 'Herencias', 'icon' => 'gold', 'color' => '#d4b106'],
                ],
            ],
            [
                'name' => 'Préstamos Recibidos',
                'icon' => 'download',
                'color' => '#597ef7',
                'children' => [
                    ['name' => 'Préstamos Personales', 'icon' => 'user', 'color' => '#597ef7'],
                    ['name' => 'Préstamos Familiares', 'icon' => 'team', 'color' => '#85a5ff'],
                ],
            ],
        ];
    }

    private function getExpenseCategories(): array
    {
        return [
            [
                'name' => 'Vivienda',
                'icon' => 'home',
                'color' => '#1677ff',
                'children' => [
                    ['name' => 'Arriendo/Hipoteca', 'icon' => 'home', 'color' => '#1677ff'],
                    ['name' => 'Gastos Comunes', 'icon' => 'apartment', 'color' => '#4096ff'],
                    ['name' => 'Contribuciones', 'icon' => 'file-text', 'color' => '#69b1ff'],
                    ['name' => 'Seguros de Hogar', 'icon' => 'safety', 'color' => '#91caff'],
                    ['name' => 'Reparaciones', 'icon' => 'tool', 'color' => '#bae0ff'],
                    ['name' => 'Muebles y Decoración', 'icon' => 'appstore', 'color' => '#e6f4ff'],
                ],
            ],
            [
                'name' => 'Servicios Básicos',
                'icon' => 'thunderbolt',
                'color' => '#faad14',
                'children' => [
                    ['name' => 'Electricidad', 'icon' => 'thunderbolt', 'color' => '#faad14'],
                    ['name' => 'Agua', 'icon' => 'experiment', 'color' => '#1677ff'],
                    ['name' => 'Gas', 'icon' => 'fire', 'color' => '#fa8c16'],
                    ['name' => 'Internet', 'icon' => 'wifi', 'color' => '#13c2c2'],
                    ['name' => 'Telefonía', 'icon' => 'phone', 'color' => '#52c41a'],
                    ['name' => 'TV Cable/Streaming', 'icon' => 'play-square', 'color' => '#722ed1'],
                ],
            ],
            [
                'name' => 'Alimentación',
                'icon' => 'shopping-cart',
                'color' => '#52c41a',
                'children' => [
                    ['name' => 'Supermercado', 'icon' => 'shopping-cart', 'color' => '#52c41a'],
                    ['name' => 'Feria/Mercado', 'icon' => 'shop', 'color' => '#73d13d'],
                    ['name' => 'Restaurantes', 'icon' => 'coffee', 'color' => '#fa8c16'],
                    ['name' => 'Delivery', 'icon' => 'car', 'color' => '#ff4d4f'],
                    ['name' => 'Cafetería', 'icon' => 'coffee', 'color' => '#d4b106'],
                    ['name' => 'Snacks', 'icon' => 'star', 'color' => '#faad14'],
                ],
            ],
            [
                'name' => 'Transporte',
                'icon' => 'car',
                'color' => '#722ed1',
                'children' => [
                    ['name' => 'Combustible', 'icon' => 'fire', 'color' => '#ff4d4f'],
                    ['name' => 'Transporte Público', 'icon' => 'dashboard', 'color' => '#1677ff'],
                    ['name' => 'Taxi/Uber', 'icon' => 'car', 'color' => '#000000'],
                    ['name' => 'Estacionamiento', 'icon' => 'environment', 'color' => '#8c8c8c'],
                    ['name' => 'Peajes', 'icon' => 'gateway', 'color' => '#faad14'],
                    ['name' => 'Mantención Vehículo', 'icon' => 'tool', 'color' => '#fa8c16'],
                    ['name' => 'Seguro Vehículo', 'icon' => 'safety', 'color' => '#13c2c2'],
                    ['name' => 'Patente/Permiso', 'icon' => 'file-protect', 'color' => '#722ed1'],
                ],
            ],
            [
                'name' => 'Salud',
                'icon' => 'heart',
                'color' => '#ff4d4f',
                'children' => [
                    ['name' => 'Médico General', 'icon' => 'medicine-box', 'color' => '#ff4d4f'],
                    ['name' => 'Especialistas', 'icon' => 'user-switch', 'color' => '#ff7875'],
                    ['name' => 'Dentista', 'icon' => 'smile', 'color' => '#ffa39e'],
                    ['name' => 'Oftalmólogo', 'icon' => 'eye', 'color' => '#1677ff'],
                    ['name' => 'Farmacia', 'icon' => 'medicine-box', 'color' => '#52c41a'],
                    ['name' => 'Exámenes', 'icon' => 'file-search', 'color' => '#13c2c2'],
                    ['name' => 'Seguro de Salud', 'icon' => 'safety', 'color' => '#722ed1'],
                    ['name' => 'Gimnasio/Deporte', 'icon' => 'trophy', 'color' => '#fa8c16'],
                ],
            ],
            [
                'name' => 'Educación',
                'icon' => 'book',
                'color' => '#13c2c2',
                'children' => [
                    ['name' => 'Colegiatura/Matrícula', 'icon' => 'bank', 'color' => '#13c2c2'],
                    ['name' => 'Útiles Escolares', 'icon' => 'highlight', 'color' => '#36cfc9'],
                    ['name' => 'Cursos y Talleres', 'icon' => 'read', 'color' => '#5cdbd3'],
                    ['name' => 'Libros', 'icon' => 'book', 'color' => '#722ed1'],
                    ['name' => 'Certificaciones', 'icon' => 'file-done', 'color' => '#faad14'],
                ],
            ],
            [
                'name' => 'Entretenimiento',
                'icon' => 'smile',
                'color' => '#eb2f96',
                'children' => [
                    ['name' => 'Cine/Teatro', 'icon' => 'play-circle', 'color' => '#ff4d4f'],
                    ['name' => 'Conciertos/Eventos', 'icon' => 'sound', 'color' => '#722ed1'],
                    ['name' => 'Suscripciones Digitales', 'icon' => 'cloud', 'color' => '#1677ff'],
                    ['name' => 'Videojuegos', 'icon' => 'rocket', 'color' => '#52c41a'],
                    ['name' => 'Salidas/Fiestas', 'icon' => 'team', 'color' => '#fa8c16'],
                    ['name' => 'Viajes/Vacaciones', 'icon' => 'global', 'color' => '#13c2c2'],
                    ['name' => 'Hobbies', 'icon' => 'star', 'color' => '#eb2f96'],
                ],
            ],
            [
                'name' => 'Vestuario',
                'icon' => 'skin',
                'color' => '#fa8c16',
                'children' => [
                    ['name' => 'Ropa', 'icon' => 'skin', 'color' => '#fa8c16'],
                    ['name' => 'Calzado', 'icon' => 'dashboard', 'color' => '#d4b106'],
                    ['name' => 'Accesorios', 'icon' => 'gift', 'color' => '#722ed1'],
                    ['name' => 'Ropa Deportiva', 'icon' => 'trophy', 'color' => '#52c41a'],
                    ['name' => 'Lavandería/Tintorería', 'icon' => 'clear', 'color' => '#1677ff'],
                ],
            ],
            [
                'name' => 'Cuidado Personal',
                'icon' => 'user',
                'color' => '#eb2f96',
                'children' => [
                    ['name' => 'Peluquería/Barbería', 'icon' => 'scissor', 'color' => '#eb2f96'],
                    ['name' => 'Cosméticos', 'icon' => 'star', 'color' => '#f759ab'],
                    ['name' => 'Spa/Tratamientos', 'icon' => 'smile', 'color' => '#ff85c0'],
                    ['name' => 'Productos de Higiene', 'icon' => 'experiment', 'color' => '#13c2c2'],
                ],
            ],
            [
                'name' => 'Mascotas',
                'icon' => 'github',
                'color' => '#d4b106',
                'children' => [
                    ['name' => 'Alimento Mascotas', 'icon' => 'shopping', 'color' => '#d4b106'],
                    ['name' => 'Veterinario', 'icon' => 'medicine-box', 'color' => '#ff4d4f'],
                    ['name' => 'Accesorios Mascotas', 'icon' => 'gift', 'color' => '#faad14'],
                    ['name' => 'Peluquería Mascotas', 'icon' => 'scissor', 'color' => '#eb2f96'],
                ],
            ],
            [
                'name' => 'Tecnología',
                'icon' => 'laptop',
                'color' => '#1677ff',
                'children' => [
                    ['name' => 'Equipos Electrónicos', 'icon' => 'desktop', 'color' => '#1677ff'],
                    ['name' => 'Software/Apps', 'icon' => 'appstore', 'color' => '#722ed1'],
                    ['name' => 'Accesorios Tech', 'icon' => 'usb', 'color' => '#8c8c8c'],
                    ['name' => 'Reparaciones Tech', 'icon' => 'tool', 'color' => '#fa8c16'],
                ],
            ],
            [
                'name' => 'Hogar',
                'icon' => 'home',
                'color' => '#52c41a',
                'children' => [
                    ['name' => 'Artículos de Limpieza', 'icon' => 'clear', 'color' => '#13c2c2'],
                    ['name' => 'Menaje', 'icon' => 'coffee', 'color' => '#fa8c16'],
                    ['name' => 'Jardinería', 'icon' => 'experiment', 'color' => '#52c41a'],
                    ['name' => 'Servicio Doméstico', 'icon' => 'user', 'color' => '#722ed1'],
                ],
            ],
            [
                'name' => 'Financiero',
                'icon' => 'bank',
                'color' => '#ff4d4f',
                'children' => [
                    ['name' => 'Comisiones Bancarias', 'icon' => 'bank', 'color' => '#ff4d4f'],
                    ['name' => 'Intereses de Créditos', 'icon' => 'percentage', 'color' => '#ff7875'],
                    ['name' => 'Seguros de Vida', 'icon' => 'safety', 'color' => '#1677ff'],
                    ['name' => 'Inversiones/Ahorro', 'icon' => 'fund', 'color' => '#52c41a'],
                ],
            ],
            [
                'name' => 'Impuestos',
                'icon' => 'file-text',
                'color' => '#8c8c8c',
                'children' => [
                    ['name' => 'Impuesto a la Renta', 'icon' => 'file-text', 'color' => '#8c8c8c'],
                    ['name' => 'IVA', 'icon' => 'percentage', 'color' => '#bfbfbf'],
                    ['name' => 'Otros Impuestos', 'icon' => 'file-done', 'color' => '#d9d9d9'],
                ],
            ],
            [
                'name' => 'Préstamos Otorgados',
                'icon' => 'upload',
                'color' => '#597ef7',
                'children' => [
                    ['name' => 'Préstamos a Familiares', 'icon' => 'team', 'color' => '#597ef7'],
                    ['name' => 'Préstamos a Amigos', 'icon' => 'user', 'color' => '#85a5ff'],
                ],
            ],
            [
                'name' => 'Donaciones',
                'icon' => 'heart',
                'color' => '#ff85c0',
                'children' => [
                    ['name' => 'Caridad', 'icon' => 'heart', 'color' => '#ff85c0'],
                    ['name' => 'Iglesia/Religión', 'icon' => 'home', 'color' => '#d4b106'],
                    ['name' => 'Propinas', 'icon' => 'dollar', 'color' => '#52c41a'],
                ],
            ],
            [
                'name' => 'Otros Gastos',
                'icon' => 'ellipsis',
                'color' => '#8c8c8c',
                'children' => [
                    ['name' => 'Regalos', 'icon' => 'gift', 'color' => '#eb2f96'],
                    ['name' => 'Imprevistos', 'icon' => 'warning', 'color' => '#faad14'],
                    ['name' => 'Varios', 'icon' => 'ellipsis', 'color' => '#8c8c8c'],
                ],
            ],
        ];
    }

    public function up(): void
    {
        $plannings = DB::table('plannings')->get();

        foreach ($plannings as $planning) {
            $this->createCategoriesForPlanning($planning->id, $planning->creator_id);
        }
    }

    private function createCategoriesForPlanning(int $planningId, int $userId): void
    {
        // Check if categories already exist for this planning
        $existingCount = DB::table('categories')
            ->where('planning_id', $planningId)
            ->count();

        if ($existingCount > 0) {
            return; // Skip if categories already exist
        }

        $order = 0;

        // Create income categories
        foreach ($this->getIncomeCategories() as $category) {
            $parentId = DB::table('categories')->insertGetId([
                'planning_id' => $planningId,
                'created_by' => $userId,
                'parent_id' => null,
                'name' => $category['name'],
                'type' => 'income',
                'icon' => $category['icon'],
                'color' => $category['color'],
                'is_system' => true,
                'system_type' => null,
                'is_archived' => false,
                'order' => $order++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!empty($category['children'])) {
                $childOrder = 0;
                foreach ($category['children'] as $child) {
                    DB::table('categories')->insert([
                        'planning_id' => $planningId,
                        'created_by' => $userId,
                        'parent_id' => $parentId,
                        'name' => $child['name'],
                        'type' => 'income',
                        'icon' => $child['icon'],
                        'color' => $child['color'],
                        'is_system' => true,
                        'system_type' => null,
                        'is_archived' => false,
                        'order' => $childOrder++,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        // Create expense categories
        foreach ($this->getExpenseCategories() as $category) {
            $parentId = DB::table('categories')->insertGetId([
                'planning_id' => $planningId,
                'created_by' => $userId,
                'parent_id' => null,
                'name' => $category['name'],
                'type' => 'expense',
                'icon' => $category['icon'],
                'color' => $category['color'],
                'is_system' => true,
                'system_type' => null,
                'is_archived' => false,
                'order' => $order++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!empty($category['children'])) {
                $childOrder = 0;
                foreach ($category['children'] as $child) {
                    DB::table('categories')->insert([
                        'planning_id' => $planningId,
                        'created_by' => $userId,
                        'parent_id' => $parentId,
                        'name' => $child['name'],
                        'type' => 'expense',
                        'icon' => $child['icon'],
                        'color' => $child['color'],
                        'is_system' => true,
                        'system_type' => null,
                        'is_archived' => false,
                        'order' => $childOrder++,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        // Ensure credits system category exists
        $creditsExists = DB::table('categories')
            ->where('planning_id', $planningId)
            ->where('system_type', 'credits')
            ->exists();

        if (!$creditsExists) {
            DB::table('categories')->insert([
                'planning_id' => $planningId,
                'created_by' => $userId,
                'parent_id' => null,
                'name' => 'Cuotas de Créditos',
                'type' => 'expense',
                'icon' => 'credit-card',
                'color' => '#722ed1',
                'is_system' => true,
                'system_type' => 'credits',
                'is_archived' => false,
                'order' => $order++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        // Only delete system categories that don't have transactions
        DB::table('categories')
            ->where('is_system', true)
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('transactions')
                    ->whereColumn('transactions.category_id', 'categories.id');
            })
            ->delete();
    }
};
