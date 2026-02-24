<?php
// contact.php
mb_internal_encoding('UTF-8');

// Fonction utilitaire pour éviter les injections HTML
function e(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// Initialisation
$errors = [];
$nom = '';
$email = '';
$message = '';
$success = false;

// Si le formulaire a été soumis
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer et nettoyer les données
    $nom = trim($_POST['nom'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');
    
    // Validation serveur
    if ($nom === '') {
        $errors['nom'] = "Le nom est requis.";
    }
    
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "L'adresse email est invalide.";
    }
    
    if (mb_strlen($message) < 10) {
        $errors['message'] = "Le message doit contenir au moins 10 caractères.";
    }
    
    // Si pas d'erreurs : on traite
    if (empty($errors)) {
        $success = true;
        
        // Enregistrer dans un fichier log
        $logLine = sprintf(
            "[%s] %s <%s> : %s\n",
            date('Y-m-d H:i:s'),
            $nom,
            $email,
            str_replace(["\r", "\n"], [' ', ' '], $message)
        );
        file_put_contents(__DIR__ . '/messages.log', $logLine, FILE_APPEND);
        
        // On vide les champs pour éviter le renvoi
        $nom = $email = $message = '';
    }
}
?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Contact — Kenny GOFFIN</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="styles1.css">
</head>
<body>
    <header>
        <div>
            <h1>Contact</h1>
            <p class="subtitle">Traitement du formulaire en PHP</p>
        </div>
    </header>
    
    <main>
        <?php if ($success): ?>
        <section aria-labelledby="t-ok">
            <h2 id="t-ok">Merci, votre message a bien été envoyé ✅</h2>
            <p>Récapitulatif :</p>
            <ul>
                <li><strong>Nom</strong> : <?= e($nom) ?></li>
                <li><strong>Email</strong> : <?= e($email) ?></li>
            </ul>
            <p><strong>Message :</strong></p>
            <p><?= nl2br(e($message)) ?></p>
            <p><a href="contact.html" class="btn">Retour au formulaire</a></p>
        </section>
        <?php else: ?>
        <section aria-labelledby="t-form">
            <h2 id="t-form">Formulaire de contact</h2>
            
            <?php if (!empty($errors) && $_SERVER['REQUEST_METHOD'] === 'POST'): ?>
            <div role="alert" class="carte" style="border-color:#c1121f; padding:1rem; margin-bottom:1rem;">
                <p><strong>Le formulaire contient des erreurs :</strong></p>
                <ul>
                    <?php foreach ($errors as $field => $msg): ?>
                    <li><?= e($msg) ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <?php endif; ?>
            
            <form class="carte" action="contact.php" method="post" novalidate>
                <label for="nom">Nom</label>
                <input
                    id="nom"
                    name="nom"
                    required
                    value="<?= e($nom) ?>"
                    aria-invalid="<?= isset($errors['nom']) ? 'true' : 'false' ?>"
                >
                <?php if (isset($errors['nom'])): ?>
                <p role="alert" style="color:#c1121f; margin:0 0 .5rem;">
                    <?= e($errors['nom']) ?>
                </p>
                <?php endif; ?>
                
                <label for="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value="<?= e($email) ?>"
                    aria-invalid="<?= isset($errors['email']) ? 'true' : 'false' ?>"
                >
                <?php if (isset($errors['email'])): ?>
                <p role="alert" style="color:#c1121f; margin:0 0 .5rem;">
                    <?= e($errors['email']) ?>
                </p>
                <?php endif; ?>
                
                <label for="message">Message (max 280 car.)</label>
                <textarea
                    id="message"
                    name="message"
                    rows="5"
                    maxlength="280"
                    aria-invalid="<?= isset($errors['message']) ? 'true' : 'false' ?>"
                ><?= e($message) ?></textarea>
                <?php if (isset($errors['message'])): ?>
                <p role="alert" style="color:#c1121f; margin:0 0 .5rem;">
                    <?= e($errors['message']) ?>
                </p>
                <?php endif; ?>
                
                <button class="btn" type="submit">Envoyer</button>
            </form>
        </section>
        <?php endif; ?>
    </main>
    
    <footer>
        <small>© <?= date('Y') ?> Kenny GOFFIN — BUT MMI • R1.12 PHP</small>
    </footer>
</body>
</html>