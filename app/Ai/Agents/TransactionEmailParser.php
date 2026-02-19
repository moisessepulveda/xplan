<?php

namespace App\Ai\Agents;

use App\Models\Category;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Collection;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Promptable;
use Stringable;

class TransactionEmailParser implements Agent, HasStructuredOutput
{
    use Promptable;

    public function __construct(
        protected Collection $categories
    ) {}

    public function instructions(): Stringable|string
    {
        $categoriesText = $this->formatCategories();

        return <<<PROMPT
Eres un asistente especializado en analizar correos electrónicos de bancos, tarjetas de crédito y servicios financieros para extraer información de transacciones.

Tu tarea es:
1. Determinar si el email contiene una notificación de transacción financiera (compra, pago, transferencia, depósito, cargo, abono)
2. Si es una transacción, extraer los datos relevantes
3. Sugerir una categoría apropiada basándote en la descripción del comercio/concepto

REGLAS DE RESPUESTA:
- is_transaction: true solo si el email notifica UNA transacción específica. false para estados de cuenta, resúmenes, ofertas, publicidad.
- type: 'expense' para gastos/compras/pagos, 'income' para depósitos/abonos, 'unknown' si no se puede determinar.
- amount: número positivo sin símbolos de moneda. Usar 0 si no se encuentra.
- description: descripción de la transacción. Cadena vacía si no hay.
- merchant: nombre del comercio. Cadena vacía si no se encuentra.
- date: formato YYYY-MM-DD. Cadena vacía si no se encuentra.
- suggested_category_id: ID de categoría sugerida. Usar 0 si no hay sugerencia apropiada.
- confidence: número entre 0 y 1 indicando confianza en la extracción.

Categorías disponibles (usa el ID):
{$categoriesText}

Si no hay categorías disponibles o ninguna aplica, usa suggested_category_id = 0.
PROMPT;
    }

    public function messages(): iterable
    {
        return [];
    }

    public function schema(JsonSchema $schema): array
    {
        // OpenAI Structured Output requiere que TODOS los campos estén en 'required'
        return [
            'is_transaction' => $schema->boolean()
                ->description('true si el email contiene una notificación de transacción financiera específica')
                ->required(),
            'type' => $schema->string()
                ->enum(['expense', 'income', 'unknown'])
                ->description('expense para gastos/compras, income para depósitos/abonos, unknown si no se puede determinar')
                ->required(),
            'amount' => $schema->number()
                ->description('Monto de la transacción como número positivo, 0 si no se encuentra')
                ->required(),
            'description' => $schema->string()
                ->description('Descripción o concepto de la transacción, cadena vacía si no hay')
                ->required(),
            'merchant' => $schema->string()
                ->description('Nombre del comercio o entidad, cadena vacía si no se encuentra')
                ->required(),
            'date' => $schema->string()
                ->description('Fecha de la transacción en formato YYYY-MM-DD, cadena vacía si no se encuentra')
                ->required(),
            'suggested_category_id' => $schema->integer()
                ->description('ID de la categoría sugerida, 0 si no hay sugerencia')
                ->required(),
            'confidence' => $schema->number()
                ->description('Nivel de confianza de la extracción entre 0 y 1')
                ->required(),
        ];
    }

    protected function formatCategories(): string
    {
        return $this->categories->map(function ($category) {
            $line = "- ID: {$category->id}, Nombre: {$category->name}";
            if ($category->children && $category->children->count() > 0) {
                $children = $category->children->map(fn($c) => "  - ID: {$c->id}, Nombre: {$c->name}")->join("\n");
                $line .= "\n{$children}";
            }
            return $line;
        })->join("\n");
    }

    public static function forPlanning(int $planningId): self
    {
        $categories = Category::where('planning_id', $planningId)
            ->where('type', 'expense')
            ->where('is_archived', false)
            ->whereNull('parent_id')
            ->with(['children' => function ($query) {
                $query->where('is_archived', false)->orderBy('order');
            }])
            ->orderBy('order')
            ->get();

        return new self($categories);
    }
}
