<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Infolists\Components as InfolistComponents;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationLabel = 'Usuarios';

    protected static ?string $modelLabel = 'Usuario';

    protected static ?string $pluralModelLabel = 'Usuarios';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informacion del Usuario')
                    ->schema([
                        TextInput::make('name')
                            ->label('Nombre')
                            ->required()
                            ->maxLength(255),

                        TextInput::make('email')
                            ->label('Email')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true),

                        Toggle::make('is_active')
                            ->label('Usuario Activo')
                            ->helperText('Desactivar impide que el usuario inicie sesion')
                            ->default(true),

                        Toggle::make('is_superadmin')
                            ->label('Super Administrador')
                            ->helperText('Permite acceso al panel de administracion')
                            ->visible(fn () => auth()->user()->is_superadmin),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('avatar')
                    ->label('Avatar')
                    ->circular()
                    ->defaultImageUrl(fn ($record) => 'https://ui-avatars.com/api/?name='.urlencode($record->name)),

                Tables\Columns\TextColumn::make('name')
                    ->label('Nombre')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('plannings_count')
                    ->label('Plannings')
                    ->counts('plannings')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('Activo')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_superadmin')
                    ->label('Admin')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Registrado')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Estado')
                    ->placeholder('Todos')
                    ->trueLabel('Solo activos')
                    ->falseLabel('Solo inactivos'),

                Tables\Filters\TernaryFilter::make('is_superadmin')
                    ->label('Administrador')
                    ->placeholder('Todos')
                    ->trueLabel('Solo admins')
                    ->falseLabel('Solo usuarios'),
            ])
            ->actions([
                ViewAction::make(),
                EditAction::make(),
                Action::make('toggle_active')
                    ->label(fn ($record) => $record->is_active ? 'Desactivar' : 'Activar')
                    ->icon(fn ($record) => $record->is_active ? 'heroicon-o-x-circle' : 'heroicon-o-check-circle')
                    ->color(fn ($record) => $record->is_active ? 'danger' : 'success')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['is_active' => ! $record->is_active])),
            ])
            ->bulkActions([
                BulkAction::make('deactivate')
                    ->label('Desactivar seleccionados')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(fn ($records) => $records->each->update(['is_active' => false])),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informacion del Usuario')
                    ->schema([
                        InfolistComponents\ImageEntry::make('avatar')
                            ->label('Avatar')
                            ->circular()
                            ->defaultImageUrl(fn ($record) => 'https://ui-avatars.com/api/?name='.urlencode($record->name)),

                        InfolistComponents\TextEntry::make('name')
                            ->label('Nombre'),

                        InfolistComponents\TextEntry::make('email')
                            ->label('Email'),

                        InfolistComponents\IconEntry::make('is_active')
                            ->label('Activo')
                            ->boolean(),

                        InfolistComponents\IconEntry::make('is_superadmin')
                            ->label('Super Admin')
                            ->boolean(),

                        InfolistComponents\TextEntry::make('created_at')
                            ->label('Fecha de Registro')
                            ->dateTime('d/m/Y H:i'),
                    ])->columns(3),

                Section::make('Plannings')
                    ->schema([
                        InfolistComponents\RepeatableEntry::make('plannings')
                            ->label('')
                            ->schema([
                                InfolistComponents\TextEntry::make('name')
                                    ->label('Nombre'),
                                InfolistComponents\TextEntry::make('currency')
                                    ->label('Moneda'),
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
            'index' => Pages\ListUsers::route('/'),
            'view' => Pages\ViewUser::route('/{record}'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->withCount('plannings');
    }
}
