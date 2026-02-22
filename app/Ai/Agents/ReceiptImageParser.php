<?php

namespace App\Ai\Agents;

use App\Models\Category;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Collection;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Files\Image;
use Laravel\Ai\Messages\UserMessage;
use Laravel\Ai\Promptable;
use Stringable;

class ReceiptImageParser implements Agent, HasStructuredOutput, Conversational
{
    use Promptable;

    public function provider(): string
    {
        return 'openai';
    }

    public function model(): string
    {
        return 'gpt-4o';
    }

    public function __construct(
        protected Collection $categories,
        protected string $imagePath
    ) {}

    public function instructions(): Stringable|string
    {
        $categoriesText = $this->formatCategories();

        return <<<PROMPT
Eres un asistente especializado en analizar imágenes de recibos, boletas, facturas y comprobantes de pago para extraer información de gastos.

Tu tarea es:
1. Analizar la imagen proporcionada
2. Extraer toda la información relevante del gasto
3. Sugerir una categoría apropiada basándote en el comercio/concepto

REGLAS DE RESPUESTA:
- is_valid_receipt: true solo si la imagen muestra claramente un recibo, boleta, factura o comprobante de pago. false para imágenes borrosas, ilegibles u otro tipo de documentos.
- amount: número positivo con el monto total del gasto. Usar 0 si no se puede leer.
- description: descripción breve de la compra (qué se compró). Cadena vacía si no se puede determinar.
- merchant: nombre del comercio/tienda/establecimiento. Cadena vacía si no se encuentra.
- date: fecha de la transacción en formato YYYY-MM-DD. Cadena vacía si no se encuentra.
- suggested_category_id: ID de categoría sugerida basándote en el tipo de comercio/productos. Usar 0 si no hay sugerencia apropiada.
- confidence: número entre 0 y 1 indicando confianza en la extracción.
- items_summary: resumen de los items/productos principales identificados, separados por coma. Cadena vacía si no se pueden identificar.

Categorías disponibles (usa el ID):
{$categoriesText}

Si no hay categorías disponibles o ninguna aplica, usa suggested_category_id = 0.

IMPORTANTE: Prioriza extraer el monto total y el nombre del comercio. Si la imagen está borrosa o parcialmente visible, indica baja confianza.
PROMPT;
    }

    public function messages(): iterable
    {
        return [
            new UserMessage(
                'Analiza esta imagen de recibo y extrae la información según las instrucciones.',
                [Image::fromPath($this->imagePath)]
            ),
        ];
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'is_valid_receipt' => $schema->boolean()
                ->description('true si la imagen es un recibo/boleta/factura legible')
                ->required(),
            'amount' => $schema->number()
                ->description('Monto total del gasto como número positivo, 0 si no se puede leer')
                ->required(),
            'description' => $schema->string()
                ->description('Descripción breve de la compra, cadena vacía si no se puede determinar')
                ->required(),
            'merchant' => $schema->string()
                ->description('Nombre del comercio/tienda, cadena vacía si no se encuentra')
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
            'items_summary' => $schema->string()
                ->description('Resumen de los items/productos principales identificados, separados por coma')
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

    public static function forPlanning(int $planningId, string $imagePath): self
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

        return new self($categories, $imagePath);
    }
}
