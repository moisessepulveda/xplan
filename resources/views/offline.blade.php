<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#1677ff">
    <title>Sin conexión - XPlan</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f5f5;
            color: #262626;
            padding: 24px;
        }
        .container {
            text-align: center;
            max-width: 360px;
        }
        .icon {
            width: 80px;
            height: 80px;
            border-radius: 20px;
            background: linear-gradient(135deg, #1677ff, #0958d9);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            color: white;
            font-size: 32px;
            font-weight: 700;
        }
        h1 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        p {
            color: #8c8c8c;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 24px;
        }
        .btn {
            display: inline-block;
            padding: 10px 24px;
            background: #1677ff;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
        }
        .btn:active { opacity: 0.8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">X</div>
        <h1>Sin conexión</h1>
        <p>No pudimos conectar con XPlan. Verifica tu conexión a internet e intenta nuevamente.</p>
        <button class="btn" onclick="window.location.reload()">Reintentar</button>
    </div>
</body>
</html>
