<?php

namespace App\Filament\Pages;

use App\Models\AppSetting;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AppSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationLabel = 'Configuracion';

    protected static ?string $title = 'Configuracion de la Aplicacion';

    protected static ?int $navigationSort = 100;

    protected string $view = 'filament.pages.app-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'registration_enabled' => AppSetting::getValue('registration_enabled', true),
        ]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Configuracion de Autenticacion')
                    ->description('Controla el acceso y registro de usuarios')
                    ->schema([
                        Toggle::make('registration_enabled')
                            ->label('Registro de usuarios habilitado')
                            ->helperText('Si esta desactivado, los nuevos usuarios no podran registrarse en la aplicacion')
                            ->required(),
                    ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        AppSetting::setValue('registration_enabled', $data['registration_enabled'] ? 'true' : 'false');

        Notification::make()
            ->title('Configuracion guardada')
            ->success()
            ->send();
    }
}
