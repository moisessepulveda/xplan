<?php

namespace App\Services;

use App\Models\EmailAccount;
use Illuminate\Support\Collection;
use Webklex\PHPIMAP\ClientManager;
use Webklex\PHPIMAP\Client;
use Webklex\PHPIMAP\Folder;
use Webklex\PHPIMAP\Message;
use Webklex\PHPIMAP\Exceptions\ConnectionFailedException;
use Webklex\PHPIMAP\Exceptions\AuthFailedException;

class EmailReaderService
{
    protected ?Client $client = null;

    public function connect(EmailAccount $account): Client
    {
        $clientManager = new ClientManager();

        $this->client = $clientManager->make([
            'host' => $account->imap_host,
            'port' => $account->imap_port,
            'encryption' => $account->imap_encryption,
            'validate_cert' => true,
            'username' => $account->email,
            'password' => $account->password,
            'protocol' => 'imap',
        ]);

        $this->client->connect();

        return $this->client;
    }

    public function disconnect(): void
    {
        if ($this->client) {
            $this->client->disconnect();
            $this->client = null;
        }
    }

    public function testConnection(array $config): array
    {
        try {
            $clientManager = new ClientManager();
            $client = $clientManager->make([
                'host' => $config['imap_host'],
                'port' => $config['imap_port'],
                'encryption' => $config['imap_encryption'],
                'validate_cert' => true,
                'username' => $config['email'],
                'password' => $config['password'],
                'protocol' => 'imap',
            ]);

            $client->connect();

            // Try to access the folder
            $folder = $client->getFolder($config['folder'] ?? 'INBOX');

            $client->disconnect();

            return [
                'success' => true,
                'message' => 'Conexión exitosa',
            ];
        } catch (AuthFailedException $e) {
            return [
                'success' => false,
                'message' => 'Error de autenticación. Verifica tu email y contraseña.',
                'error' => $e->getMessage(),
            ];
        } catch (ConnectionFailedException $e) {
            return [
                'success' => false,
                'message' => 'No se pudo conectar al servidor. Verifica la configuración IMAP.',
                'error' => $e->getMessage(),
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Error de conexión: ' . $e->getMessage(),
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Obtiene emails nuevos desde la última sincronización.
     * Usa la fecha del último sync para filtrar en el servidor IMAP (eficiente).
     */
    public function fetchNewEmailsOnly(EmailAccount $account, int $limit = 50): Collection
    {
        if (!$this->client) {
            $this->connect($account);
        }

        // Si no hay último UID, no devolver nada (primera sync solo marca el punto)
        if (!$account->last_uid) {
            return collect();
        }

        $folder = $this->client->getFolder($account->folder);
        $query = $folder->messages();

        // Si tenemos fecha de último sync, usarla como filtro IMAP (muy eficiente)
        if ($account->last_sync_at) {
            // Buscar desde 1 día antes del último sync para no perder emails
            $since = $account->last_sync_at->subDay()->format('d-M-Y');
            $query->since($since);
        }

        $messages = $query
            ->setFetchOrder('desc')
            ->limit($limit)
            ->get();

        $lastUid = $account->last_uid;

        // Filtrar solo los que tienen UID mayor al último procesado
        return collect($messages)
            ->filter(fn(Message $message) => $message->getUid() > $lastUid)
            ->map(fn(Message $message) => $this->parseMessage($message))
            ->values();
    }

    /**
     * Obtiene emails no leídos de los últimos 7 días.
     * El filtro SINCE y UNSEEN se hace en el servidor IMAP (eficiente).
     */
    public function fetchUnreadEmailsLast7Days(EmailAccount $account, int $limit = 50): Collection
    {
        if (!$this->client) {
            $this->connect($account);
        }

        $folder = $this->client->getFolder($account->folder);

        // Estos filtros se aplican en el servidor IMAP
        $since = now()->subDays(7)->format('d-M-Y');

        $messages = $folder->messages()
            ->unseen()
            ->since($since)
            ->setFetchOrder('desc')
            ->limit($limit)
            ->get();

        $lastUid = $account->last_uid ?? 0;

        // Filtrar por UID en PHP solo si es necesario (generalmente pocos emails)
        return collect($messages)
            ->filter(fn(Message $message) => $message->getUid() > $lastUid)
            ->map(fn(Message $message) => $this->parseMessage($message))
            ->values();
    }

    /**
     * Obtiene el UID del mensaje más reciente.
     * Solo descarga 1 mensaje (muy eficiente).
     */
    public function getLatestUid(EmailAccount $account): ?int
    {
        if (!$this->client) {
            $this->connect($account);
        }

        $folder = $this->client->getFolder($account->folder);

        $messages = $folder->messages()
            ->setFetchOrder('desc')
            ->limit(1)
            ->get();

        if ($messages->count() > 0) {
            return $messages->first()->getUid();
        }

        return null;
    }

    /**
     * Obtiene emails no leídos desde el último sync.
     */
    public function fetchUnreadEmails(EmailAccount $account, int $limit = 50): Collection
    {
        if (!$this->client) {
            $this->connect($account);
        }

        $folder = $this->client->getFolder($account->folder);
        $query = $folder->messages()->unseen();

        // Usar fecha del último sync como filtro IMAP
        if ($account->last_sync_at) {
            $since = $account->last_sync_at->subDay()->format('d-M-Y');
            $query->since($since);
        }

        $messages = $query
            ->setFetchOrder('desc')
            ->limit($limit)
            ->get();

        $lastUid = $account->last_uid ?? 0;

        return collect($messages)
            ->filter(fn(Message $message) => $message->getUid() > $lastUid)
            ->map(fn(Message $message) => $this->parseMessage($message))
            ->values();
    }

    /**
     * Obtiene emails generales (usado para fetchEmails legacy).
     */
    public function fetchEmails(EmailAccount $account, int $limit = 50): Collection
    {
        if (!$this->client) {
            $this->connect($account);
        }

        $folder = $this->client->getFolder($account->folder);
        $query = $folder->messages();

        // Usar fecha del último sync si existe
        if ($account->last_sync_at) {
            $since = $account->last_sync_at->subDay()->format('d-M-Y');
            $query->since($since);
        }

        $messages = $query
            ->setFetchOrder('desc')
            ->limit($limit)
            ->get();

        $lastUid = $account->last_uid ?? 0;

        return collect($messages)
            ->filter(fn(Message $message) => $message->getUid() > $lastUid)
            ->map(fn(Message $message) => $this->parseMessage($message))
            ->values();
    }

    protected function parseMessage(Message $message): array
    {
        $body = $message->getTextBody();

        // Si no hay cuerpo de texto, intentar con HTML y convertir
        if (empty($body)) {
            $htmlBody = $message->getHTMLBody();
            if ($htmlBody) {
                $body = $this->htmlToText($htmlBody);
            }
        }

        return [
            'uid' => $message->getUid(),
            'message_id' => $message->getMessageId()?->toString(),
            'subject' => $message->getSubject()?->toString(),
            'from' => $message->getFrom()->first()?->mail,
            'from_name' => $message->getFrom()->first()?->personal,
            'date' => $message->getDate()?->toDate(),
            'body' => $body,
            'is_seen' => $message->getFlags()->contains('Seen'),
        ];
    }

    protected function htmlToText(string $html): string
    {
        // Remover scripts y estilos
        $html = preg_replace('/<script[^>]*>.*?<\/script>/is', '', $html);
        $html = preg_replace('/<style[^>]*>.*?<\/style>/is', '', $html);

        // Convertir saltos de línea
        $html = preg_replace('/<br\s*\/?>/i', "\n", $html);
        $html = preg_replace('/<\/p>/i', "\n\n", $html);
        $html = preg_replace('/<\/div>/i', "\n", $html);
        $html = preg_replace('/<\/tr>/i', "\n", $html);
        $html = preg_replace('/<\/td>/i', " | ", $html);

        // Remover etiquetas HTML
        $text = strip_tags($html);

        // Decodificar entidades HTML
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // Limpiar espacios múltiples
        $text = preg_replace('/[ \t]+/', ' ', $text);
        $text = preg_replace('/\n\s*\n/', "\n\n", $text);

        return trim($text);
    }

    public function markAsRead(EmailAccount $account, string|int $uid): void
    {
        if (!$this->client) {
            $this->connect($account);
        }

        $folder = $this->client->getFolder($account->folder);

        // Buscar mensaje reciente por UID
        $messages = $folder->messages()
            ->since(now()->subDays(7)->format('d-M-Y'))
            ->limit(100)
            ->get();

        foreach ($messages as $message) {
            if ($message->getUid() == $uid) {
                $message->setFlag('Seen');
                break;
            }
        }
    }

    public function getFolders(EmailAccount $account): Collection
    {
        if (!$this->client) {
            $this->connect($account);
        }

        $folders = $this->client->getFolders();

        return collect($folders)->map(function (Folder $folder) {
            return [
                'name' => $folder->name,
                'full_name' => $folder->full_name,
                'path' => $folder->path,
            ];
        });
    }
}
