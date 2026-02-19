<?php

namespace Database\Seeders;

use App\Actions\Category\CreateCategoryAction;
use App\Enums\CategoryType;
use App\Models\Planning;
use Illuminate\Database\Seeder;

class DefaultCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        // This seeder is meant to be called when creating a new planning
        // Not to be run globally
    }

    public static function createForPlanning(Planning $planning, int $userId): void
    {
        $action = new CreateCategoryAction();

        $incomeCategories = [
            ['name' => 'Salario', 'icon' => 'dollar', 'color' => '#52c41a'],
            ['name' => 'Freelance', 'icon' => 'laptop', 'color' => '#1677ff'],
            ['name' => 'Inversiones', 'icon' => 'line-chart', 'color' => '#722ed1'],
            ['name' => 'Regalos', 'icon' => 'gift', 'color' => '#eb2f96'],
            ['name' => 'Otros Ingresos', 'icon' => 'plus-circle', 'color' => '#13c2c2'],
        ];

        $expenseCategories = [
            [
                'name' => 'Hogar',
                'icon' => 'home',
                'color' => '#1677ff',
                'children' => [
                    ['name' => 'Arriendo/Hipoteca', 'icon' => 'home', 'color' => '#1677ff'],
                    ['name' => 'Servicios Básicos', 'icon' => 'thunderbolt', 'color' => '#faad14'],
                    ['name' => 'Internet/TV', 'icon' => 'wifi', 'color' => '#13c2c2'],
                    ['name' => 'Mantención', 'icon' => 'tool', 'color' => '#8c8c8c'],
                ],
            ],
            [
                'name' => 'Alimentación',
                'icon' => 'shopping-cart',
                'color' => '#52c41a',
                'children' => [
                    ['name' => 'Supermercado', 'icon' => 'shopping-cart', 'color' => '#52c41a'],
                    ['name' => 'Restaurantes', 'icon' => 'coffee', 'color' => '#fa8c16'],
                    ['name' => 'Delivery', 'icon' => 'car', 'color' => '#ff4d4f'],
                ],
            ],
            [
                'name' => 'Transporte',
                'icon' => 'car',
                'color' => '#722ed1',
                'children' => [
                    ['name' => 'Combustible', 'icon' => 'fire', 'color' => '#ff4d4f'],
                    ['name' => 'Transporte Público', 'icon' => 'bus', 'color' => '#1677ff'],
                    ['name' => 'Estacionamiento', 'icon' => 'car', 'color' => '#8c8c8c'],
                    ['name' => 'Mantención Vehículo', 'icon' => 'tool', 'color' => '#faad14'],
                ],
            ],
            [
                'name' => 'Salud',
                'icon' => 'heart',
                'color' => '#ff4d4f',
                'children' => [
                    ['name' => 'Médico', 'icon' => 'medicine-box', 'color' => '#ff4d4f'],
                    ['name' => 'Farmacia', 'icon' => 'medicine-box', 'color' => '#52c41a'],
                    ['name' => 'Seguro de Salud', 'icon' => 'safety', 'color' => '#1677ff'],
                ],
            ],
            [
                'name' => 'Entretenimiento',
                'icon' => 'smile',
                'color' => '#eb2f96',
                'children' => [
                    ['name' => 'Streaming', 'icon' => 'play-circle', 'color' => '#ff4d4f'],
                    ['name' => 'Salidas', 'icon' => 'team', 'color' => '#1677ff'],
                    ['name' => 'Hobbies', 'icon' => 'star', 'color' => '#faad14'],
                ],
            ],
            [
                'name' => 'Educación',
                'icon' => 'book',
                'color' => '#13c2c2',
                'children' => [
                    ['name' => 'Cursos', 'icon' => 'book', 'color' => '#13c2c2'],
                    ['name' => 'Libros', 'icon' => 'read', 'color' => '#722ed1'],
                ],
            ],
            [
                'name' => 'Ropa y Accesorios',
                'icon' => 'skin',
                'color' => '#fa8c16',
            ],
            [
                'name' => 'Otros Gastos',
                'icon' => 'ellipsis',
                'color' => '#8c8c8c',
            ],
        ];

        // Create income categories
        foreach ($incomeCategories as $category) {
            $action->execute([
                'planning_id' => $planning->id,
                'created_by' => $userId,
                'name' => $category['name'],
                'type' => CategoryType::INCOME,
                'icon' => $category['icon'],
                'color' => $category['color'],
                'is_system' => true,
            ]);
        }

        // Create expense categories with children
        foreach ($expenseCategories as $category) {
            $parent = $action->execute([
                'planning_id' => $planning->id,
                'created_by' => $userId,
                'name' => $category['name'],
                'type' => CategoryType::EXPENSE,
                'icon' => $category['icon'],
                'color' => $category['color'],
                'is_system' => true,
            ]);

            if (isset($category['children'])) {
                foreach ($category['children'] as $child) {
                    $action->execute([
                        'planning_id' => $planning->id,
                        'created_by' => $userId,
                        'parent_id' => $parent->id,
                        'name' => $child['name'],
                        'type' => CategoryType::EXPENSE,
                        'icon' => $child['icon'],
                        'color' => $child['color'],
                        'is_system' => true,
                    ]);
                }
            }
        }
    }
}
