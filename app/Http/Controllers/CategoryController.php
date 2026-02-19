<?php

namespace App\Http\Controllers;

use App\Actions\Category\CreateCategoryAction;
use App\Actions\Category\ReorderCategoriesAction;
use App\Actions\Category\UpdateCategoryAction;
use App\Enums\CategoryType;
use App\Http\Requests\Category\ReorderCategoriesRequest;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $incomeCategories = Category::with('children')
            ->income()
            ->active()
            ->roots()
            ->ordered()
            ->get();

        $expenseCategories = Category::with('children')
            ->expense()
            ->active()
            ->roots()
            ->ordered()
            ->get();

        return Inertia::render('Categories/Index', [
            'incomeCategories' => CategoryResource::collection($incomeCategories),
            'expenseCategories' => CategoryResource::collection($expenseCategories),
            'categoryTypes' => CategoryType::options(),
        ]);
    }

    public function create(): Response
    {
        $parentCategories = Category::active()
            ->roots()
            ->ordered()
            ->get()
            ->groupBy('type');

        return Inertia::render('Categories/Create', [
            'categoryTypes' => CategoryType::options(),
            'parentCategories' => [
                'income' => CategoryResource::collection($parentCategories->get('income', collect())),
                'expense' => CategoryResource::collection($parentCategories->get('expense', collect())),
            ],
        ]);
    }

    public function store(StoreCategoryRequest $request, CreateCategoryAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('categories.index')
            ->with('success', 'Categoría creada exitosamente.');
    }

    public function edit(Category $category): Response
    {
        $parentCategories = Category::active()
            ->roots()
            ->where('type', $category->type)
            ->where('id', '!=', $category->id)
            ->ordered()
            ->get();

        return Inertia::render('Categories/Edit', [
            'category' => new CategoryResource($category->load('parent')),
            'categoryTypes' => CategoryType::options(),
            'parentCategories' => CategoryResource::collection($parentCategories),
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category, UpdateCategoryAction $action): RedirectResponse
    {
        $action->execute($category, $request->validated());

        return redirect()->route('categories.index')
            ->with('success', 'Categoría actualizada exitosamente.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->is_system) {
            return redirect()->route('categories.index')
                ->with('error', 'No se pueden eliminar categorías del sistema.');
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Categoría eliminada exitosamente.');
    }

    public function archive(Category $category, UpdateCategoryAction $action): RedirectResponse
    {
        $action->archive($category);

        return redirect()->route('categories.index')
            ->with('success', 'Categoría archivada exitosamente.');
    }

    public function restore(Category $category, UpdateCategoryAction $action): RedirectResponse
    {
        $action->restore($category);

        return redirect()->route('categories.index')
            ->with('success', 'Categoría restaurada exitosamente.');
    }

    public function reorder(ReorderCategoriesRequest $request, ReorderCategoriesAction $action): JsonResponse
    {
        $action->execute($request->validated()['ids']);

        return response()->json(['success' => true]);
    }
}
