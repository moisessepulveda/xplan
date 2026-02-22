<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateSuperAdmin extends Command
{
    protected $signature = 'admin:create {email?} {--promote : Promote existing user}';

    protected $description = 'Create a new super admin user or promote an existing one';

    public function handle(): int
    {
        if ($this->option('promote')) {
            return $this->promoteExistingUser();
        }

        return $this->createNewAdmin();
    }

    protected function promoteExistingUser(): int
    {
        $email = $this->argument('email') ?? $this->ask('Enter the email of the user to promote');

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("User with email {$email} not found.");

            return 1;
        }

        $user->update(['is_superadmin' => true]);

        $this->info("User {$user->name} ({$user->email}) has been promoted to super admin.");

        return 0;
    }

    protected function createNewAdmin(): int
    {
        $name = $this->ask('Name');
        $email = $this->argument('email') ?? $this->ask('Email');
        $password = $this->secret('Password');

        if (User::where('email', $email)->exists()) {
            $this->error("A user with email {$email} already exists. Use --promote to promote them.");

            return 1;
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'is_superadmin' => true,
            'is_active' => true,
        ]);

        $this->info("Super admin {$user->name} ({$user->email}) created successfully.");

        return 0;
    }
}
