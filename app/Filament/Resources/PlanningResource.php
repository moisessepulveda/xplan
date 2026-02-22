<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PlanningResource\Pages;
use App\Models\Planning;
use App\Services\DefaultCategoriesService;
use Filament\Actions\Action;
use Filament\Actions\ViewAction;
use Filament\Infolists\Components as InfolistComponents;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class PlanningResource extends Resource
{
    protected static ?string $model = Planning::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-clipboard-document-list';

    protected static ?string $navigationLabel = 'Planificaciones';

    protected static ?string $modelLabel = 'Planificacion';

    protected static ?string $pluralModelLabel = 'Planificaciones';

    protected static ?int $navigationSort = 2;

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nombre')
                    ->searchable()
                    ->sortable()
                    ->description(fn ($record) => $record->description),

                Tables\Columns\TextColumn::make('creator.name')
                    ->label('Creador')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('currency')
                    ->label('Moneda')
                    ->badge()
                    ->sortable(),

                Tables\Columns\TextColumn::make('members_count')
                    ->label('Miembros')
                    ->counts('members')
                    ->sortable(),

                Tables\Columns\TextColumn::make('categories_count')
                    ->label('Categorias')
                    ->counts('categories')
                    ->sortable(),

                Tables\Columns\TextColumn::make('transactions_count')
                    ->label('Transacciones')
                    ->counts('transactions')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\Filter::make('with_transactions')
                    ->label('Con transacciones')
                    ->query(fn (Builder $query) => $query->has('transactions')),

                Tables\Filters\Filter::make('without_transactions')
                    ->label('Sin transacciones')
                    ->query(fn (Builder $query) => $query->doesntHave('transactions')),
            ])
            ->actions([
                ViewAction::make(),
                Action::make('add_missing_categories')
                    ->label('Agregar Categorias')
                    ->icon('heroicon-o-plus-circle')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->modalHeading('Agregar Categorias Faltantes')
                    ->modalDescription('Esto agregara las categorias del sistema que faltan en esta planificacion.')
                    ->action(function (Planning $record) {
                        $service = app(DefaultCategoriesService::class);
                        $added = $service->createMissingCategories($record, $record->creator_id);

                        Notification::make()
                            ->title('Categorias agregadas')
                            ->body("Se agregaron {$added} categorias faltantes.")
                            ->success()
                            ->send();
                    }),
            ])
            ->bulkActions([])
            ->defaultSort('created_at', 'desc');
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informacion General')
                    ->schema([
                        InfolistComponents\TextEntry::make('name')
                            ->label('Nombre'),

                        InfolistComponents\TextEntry::make('description')
                            ->label('Descripcion')
                            ->default('Sin descripcion'),

                        InfolistComponents\TextEntry::make('currency')
                            ->label('Moneda')
                            ->badge(),

                        InfolistComponents\TextEntry::make('creator.name')
                            ->label('Creador'),

                        InfolistComponents\TextEntry::make('created_at')
                            ->label('Fecha de Creacion')
                            ->dateTime('d/m/Y H:i'),

                        InfolistComponents\TextEntry::make('month_start_day')
                            ->label('Dia inicio de mes'),
                    ])->columns(3),

                Section::make('Resumen Financiero del Mes')
                    ->schema([
                        InfolistComponents\ViewEntry::make('financial_summary')
                            ->label('')
                            ->view('filament.infolists.components.planning-financial-summary'),
                    ]),

                Section::make('Historico Ultimos 6 Meses')
                    ->schema([
                        InfolistComponents\ViewEntry::make('historical_chart')
                            ->label('')
                            ->view('filament.infolists.components.planning-historical-chart'),
                    ]),

                Section::make('Alertas')
                    ->schema([
                        InfolistComponents\ViewEntry::make('alerts')
                            ->label('')
                            ->view('filament.infolists.components.planning-alerts'),
                    ]),

                Section::make('Miembros')
                    ->schema([
                        InfolistComponents\RepeatableEntry::make('members')
                            ->label('')
                            ->schema([
                                InfolistComponents\TextEntry::make('name')
                                    ->label('Nombre'),
                                InfolistComponents\TextEntry::make('email')
                                    ->label('Email'),
                                InfolistComponents\TextEntry::make('pivot.role')
                                    ->label('Rol')
                                    ->badge()
                                    ->color(fn ($state) => match ($state) {
                                        'owner' => 'success',
                                        'admin' => 'warning',
                                        'editor' => 'info',
                                        default => 'gray',
                                    }),
                            ])->columns(3),
                    ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPlannings::route('/'),
            'view' => Pages\ViewPlanning::route('/{record}'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withCount(['members', 'categories', 'transactions'])
            ->with(['creator']);
    }
}
