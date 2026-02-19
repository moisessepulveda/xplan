<x-mail::message>
# Has sido invitado a {{ $planningName }}

**{{ $inviterName }}** te ha invitado a unirte a **{{ $planningName }}** en XPlan con el rol de **{{ $roleName }}**.

<x-mail::button :url="$acceptUrl">
Aceptar Invitación
</x-mail::button>

Esta invitación expira el **{{ $expiresAt }}**.

Si no esperabas esta invitación, puedes ignorar este correo.

Gracias,<br>
{{ config('app.name') }}
</x-mail::message>
